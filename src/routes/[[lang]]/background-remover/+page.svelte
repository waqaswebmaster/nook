<script lang="ts">
	import { pipeline, env } from '@huggingface/transformers';
	import { onMount, onDestroy } from 'svelte';
	import { useWakeLock } from '$lib/wakeLock.svelte';
	import JSZip from 'jszip';

	import BackgroundRemoverUpload from '$lib/components/background-remover/BackgroundRemoverUpload.svelte';
	import BackgroundRemoverProgress from '$lib/components/background-remover/BackgroundRemoverProgress.svelte';
	import BackgroundRemoverResult from '$lib/components/background-remover/BackgroundRemoverResult.svelte';
	import BackgroundRemoverBatchResult from '$lib/components/background-remover/BackgroundRemoverBatchResult.svelte';
	import LoadingProgress from '$lib/components/common/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/common/ErrorDisplay.svelte';
	import SegmentedControl from '$lib/components/common/SegmentedControl.svelte';
	import { BASE_MODEL_URL } from '$lib/config';

	let isModelLoaded = $state(false);
	let isLoadingModel = $state(false);
	let isProcessing = $state(false);
	let error = $state(false);
	let errorMessage = $state('');
	let modelLoadProgress = $state(0);
	let processingProgress = $state(0);

	// Configure custom model URL
	if (env.backends?.onnx?.wasm) {
		env.backends.onnx.wasm.wasmPaths = '/transformers/';
	}
	env.remoteHost = `${BASE_MODEL_URL}/bgremoval/`;
	env.remotePathTemplate = '{model}/';

	// Mode selection
	let processingMode = $state<'single' | 'batch'>('single');

	const getAvailableModels = () => {
		return [
			{
				id: 'RMBG-1.4', //briaai/
				name: 'RMBG v1.4',
				description: ['Small and fast', 'Runs on most devices'],
				size: '44MB',
				precision: 'QUANT'
			},
			{
				id: 'BEN2-ONNX', //briaai/
				name: 'BEN2',
				description: ['Large, very slow model', 'Generally provides better results'],
				size: '235MB',
				precision: 'FP16'
			}
		];
	};

	let selectedModelId = $state('RMBG-1.4');

	// Single image mode
	let selectedFile: File | null = $state(null);
	let processedImageUrl = $state<string | null>(null);
	let originalImageUrl = $state<string | null>(null);

	// Batch mode
	let selectedFiles: File[] = $state([]);
	let batchResults: Array<{
		file: File;
		originalThumbnail: string;
		processedThumbnail: string | null;
		processedFullUrl: string | null; // Full size for download
		error?: string;
	}> = $state([]);
	let currentBatchIndex = $state(0);
	let totalBatchCount = $state(0);

	let segmenter: any = null;

	const EXAMPLE_URL = '/pexels-photo-5965592.jpeg';

	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	onMount(() => {
		const cleanup = setupWakeLock(() => isProcessing || isLoadingModel);
		// Auto-load model when page loads
		loadModel();
		return cleanup;
	});

	async function loadModel() {
		try {
			isLoadingModel = true;
			error = false;
			modelLoadProgress = 0;

			await requestWakeLock();

			segmenter = await pipeline('background-removal', selectedModelId, {
				progress_callback: (progress: any) => {
					if (progress.status === 'initiate') {
						console.log('Initiating download of', progress);
					} else if (progress.status === 'progress') {
						modelLoadProgress = Math.round(progress.progress || 0);
					} else if (progress.status === 'ready') {
						modelLoadProgress = 100;
					}
				}
			});

			modelLoadProgress = 100;
			isModelLoaded = true;
		} catch (err) {
			console.error('Model loading error:', err);
			error = true;
			errorMessage =
				'Failed to load background removal model. Please check your connection and try again.';
		} finally {
			isLoadingModel = false;
			await releaseWakeLock();
		}
	}

	// Helper function to create a thumbnail from a blob URL
	async function createThumbnail(imageUrl: string, maxSize: number = 500): Promise<string | null> {
		return new Promise((resolve) => {
			let img: HTMLImageElement | null = new Image();

			img.onload = () => {
				if (!img) return; // Safety check

				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				// Calculate thumbnail dimensions
				let width = img.width;
				let height = img.height;
				if (width > height) {
					if (width > maxSize) {
						height = (height * maxSize) / width;
						width = maxSize;
					}
				} else {
					if (height > maxSize) {
						width = (width * maxSize) / height;
						height = maxSize;
					}
				}

				canvas.width = width;
				canvas.height = height;
				ctx?.drawImage(img, 0, 0, width, height);

				canvas.toBlob((blob) => {
					if (blob) {
						resolve(URL.createObjectURL(blob));
					} else {
						resolve(null);
					}
					// Clean up img reference to help garbage collection
					img = null;
				}, 'image/png'); // Use PNG to preserve transparency
			};

			img.onerror = () => {
				// Clean up on error
				img = null;
				resolve(null);
			};

			img.src = imageUrl;
		});
	}

	async function processImage(
		imageUrl: string
	): Promise<{ fullUrl: string | null; thumbnail: string | null }> {
		if (!segmenter) return { fullUrl: null, thumbnail: null };

		let tempCanvas: HTMLCanvasElement | null = null;
		let rawImage: any = null;

		try {
			// Process the image using the pipeline
			const output = await segmenter(imageUrl);

			// The pipeline returns an array with the processed image
			if (output && output.length > 0) {
				// The output is a RawImage, create a proper HTML canvas
				rawImage = output[0];
				tempCanvas = rawImage.toCanvas();

				// Create a new HTML canvas element
				const canvas = document.createElement('canvas');
				canvas.width = rawImage.width;
				canvas.height = rawImage.height;
				const ctx = canvas.getContext('2d');

				// Draw the image onto the HTML canvas
				if (ctx && tempCanvas) {
					ctx.drawImage(tempCanvas, 0, 0);
				}

				// Clean up temp canvas immediately
				if (tempCanvas && tempCanvas.parentNode) {
					tempCanvas.parentNode.removeChild(tempCanvas);
				}
				tempCanvas = null;

				// Dispose of RawImage if it has a dispose method
				if (rawImage && typeof rawImage.dispose === 'function') {
					rawImage.dispose();
				}
				rawImage = null;

				return new Promise((resolve) => {
					canvas.toBlob(async (blob) => {
						if (blob) {
							const fullUrl = URL.createObjectURL(blob);
							// Create thumbnail from the full image
							const thumbnail = await createThumbnail(fullUrl, 500);
							resolve({ fullUrl, thumbnail });
						} else {
							resolve({ fullUrl: null, thumbnail: null });
						}
					}, 'image/png');
				});
			}
			return { fullUrl: null, thumbnail: null };
		} catch (err) {
			console.error('Error processing image:', err);
			// Clean up on error
			if (tempCanvas && tempCanvas.parentNode) {
				tempCanvas.parentNode.removeChild(tempCanvas);
			}
			tempCanvas = null;
			if (rawImage && typeof rawImage.dispose === 'function') {
				rawImage.dispose();
			}
			rawImage = null;
			return { fullUrl: null, thumbnail: null };
		}
	}

	async function handleSingleImageProcessing(imageUrl: string) {
		try {
			isProcessing = true;
			processingProgress = 0;
			originalImageUrl = imageUrl;

			await requestWakeLock();

			// Simulate progress steps
			processingProgress = 25;
			await new Promise((resolve) => setTimeout(resolve, 100));

			processingProgress = 50;
			const result = await processImage(imageUrl);

			processingProgress = 100;

			if (processedImageUrl) {
				URL.revokeObjectURL(processedImageUrl);
			}
			processedImageUrl = result.fullUrl;
			// Clean up thumbnail since we don't use it in single mode
			if (result.thumbnail) {
				URL.revokeObjectURL(result.thumbnail);
			}
		} catch (err) {
			console.error('Processing error:', err);
			error = true;
			errorMessage = 'Failed to process image. Please try again.';
		} finally {
			isProcessing = false;
			await releaseWakeLock();
		}
	}

	async function handleBatchProcessing(files: File[]) {
		try {
			isProcessing = true;
			processingProgress = 0;
			currentBatchIndex = 0;
			totalBatchCount = files.length;

			// Initialize batch results with empty placeholders
			batchResults = files.map((file) => ({
				file,
				originalThumbnail: '',
				processedThumbnail: null,
				processedFullUrl: null
			}));

			await requestWakeLock();

			// Process each image
			for (let i = 0; i < files.length; i++) {
				currentBatchIndex = i + 1;
				processingProgress = Math.round((i / files.length) * 100);

				let originalUrl: string | null = null;
				try {
					// Create blob URL for the original file
					originalUrl = URL.createObjectURL(files[i]);

					// Create thumbnail for original
					const originalThumb = await createThumbnail(originalUrl, 500);
					if (originalThumb) {
						batchResults[i].originalThumbnail = originalThumb;
					}

					// Process the image
					const result = await processImage(originalUrl);

					// Store results
					batchResults[i].processedThumbnail = result.thumbnail;
					batchResults[i].processedFullUrl = result.fullUrl;

					// IMPORTANT: Immediately revoke the original blob URL to free memory
					URL.revokeObjectURL(originalUrl);
					originalUrl = null;
				} catch (err) {
					console.error(`Error processing image ${i + 1}:`, err);
					batchResults[i].error = 'Processing failed';
					// Clean up on error
					if (originalUrl) {
						URL.revokeObjectURL(originalUrl);
					}
				}

				// Update reactivity
				batchResults = [...batchResults];
			}

			processingProgress = 100;
		} catch (err) {
			console.error('Batch processing error:', err);
			error = true;
			errorMessage = 'Failed to process batch. Please try again.';
		} finally {
			isProcessing = false;
			await releaseWakeLock();
		}
	}

	function handleSingleFileSelect(file: File) {
		selectedFile = file;
		const url = URL.createObjectURL(file);
		handleSingleImageProcessing(url);
	}

	function handleBatchFileSelect(files: File[]) {
		selectedFiles = files;
		handleBatchProcessing(files);
	}

	function handleExampleUse() {
		if (processingMode === 'single') {
			handleSingleImageProcessing(EXAMPLE_URL);
		}
	}

	function clearResults() {
		if (processingMode === 'single') {
			if (processedImageUrl) {
				URL.revokeObjectURL(processedImageUrl);
				processedImageUrl = null;
			}
			if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
				URL.revokeObjectURL(originalImageUrl);
			}
			originalImageUrl = null;
			selectedFile = null;
		} else {
			// Clear batch results - revoke all URLs
			batchResults.forEach((result) => {
				if (result.originalThumbnail) {
					URL.revokeObjectURL(result.originalThumbnail);
				}
				if (result.processedThumbnail) {
					URL.revokeObjectURL(result.processedThumbnail);
				}
				if (result.processedFullUrl) {
					URL.revokeObjectURL(result.processedFullUrl);
				}
			});
			batchResults = [];
			selectedFiles = [];
		}
		error = false;
	}

	function switchMode(mode: 'single' | 'batch') {
		clearResults();
		processingMode = mode;
	}

	async function downloadBatchAsZip() {
		const zip = new JSZip();
		const successfulResults = batchResults.filter((r) => r.processedFullUrl && !r.error);

		for (let i = 0; i < successfulResults.length; i++) {
			const result = successfulResults[i];
			try {
				const response = await fetch(result.processedFullUrl!);
				const blob = await response.blob();
				const fileName = `${result.file.name.split('.')[0]}_bg_removed.png`;
				zip.file(fileName, blob);
			} catch (err) {
				console.error(`Failed to add ${result.file.name} to zip:`, err);
			}
		}

		const zipBlob = await zip.generateAsync({ type: 'blob' });
		const url = URL.createObjectURL(zipBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'background_removed_images.zip';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function retry() {
		error = false;
		if (!isModelLoaded) {
			loadModel();
		}
	}

	function handleModelChange(newModelId: string) {
		if (newModelId !== selectedModelId) {
			selectedModelId = newModelId;
			// Clear existing results
			clearResults();
			// Reset model state
			isModelLoaded = false;
			segmenter = null;
			// Load new model
			loadModel();
		}
	}

	onDestroy(() => {
		if (processedImageUrl) {
			URL.revokeObjectURL(processedImageUrl);
		}
		if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
			URL.revokeObjectURL(originalImageUrl);
		}
		// Clean up batch results - all URLs
		batchResults.forEach((result) => {
			if (result.originalThumbnail) {
				URL.revokeObjectURL(result.originalThumbnail);
			}
			if (result.processedThumbnail) {
				URL.revokeObjectURL(result.processedThumbnail);
			}
			if (result.processedFullUrl) {
				URL.revokeObjectURL(result.processedFullUrl);
			}
		});
	});
</script>

{#if !isModelLoaded}
	<div class="page-container">
		<header class="page-header">
			<h1>Background Remover</h1>
			<p>AI-powered background removal, running locally in your browser.</p>
		</header>
		<div class="loading-panel">
			{#if error}
				<ErrorDisplay
					message={errorMessage}
					buttonText={isLoadingModel ? 'Loading...' : 'Retry'}
					onRetry={retry}
					isRetrying={isLoadingModel}
				/>
			{:else if isLoadingModel}
				<LoadingProgress
					title="Loading Background Removal Model"
					progress={modelLoadProgress}
					message="The AI model is being downloaded and initialized. This may take a few moments."
				/>
			{/if}
		</div>
	</div>
{:else}
	<div class="page-container">
		<header class="page-header">
			<h1>Background Remover</h1>
			<p>AI-powered background removal, running locally in your browser.</p>
		</header>

		<div class="page-content">
			<!-- Config row: model + mode -->
			{#if !isProcessing && !processedImageUrl && batchResults.length === 0}
				<section class="panel config-panel">
					<div class="config-row">
						<div class="config-group">
							<span class="config-label">Model</span>
							<SegmentedControl
								options={getAvailableModels().map((m) => ({ value: m.id, label: m.name }))}
								bind:value={selectedModelId}
								onchange={(v) => handleModelChange(v)}
								disabled={isLoadingModel}
							/>
						</div>
						<div class="config-group">
							<span class="config-label">Mode</span>
							<SegmentedControl
								options={[
									{ value: 'single', label: 'Single' },
									{ value: 'batch', label: 'Multiple' }
								]}
								bind:value={processingMode}
								onchange={(v) => switchMode(v as 'single' | 'batch')}
							/>
						</div>
					</div>

					{#if selectedModelId}
						{@const model = getAvailableModels().find((m) => m.id === selectedModelId)}
						{#if model}
							<p class="model-meta">
								{model.size} &middot; {model.precision}
								{#each model.description as line}&middot; {line}
								{/each}
							</p>
						{/if}
					{/if}
				</section>

				<!-- Upload -->
				<section class="panel">
					<BackgroundRemoverUpload
						mode={processingMode}
						{selectedFile}
						{selectedFiles}
						onFileSelect={handleSingleFileSelect}
						onFilesSelect={handleBatchFileSelect}
						onExampleUse={handleExampleUse}
						disabled={isProcessing}
					/>
				</section>
			{/if}

			{#if isProcessing}
				<section class="panel">
					<BackgroundRemoverProgress
						progress={processingProgress}
						message={processingMode === 'single'
							? 'Processing image and removing background...'
							: `Processing image ${currentBatchIndex} of ${totalBatchCount}...`}
					/>
				</section>
			{/if}

			{#if error}
				<ErrorDisplay message={errorMessage} buttonText="Try Again" onRetry={retry} />
			{/if}

			{#if processingMode === 'single' && processedImageUrl && originalImageUrl && !isProcessing}
				<section class="panel">
					<BackgroundRemoverResult
						{originalImageUrl}
						{processedImageUrl}
						onProcessAnother={clearResults}
					/>
				</section>
			{/if}

			{#if processingMode === 'batch' && batchResults.length > 0 && !isProcessing}
				<section class="panel">
					<BackgroundRemoverBatchResult
						{batchResults}
						onProcessAnother={clearResults}
						onDownloadZip={downloadBatchAsZip}
					/>
				</section>
			{/if}
		</div>
	</div>
{/if}

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

	.loading-panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--sp-4);
		animation: fadeIn 0.25s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
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
	}

	/* Config section */
	.config-panel {
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
	}

	.config-row {
		display: flex;
		gap: var(--sp-5);
		flex-wrap: wrap;
	}

	.config-group {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
	}

	.config-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.model-meta {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
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

		.config-row {
			flex-direction: column;
			gap: var(--sp-4);
		}
	}
</style>
