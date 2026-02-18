<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		disabled?: boolean;
	}

	let { children, disabled = false }: Props = $props();
</script>

<div class="input-area" class:disabled>
	{@render children?.()}
</div>

<style>
	.input-area {
		padding: 1rem 1.25rem;
		border-top: 1px solid var(--color-border-primary);
		background: var(--color-background-secondary);
		box-sizing: border-box;
		flex: 0 0 auto;
		transition:
			background-color var(--transition-fast),
			color var(--transition-fast);
	}

	.input-area.disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	@media (max-width: 600px) {
		.input-area {
			padding: 0.875rem 1rem;
		}
	}
</style>
