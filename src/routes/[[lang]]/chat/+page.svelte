<script lang="ts">
	import { Wllama, type DownloadProgressCallback } from '@wllama/wllama';
	import { onMount, onDestroy } from 'svelte';
	import { Template } from '@huggingface/jinja';
	import {
		WLLAMA_CONFIG_PATHS,
		DEFAULT_CHAT_TEMPLATE,
		AVAILABLE_MODELS,
		type Message
	} from '$lib/wllama-config';
	import { useWakeLock } from '$lib/wakeLock.svelte';
	import { messages, inferenceParams } from '$lib/stores';
	import { setModelLoaded } from '$lib/chat-state.svelte';
	import BotIcon from 'virtual:icons/lucide/bot';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';

	import LoadingProgress from '$lib/components/common/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/common/ErrorDisplay.svelte';
	import PageHeader from '$lib/components/common/PageHeader.svelte';
	import ModelSelector from '$lib/components/chat/ModelSelector.svelte';
	import ChatMessages from '$lib/components/chat/ChatMessages.svelte';
	import MessageInput from '$lib/components/chat/MessageInput.svelte';

	let wllama: Wllama;
	let isLoading = $state(false);
	let isModelLoaded = $state(false);
	let isGenerating = $state(false);
	let downloadProgress = $state(0);
	let previousProgress = $state(0);
	let downloadError = $state(false);
	let modelSelection = $state(AVAILABLE_MODELS[0].url);
	let selectedModel = $state(AVAILABLE_MODELS[0]);
	let inputText = $state('');
	let stopSignal = false;
	let chatMessagesComponent: ChatMessages | undefined = $state();
	let messageInputComponent: MessageInput | undefined = $state();
	let downloadAbortController: AbortController | null = null;

	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	onMount(() => {
		return setupWakeLock(() => isGenerating);
	});

	onDestroy(() => {
		// Cancel any ongoing download
		if (downloadAbortController) {
			downloadAbortController.abort();
		}

		// Clean up wllama instance if it exists
		if (wllama) {
			wllama.exit();
		}

		// Reset global state
		setModelLoaded(false);
	});

	// Fixes weird Safari bug
	$effect(() => {
		if (isLoading) {
			console.log('isLoading true');
			window.scrollTo(0, 0);
		}
	});

	async function loadModel() {
		try {
			isLoading = true;
			downloadError = false;
			downloadProgress = 0;
			previousProgress = 0;

			// Create new abort controller for this download
			downloadAbortController = new AbortController();

			const model = AVAILABLE_MODELS.find((m) => m.url === modelSelection);
			if (model) {
				selectedModel = model;
			}

			// TODO: Cleanup
			wllama = new Wllama(WLLAMA_CONFIG_PATHS);

			const progressCallback: DownloadProgressCallback = ({ loaded, total }) => {
				previousProgress = downloadProgress;
				downloadProgress = Math.round((loaded / total) * 100);
				console.log(`Downloading... ${downloadProgress}%`);
			};

			await wllama.loadModelFromUrl(modelSelection, {
				progressCallback,
				signal: downloadAbortController.signal,
				n_threads: $inferenceParams.nThreads > 0 ? $inferenceParams.nThreads : undefined,
				n_ctx: $inferenceParams.nContext,
				n_batch: $inferenceParams.nBatch
			});

			isModelLoaded = true;
			setModelLoaded(true);
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				console.log('Model download was cancelled');
				return;
			}
			console.error('Model loading error:', err);
			downloadError = true;
		} finally {
			isLoading = false;
			downloadAbortController = null;
		}
	}

	async function sendMessage() {
		if (!isModelLoaded || isGenerating || !inputText.trim()) {
			return;
		}

		const userMessage: Message = {
			role: 'user',
			content: inputText
		};

		$messages = [...$messages, userMessage];

		chatMessagesComponent?.scrollToBottom();

		const assistantMessage: Message = {
			role: 'assistant',
			content: ''
		};

		$messages = [...$messages, assistantMessage];

		chatMessagesComponent?.scrollToBottom();

		inputText = '';
		isGenerating = true;
		stopSignal = false;

		await requestWakeLock();

		try {
			let formattedChat = await formatChatHistory($messages.slice(0, -1));
			console.log('Formatted chat:', formattedChat);

			const result = await wllama.createCompletion(formattedChat, {
				nPredict: $inferenceParams.nPredict,
				sampling: {
					temp: $inferenceParams.temperature
				},
				useCache: true,
				onNewToken: (_token, _piece, currentText, optionals) => {
					console.log('New token received, current text length:', currentText.length);
					const updatedMessages = [...$messages];
					updatedMessages[updatedMessages.length - 1] = {
						...updatedMessages[updatedMessages.length - 1],
						content: currentText
					};
					$messages = updatedMessages;

					chatMessagesComponent?.scrollToBottom();

					if (stopSignal) {
						optionals.abortSignal();
					}
				}
			});

			const finalMessages = [...$messages];
			finalMessages[finalMessages.length - 1] = {
				...finalMessages[finalMessages.length - 1],
				content: result
			};
			$messages = finalMessages;
		} catch (err) {
			console.error('Generation error:', err);
		} finally {
			isGenerating = false;

			await releaseWakeLock();

			messageInputComponent?.focus();
		}
	}

	async function stopGeneration() {
		stopSignal = true;

		await releaseWakeLock();
	}

	async function formatChatHistory(msgs: Message[]): Promise<string> {
		try {
			const templateStr = wllama.getChatTemplate() || DEFAULT_CHAT_TEMPLATE;

			// Special handling for DeepSeek models that cause issues with jinja
			const isDeepSeekR1 =
				templateStr.match(/<｜Assistant｜>/) &&
				templateStr.match(/<｜User｜>/) &&
				templateStr.match(/<\/think>/);

			if (isDeepSeekR1) {
				let result = '';
				for (const message of msgs) {
					if (message.role === 'system') {
						result += `${message.content}\n\n`;
					} else if (message.role === 'user') {
						result += `<｜User｜>${message.content}`;
					} else {
						result += `<｜Assistant｜>${message.content.split('</think>').pop()}<｜end▁of▁sentence｜>`;
					}
				}
				return result + '<｜Assistant｜>';
			}

			const template = new Template(templateStr);
			const bos_token = await wllama.detokenize([wllama.getBOS()], true);
			const eos_token = await wllama.detokenize([wllama.getEOS()], true);

			return template.render({
				messages: msgs,
				bos_token,
				eos_token,
				add_generation_prompt: true
			});
		} catch (err) {
			console.error('Error formatting chat:', err);
			return msgs.map((m) => `${m.role}: ${m.content}`).join('\n\n') + '\n\nassistant: ';
		}
	}

	function newChat() {
		if (isGenerating) {
			stopGeneration();
		}
		$messages = [];

		messageInputComponent?.focus();
	}

	onMount(() => {
		if ($messages.length === 0) {
			$messages = [
				{
					role: 'system',
					content:
						"You are a helpful AI assistant. Answer the user's questions concisely and accurately."
				}
			];
		}

		if (isModelLoaded) {
			messageInputComponent?.focus();
		}
	});
