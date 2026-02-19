<script lang="ts">
	import { AVAILABLE_MODELS, formatFileSize } from '$lib/wllama-config';
	import { inferenceParams } from '$lib/stores';
	import AdvancedSection from '../common/AdvancedSection.svelte';
	import StepHeader from '$lib/components/common/StepHeader.svelte';
	import RocketIcon from 'virtual:icons/lucide/rocket';
	import ZapIcon from 'virtual:icons/lucide/zap';
	import HourglassIcon from 'virtual:icons/lucide/hourglass';
	import BrainIcon from 'virtual:icons/lucide/brain';
	import SmartphoneIcon from 'virtual:icons/lucide/smartphone';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';
	import CardInterface from '$lib/components/common/CardInterface.svelte';
	import Toolbar from '$lib/components/common/Toolbar.svelte';

	interface Props {
		modelSelection: string;
		onLoadModel: () => void;
		isLoading?: boolean;
	}

	let { modelSelection = $bindable(), onLoadModel, isLoading = false }: Props = $props();

	// Get model pros
	function getModelPros(modelUrl: string) {
		const model = AVAILABLE_MODELS.find((m) => m.url === modelUrl);
		if (model?.name.includes('Gemma')) {
			return { icon: BrainIcon, text: 'Smarter AI responses' };
		} else if (model?.name.includes('SmolLM2')) {
			return { icon: SmartphoneIcon, text: 'Runs on most computers and phones' };
		}
		return { icon: SparklesIcon, text: 'High quality responses' };
	}
</script>

<CardInterface>
	<Toolbar modelInfo="Chat with AI Models" ModelIcon={RocketIcon} variant="studio" />

	<div class="content-area">
		<!-- Model Selection -->
		<div class="model-selection">
			<StepHeader
				stepNumber={1}
				title="Choose Your AI Model"
				backgroundColor="var(--color-background-secondary)"
			/>
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
						<div class="model-header">
							<h4>{model.name}</h4>
							<span class="model-size">{formatFileSize(model.size)}</span>
						</div>
						<div class="model-pros">
							<span class="pros-icon"><pros.icon></pros.icon></span>
							<span class="pros-text">{pros.text}</span>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<div class="advanced-section">
			<StepHeader
				stepNumber={2}
				title="Advanced Settings"
				backgroundColor="var(--color-background-secondary)"
			/>
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
					<input
						type="number"
						bind:value={$inferenceParams.temperature}
						min="0"
						max="2"
						step="0.1"
					/>
				</label>
			</AdvancedSection>
		</div>
	</div>

	<!-- Load Model Button -->
	<div class="input-area">
		<button onclick={onLoadModel} class="load-button primary-button" disabled={isLoading}>
			{#if isLoading}
				<span class="loading-icon"><HourglassIcon /></span>
				Loading Model...
			{:else}
				<span class="button-icon"><ZapIcon /></span>
				Load Selected Model
			{/if}
		</button>

		<div class="disclaimer">
			<span class="disclaimer-icon"><RocketIcon /></span>
			Models run locally in your browser. No data is sent to external servers.
		</div>
	</div>
</CardInterface>

<style>
	.model-selection {
		background: var(--color-background-secondary);
		border: var(--border-brutalist-extra-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-large);
		margin-bottom: 1.5rem;
	}

	/* step header handled by shared `StepHeader` component */

	/* Override StepHeader background + badge for chat page */
	:global(.model-selection .step-header) {
		background: var(--color-background-secondary);
	}
	:global(.model-selection .step-header),
	:global(.advanced-section .step-header) {
		background: var(--color-background-secondary);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border-secondary);
		box-shadow: none;
	}

	/* using StepHeader component's step badge */

	.model-cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.model-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 1rem;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s ease;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-xs);
		text-align: center;
	}

	.model-card:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.model-card:not(:disabled):hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
	}

	.model-card.active {
		background: var(--color-accent-primary-alpha);
		border-color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	.model-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
		border-radius: var(--radius-md);
		padding: 0.625rem;
	}

	.model-icon :global(svg) {
		width: 1.75rem;
		height: 1.75rem;
	}

	.model-header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.model-header h4 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
		line-height: 1.3;
	}

	.model-size {
		font-size: 0.75rem;
		color: var(--color-text-inverse);
		background: var(--color-primary-dark);
		padding: 0.25rem 0.5rem;
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		font-weight: 700;
		box-shadow: var(--shadow-brutalist-small);
		width: fit-content;
		margin: 0 auto;
	}

	.model-pros {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		background: var(--color-background-tertiary);
		padding: 0.375rem 0.625rem;
		border-radius: var(--radius-sm);
		width: 100%;
		box-sizing: border-box;
		justify-content: center;
	}

	.pros-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.pros-icon :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}

	.pros-text {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		line-height: 1.3;
		text-align: center;
	}

	.advanced-section {
		background: var(--color-background-secondary);
		border: var(--border-brutalist-extra-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-large);
		margin-bottom: 1.5rem;
		position: relative;
		transform: rotate(0.1deg);
		animation: slideIn 0.4s ease-out;
		animation-delay: 0.1s;
		animation-fill-mode: both;
	}

	/* .advanced-section h3 {
		margin-top: 0;
		margin-bottom: 1.25rem;
		font-family: var(--font-family-display);
		font-size: 1.75rem;
		color: var(--color-text-inverse);
		text-align: center;
		letter-spacing: 2px;
		text-transform: uppercase;
		background: var(--color-primary-dark);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	} */

	.param-item {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
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
		transition: border-color 0.2s ease;
		font-family: var(--font-family-primary);
		box-sizing: border-box;
		width: 100%;
		color: var(--color-text-primary);
	}

	.param-item input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-accent-primary-alpha);
	}

	.load-button {
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.625rem;
		min-width: 260px;
		padding: 0.875rem 1.75rem;
		font-size: 1rem;
	}

	.load-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.button-icon,
	.loading-icon {
		display: flex;
		align-items: center;
	}

	.button-icon :global(svg),
	.loading-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.loading-icon {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.disclaimer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		text-align: center;
	}

	.disclaimer-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-tertiary);
	}

	.disclaimer-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* .toolbar-decoration {
		position: absolute;
		bottom: -8px;
		left: 0;
		right: 0;
		height: 4px;
		background: repeating-linear-gradient(
			90deg,
			var(--color-text-primary),
			var(--color-text-primary) 10px,
			var(--color-success) 10px,
			var(--color-success) 20px
		);
	} */

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px) rotate(-1deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(-0.5deg);
		}
	}

	@media (max-width: 768px) {
		.model-cards {
			grid-template-columns: 1fr;
		}

		.load-button {
			min-width: auto;
			width: 100%;
		}
	}
</style>
