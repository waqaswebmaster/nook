<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		fixedHeight?: boolean;
	}

	let { children, fixedHeight = false }: Props = $props();
</script>

<div class="card-interface" class:fixed-height={fixedHeight}>
	{@render children?.()}
</div>

<style>
	.card-interface {
		position: relative;
		animation: slideInCard 0.35s ease-out;
		display: flex;
		flex-direction: column;
	}

	.card-interface.fixed-height {
		height: calc(100vh - var(--nav-height) - var(--sp-12) - var(--sp-4));
		min-height: 500px;
		max-height: calc(100vh - var(--nav-height) - var(--sp-8));
	}

	@keyframes slideInCard {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.card-interface.fixed-height {
			height: calc(100vh - var(--nav-height) - var(--sp-8));
			min-height: 400px;
		}
	}
</style>
