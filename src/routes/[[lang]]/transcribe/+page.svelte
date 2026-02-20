<script lang="ts">
	import createModule from '@transcribe/shout';
	import { FileTranscriber } from '@transcribe/transcriber';
	import { downloadModelWithProgress, isModelCached, isOPFSSupported } from '$lib/download-utils';
	import { onMount, onDestroy } from 'svelte';
	import { whisperModel } from '$lib/stores';
	import { useWakeLock } from '$lib/wakeLock.svelte';
	import { BASE_MODEL_URL } from '$lib/config';
	import LockIcon from 'virtual:icons/lucide/lock';
	import PlayIcon from 'virtual:icons/lucide/play';
	import SquareSpinner from '$lib/components/common/SquareSpinner.svelte';

	import WhisperModelSelector from '$lib/components/whisper/WhisperModelSelector.svelte';
	import TranscribeOptions from '$lib/components/whisper/TranscribeOptions.svelte';
	import TranscriptionProgress from '$lib/components/whisper/TranscriptionProgress.svelte';
	import TranscriptionResult from '$lib/components/whisper/TranscriptionResult.svelte';

	let isReady = $state(false);
	let isLoading = $state(false);
	let isTranscribing = $state(false);
	let transcriber: FileTranscriber;
	let text = $state('');
	let error = $state(false);
	let transcribeProgress = $state(0);
	let previousProgress = $state(0);
	let downloadProgress = $state(0);
	let previousDownloadProgress = $state(0);
	let currentSegment = $state('');
	let usingCachedModel = $state(false);
	let opfsSupported = $state(true);
	let hasProgressTracking = $state(true);

	let transcriptionData = $state<
		| {
				transcription: Array<{
					text: string;
					timestamps: {
						from: string;
						to: string;
					};
				}>;
		  }
		| undefined
	>(undefined);

	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	onMount(() => {
		return setupWakeLock(() => isTranscribing);
	});

	let selectedFile: File | null = $state(null);
	let transcribeMode = $state<'demo' | 'upload' | 'record'>('upload');

	let lastSegmentTime = $state(0);
	let stuckCheckInterval: number | null = null;
	let isStuck = $state(false);

	const DEFAULT_MODEL = `${BASE_MODEL_URL}/whisper/ggml-tiny-q5_1.bin`;

	let selectedModel = $state(DEFAULT_MODEL);
	const availableModels = [
		{ path: DEFAULT_MODEL, name: 'Whisper Tiny (q5_1)' },
		{
			path: `${BASE_MODEL_URL}/whisper/ggml-tiny.en-q5_1.bin`,
			name: 'Whisper Tiny English (q5_1)'
		},
		{ path: `${BASE_MODEL_URL}/whisper/ggml-small-q5_1.bin`, name: 'Whisper Small (q5_1)' },
		{
			path: `${BASE_MODEL_URL}/whisper/ggml-small.en-q5_1.bin`,
			name: 'Whisper Small English (q5_1)'
		},
		{
			path: `${BASE_MODEL_URL}/whisper/ggml-medium-q5_0.bin`,
			name: 'Whisper Medium (q5_0)'
		},
		{
			path: `${BASE_MODEL_URL}/whisper/ggml-medium.en-q5_0.bin`,
			name: 'Whisper Medium English (q5_0)'
		},
		{
			path: `${BASE_MODEL_URL}/whisper/ggml-large-v2-q5_0.bin`,
			name: 'Whisper Large (q5_0)'
		}
	];

	async function transcribe() {
		if (!transcriber?.isReady) return;
		if ((transcribeMode === 'upload' || transcribeMode === 'record') && !selectedFile) return;

		text = '';
		currentSegment = '';
		isTranscribing = true;
		transcribeProgress = 0;
		previousProgress = 0;
		isStuck = false;
		lastSegmentTime = Date.now();
		transcriptionData = undefined;

		startStuckCheck();

		await requestWakeLock();

		try {
			let result;
			if (transcribeMode === 'demo') {
				result = await transcriber.transcribe('/rich.mp3', { lang: 'en' });
			} else {
				result = await transcriber.transcribe(selectedFile!, { lang: 'en' });
			}

			transcriptionData = result;

			text = result.transcription.map((t) => t.text).join(' ');
		} catch (err) {
			console.error('Transcription error:', err);
			error = true;
			text = 'An error occurred during transcription. Please try again.';
		} finally {
			isTranscribing = false;
			transcribeProgress = 0;
			currentSegment = '';
			stopStuckCheck();

			await releaseWakeLock();
		}
	}

	function startStuckCheck() {
		stuckCheckInterval = window.setInterval(() => {
			if (isTranscribing && Date.now() - lastSegmentTime > 60000) {
				isStuck = true;
				stopStuckCheck();
			}
		}, 5000); // Check every 5 seconds
	}

	function stopStuckCheck() {
		if (stuckCheckInterval) {
			clearInterval(stuckCheckInterval);
			stuckCheckInterval = null;
		}
	}

	function reloadPage() {
		window.location.reload();
	}

	function retry() {
		error = false;
		loadModel();
	}

	function handleFileSelect(file: File) {
		selectedFile = file;
		transcribeMode = 'upload';
	}

	function handleModeChange(mode: 'demo' | 'upload' | 'record') {
		transcribeMode = mode;
		if (mode === 'demo') {
			selectedFile = null;
		}
	}

	async function loadModel() {
		try {
			isLoading = true;
			error = false;

			if (transcriber) {
				transcriber.destroy();
				isReady = false;
			}

			// Save the model name instead of the path
			const selectedModelObj = availableModels.find((m) => m.path === selectedModel);
			$whisperModel = selectedModelObj?.name || '';

			console.log(`Loading model from: ${selectedModel}`);

			usingCachedModel = false;
			downloadProgress = 0;
			hasProgressTracking = true;

			const modelFile = await downloadModelWithProgress(selectedModel, (progress, cached) => {
				previousDownloadProgress = downloadProgress;
				downloadProgress = progress;

				if (progress === -1) {
					hasProgressTracking = false;
					downloadProgress = 0;
					return;
				}

				if (cached) {
					usingCachedModel = true;
				}
			});

			transcriber = new FileTranscriber({
				createModule,
				model: modelFile, // Pass the downloaded File object instead of URL
				onReady: () => console.log('Transcriber ready'),
				onProgress: (progress) => {
					previousProgress = transcribeProgress;
					transcribeProgress = Math.round(progress);
					console.log(`Transcription progress: ${transcribeProgress}%`);
				},
				onSegment: (segment) => {
					console.log('New segment:', segment);
					currentSegment = segment.segment.text.trim();
					lastSegmentTime = Date.now();
					isStuck = false;
				},
				onComplete: (result) => console.log('Transcription complete:', result),
				onCanceled: () => console.log('Transcription canceled')
			});

			await transcriber.init();

			isReady = true;
		} catch (err) {
			console.error('Failed to initialize transcriber:', err);
			error = true;
		} finally {
			isLoading = false;
		}
	}

	function changeModel() {
		isReady = false;
		loadModel();
	}

	onMount(async () => {
		opfsSupported = isOPFSSupported(import.meta.env.PUBLIC_DISABLE_OPFS === 'true');
		if (!opfsSupported) {
			console.log('OPFS not supported - models will not be cached');
		}

		if ($whisperModel) {
			// Find the stored model by name and set selectedModel to its path
			const storedModel =
				availableModels.find((m) => m.name === $whisperModel) ||
				availableModels.find((m) => m.path === $whisperModel); // Backward compatibility

			if (storedModel) {
				selectedModel = storedModel.path;

				// Migrate old format if needed
				if ($whisperModel !== storedModel.name) {
					$whisperModel = storedModel.name;
				}

				if (opfsSupported) {
					// Only autoload if the model is already cached
					const cached = await isModelCached(storedModel.path);
					if (cached) {
						console.log('Autoloading cached model:', storedModel.name);
						loadModel();
					} else {
						console.log('Model not cached, user must manually load:', storedModel.name);
					}
				} else {
					console.log('OPFS not supported, user must manually load model:', storedModel.name);
				}
			}
		}
	});

	onDestroy(() => {
		if (transcriber) {
			transcriber.destroy();
		}
		stopStuckCheck();
	});
