<script lang="ts">
	interface Props {
		label: string;
		variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
	}

	let { label, variant = 'default' }: Props = $props();
</script>

<span
	class="chip"
	class:primary={variant === 'primary'}
	class:success={variant === 'success'}
	class:warning={variant === 'warning'}
	class:danger={variant === 'danger'}
>
	{label}
</span>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		padding: 2px var(--sp-2);
		font-size: 0.6875rem;
		font-weight: 500;
		line-height: 1.5;
		color: var(--color-text-tertiary);
		background: var(--color-background-tertiary);
		border-radius: var(--radius-full);
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.chip.primary {
		color: var(--color-primary);
		background: var(--color-primary-subtle);
	}

	.chip.success {
		color: var(--color-success);
		background: rgba(34, 197, 94, 0.1);
	}

	.chip.warning {
		color: var(--color-warning);
		background: rgba(245, 158, 11, 0.1);
	}

	.chip.danger {
		color: var(--color-danger);
		background: rgba(239, 68, 68, 0.1);
	}
</style>
