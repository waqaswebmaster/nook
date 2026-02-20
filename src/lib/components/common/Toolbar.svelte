<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		modelInfo: string;
		ModelIcon?: any;
		variant?: 'studio' | 'default';
		children?: Snippet;
	}

	let { modelInfo, ModelIcon, variant = 'default', children }: Props = $props();
</script>

<div class="toolbar" class:studio={variant === 'studio'}>
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
		padding: 0.75rem 1rem;
		background: var(--color-background-secondary);
		border-bottom: 1px solid var(--color-border-primary);
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
		position: absolute;
		bottom: -6px;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--color-border-primary);
		opacity: 0.08;
	}

	/* Studio variant (purple / teal stripe and bold label) */
	.toolbar.studio {
		background: var(--color-primary);
		color: var(--color-text-inverse);
		border-radius: 12px 12px 0 0;
		padding: 0.9rem 1.25rem;
		box-shadow: none;
		position: relative;
	}

	.toolbar.studio .model-info {
		font-size: 0.95rem;
		letter-spacing: 1px;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--color-text-inverse);
	}

	.toolbar.studio .model-emoji {
		width: 36px;
		height: 36px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.12);
		border-radius: 8px;
		color: var(--color-text-inverse);
	}

	/* decorative stripe under studio toolbar */
	.toolbar.studio .toolbar-decoration {
		height: 6px;
		bottom: -8px;
		background: repeating-linear-gradient(90deg, var(--color-success) 0 8px, transparent 8px 16px);
		opacity: 0.95;
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
