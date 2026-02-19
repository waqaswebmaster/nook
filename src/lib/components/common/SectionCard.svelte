<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		rotation?: number;
		animationDelay?: number;
	}

	let { children, rotation = 0.5, animationDelay = 0 }: Props = $props();
</script>

<div
	class="section-card"
	style="transform: rotate({rotation}deg); animation-delay: {animationDelay}s;"
>
	{@render children?.()}
</div>

<style>
	.section-card {
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-primary);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft-sm);
		margin-bottom: 1rem;
		position: relative;
		border-radius: var(--card-radius);
		animation: slideIn 300ms var(--transition-fast) both;
	}

	@keyframes slideIn {
		from {
			transform: translateY(10px) rotate(var(--rotation, 0.5deg));
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(var(--rotation, 0.5deg));
			opacity: 1;
		}
	}

	@media (max-width: 600px) {
		.section-card {
			padding: 1.25rem;
		}
	}
</style>
