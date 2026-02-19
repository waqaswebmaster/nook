<script lang="ts">
	interface Props {
		message?: string;
	}

	let { message = 'Enter some text above to see the token count' }: Props = $props();
</script>

<div class="empty-state">
	<div class="empty-state-content">
		<div class="empty-state-icon">
			<span class="dots">⋯</span>
		</div>
		<h3>{message}</h3>
		<p>Type or paste text in the input field above to analyze tokens and character count.</p>
	</div>
</div>

<style>
	.empty-state {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-sm);
		padding: 3rem 2rem;
		border-radius: var(--radius-lg);
		text-align: center;
	}

	.empty-state-content {
		max-width: 400px;
		margin: 0 auto;
	}

	.empty-state-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		margin: 0 auto 1.5rem auto;
		background: var(--color-accent-primary-alpha);
		border: 1px solid var(--color-border-light);
		border-radius: 50%;
		color: var(--color-text-secondary);
		font-size: 1.5rem;
	}

	.dots {
		font-size: 2rem;
		font-weight: bold;
		line-height: 1;
	}

	.empty-state h3 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.empty-state p {
		margin: 0;
		color: var(--color-text-tertiary);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	@media (max-width: 600px) {
		.empty-state {
			padding: 2rem 1rem;
		}

		.empty-state h3 {
			font-size: 1.125rem;
		}

		.empty-state p {
			font-size: 0.9rem;
		}

		.empty-state-icon {
			width: 3rem;
			height: 3rem;
			margin-bottom: 1rem;
		}

		.dots {
			font-size: 1.5rem;
		}
	}
</style>