</script>

<div class="page-container">
	<header class="page-header">
		<h1>Transcribe</h1>
		<p>Whisper runs locally in your browser. No uploads.</p>
	</header>

	<div class="page-content">
		<!-- Section A: Model -->
		<section class="panel">
			<WhisperModelSelector
				bind:selectedModel
				{availableModels}
				{isLoading}
				{isReady}
				loadedModel={$whisperModel}
				{error}
				{downloadProgress}
				{previousDownloadProgress}
				{usingCachedModel}
				{hasProgressTracking}
				onLoadModel={loadModel}
				onChangeModel={changeModel}
				onRetry={retry}
			/>
		</section>

		<!-- Section B: Audio Input -->
		<section class="panel" class:disabled={!isReady}>
			<TranscribeOptions
				bind:transcribeMode
				bind:selectedFile
				onFileSelect={handleFileSelect}
				onModeChange={handleModeChange}
				disabled={!isReady}
			/>
		</section>

		<!-- Section C: Output -->
		{#if isTranscribing}
			<section class="panel">
				<TranscriptionProgress
					progress={transcribeProgress}
					{previousProgress}
					{currentSegment}
					{isStuck}
					onReload={reloadPage}
				/>
			</section>
		{:else if text}
			<section class="panel">
				<TranscriptionResult {text} {transcriptionData} />
			</section>
		{/if}

		<!-- Action -->
		<div class="action-row">
			<button
				class="transcribe-btn"
				onclick={transcribe}
				disabled={!isReady ||
					isTranscribing ||
					((transcribeMode === 'upload' || transcribeMode === 'record') && !selectedFile)}
			>
				{#if isTranscribing}
					<SquareSpinner class="loading-spinner" />
					Transcribing…
				{:else}
					<span class="btn-icon"><PlayIcon /></span>
					Start Transcription
				{/if}
			</button>
		</div>

		<p class="disclaimer">
			<span class="disclaimer-icon"><LockIcon /></span>
			Transcription is performed locally in your browser. Results may not always be accurate.
		</p>
	</div>
</div>

<style>
	.page-container {
		max-width: 720px;
		margin: 0 auto;
		padding: var(--sp-6) var(--sp-4);
	}

	.page-header {
		margin-bottom: var(--sp-6);
	}

	.page-header h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin: 0 0 var(--sp-1) 0;
	}

	.page-header p {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
	}

	.page-content {
		display: flex;
		flex-direction: column;
		gap: var(--sp-5);
	}

	.panel {
		background: var(--color-background-primary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--sp-5);
		transition: opacity 0.25s ease;
	}

	.panel.disabled {
		opacity: 0.4;
		pointer-events: none;
	}

	.action-row {
		display: flex;
		justify-content: flex-end;
	}

	.transcribe-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		padding: var(--sp-2) var(--sp-5);
		font-size: 0.9375rem;
		font-weight: 600;
		color: #fff;
		background: var(--color-primary);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition:
			background 0.15s ease,
			opacity 0.15s ease;
	}

	.transcribe-btn:hover:not(:disabled) {
		background: var(--color-primary-hover);
	}

	.transcribe-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.btn-icon {
		display: flex;
		align-items: center;
		font-size: 1.125rem;
	}

	.btn-icon :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	:global(.loading-spinner) {
		color: #fff;
	}

	.disclaimer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--sp-2);
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
		text-align: center;
	}

	.disclaimer-icon {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
	}

	.disclaimer-icon :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}

	@media (max-width: 640px) {
		.page-container {
			padding: var(--sp-4) var(--sp-3);
		}

		.page-header h1 {
			font-size: 1.375rem;
		}

		.panel {
			padding: var(--sp-4);
		}

		.action-row {
			justify-content: stretch;
		}

		.transcribe-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
