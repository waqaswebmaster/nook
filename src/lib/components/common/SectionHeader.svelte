<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="section-header">
	{@render children?.()}
</div>

<style>
	.section-header {
		margin-bottom: var(--sp-4);
	}

	.section-header :global(h2) {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin: 0 0 var(--sp-1) 0;
		letter-spacing: -0.01em;
	}

	.section-header :global(p) {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		margin: 0;
		line-height: 1.5;
	}
</style>
