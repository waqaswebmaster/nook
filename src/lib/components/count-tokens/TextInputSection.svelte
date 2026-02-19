<script lang="ts">
	import DicesIcon from 'virtual:icons/lucide/dices';
	import CopyIcon from 'virtual:icons/lucide/copy';
	import CheckIcon from 'virtual:icons/lucide/check';
	import TrashIcon from 'virtual:icons/lucide/trash';
	import { toast } from 'svelte-sonner';

	interface Props {
		text: string;
		exampleTexts: string[];
		placeholder?: string;
	}

	let {
		text = $bindable(),
		exampleTexts,
		placeholder = 'Enter or paste your text here to count tokens...'
	}: Props = $props();

	let copied = $state(false);

	function handleRandomExample() {
		if (exampleTexts.length <= 1) {
			// If there's only one example, just use it
			text = exampleTexts[0] || '';
			return;
		}

		let randomText;
		let attempts = 0;
		const maxAttempts = 10; // Prevent infinite loop

		do {
			randomText = exampleTexts[Math.floor(Math.random() * exampleTexts.length)];
			attempts++;
		} while (randomText === text && attempts < maxAttempts);

		text = randomText;
	}

	function handleClear() {
		text = '';
	}

	async function handleCopy() {
		if (!text) return;

		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			toast.success('Text copied to clipboard!');
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (error) {
			console.error('Failed to copy text:', error);
			toast.error('Failed to copy text');
		}
	}
</script>

<div class="input-section">
	<div class="section-header">
		<h3>Input Text</h3>
		<div class="header-actions">
			<button class="icon-button" onclick={handleRandomExample} title="Load example">
				<DicesIcon />
			</button>
			<button
				class="icon-button"
				onclick={handleCopy}
				title={copied ? 'Copied!' : 'Copy text'}
				disabled={!text}
			>
				{#if copied}
					<CheckIcon />
				{:else}
					<CopyIcon />
				{/if}
			</button>
			<button class="icon-button" onclick={handleClear} title="Clear text">
				<TrashIcon />
			</button>
		</div>
	</div>

	<textarea bind:value={text} {placeholder} class="text-input"></textarea>
</div>

<style>
	.input-section {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-sm);
		padding: 1.5rem;
		border-radius: var(--radius-lg);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.section-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.header-actions {
		display: flex;
		gap: 0.375rem;
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition:
			background 0.15s,
			box-shadow 0.15s;
		color: var(--color-text-secondary);
		font-size: 1rem;
	}

	.icon-button:hover:not(:disabled) {
		background: var(--color-accent-primary-alpha);
		color: var(--color-text-primary);
		box-shadow: var(--shadow-xs);
	}

	.icon-button:active {
		box-shadow: none;
	}

	.icon-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.icon-button :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.text-input {
		width: 100%;
		height: 200px;
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		padding: 1rem;
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--color-text-primary);
		resize: vertical;
		min-height: 120px;
		max-height: 400px;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
		box-sizing: border-box;
	}

	.text-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-accent-primary-alpha);
	}

	.text-input::placeholder {
		color: var(--color-text-tertiary);
		opacity: 1;
	}
</style>
