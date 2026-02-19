<script lang="ts">
	interface Props {
		stepNumber: number;
		title: string;
		backgroundColor?: string;
	}

	let { stepNumber, title, backgroundColor = 'var(--color-primary-dark)' }: Props = $props();
</script>

<h3 class="step-header" style="background: {backgroundColor};">
	<span class="step-number">Step {stepNumber}:</span>
	{title}
</h3>

<style>
	.step-header {
		margin-top: 0;
		margin-bottom: var(--sp-4);
		font-family: var(--font-family-primary);
		font-size: 1.125rem;
		color: var(--color-text-primary);
		text-align: center;
		font-weight: 700;
		background: var(--color-background-secondary);
		padding: var(--sp-2) var(--sp-4);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.step-number {
		background: var(--color-primary);
		color: #fff;
		padding: 0.125rem var(--sp-2);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 700;
		margin-right: var(--sp-2);
		display: inline-block;
	}

	@media (max-width: 768px) {
		.step-header {
			font-size: 1rem;
		}
	}
</style>
