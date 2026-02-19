<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		rotation?: number;
		animationDelay?: number;
	}

	let { children, rotation = 0.5, animationDelay = 0 }: Props = $props();
</script>

<div class="section-card" style="animation-delay: {animationDelay}s;">
	{@render children?.()}
</div>

<style>
	.section-card {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		padding: var(--sp-5);
		box-shadow: var(--shadow-sm);
		border-radius: var(--radius-lg);
		margin-bottom: var(--sp-4);
		position: relative;
		animation: slideIn 0.35s ease-out;
		animation-fill-mode: both;
	}

	@keyframes slideIn {
		from {
			transform: translateY(6px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@media (max-width: 600px) {
		.section-card {
			padding: var(--sp-4);
		}
	}
</style>
