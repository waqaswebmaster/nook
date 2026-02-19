<script lang="ts">
	import ProgressBar from '$lib/components/common/ProgressBar.svelte';
	import RotateCwIcon from 'virtual:icons/lucide/rotate-cw';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';

	interface Props {
		progress: number;
		previousProgress?: number;
		message?: string;
	}

	let { progress = 0, previousProgress = 0, message = 'Processing...' }: Props = $props();
</script>

<div class="processing">
	<h3>
		<span class="title-icon"><RotateCwIcon /></span>
		Processing Image
	</h3>
	<p class="progress-percentage">{progress}% Complete</p>

	<div class="progress-wrapper">
		<ProgressBar {progress} {previousProgress} />
	</div>

	<div class="processing-message">
		<span class="pulse-icon"><SparklesIcon /></span>
		{message}
	</div>
</div>

<style>
	.processing {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2.5rem;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		margin: 1.5rem 0;
	}

	.processing h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.title-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-primary);
		animation: rotate 2s linear infinite;
	}

	.title-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.progress-percentage {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 1.5rem;
	}

	.progress-wrapper {
		width: 100%;
		max-width: 400px;
		margin-bottom: 1.5rem;
	}

	.processing-message {
		margin: 1rem 0;
		color: var(--color-text-secondary);
		font-size: 0.9375rem;
		text-align: center;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.pulse-icon {
		font-size: 1.125rem;
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.pulse-icon :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	@media (max-width: 600px) {
		.processing {
			padding: 1.75rem;
		}

		.processing h3 {
			font-size: 1.125rem;
		}

		.processing-message {
			font-size: 0.875rem;
		}
	}
</style>
