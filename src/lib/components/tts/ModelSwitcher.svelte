<script lang="ts">
	import CatIcon from 'virtual:icons/lucide/cat';
	import FlowerIcon from 'virtual:icons/lucide/flower';
	import TheaterIcon from 'virtual:icons/lucide/theater';

	interface Props {
		selectedModel: string | null;
		onModelChange: (model: 'kitten' | 'piper' | 'kokoro') => void;
		loading?: boolean;
	}

	let { selectedModel, onModelChange, loading = false }: Props = $props();
</script>

<div class="model-switcher">
	<h3>Choose a Model</h3>

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
				<p>24MB · Edge devices</p>
			</div>
		</button>

		<button
			class="model-card"
			class:active={selectedModel === 'piper'}
			class:loading
			disabled={loading}
			onclick={() => onModelChange('piper')}
		>
			<span class="badge">Recommended</span>
			<div class="model-icon">
				<TheaterIcon />
			</div>
			<div class="model-info">
				<h4>Piper Voices</h4>
				<p>75MB · Fast & clear</p>
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
				<p>80MB · Highest quality</p>
			</div>
		</button>
	</div>
</div>

<style>
	.model-switcher {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
	}

	h3 {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.model-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--sp-3);
	}

	.model-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--sp-3);
		padding: var(--sp-4) var(--sp-3);
		background: var(--color-background-main);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.18s ease;
		font-family: var(--font-family-primary);
		text-align: center;
		overflow: hidden;
	}

	.model-card:hover:not(:disabled) {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	.model-card.active {
		background: var(--color-accent-primary-alpha);
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-primary-subtle);
	}

	.model-card.loading {
		opacity: 0.45;
		cursor: not-allowed;
		pointer-events: none;
	}

	.model-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: var(--radius-md);
		background: var(--color-accent-primary-alpha);
		color: var(--color-primary);
	}

	.model-icon :global(svg) {
		width: 22px;
		height: 22px;
	}

	.model-info h4 {
		margin: 0 0 2px;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.model-info p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-weight: 500;
	}

	.badge {
		position: absolute;
		top: 6px;
		right: 6px;
		background: var(--color-primary);
		color: #fff;
		font-size: 0.625rem;
		font-weight: 700;
		padding: 2px 7px;
		border-radius: var(--radius-sm);
		letter-spacing: 0.02em;
	}

	@media (max-width: 640px) {
		.model-cards {
			grid-template-columns: 1fr;
			gap: var(--sp-2);
		}

		.model-card {
			flex-direction: row;
			text-align: left;
			padding: var(--sp-3);
		}

		.model-icon {
			width: 38px;
			height: 38px;
			flex-shrink: 0;
		}

		.model-icon :global(svg) {
			width: 18px;
			height: 18px;
		}

		.badge {
			top: 4px;
			right: 4px;
		}
	}
</style>
