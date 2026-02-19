<script lang="ts">
	interface Props {
		stepNumber: number;
		title: string;
		backgroundColor?: string;
	}

	let {
		stepNumber,
		title,
		backgroundColor = 'var(--color-background-secondary)'
	}: Props = $props();
</script>

<h3 class="step-header" style="background: {backgroundColor};">
	<span class="step-number">Step {stepNumber}:</span>
	{title}
</h3>

<style>
	.step-header {
		margin: 0 0 1rem 0;
		font-family: var(--font-family-display);
		font-size: 1.1rem;
		color: var(--color-text-primary);
		text-align: center;
		letter-spacing: 1px;
		text-transform: uppercase;
		background: var(--color-background-secondary);
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 10px;
		box-shadow: var(--shadow-soft-sm);
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
	}

	.step-number {
		background: var(--color-step-badge);
		color: var(--color-step-badge-text);
		padding: 0.25rem 0.6rem;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 800;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2.2rem;
		text-align: center;
	}

	@media (max-width: 768px) {
		.step-header {
			font-size: 1rem;
		}
	}
</style>
