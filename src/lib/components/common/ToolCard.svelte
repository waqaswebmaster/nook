<script lang="ts">
	import type { Snippet, Component } from 'svelte';

	interface Props {
		href: string;
		title: string;
		description: string;
		icon: Component;
		chips?: string[];
	}

	let { href, title, description, icon: Icon, chips = [] }: Props = $props();
</script>

<a {href} class="tool-card">
	<div class="card-icon">
		<Icon />
	</div>
	<div class="card-body">
		<h3 class="card-title">{title}</h3>
		<p class="card-desc">{description}</p>
		{#if chips.length > 0}
			<div class="card-chips">
				{#each chips as chip}
					<span class="chip">{chip}</span>
				{/each}
			</div>
		{/if}
	</div>
	<div class="card-arrow" aria-hidden="true">
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path
				d="M6 3l5 5-5 5"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>
</a>

<style>
	.tool-card {
		display: flex;
		align-items: flex-start;
		gap: var(--sp-4);
		padding: var(--sp-5);
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		text-decoration: none;
		color: var(--color-text-primary);
		transition: all var(--transition-base);
		position: relative;
		overflow: hidden;
	}

	.tool-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--color-primary-subtle), transparent 60%);
		opacity: 0;
		transition: opacity var(--transition-base);
	}

	.tool-card:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-lg), var(--shadow-glow);
		transform: translateY(-2px);
	}

	.tool-card:hover::before {
		opacity: 1;
	}

	.tool-card:hover .card-arrow {
		opacity: 1;
		transform: translateX(0);
	}

	.tool-card:hover .card-icon {
		background: var(--color-primary);
		color: var(--color-text-inverse);
		transform: scale(1.05);
	}

	.card-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: var(--radius-md);
		background: var(--color-primary-subtle);
		color: var(--color-primary);
		flex-shrink: 0;
		transition: all var(--transition-base);
		position: relative;
		z-index: 1;
	}

	.card-icon :global(svg) {
		width: 24px;
		height: 24px;
	}

	.card-body {
		flex: 1;
		min-width: 0;
		position: relative;
		z-index: 1;
	}

	.card-title {
		margin: 0 0 var(--sp-1) 0;
		font-size: 1.0625rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.card-desc {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-1);
		margin-top: var(--sp-3);
	}

	.chip {
		display: inline-flex;
		align-items: center;
		padding: 2px var(--sp-2);
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--color-text-tertiary);
		background: var(--color-background-tertiary);
		border-radius: var(--radius-full);
		letter-spacing: 0.02em;
		text-transform: capitalize;
	}

	.card-arrow {
		display: flex;
		align-items: center;
		color: var(--color-primary);
		opacity: 0;
		transform: translateX(-6px);
		transition: all var(--transition-base);
		flex-shrink: 0;
		margin-top: var(--sp-1);
		position: relative;
		z-index: 1;
	}

	@media (max-width: 600px) {
		.tool-card {
			padding: var(--sp-4);
		}
		.card-icon {
			width: 40px;
			height: 40px;
		}
		.card-icon :global(svg) {
			width: 20px;
			height: 20px;
		}
	}
</style>
