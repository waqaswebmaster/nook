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
	<label for="speed-control">Speed</label>
	<div class="speed-row">
		<input
			id="speed-control"
			type="range"
			value={speed}
			oninput={handleSpeedChange}
			min="0.5"
			max="2"
			step="0.1"
		/>
		<span class="speed-badge">{speed}x</span>
	</div>
</div>

<style>
	.speed-control {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
		width: 100%;
	}

	label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.speed-row {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}

	input[type='range'] {
		flex: 1;
		height: 5px;
		background: var(--color-border-light);
		border: none;
		border-radius: var(--radius-full);
		outline: none;
		appearance: none;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		background: var(--color-primary);
		border: 2px solid var(--color-card);
		border-radius: 50%;
		cursor: pointer;
		box-shadow: var(--shadow-sm);
		transition: transform 0.15s;
	}

	input[type='range']::-webkit-slider-thumb:hover {
		transform: scale(1.15);
	}

	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: var(--color-primary);
		border: 2px solid var(--color-card);
		border-radius: 50%;
		cursor: pointer;
		box-shadow: var(--shadow-sm);
	}

	.speed-badge {
		min-width: 2.75rem;
		text-align: center;
		padding: 2px 8px;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
		border-radius: var(--radius-sm);
	}
</style>
