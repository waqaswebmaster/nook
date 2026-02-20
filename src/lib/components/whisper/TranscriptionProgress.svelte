<script lang="ts">
	import ProgressBar from '$lib/components/common/ProgressBar.svelte';
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
	<div class="progress-top">
		<span class="progress-label">Transcribing…</span>
		<span class="progress-pct">{progress}%</span>
	</div>

	<div class="progress-wrapper">
		<ProgressBar {progress} {previousProgress} />
	</div>

	{#if currentSegment}
		<div class="segment-preview">
			<span class="segment-label">Current segment</span>
			<p>"{currentSegment}"</p>
		</div>
	{/if}

	{#if isStuck}
		<div class="stuck-message">
			<AlertTriangleIcon />
			Transcription seems stuck.
			<button class="reload-link" onclick={onReload}>Reload page</button>
		</div>
	{:else}
		<p class="hint"><ZapIcon /> Keep this tab active during transcription</p>
	{/if}
</div>

<style>
	.transcribing {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
		animation: fadeIn 0.25s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.progress-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.progress-label {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.progress-pct {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-primary);
	}

	.progress-wrapper {
		width: 100%;
	}

	.segment-preview {
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--sp-3);
	}

	.segment-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.segment-preview p {
		margin: var(--sp-1) 0 0;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
		font-style: italic;
	}

	.hint {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
	}

	.hint :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
		color: var(--color-primary);
		animation: flash 2s ease-in-out infinite;
	}

	@keyframes flash {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	.stuck-message {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-danger);
		padding: var(--sp-3);
		background: color-mix(in srgb, var(--color-danger) 6%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-danger) 18%, transparent);
		border-radius: var(--radius-md);
	}

	.stuck-message :global(svg) {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
	}

	.reload-link {
		margin-left: auto;
		background: none;
		border: none;
		color: var(--color-primary);
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font-family-primary);
		text-decoration: underline;
		padding: 0;
	}

	.reload-link:hover {
		color: var(--color-primary-hover);
	}
</style>
