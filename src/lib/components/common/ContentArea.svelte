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
		background: var(--color-card);
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
		box-sizing: border-box;
		min-height: 0;
		transition: opacity 0.25s ease;
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
