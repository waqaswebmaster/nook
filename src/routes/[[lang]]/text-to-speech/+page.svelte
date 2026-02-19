<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import {
		ttsModel,
		ttsWebGPUKitten,
		ttsWebGPUKokoro,
		ttsKittenSampleRate,
		ttsText
	} from '$lib/stores';
	import MicIcon from 'virtual:icons/lucide/mic';
	import PlayIcon from 'virtual:icons/lucide/play';
	import PauseIcon from 'virtual:icons/lucide/pause';
	import DownloadIcon from 'virtual:icons/lucide/download';
	import CopyIcon from 'virtual:icons/lucide/copy';
	import CheckIcon from 'virtual:icons/lucide/check';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';
	import DicesIcon from 'virtual:icons/lucide/dices';
	import TrashIcon from 'virtual:icons/lucide/trash';
	import LoaderIcon from 'virtual:icons/lucide/loader';

	import CardInterface from '$lib/components/common/CardInterface.svelte';
	import Toolbar from '$lib/components/common/Toolbar.svelte';
	import ContentArea from '$lib/components/common/ContentArea.svelte';
	import LoadingProgress from '$lib/components/common/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/common/ErrorDisplay.svelte';

	import AudioChunk from '$lib/components/tts/AudioChunk.svelte';
	import ModelSwitcher from '$lib/components/tts/ModelSwitcher.svelte';
	import AdvancedParameters from '$lib/components/tts/AdvancedParameters.svelte';
	import SpeedControl from '$lib/components/tts/SpeedControl.svelte';
	import TextStatistics from '$lib/components/tts/TextStatistics.svelte';
	import VoiceSelector from '$lib/components/tts/VoiceSelector.svelte';
	import { getRandomQuote } from '$lib/quotes';

	// State variables
	let text = $state('');
	let lastGeneration = $state<any>(null);
	let isPlaying = $state(false);
	let currentChunkIndex = $state(-1);
	let speed = $state(1);
	let copied = $state(false);
	let status = $state<'waiting' | 'loading' | 'ready' | 'generating' | 'error'>('waiting');
	let error = $state<string | null>(null);
	let worker: Worker | null = $state(null);
	let voices = $state<any[]>([]);
	let selectedVoice = $state<string>('expr-voice-2-m');
	// Computed properties for persisted values
	let selectedSampleRate = $derived(
		$ttsModel === 'kitten' ? $ttsKittenSampleRate : $ttsModel === 'piper' ? 22050 : 24000
	);
	let useWebGPU = $derived(
		$ttsModel === 'kitten' ? $ttsWebGPUKitten : $ttsModel === 'kokoro' ? $ttsWebGPUKokoro : false
	);
	let actualDevice = $state('wasm');
	let chunks = $state<any[]>([]);
	let result = $state<Blob | null>(null);

	// Computed properties
	let processed = $derived.by(() => {
		return (
			lastGeneration &&
			lastGeneration.text === text &&
			lastGeneration.speed === speed &&
			lastGeneration.voice === selectedVoice &&
			($ttsModel === 'kitten' ? lastGeneration.sampleRate === selectedSampleRate : true) &&
			lastGeneration.model === $ttsModel
		);
	});

	// Methods
	function setSelectedVoice(voice: string | number) {
		selectedVoice = String(voice);
	}

	function setSpeed(newSpeed: number) {
		speed = newSpeed;
	}

	function setSampleRate(sampleRate: number) {
		if ($ttsModel === 'kitten') {
			$ttsKittenSampleRate = sampleRate;
		}
	}

	function handleModelChange(model: 'kitten' | 'piper' | 'kokoro') {
		if ($ttsModel === model) return;

		$ttsModel = model;

		// Reset voice selection based on model
		if (model === 'kitten') {
			selectedVoice = 'expr-voice-2-m';
		} else if (model === 'piper') {
			selectedVoice = '0';
		} else if (model === 'kokoro') {
			selectedVoice = 'af_heart';
		}

		// Restart worker with new model
		restartWorker();
	}

	function handleWebGPUToggle(enabled: boolean) {
		// Update the persisted store based on current model
		if ($ttsModel === 'kitten') {
			$ttsWebGPUKitten = enabled;
		} else if ($ttsModel === 'kokoro') {
			$ttsWebGPUKokoro = enabled;
		}

		// Only restart if the value actually changed and it's different from current device
		if (enabled !== (actualDevice === 'webgpu')) {
			restartWorker(enabled);
		}
	}

	let previewAudio: HTMLAudioElement | null = null;
	let isPreviewMode = $state(false);

	async function handleVoicePreview({
		voice,
		text: previewText,
		action
	}: {
		voice: string | number;
		text?: string;
		action: 'play' | 'stop';
	}) {
		if (action === 'stop') {
			if (previewAudio) {
				previewAudio.pause();
				previewAudio = null;
			}
			isPreviewMode = false;
			return;
		}

		if (action === 'play') {
			// Stop any existing preview
			if (previewAudio) {
				previewAudio.pause();
				previewAudio = null;
			}

			// Only preview if we have a worker and the model is ready
			if (!worker || status !== 'ready') {
				console.warn('Model not ready for preview');
				return;
			}

			try {
				// Mark as preview mode
				isPreviewMode = true;

				// Send preview request to worker
				worker.postMessage({
					type: 'tts',
					text: previewText,
					voice: $ttsModel === 'piper' ? parseInt(voice as string) : voice,
					speed: speed,
					sampleRate: selectedSampleRate,
					isPreview: true
				});
			} catch (error) {
				console.error('Error starting voice preview:', error);
				isPreviewMode = false;
			}
		}
	}

	function restartWorker(webGPUPreference = false) {
		if (worker) {
			worker.terminate();
		}

		// Don't start worker if no model is selected
		if (!$ttsModel) {
			status = 'waiting';
			return;
		}

		// Reset all audio and UI state
		status = 'loading';
		voices = [];
		chunks = [];
		result = null;
		lastGeneration = null;
		isPlaying = false;
		currentChunkIndex = -1;

		worker = new Worker(new URL('$lib/workers/tts-worker.js', import.meta.url), {
			type: 'module'
		});

		worker.addEventListener('message', onMessageReceived);
		worker.addEventListener('error', onErrorReceived);

		// Send init message with model type and device preference
		worker.postMessage({
			type: 'init',
			model: $ttsModel,
			useWebGPU: webGPUPreference
		});
	}

	function setCurrentChunkIndex(index: number) {
		currentChunkIndex = index;
	}

	function setIsPlaying(playing: boolean) {
		isPlaying = playing;
	}

	function handleChunkEnd() {
		if (status !== 'generating' && currentChunkIndex === chunks.length - 1) {
			isPlaying = false;
			currentChunkIndex = -1;
		} else {
			currentChunkIndex = currentChunkIndex + 1;
		}
	}

	function handlePlayPause() {
		if (!isPlaying && status === 'ready' && !processed) {
			status = 'generating';
			chunks = [];
			currentChunkIndex = 0;
			const params = {
				text: text,
				voice: $ttsModel === 'piper' ? parseInt(selectedVoice) : selectedVoice,
				speed: speed,
				model: $ttsModel,
				sampleRate: selectedSampleRate
			};

			lastGeneration = params;
			worker?.postMessage({
				type: 'tts',
				...params
			});
		}
		if (currentChunkIndex === -1) {
			currentChunkIndex = 0;
		}
		isPlaying = !isPlaying;
	}

	function downloadAudio() {
		if (!result) return;
		const url = URL.createObjectURL(result);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'audio.wav';
		link.click();
		URL.revokeObjectURL(url);
	}

	async function handleCopy() {
		if (!text) return;

		await navigator.clipboard.writeText(text);
		copied = true;
		toast.success('Text copied to clipboard!');
		setTimeout(() => {
			copied = false;
		}, 2000);
	}

	function handleGetRandomQuote() {
		text = getRandomQuote();
	}

	function handleClear() {
		text = '';
		$ttsText = ''; // Clear persisted text too
	}

	// Worker message handlers
	function onMessageReceived(event: MessageEvent) {
		const { data } = event;
		switch (data.status) {
			case 'device':
				actualDevice = data.device;
				useWebGPU = data.device === 'webgpu';
				break;
			case 'ready':
				status = 'ready';
				voices = data.voices || [];
				actualDevice = data.device;
				useWebGPU = data.device === 'webgpu';
				break;
			case 'error':
				status = 'error';
				error = data.data;

				// Show toast notification for errors
				if (data.errorType === 'phonemization') {
					toast.error('Phonemization Failed', {
						description:
							'Unable to convert text to phonemes. The text may contain unsupported characters or the phonemizer service is unavailable.',
						duration: 5000
					});
				} else {
					toast.error('TTS Error', {
						description: data.data || 'An error occurred during text-to-speech generation.',
						duration: 4000
					});
				}
				break;
			case 'stream':
				chunks = [...chunks, data.chunk];
				break;
			case 'complete':
				if (isPreviewMode) {
					// Handle preview audio
					isPreviewMode = false;
					if (data.audio) {
						try {
							const audioUrl = URL.createObjectURL(data.audio);
							previewAudio = new Audio(audioUrl);
							previewAudio.volume = 0.8;
							previewAudio.onended = () => {
								URL.revokeObjectURL(audioUrl);
								previewAudio = null;
								document.dispatchEvent(new CustomEvent('voicePreviewEnded'));
							};
							previewAudio.onerror = (e) => {
								console.error('Preview audio error:', e);
								URL.revokeObjectURL(audioUrl);
								previewAudio = null;
								document.dispatchEvent(new CustomEvent('voicePreviewEnded'));
							};

							previewAudio.play().catch((e) => {
								console.warn('Preview autoplay failed:', e);
								URL.revokeObjectURL(audioUrl);
								previewAudio = null;
								document.dispatchEvent(new CustomEvent('voicePreviewEnded'));
							});
						} catch (e) {
							console.error('Error creating preview audio:', e);
							previewAudio = null;
							document.dispatchEvent(new CustomEvent('voicePreviewEnded'));
						}
					}
				} else {
					// Handle main generation
					status = 'ready';
					result = data.audio;
				}
				break;
		}
	}

	function onErrorReceived(e: ErrorEvent) {
		console.error('Worker error:', e);
		error = e.message;
	}

	// Initialize on mount
	onMount(() => {
		// Initialize text with persisted value or random quote
		text = $ttsText || getRandomQuote();

		// If we have a persisted model, initialize with it
		if ($ttsModel) {
			// Set voice defaults based on the persisted model
			if ($ttsModel === 'kitten') {
				selectedVoice = 'expr-voice-2-m';
			} else if ($ttsModel === 'piper') {
				selectedVoice = '0';
			} else if ($ttsModel === 'kokoro') {
				selectedVoice = 'af_heart';
			}

			// Start the worker with the persisted model
			restartWorker();
		}
	});

	// Cleanup
	onDestroy(() => {
		if (worker) {
			worker.terminate();
		}
	});
