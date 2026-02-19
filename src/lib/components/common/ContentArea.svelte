<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		disabled?: boolean;
	}

	let { children, disabled = false }: Props = $props();
</script>

<div class="content-area" class:disabled>
	{@render children?.()}
</div>

<style>
	.content-area {
		padding: 1rem;
		background: var(--color-background-secondary);
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
		box-sizing: border-box;
		min-height: 0;
		transition:
			background-color var(--transition-fast),
			color var(--transition-fast);
		border-radius: 10px;
	}

	.content-area.disabled {
		opacity: 0.35;
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.content-area {
			padding: var(--sp-4);
			min-height: 0;
		}
	}
</style>
