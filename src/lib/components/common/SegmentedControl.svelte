<script lang="ts">
	interface Option {
		value: string;
		label: string;
		icon?: any;
	}

	interface Props {
		options: Option[];
		value: string;
		onchange?: (value: string) => void;
		disabled?: boolean;
	}

	let { options, value = $bindable(), onchange, disabled = false }: Props = $props();

	function select(v: string) {
		if (disabled) return;
		value = v;
		onchange?.(v);
	}
</script>

<div class="segmented-control" class:disabled>
	{#each options as option (option.value)}
		<button
			class="segment"
			class:active={value === option.value}
			onclick={() => select(option.value)}
			{disabled}
		>
			{#if option.icon}
				<span class="segment-icon"><option.icon /></span>
			{/if}
			{option.label}
		</button>
	{/each}
</div>

<style>
	.segmented-control {
		display: inline-flex;
		background: var(--color-background-tertiary);
		border-radius: var(--radius-md);
		padding: 3px;
		gap: 2px;
	}

	.segmented-control.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	.segment {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: calc(var(--radius-md) - 2px);
		background: transparent;
		color: var(--color-text-tertiary);
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-fast);
		font-family: var(--font-family-primary);
		white-space: nowrap;
	}

	.segment:hover:not(.active):not(:disabled) {
		color: var(--color-text-primary);
	}

	.segment.active {
		background: var(--color-card);
		color: var(--color-text-primary);
		box-shadow: var(--shadow-sm);
		font-weight: 600;
	}

	.segment:disabled {
		cursor: not-allowed;
	}

	.segment-icon {
		display: flex;
		align-items: center;
	}

	.segment-icon :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}
</style>
