<script lang="ts">
	interface Props {
		title: string;
		items: string[];
	}

	let { title, items }: Props = $props();
</script>

<div class="info-box">
	<h4>{title}</h4>
	<ul>
		{#each items as item, index (index)}
			<li>{item}</li>
		{/each}
	</ul>
</div>

<style>
	.info-box {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-xs);
		padding: 1.5rem;
		border-radius: var(--radius-lg);
		margin-top: 2rem;
	}

	.info-box h4 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.info-box ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.info-box li {
		position: relative;
		padding-left: 1.5rem;
		margin-bottom: 0.75rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.info-box li:last-child {
		margin-bottom: 0;
	}

	.info-box li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: var(--color-primary);
		font-size: 1rem;
		top: 0;
	}

	.info-box li:hover {
		color: var(--color-text-primary);
	}
</style>
