<script lang="ts">
	import AdvancedSection from '../common/AdvancedSection.svelte';
	import WebGPUToggle from './WebGPUToggle.svelte';
	import SampleRateSelector from './SampleRateSelector.svelte';

	interface Props {
		selectedModel: 'kitten' | 'piper' | 'kokoro' | null;
		useWebGPU: boolean;
		selectedSampleRate: number;
		onWebGPUToggle: (enabled: boolean) => void;
		onSampleRateChange: (sampleRate: number) => void;
	}

	let { selectedModel, useWebGPU, selectedSampleRate, onWebGPUToggle, onSampleRateChange }: Props =
		$props();

	// Show advanced params if model supports WebGPU or other advanced features
	const hasAdvancedOptions = $derived(selectedModel === 'kitten' || selectedModel === 'kokoro');
</script>

{#if hasAdvancedOptions}
	<div class="advanced-section">
		<AdvancedSection>
			{#if selectedModel === 'kitten' || selectedModel === 'kokoro'}
				<div class="param-item">
					<WebGPUToggle modelValue={useWebGPU} onUpdate={onWebGPUToggle} />
				</div>
			{/if}

			{#if selectedModel === 'kitten'}
				<div class="param-item">
					<SampleRateSelector {selectedSampleRate} {onSampleRateChange} />
				</div>
			{/if}
		</AdvancedSection>
	</div>
{/if}

<style>
	.advanced-section {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		padding: var(--sp-5);
		border-radius: var(--radius-lg);
		margin-bottom: var(--sp-3);
	}

	.param-item {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	@media (max-width: 768px) {
		.advanced-section {
			padding: var(--sp-4);
		}
	}
</style>
