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
	import DicesIcon from 'virtual:icons/lucide/dices';
	import TrashIcon from 'virtual:icons/lucide/trash';
	import LoaderIcon from 'virtual:icons/lucide/loader';

	import LoadingProgress from '$lib/components/common/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/common/ErrorDisplay.svelte';
	import PageHeader from '$lib/components/common/PageHeader.svelte';

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

<div class="page-container">
	<PageHeader
		title="Text to Speech Studio"
		subtitle="Generate high-quality speech from text, running locally in your browser."
		Icon={MicIcon}
	/>

	<div class="page-content">
		<!-- Step 1: Model Selection -->
		<section class="panel">
			<ModelSwitcher
				selectedModel={$ttsModel}
				onModelChange={handleModelChange}
				loading={status === 'loading'}
			/>
		</section>

		{#if status === 'loading'}
			<section class="panel">
				<LoadingProgress
					title="Loading TTS Model"
					progress={0}
					message="Initializing text-to-speech model..."
					showPercentage={false}
					mode="spinner"
				/>
			</section>
		{:else if status === 'error'}
			<section class="panel">
				<ErrorDisplay
					message={error || 'Failed to load model'}
					buttonText="Retry"
					onRetry={() => restartWorker()}
				/>
			</section>
		{:else if status !== 'waiting'}
			<!-- Step 2: Text Input -->
			<section class="panel">
				<div class="panel-header">
					<h3>Your Text</h3>
					<div class="panel-toolbar">
						<TextStatistics {text} />
						<div class="icon-group">
							<button class="icon-btn" onclick={handleGetRandomQuote} title="Get random quote">
								<DicesIcon />
							</button>
							<button
								class="icon-btn"
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
							<button class="icon-btn" onclick={handleClear} title="Clear text" disabled={!text}>
								<TrashIcon />
							</button>
						</div>
					</div>
				</div>
				<textarea
					bind:value={text}
					oninput={() => {
						$ttsText = text;
					}}
					placeholder="Type or paste your text here…"
					class="text-input"
					disabled={status === 'generating'}
				></textarea>
			</section>

			<!-- Step 3: Voice & Speed Controls -->
			{#if voices.length > 0}
				<section class="panel controls-panel">
					<div class="controls-row">
						<div class="control-field">
							<label>Voice</label>
							<VoiceSelector
								{voices}
								selectedVoice={selectedVoice ?? ''}
								onVoiceChange={setSelectedVoice}
								onVoicePreview={handleVoicePreview}
							/>
						</div>
						<div class="control-field speed-field">
							<SpeedControl {speed} onSpeedChange={setSpeed} />
						</div>
					</div>
				</section>
			{/if}

			<AdvancedParameters
				selectedModel={$ttsModel}
				{useWebGPU}
				{selectedSampleRate}
				onWebGPUToggle={handleWebGPUToggle}
				onSampleRateChange={setSampleRate}
			/>

			<!-- Output / Actions -->
			{#if voices.length > 0}
				<div class="action-row">
					<button
						class="generate-btn"
						class:playing={isPlaying}
						onclick={handlePlayPause}
						disabled={(status === 'ready' && !isPlaying && !text) ||
							(status !== 'ready' && chunks.length === 0)}
					>
						{#if status === 'generating'}
							<LoaderIcon />
							<span>Generating…</span>
						{:else if isPlaying && status === 'ready'}
							<PauseIcon />
							<span>Pause</span>
						{:else}
							<PlayIcon />
							<span>{processed ? 'Play' : 'Generate Speech'}</span>
						{/if}
					</button>

					<button
						class="download-btn"
						onclick={downloadAudio}
						disabled={!result || status !== 'ready'}
					>
						<DownloadIcon />
						<span>Download</span>
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
</div>

<style>
	.page-container {
		max-width: 760px;
		margin: 0 auto;
		padding: var(--sp-6) var(--sp-4);
	}

	.page-content {
		display: flex;
		flex-direction: column;
		gap: var(--sp-5);
	}

	/* Panels */
	.panel {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		padding: var(--sp-5);
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--sp-3);
		flex-wrap: wrap;
		gap: var(--sp-2);
	}

	.panel-header h3 {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.panel-toolbar {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}

	.icon-group {
		display: flex;
		gap: var(--sp-1);
	}

	.icon-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-sm);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.icon-btn :global(svg) {
		width: 15px;
		height: 15px;
	}

	.icon-btn:hover:not(:disabled) {
		background: var(--color-accent-primary-alpha);
		color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.icon-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	/* Textarea */
	.text-input {
		width: 100%;
		min-height: 150px;
		padding: var(--sp-3);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		background: var(--color-background-main);
		color: var(--color-text-primary);
		font-family: var(--font-family-primary);
		font-size: 0.9375rem;
		line-height: 1.6;
		resize: vertical;
		box-sizing: border-box;
		transition: border-color var(--transition-fast);
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

	/* Controls */
	.controls-panel {
		padding: var(--sp-4) var(--sp-5);
	}

	.controls-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-5);
		align-items: end;
	}

	.control-field {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
	}

	.control-field > label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	/* Action buttons */
	.action-row {
		display: flex;
		gap: var(--sp-3);
		justify-content: center;
	}

	.generate-btn,
	.download-btn {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		padding: var(--sp-3) var(--sp-5);
		border: none;
		border-radius: var(--radius-md);
		font-size: 0.9375rem;
		font-weight: 600;
		font-family: var(--font-family-primary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.generate-btn {
		background: var(--color-primary);
		color: #fff;
	}

	.generate-btn.playing {
		background: var(--color-warning);
		color: #000;
	}

	.generate-btn:hover:not(:disabled) {
		filter: brightness(1.08);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.generate-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.download-btn {
		background: var(--color-card);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border-light);
	}

	.download-btn:hover:not(:disabled) {
		border-color: var(--color-primary);
		color: var(--color-primary);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.download-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.generate-btn :global(svg),
	.download-btn :global(svg) {
		width: 18px;
		height: 18px;
	}

	.hidden {
		display: none;
	}

	@media (max-width: 640px) {
		.page-container {
			padding: var(--sp-4) var(--sp-3);
		}

		.panel {
			padding: var(--sp-4);
		}

		.panel-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.controls-row {
			grid-template-columns: 1fr;
			gap: var(--sp-4);
		}

		.action-row {
			flex-direction: column;
		}

		.generate-btn,
		.download-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
