<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		modelInfo: string;
		ModelIcon?: any;
		children?: Snippet;
	}

	let { modelInfo, ModelIcon, children }: Props = $props();
</script>

<div class="toolbar">
	<span class="model-info">
		{#if ModelIcon}
			<span class="model-emoji"><ModelIcon></ModelIcon></span>
		{/if}
		{modelInfo}
	</span>

	<div class="toolbar-actions">
		{@render children?.()}
	</div>

	<div class="toolbar-decoration"></div>
</div>

<style>
	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--sp-3) var(--sp-5);
		background: var(--color-background-secondary);
		border-bottom: 1px solid var(--color-border-light);
		flex-wrap: wrap;
		gap: var(--sp-2);
		position: relative;
	}

	.model-info {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		letter-spacing: 0.02em;
		word-break: break-word;
		max-width: 100%;
		display: flex;
		align-items: center;
		gap: var(--sp-2);
	}

	.model-emoji {
		font-size: 1.125rem;
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.model-emoji :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		flex-wrap: wrap;
	}

	.toolbar-decoration {
		display: none;
	}

	@media (max-width: 768px) {
		.toolbar {
			padding: var(--sp-3) var(--sp-4);
		}

		.model-info {
			font-size: 0.75rem;
		}
	}
</style>
