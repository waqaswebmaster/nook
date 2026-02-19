<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		onClick?: () => void;
		disabled?: boolean;
		variant?: 'default' | 'success' | 'warning' | 'danger';
		Icon?: any;
	}

	let { children, onClick, disabled = false, variant = 'default', Icon }: Props = $props();

	const variantStyles = {
		default: 'var(--color-success)',
		success: 'var(--color-success)',
		warning: 'var(--color-primary-dark)',
		danger: 'var(--color-danger)'
	};

	const hoverStyles = {
		default: 'var(--color-primary-dark)',
		success: 'var(--color-success-hover)',
		warning: 'var(--color-warning)',
		danger: 'var(--color-danger-hover)'
	};
</script>

<button
	class="action-button"
	class:disabled
	style="background: {variantStyles[variant]}; --hover-color: {hoverStyles[variant]};"
	onclick={onClick}
	{disabled}
>
	{#if Icon}
		<span class="btn-icon">
			<Icon></Icon>
		</span>
	{/if}
	{@render children?.()}
</button>

<style>
	.action-button {
		padding: var(--sp-2) var(--sp-3);
		background: var(--color-background-secondary);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: 0.8125rem;
		font-weight: 600;
		transition: all var(--transition-fast);
		font-family: var(--font-family-primary);
		white-space: nowrap;
		box-shadow: var(--shadow-xs);
		display: flex;
		align-items: center;
		gap: var(--sp-1);
	}

	.action-button:hover:not(.disabled) {
		background: var(--hover-color, var(--color-primary-subtle));
		border-color: var(--color-primary);
		color: var(--color-primary);
		box-shadow: var(--shadow-sm);
		transform: translateY(-1px);
	}

	.action-button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-icon {
		font-size: 1rem;
		display: flex;
		align-items: center;
		color: currentColor;
	}

	.btn-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	@media (max-width: 768px) {
		.action-button {
			padding: var(--sp-1) var(--sp-2);
			font-size: 0.75rem;
		}
	}
</style>
