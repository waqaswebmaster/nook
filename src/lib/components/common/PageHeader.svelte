<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
		Icon?: any;
		actions?: Snippet;
	}

	let { title, subtitle, Icon, actions }: Props = $props();
</script>

<header class="page-header">
	<div class="page-header-text">
		{#if Icon}
			<span class="page-header-icon"><Icon /></span>
		{/if}
		<div>
			<h1>{title}</h1>
			{#if subtitle}
				<p>{subtitle}</p>
			{/if}
		</div>
	</div>
	{#if actions}
		<div class="page-header-actions">
			{@render actions()}
		</div>
	{/if}
</header>

<style>
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--sp-4);
		margin-bottom: var(--sp-6);
	}

	.page-header-text {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		min-width: 0;
	}

	.page-header-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: var(--radius-lg);
		background: var(--color-accent-primary-alpha);
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.page-header-icon :global(svg) {
		width: 22px;
		height: 22px;
	}

	h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
		line-height: 1.3;
	}

	p {
		margin: var(--sp-1) 0 0;
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		line-height: 1.4;
	}

	.page-header-actions {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		flex-shrink: 0;
	}

	@media (max-width: 600px) {
		.page-header {
			flex-direction: column;
			gap: var(--sp-3);
		}

		h1 {
			font-size: 1.25rem;
		}

		p {
			font-size: 0.875rem;
		}

		.page-header-icon {
			width: 38px;
			height: 38px;
		}

		.page-header-icon :global(svg) {
			width: 20px;
			height: 20px;
		}
	}
</style>
