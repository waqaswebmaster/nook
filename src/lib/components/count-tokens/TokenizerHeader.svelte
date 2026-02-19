<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		icon: Component;
		title: string;
		description: string;
	}

	let { icon: Icon, title, description }: Props = $props();
</script>

<div class="tokenizer-header">
	<div class="header-content">
		<div class="header-title">
			<span class="header-icon"><Icon /></span>
			<h1>{title}</h1>
		</div>
		<p class="header-description">{description}</p>
	</div>
</div>

<style>
	.tokenizer-header {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-sm);
		padding: 1.5rem;
		margin-bottom: 2rem;
		border-radius: var(--radius-lg);
		position: relative;
	}

	.header-content {
		text-align: center;
	}

	.header-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.header-icon {
		display: flex;
		align-items: center;
		color: var(--color-primary);
		font-size: 1.5rem;
	}

	.header-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.tokenizer-header h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.header-description {
		margin: 0;
		font-size: 0.95rem;
		color: var(--color-text-secondary);
	}
</style>
