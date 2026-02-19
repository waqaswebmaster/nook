<script lang="ts">
	interface Props {
		speed: number;
		onSpeedChange: (speed: number) => void;
	}

	let { speed, onSpeedChange }: Props = $props();

	function handleSpeedChange(event: Event) {
		const target = event.target as HTMLInputElement;
		onSpeedChange(parseFloat(target.value));
	}
</script>

<div class="speed-control">
	<label for="speed-control">Speed:</label>
	<div class="speed-input-wrapper">
		<input
			id="speed-control"
			type="range"
			value={speed}
			oninput={handleSpeedChange}
			min="0.5"
			max="2"
			step="0.1"
		/>
		<div class="speed-value">{speed}x</div>
	</div>
</div>

<style>
	.speed-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.speed-input-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
	}

	input[type='range'] {
		flex: 1;
		height: 6px;
		background: var(--color-border-light);
		border: none;
		border-radius: var(--radius-sm);
		outline: none;
		appearance: none;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 18px;
		height: 18px;
		background: var(--color-primary);
		border: 2px solid white;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: var(--shadow-sm);
		transition: all 0.15s;
	}

	input[type='range']::-webkit-slider-thumb:hover {
		transform: scale(1.1);
	}

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: var(--color-primary);
		border: 2px solid white;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: var(--shadow-sm);
		transition: all 0.15s;
	}

	input[type='range']::-moz-range-thumb:hover {
		transform: scale(1.1);
	}

	.speed-value {
		min-width: 3rem;
		padding: 0.25rem 0.5rem;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		font-weight: 600;
		text-align: center;
		color: var(--color-text-primary);
	}
</style>