</script>

<div class="chat-page" class:chat-mode={isModelLoaded}>
	{#if !isModelLoaded}
		<div class="setup-view">
			<PageHeader
				title="Chat with AI"
				subtitle="Run language models locally in your browser — no data leaves your device."
				Icon={BotIcon}
			/>

			{#if downloadError}
				<ErrorDisplay
					message="Failed to load model. Please check your connection and try again."
					buttonText={isLoading ? 'Reloading...' : 'Reload Model'}
					onRetry={loadModel}
					isRetrying={isLoading}
				/>
			{:else if isLoading}
				<LoadingProgress
					title="Loading Model"
					progress={downloadProgress}
					{previousProgress}
					message="This will take a couple of minutes. The chat model is being downloaded to your browser."
				/>
			{:else}
				<ModelSelector bind:modelSelection onLoadModel={loadModel} {isLoading} />
			{/if}
		</div>
	{:else}
		<!-- Chat mode: toolbar + messages + input -->
		<div class="chat-shell">
			<header class="chat-toolbar">
				<div class="chat-toolbar-info">
					<span class="chat-toolbar-icon"><BotIcon /></span>
					<span class="chat-toolbar-name">{selectedModel.name}</span>
				</div>
				<button class="new-chat-btn" onclick={newChat}>
					<SparklesIcon />
					<span>New Chat</span>
				</button>
			</header>

			<ChatMessages bind:this={chatMessagesComponent} messages={$messages} {isGenerating} />

			<MessageInput
				bind:this={messageInputComponent}
				bind:value={inputText}
				{isGenerating}
				onSend={sendMessage}
				onStop={stopGeneration}
			/>
		</div>
	{/if}
</div>

<style>
	.chat-page {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	/* ── Setup view (before model loaded) ── */
	.setup-view {
		max-width: 680px;
		margin: 0 auto;
		padding: var(--sp-6) var(--sp-4);
		width: 100%;
		box-sizing: border-box;
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── Chat mode (model loaded) ── */
	.chat-page.chat-mode {
		height: calc(100vh - var(--nav-height) - var(--sp-8));
		overflow: hidden;
	}

	.chat-shell {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		height: 100%;
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: var(--color-background-main);
	}

	/* Toolbar */
	.chat-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--sp-3) var(--sp-4);
		background: var(--color-background-secondary);
		border-bottom: 1px solid var(--color-border-light);
		flex-shrink: 0;
	}

	.chat-toolbar-info {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		color: var(--color-text-secondary);
		font-size: 0.8125rem;
		font-weight: 600;
	}

	.chat-toolbar-icon {
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.chat-toolbar-icon :global(svg) {
		width: 18px;
		height: 18px;
	}

	.new-chat-btn {
		display: flex;
		align-items: center;
		gap: var(--sp-1);
		padding: var(--sp-2) var(--sp-3);
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		color: var(--color-text-secondary);
		font-size: 0.8125rem;
		font-weight: 600;
		font-family: var(--font-family-primary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.new-chat-btn :global(svg) {
		width: 14px;
		height: 14px;
	}

	.new-chat-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
	}

	@media (max-width: 768px) {
		.chat-page.chat-mode {
			height: calc(100vh - var(--nav-height) - var(--sp-6));
		}

		.setup-view {
			padding: var(--sp-4) var(--sp-3);
		}
	}
</style>
