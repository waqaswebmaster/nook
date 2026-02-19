<script lang="ts">
	import ProgressBar from '$lib/components/common/ProgressBar.svelte';
	import HeadphonesIcon from 'virtual:icons/lucide/headphones';
	import ZapIcon from 'virtual:icons/lucide/zap';
	import AlertTriangleIcon from 'virtual:icons/lucide/alert-triangle';

	interface Props {
		progress: number;
		previousProgress?: number;
		currentSegment?: string;
		isStuck?: boolean;
		onReload?: () => void;
	}

	let {
		progress = 0,
		previousProgress = 0,
		currentSegment = '',
		isStuck = false,
		onReload
	}: Props = $props();
</script>

<div class="transcribing">
	<h3>
		<span class="title-icon"><HeadphonesIcon /></span>
		Transcribing Audio
	</h3>
	<p class="progress-percentage">{progress}% Complete</p>

	<div class="progress-wrapper">
		<ProgressBar {progress} {previousProgress} />
	</div>

	{#if currentSegment}
		<div class="segment-preview">
			<h4>Current Segment</h4>
			<p>"{currentSegment}"</p>
		</div>
	{/if}

	{#if isStuck}
		<div class="stuck-message">
			<span class="warning-icon"><AlertTriangleIcon /></span>
			Transcription seems stuck
			<button class="reload-link" onclick={onReload}> Reload Page → </button>
		</div>
	{:else}
		<div class="transcribing-message">
			<span class="pulse-icon"><ZapIcon /></span>
			Keep this tab active during transcription
		</div>
	{/if}
</div>

<style>
	.transcribing {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		margin: 1.5rem 0;
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

	.transcribing h3 {
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
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.title-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.progress-percentage {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-primary);
		margin-bottom: 1rem;
	}

	.progress-wrapper {
		width: 100%;
		max-width: 400px;
		margin-bottom: 1.5rem;
	}

	.segment-preview {
		margin: 1rem 0;
		padding: 1.25rem;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-xs);
		width: 100%;
		max-width: 500px;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.segment-preview h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		letter-spacing: 0.025em;
	}

	.segment-preview p {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color-text-primary);
		font-style: italic;
		padding: 0.75rem;
		background: var(--color-accent-primary-alpha);
		border-radius: var(--radius-sm);
	}

	.transcribing-message {
		margin-top: 1rem;
		color: var(--color-text-secondary);
		font-weight: 500;
		font-size: 0.875rem;
		text-align: center;
		padding: 0.75rem 1.25rem;
		background: var(--color-accent-primary-alpha);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.pulse-icon {
		display: flex;
		align-items: center;
		color: var(--color-primary);
		animation: flash 2s ease-in-out infinite;
	}

	.pulse-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	@keyframes flash {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	.stuck-message {
		margin-top: 1rem;
		color: var(--color-danger);
		font-weight: 500;
		font-size: 0.875rem;
		text-align: center;
		padding: 1rem 1.25rem;
		background: color-mix(in srgb, var(--color-danger) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-danger) 20%, transparent);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.warning-icon {
		display: flex;
		align-items: center;
		color: var(--color-danger);
	}

	.warning-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.reload-link {
		background: var(--color-primary);
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: var(--radius-sm);
		font-family: inherit;
		transition: opacity 0.15s;
	}

	.reload-link:hover {
		opacity: 0.85;
	}

	@media (max-width: 600px) {
		.transcribing {
			padding: 1.5rem;
		}

		.transcribing h3 {
			font-size: 1.125rem;
		}

		.segment-preview {
			max-width: none;
		}

		.transcribing-message,
		.stuck-message {
			font-size: 0.8125rem;
			padding: 0.75rem 1rem;
		}
	}
</style>
