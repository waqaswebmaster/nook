<script lang="ts">
	import { AVAILABLE_MODELS, formatFileSize } from '$lib/wllama-config';
	import { inferenceParams } from '$lib/stores';
	import AdvancedSection from '../common/AdvancedSection.svelte';
	import ZapIcon from 'virtual:icons/lucide/zap';
	import HourglassIcon from 'virtual:icons/lucide/hourglass';
	import BrainIcon from 'virtual:icons/lucide/brain';
	import SmartphoneIcon from 'virtual:icons/lucide/smartphone';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';
	import ShieldIcon from 'virtual:icons/lucide/shield';

	interface Props {
		modelSelection: string;
		onLoadModel: () => void;
		isLoading?: boolean;
	}

	let { modelSelection = $bindable(), onLoadModel, isLoading = false }: Props = $props();

	function getModelPros(modelUrl: string) {
		const model = AVAILABLE_MODELS.find((m) => m.url === modelUrl);
		if (model?.name.includes('Gemma')) {
			return { icon: BrainIcon, text: 'Smarter AI responses' };
		} else if (model?.name.includes('SmolLM2')) {
			return { icon: SmartphoneIcon, text: 'Runs on most devices' };
		}
		return { icon: SparklesIcon, text: 'High quality responses' };
	}
</script>

<div class="model-selector">
	<!-- Model cards -->
	<section class="panel">
		<h3>Choose a Model</h3>
		<div class="model-cards">
			{#each AVAILABLE_MODELS as model (model.url)}
				{@const pros = getModelPros(model.url)}
				<button
					class="model-card"
					class:active={modelSelection === model.url}
					onclick={() => (modelSelection = model.url)}
					disabled={isLoading}
				>
					<div class="model-icon">
						<pros.icon></pros.icon>
					</div>
					<div class="model-meta">
						<h4>{model.name}</h4>
						<span class="model-size">{formatFileSize(model.size)}</span>
					</div>
					<div class="model-pros">
						<pros.icon></pros.icon>
						<span>{pros.text}</span>
					</div>
				</button>
			{/each}
		</div>
	</section>

	<!-- Advanced params -->
	<AdvancedSection>
		<label class="param-item">
			<span class="param-label">Threads <span class="param-hint">(-1 auto)</span></span>
			<input type="number" bind:value={$inferenceParams.nThreads} min="-1" max="32" />
		</label>
		<label class="param-item">
			<span class="param-label">Context Size</span>
			<input type="number" bind:value={$inferenceParams.nContext} min="512" max="8192" />
		</label>
		<label class="param-item">
			<span class="param-label">Temperature</span>
			<input type="number" bind:value={$inferenceParams.temperature} min="0" max="2" step="0.1" />
		</label>
	</AdvancedSection>

	<!-- Load button -->
	<div class="load-area">
		<button class="load-btn" onclick={onLoadModel} disabled={isLoading}>
			{#if isLoading}
				<span class="spin"><HourglassIcon /></span>
				Loading…
			{:else}
				<ZapIcon />
				Load Selected Model
			{/if}
		</button>

		<p class="disclaimer">
			<ShieldIcon />
			Models run locally in your browser. No data is sent to external servers.
		</p>
	</div>
</div>

<style>
	.model-selector {
		display: flex;
		flex-direction: column;
		gap: var(--sp-5);
	}

	.panel {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		padding: var(--sp-5);
	}

	h3 {
		margin: 0 0 var(--sp-4);
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.model-cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--sp-3);
	}

	.model-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--sp-3);
		padding: var(--sp-4) var(--sp-3);
		background: var(--color-background-main);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-family: var(--font-family-primary);
		transition: all 0.18s ease;
		text-align: center;
		overflow: hidden;
	}

	.model-card:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.model-card:not(:disabled):hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	.model-card.active {
		background: var(--color-accent-primary-alpha);
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-primary-subtle);
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

	.model-meta h4 {
		margin: 0 0 2px;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
		line-height: 1.3;
	}

	.model-size {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-weight: 500;
	}

	.model-pros {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		background: var(--color-background-tertiary);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.model-pros :global(svg) {
		width: 13px;
		height: 13px;
		flex-shrink: 0;
	}

	/* Params */
	.param-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.param-label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.param-hint {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-weight: 400;
	}

	.param-item input {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 500;
		background: var(--color-background-main);
		color: var(--color-text-primary);
		font-family: var(--font-family-primary);
		box-sizing: border-box;
		width: 100%;
		transition: border-color var(--transition-fast);
	}

	.param-item input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-primary-subtle);
	}

	/* Load area */
	.load-area {
		text-align: center;
	}

	.load-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--sp-2);
		padding: var(--sp-3) var(--sp-6);
		background: var(--color-primary);
		color: #fff;
		border: none;
		border-radius: var(--radius-md);
		font-size: 0.9375rem;
		font-weight: 600;
		font-family: var(--font-family-primary);
		cursor: pointer;
		transition: all var(--transition-fast);
		min-width: 220px;
	}

	.load-btn :global(svg) {
		width: 18px;
		height: 18px;
	}

	.load-btn:hover:not(:disabled) {
		filter: brightness(1.08);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.load-btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.spin {
		display: flex;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.disclaimer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		margin-top: var(--sp-3);
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
	}

	.disclaimer :global(svg) {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}

	@media (max-width: 640px) {
		.model-cards {
			grid-template-columns: 1fr;
		}

		.load-btn {
			width: 100%;
			min-width: auto;
		}
	}
</style>
