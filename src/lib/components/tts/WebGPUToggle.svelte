<script lang="ts">
	import { onMount } from 'svelte';
	import { detectWebGPU } from '$lib/utils';

	interface Props {
		modelValue: boolean;
		onUpdate: (value: boolean) => void;
	}

	let { modelValue = false, onUpdate }: Props = $props();

	let webGPUSupported = $state(false);

	onMount(async () => {
		webGPUSupported = await detectWebGPU();
	});

	function handleToggle(event: Event) {
		const target = event.target as HTMLInputElement;
		onUpdate(target.checked);
	}
</script>

<div class="webgpu-toggle">
	<input
		id="webgpu-toggle"
		type="checkbox"
		checked={modelValue}
		disabled={!webGPUSupported}
		onchange={handleToggle}
	/>
	<label for="webgpu-toggle" class:disabled={!webGPUSupported}>
		Try WebGPU (experimental)
		{#if !webGPUSupported}
			<span class="not-supported">(not supported)</span>
		{/if}
	</label>
</div>

<style>
	.webgpu-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 0.75rem;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
	}

	input[type='checkbox'] {
		width: 18px;
		height: 18px;
		accent-color: var(--color-primary);
		cursor: pointer;
	}

	input[type='checkbox']:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
		cursor: pointer;
		user-select: none;
	}

	label.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.not-supported {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-weight: 400;
	}
</style>