</script>

<CardInterface>
	<Toolbar modelInfo="Text to Speech Studio" ModelIcon={MicIcon} variant="studio" />

	<ContentArea>
		<div class="tts-container">
			<div class="model-selection-intro">
				<h2>
					<span class="title-icon"><SparklesIcon /></span>
					Welcome to TTS Studio
				</h2>
				<p>Generate high-quality speech from text, all running locally in your browser!</p>
			</div>

			<!-- Model Selection -->
			<ModelSwitcher
				selectedModel={$ttsModel}
				onModelChange={handleModelChange}
				loading={status === 'loading'}
			/>

			{#if status === 'loading'}
				<LoadingProgress
					title="Loading TTS Model"
					progress={0}
					message="Initializing text-to-speech model..."
					showPercentage={false}
					mode="spinner"
				/>
			{:else if status === 'error'}
				<ErrorDisplay
					message={error || 'Failed to load model'}
					buttonText="Retry"
					onRetry={() => restartWorker()}
				/>
			{:else if status !== 'waiting'}
				<!-- Text Input Section -->
				<div class="text-input-section">
					<div class="section-header">
						<div class="title-and-icons">
							<h3>Enter Your Text</h3>
							<div class="button-group mobile-icons">
								<button
									class="dice-button"
									onclick={handleGetRandomQuote}
									title="Get random Svelte quote"
								>
									<DicesIcon />
								</button>
								<button
									class="copy-button"
									onclick={handleCopy}
									title={copied ? 'Copied!' : 'Copy text'}
									disabled={!text}
								>
									{#if copied}
										<CheckIcon />
									{:else}
										<CopyIcon />
									{/if}
								</button>
								<button class="clear-button" onclick={handleClear} title="Clear text">
									<TrashIcon />
								</button>
							</div>
						</div>
						<div class="stats-and-buttons desktop-only">
							<TextStatistics {text} />
							<div class="button-group">
								<button
									class="dice-button"
									onclick={handleGetRandomQuote}
									title="Get random Svelte quote"
								>
									<DicesIcon />
								</button>
								<button
									class="copy-button"
									onclick={handleCopy}
									title={copied ? 'Copied!' : 'Copy text'}
									disabled={!text}
								>
									{#if copied}
										<CheckIcon />
									{:else}
										<CopyIcon />
									{/if}
								</button>
								<button class="clear-button" onclick={handleClear} title="Clear text">
									<TrashIcon />
								</button>
							</div>
						</div>
					</div>
					<div class="mobile-stats">
						<TextStatistics {text} />
					</div>

					<div class="text-input-wrapper">
						<textarea
							bind:value={text}
							oninput={() => {
								$ttsText = text;
							}}
							placeholder="Type or paste your text here..."
							class="text-input"
							disabled={status === 'generating'}
						></textarea>
					</div>
				</div>

				<AdvancedParameters
					selectedModel={$ttsModel}
					{useWebGPU}
					{selectedSampleRate}
					onWebGPUToggle={handleWebGPUToggle}
					onSampleRateChange={setSampleRate}
				/>

				<!-- Controls Section -->
				{#if voices.length > 0}
					<div class="controls-section">
						<div class="controls-grid">
							<div class="control-item">
								<label for="voice-selector">Voice:</label>
								<VoiceSelector
									{voices}
									selectedVoice={selectedVoice ?? ''}
									onVoiceChange={setSelectedVoice}
									onVoicePreview={handleVoicePreview}
								/>
							</div>

							<div class="control-item">
								<SpeedControl {speed} onSpeedChange={setSpeed} />
							</div>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="action-buttons">
						<button
							class="primary-action-btn"
							class:playing={isPlaying}
							onclick={handlePlayPause}
							disabled={(status === 'ready' && !isPlaying && !text) ||
								(status !== 'ready' && chunks.length === 0)}
						>
							{#if status === 'generating'}
								<LoaderIcon />
								<span>Generating</span>
							{:else if isPlaying && status === 'ready'}
								<PauseIcon />
								<span>Pause</span>
							{:else}
								<PlayIcon />
								<span>{processed ? 'Play' : 'Generate'}</span>
							{/if}
						</button>

						<button
							class="secondary-action-btn"
							onclick={downloadAudio}
							disabled={!result || status !== 'ready'}
						>
							<DownloadIcon />
							<span>Download Audio</span>
						</button>
					</div>

					<!-- Hidden Audio Chunks -->
					<div class="hidden">
						{#if chunks.length > 0}
							{#each chunks as chunk, index (index)}
								<AudioChunk
									audio={chunk.audio}
									active={currentChunkIndex === index}
									playing={isPlaying}
									onStart={() => setCurrentChunkIndex(index)}
									onPause={() => {
										if (currentChunkIndex === index) setIsPlaying(false);
									}}
									onEnd={handleChunkEnd}
								/>
							{/each}
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	</ContentArea>
</CardInterface>

<style>
	.tts-container {
		display: flex;
		flex-direction: column;
		gap: var(--sp-5);
	}

	.model-selection-intro {
		text-align: center;
		padding: var(--sp-6);
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		margin-bottom: var(--sp-3);
	}

	.model-selection-intro h2 {
		margin: 0 0 var(--sp-3) 0;
		font-family: var(--font-family-primary);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--sp-2);
	}

	.title-icon {
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.title-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.model-selection-intro p {
		margin: 0;
		font-size: 1rem;
		color: var(--color-text-secondary);
	}

	.text-input-section {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		padding: var(--sp-5);
		box-shadow: var(--shadow-sm);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--sp-3);
		flex-wrap: wrap;
		gap: var(--sp-3);
	}

	.title-and-icons {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}

	.button-group.mobile-icons {
		display: none;
	}

	.desktop-only {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}

	.mobile-stats {
		display: none;
		margin-bottom: var(--sp-3);
	}

	.section-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.text-input-wrapper {
		position: relative;
	}

	.text-input {
		width: 100%;
		min-height: 160px;
		padding: var(--sp-3);
		border: 1px solid var(--color-border-light);
		font-family: var(--font-family-primary);
		font-size: 0.9375rem;
		resize: vertical;
		box-sizing: border-box;
		background: var(--color-background-main);
		border-radius: var(--radius-md);
		transition: border-color var(--transition-fast);
		color: var(--color-text-primary);
	}

	.text-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-primary-subtle);
	}

	.text-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.stats-and-buttons {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		flex-shrink: 0;
		min-width: 0;
	}

	.button-group {
		display: flex;
		gap: var(--sp-1);
		flex-shrink: 0;
	}

	.dice-button,
	.copy-button,
	.clear-button {
		width: 32px;
		height: 32px;
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-sm);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-fast);
		color: var(--color-text-secondary);
	}

	.dice-button :global(svg),
	.copy-button :global(svg),
	.clear-button :global(svg) {
		width: 16px;
		height: 16px;
	}

	.copy-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.dice-button:hover,
	.copy-button:hover:not(:disabled),
	.clear-button:hover {
		background: var(--color-primary-subtle);
		color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.controls-section {
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-light);
		padding: var(--sp-5);
		border-radius: var(--radius-lg);
	}

	.controls-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--sp-4);
		margin-bottom: var(--sp-3);
	}

	.control-item {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
	}

	.control-item label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.action-buttons {
		display: flex;
		gap: var(--sp-3);
		flex-wrap: wrap;
		justify-content: center;
	}

	.primary-action-btn,
	.secondary-action-btn {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		padding: var(--sp-3) var(--sp-5);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		transition: all var(--transition-fast);
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-sm);
	}

	.primary-action-btn {
		background: var(--color-success);
		color: #fff;
	}

	.primary-action-btn.playing {
		background: var(--color-warning);
		color: #000;
	}

	.primary-action-btn:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.primary-action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.secondary-action-btn {
		background: var(--color-card);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border-light);
	}

	.secondary-action-btn:hover:not(:disabled) {
		background: var(--color-primary-subtle);
		border-color: var(--color-primary);
		color: var(--color-primary);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.secondary-action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.primary-action-btn :global(svg),
	.secondary-action-btn :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.hidden {
		display: none;
	}

	@media (max-width: 768px) {
		.controls-grid {
			grid-template-columns: 1fr;
		}

		.action-buttons {
			flex-direction: column;
		}

		.primary-action-btn,
		.secondary-action-btn {
			width: 100%;
			justify-content: center;
		}
	}

	@media (max-width: 600px) {
		.text-input-section {
			padding: var(--sp-4);
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--sp-2);
		}

		.title-and-icons {
			width: 100%;
			justify-content: space-between;
		}

		.button-group.mobile-icons {
			display: flex;
		}

		.desktop-only {
			display: none;
		}

		.mobile-stats {
			display: block;
		}

		.controls-section {
			padding: var(--sp-4);
		}

		.model-selection-intro {
			padding: var(--sp-4);
		}

		.model-selection-intro h2 {
			font-size: 1.25rem;
		}
	}
</style>
