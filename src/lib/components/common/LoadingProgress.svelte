<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	interface Props {
		title: string;
		progress: number;
		previousProgress?: number;
		message?: string;
		percentageText?: string;
		showPercentage?: boolean;
		mode?: 'progress' | 'spinner';
		topMargin?: boolean;
	}

	let {
		title,
		progress = 0,
		previousProgress = 0,
		message,
		percentageText,
		showPercentage = true,
		mode = 'progress',
		topMargin = false
	}: Props = $props();

	let displayPercentage = /* @wc-include */ $derived(`${progress}% Complete`);
</script>

<div class="loading-progress" class:top-margin={topMargin}>
	<h3>{title}</h3>
	{#if mode === 'progress'}
		{#if showPercentage}
			{#if percentageText}
				<p class="download-percentage">{percentageText}</p>
			{:else}
				<p class="download-percentage">{displayPercentage}</p>
			{/if}
		{/if}
		<ProgressBar {progress} {previousProgress} />
	{:else}
		<div class="spinner-progress">
			<div class="animated-progress-bar">
				<div class="animated-progress-fill"></div>
			</div>
		</div>
	{/if}
	{#if message}
		<p class="loading-message">{message}</p>
	{/if}
</div>

<style>
	.loading-progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--sp-4);
		padding: var(--sp-6);
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-md);
		width: calc(100% - var(--sp-8));
		max-width: 500px;
		text-align: center;
		border-radius: var(--radius-lg);
		margin: 0 auto;
		box-sizing: border-box;
	}

	.loading-progress.top-margin {
		margin-top: var(--sp-6);
	}

	.loading-progress h3 {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		color: var(--color-text-primary);
	}

	.download-percentage {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-primary);
		margin: 0;
		background: var(--color-primary-subtle);
		padding: var(--sp-1) var(--sp-3);
		border-radius: var(--radius-full);
	}

	.loading-message {
		font-size: 0.875rem;
		font-weight: 400;
		color: var(--color-text-tertiary);
		margin: 0;
		max-width: 100%;
		padding: 0 var(--sp-3);
		word-wrap: break-word;
	}

	@media (max-width: 768px) {
		.loading-progress {
			width: calc(100% - var(--sp-4));
			padding: var(--sp-5) var(--sp-4);
			max-width: none;
			margin: 0 auto;
		}

		.loading-progress h3 {
			font-size: 1.125rem;
		}
	}

	.spinner-progress {
		width: 100%;
		margin: var(--sp-1) 0;
	}

	.animated-progress-bar {
		height: 0.5rem;
		background: var(--color-background-tertiary);
		border-radius: var(--radius-full);
		overflow: hidden;
		width: 100%;
		position: relative;
	}

	.animated-progress-fill {
		height: 100%;
		width: 100%;
		background: linear-gradient(
			90deg,
			var(--color-primary) 0%,
			var(--color-primary) 40%,
			var(--color-primary-hover) 60%,
			var(--color-primary) 100%
		);
		background-size: 300% 100%;
		animation: gradientShift 3s ease-in-out infinite;
		position: relative;
		border-radius: var(--radius-full);
	}

	.animated-progress-fill::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			transparent 30%,
			rgba(255, 255, 255, 0.2) 50%,
			transparent 70%,
			transparent 100%
		);
		animation: shimmer 3s ease-in-out infinite;
	}

	@keyframes gradientShift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-150%);
		}
		100% {
			transform: translateX(150%);
		}
	}
</style>
