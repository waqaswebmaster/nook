<script lang="ts">
	import CatIcon from 'virtual:icons/lucide/cat';
	import FlowerIcon from 'virtual:icons/lucide/flower';
	import TheaterIcon from 'virtual:icons/lucide/theater';
	import StepHeader from '$lib/components/common/StepHeader.svelte';

	interface Props {
		selectedModel: string | null;
		onModelChange: (model: 'kitten' | 'piper' | 'kokoro') => void;
		loading?: boolean;
	}

	let { selectedModel, onModelChange, loading = false }: Props = $props();
</script>

<div class="model-switcher">
	<StepHeader
		stepNumber={1}
		title="Text-to-speech Model"
		backgroundColor="var(--color-background-secondary)"
	/>

	<div class="model-cards">
		<button
			class="model-card"
			class:active={selectedModel === 'kitten'}
			class:loading
			disabled={loading}
			onclick={() => onModelChange('kitten')}
		>
			<div class="model-icon">
				<CatIcon />
			</div>
			<div class="model-info">
				<h4>Kitten TTS Nano</h4>
				<p>24MB • Best for edge devices</p>
			</div>
		</button>

		<button
			class="model-card"
			class:active={selectedModel === 'piper'}
			class:loading
			disabled={loading}
			onclick={() => onModelChange('piper')}
		>
			<div class="recommended-badge">Recommended</div>
			<div class="model-icon">
				<TheaterIcon />
			</div>
			<div class="model-info">
				<h4>Piper Voices</h4>
				<p>75MB • Better Quality • Fast</p>
			</div>
		</button>

		<button
			class="model-card"
			class:active={selectedModel === 'kokoro'}
			class:loading
			disabled={loading}
			onclick={() => onModelChange('kokoro')}
		>
			<div class="model-icon">
				<FlowerIcon />
			</div>
			<div class="model-info">
				<h4>Kokoro</h4>
				<p>80MB • Highest Quality • Slow</p>
			</div>
		</button>
	</div>
</div>

<style>
	.model-switcher {
		background: var(--color-background-secondary);
		border: var(--border-brutalist-extra-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-sm);
		margin-bottom: 1.5rem;
	}

	/* Step header now uses shared StepHeader component */

	.model-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.model-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 1rem;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-xs);
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.model-card:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
		background: var(--color-accent-primary-alpha);
	}

	.model-card.active {
		background: var(--color-accent-primary-alpha);
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
	}

	.model-card.loading {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	.model-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
		border-radius: var(--radius-md);
		padding: 0.75rem;
	}

	.model-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.model-info h4 {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.model-info p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-weight: 500;
		line-height: 1.2;
	}

	.recommended-badge {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: var(--color-primary);
		color: white;
		font-size: 0.625rem;
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		border-radius: var(--radius-sm);
		z-index: 1;
	}

	@media (max-width: 768px) {
		.model-cards {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.model-card {
			flex-direction: row;
			justify-content: flex-start;
			text-align: left;
		}

		.model-icon {
			padding: 0.5rem;
		}

		.model-info {
			text-align: left;
		}

		.recommended-badge {
			top: 0.25rem;
			right: 0.25rem;
			font-size: 0.55rem;
			padding: 0.15rem 0.4rem;
		}
	}

	@media (max-width: 600px) {
		.model-switcher {
			padding: 1rem;
		}

		h3 {
			font-size: 1rem;
		}
	}
</style>
