<script lang="ts">
	interface Props {
		tokenCount: number;
		charCount: number;
	}

	let { tokenCount, charCount }: Props = $props();

	function formatNumber(num: number): string {
		return new Intl.NumberFormat().format(num);
	}
</script>

<div class="stats-grid">
	<div class="stat-card tokens">
		<div class="stat-label">Tokens</div>
		<div class="stat-value">{formatNumber(tokenCount)}</div>
	</div>
	<div class="stat-card chars">
		<div class="stat-label">Characters</div>
		<div class="stat-value">{formatNumber(charCount)}</div>
	</div>
	<div class="stat-card ratio">
		<div class="stat-label">Chars/Token</div>
		<div class="stat-value">{(charCount / tokenCount).toFixed(2)}</div>
	</div>
</div>

<style>
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		padding: 1rem;
		text-align: center;
		box-shadow: var(--shadow-xs);
		border-radius: var(--radius-md);
		transition: box-shadow 0.15s;
	}

	.stat-card.tokens {
		background: var(--color-accent-primary-alpha);
	}

	.stat-card.chars {
		background: var(--color-accent-primary-alpha);
	}

	.stat-card.ratio {
		background: var(--color-accent-primary-alpha);
	}

	.stat-card:hover {
		box-shadow: var(--shadow-md);
	}

	.stat-label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		margin-bottom: 0.375rem;
	}

	.stat-value {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}
</style>
