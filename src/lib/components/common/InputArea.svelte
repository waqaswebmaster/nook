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
		padding: var(--sp-4) var(--sp-5);
		border-top: 1px solid var(--color-border-light);
		background: var(--color-background-secondary);
		box-sizing: border-box;
		flex: 0 0 auto;
		transition: opacity 0.25s ease;
	}

	.input-area.disabled {
		opacity: 0.35;
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.input-area {
			padding: var(--sp-3) var(--sp-4);
		}
	}
</style>
