<script lang="ts">
	import SparklesIcon from 'virtual:icons/lucide/sparkles';
	import ImageIcon from 'virtual:icons/lucide/image';
	import ScaleIcon from 'virtual:icons/lucide/scale';
	import SaveIcon from 'virtual:icons/lucide/save';
	import RotateCwIcon from 'virtual:icons/lucide/rotate-cw';

	interface Props {
		originalImageUrl: string;
		processedImageUrl: string;
		onProcessAnother: () => void;
	}

	let { originalImageUrl, processedImageUrl, onProcessAnother }: Props = $props();

	let showComparison = $state(false);
	let downloadName = $state('background-removed.png');

	function downloadImage() {
		const link = document.createElement('a');
		link.href = processedImageUrl;
		link.download = downloadName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<div class="result-wrapper">
	<div class="result">
		<div class="result-content">
			<div class="result-header">
				<h3>
					<span class="header-icon"><SparklesIcon /></span>
					Background Removed!
				</h3>
				<div class="result-actions">
					<button class="comparison-toggle" onclick={() => (showComparison = !showComparison)}>
						{#if showComparison}
							<ImageIcon />
							Processed
						{:else}
							<ScaleIcon />
							Compare
						{/if}
					</button>
				</div>
			</div>

			<div class="image-container">
				{#if showComparison}
					<div class="comparison-view">
						<div class="image-side">
							<h4>Original</h4>
							<img src={originalImageUrl} alt="Original" />
						</div>
						<div class="image-side">
							<h4>Background Removed</h4>
							<img src={processedImageUrl} alt="Background removed" />
						</div>
					</div>
				{:else}
					<div class="single-view">
						<img src={processedImageUrl} alt="Background removed" class="processed-image" />
						<div class="transparent-bg-pattern"></div>
					</div>
				{/if}
			</div>

			<div class="action-buttons">
				<button class="download-btn" onclick={downloadImage}>
					<span class="btn-icon"><SaveIcon /></span>
					Download
				</button>

				<button class="process-another-btn" onclick={onProcessAnother}>
					<span class="btn-icon"><RotateCwIcon /></span>
					Process Another
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.result-wrapper {
		display: flex;
		margin: 1.5rem 0;
		width: 100%;
	}

	.result {
		position: relative;
		width: 100%;
	}

	.result-content {
		padding: 2rem;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border-light);
	}

	.result-content h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.header-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.header-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.comparison-toggle {
		padding: 0.5rem 1rem;
		background: transparent;
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.comparison-toggle :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.comparison-toggle:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.image-container {
		margin: 1.5rem 0;
		position: relative;
	}

	.single-view {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 300px;
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--color-card);
	}

	.transparent-bg-pattern {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image:
			linear-gradient(45deg, var(--color-background-pattern) 25%, transparent 25%),
			linear-gradient(-45deg, var(--color-background-pattern) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, var(--color-background-pattern) 75%),
			linear-gradient(-45deg, transparent 75%, var(--color-background-pattern) 75%);
		background-size: 20px 20px;
		background-position:
			0 0,
			0 10px,
			10px -10px,
			-10px 0px;
		z-index: 0;
	}

	.processed-image {
		max-width: 100%;
		max-height: 500px;
		border-radius: var(--radius-sm);
		box-shadow: var(--shadow-sm);
		position: relative;
		z-index: 1;
	}

	.comparison-view {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		background: var(--color-card);
	}

	.image-side {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.image-side h4 {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.image-side img {
		max-width: 100%;
		max-height: 300px;
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-sm);
	}

	.action-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
		margin-top: 1.5rem;
	}

	.download-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		border: none;
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 500;
		transition: opacity 0.2s;
		font-family: var(--font-family-primary);
		border-radius: var(--radius-md);
		background: var(--color-primary);
		color: white;
	}

	.process-another-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 500;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		border-radius: var(--radius-md);
		background: transparent;
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border-light);
	}

	.download-btn:hover {
		opacity: 0.9;
	}

	.process-another-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.btn-icon {
		font-size: 1.125rem;
		display: flex;
		align-items: center;
	}

	.btn-icon :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	@media (max-width: 768px) {
		.result-content {
			padding: 1.5rem;
		}

		.result-header {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.comparison-view {
			grid-template-columns: 1fr;
			gap: 1rem;
			padding: 1rem;
		}

		.action-buttons {
			gap: 0.75rem;
		}

		.download-btn,
		.process-another-btn {
			flex: 1;
			min-width: 120px;
			justify-content: center;
		}
	}

	@media (max-width: 600px) {
		.result-content {
			padding: 1.25rem;
		}

		.result-content h3 {
			font-size: 1.125rem;
		}

		.download-btn,
		.process-another-btn {
			width: 100%;
		}
	}
</style>
