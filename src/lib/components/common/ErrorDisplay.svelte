<script lang="ts">
	interface Props {
		message: string;
		buttonText?: string;
		onRetry?: () => void;
		isRetrying?: boolean;
	}

	let { message, buttonText = 'Retry', onRetry, isRetrying = false }: Props = $props();
</script>

<div class="error">
	<h3>Error</h3>
	<p>{message}</p>
	{#if onRetry}
		<button onclick={onRetry} disabled={isRetrying} class="retry-button">
			{isRetrying ? 'Retrying...' : buttonText}
		</button>
	{/if}
</div>

<style>
	.error {
		color: var(--color-text-primary);
		background: var(--color-card);
		padding: var(--sp-6);
		border: 1px solid var(--color-danger);
		text-align: center;
		box-shadow: var(--shadow-md);
		width: calc(100% - var(--sp-8));
		max-width: 500px;
		border-radius: var(--radius-lg);
		margin: 0 auto;
		box-sizing: border-box;
	}

	.error h3 {
		font-size: 1.25rem;
		margin: 0 0 var(--sp-2) 0;
		color: var(--color-danger);
		font-weight: 700;
	}

	.error p {
		font-size: 0.9375rem;
		font-weight: 400;
		margin-bottom: var(--sp-4);
		line-height: 1.6;
		color: var(--color-text-secondary);
		word-wrap: break-word;
	}

	.retry-button {
		padding: var(--sp-3) var(--sp-5);
		background: var(--color-primary);
		color: #fff;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 600;
		transition: all var(--transition-fast);
		font-family: var(--font-family-primary);
	}

	.retry-button:hover:not(:disabled) {
		background: var(--color-primary-hover);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.retry-button:disabled {
		background: var(--color-background-disabled);
		color: var(--color-text-disabled);
		cursor: not-allowed;
		opacity: 0.7;
	}

	@media (max-width: 600px) {
		.error {
			width: calc(100% - var(--sp-4));
			max-width: none;
			padding: var(--sp-5) var(--sp-4);
			margin: 0 auto;
		}

		.error h3 {
			font-size: 1.125rem;
		}

		.error p {
			font-size: 0.875rem;
		}
	}
</style>
