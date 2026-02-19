<script lang="ts">
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import ChevronUpIcon from 'virtual:icons/lucide/chevron-up';

	interface Props {
		tokens: number[];
		decodedTokens: string[];
		showRawTokens?: boolean;
	}

	let { tokens, decodedTokens, showRawTokens = $bindable(false) }: Props = $props();

	const tokenCount = $derived(tokens.length);
</script>

<div class="tokens-section">
	<button class="toggle-button" onclick={() => (showRawTokens = !showRawTokens)}>
		{#if showRawTokens}
			<ChevronUpIcon />
		{:else}
			<ChevronDownIcon />
		{/if}
		Raw Tokens ({tokenCount})
	</button>

	{#if showRawTokens}
		<div class="tokens-display">
			<div class="tokens-grid">
				{#each decodedTokens as token, i (i)}
					<div class="token-item" title={`Token ID: ${tokens[i]}`}>
						<span class="token-id">{tokens[i]}</span>
						<span class="token-text">{token}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.tokens-section {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.toggle-button {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1rem;
		background: transparent;
		border: none;
		color: var(--color-text-primary);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: background 0.15s;
	}

	.toggle-button:hover {
		background: var(--color-accent-primary-alpha);
	}

	.toggle-button :global(svg) {
		width: 1rem;
		height: 1rem;
		transition: transform 0.2s;
	}

	.tokens-display {
		padding: 1rem;
		background: var(--color-background-main);
		border-top: 1px solid var(--color-border-light);
		max-height: 400px;
		overflow-y: auto;
	}

	.tokens-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.5rem;
	}

	.token-item {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-sm);
		font-family: var(--font-family-mono);
		font-size: 0.75rem;
		cursor: pointer;
		transition:
			background 0.15s,
			box-shadow 0.15s;
	}

	.token-item:hover {
		background: var(--color-accent-primary-alpha);
		box-shadow: var(--shadow-xs);
	}

	.token-id {
		font-weight: 600;
		color: var(--color-text-tertiary);
		font-size: 0.7rem;
		margin-bottom: 0.25rem;
	}

	.token-text {
		color: var(--color-text-primary);
		word-break: break-all;
		white-space: pre-wrap;
		line-height: 1.2;
	}

	/* Custom scrollbar for tokens display */
	.tokens-display::-webkit-scrollbar {
		width: 6px;
	}

	.tokens-display::-webkit-scrollbar-track {
		background: transparent;
	}

	.tokens-display::-webkit-scrollbar-thumb {
		background: var(--color-border-light);
		border-radius: 3px;
	}

	.tokens-display::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-tertiary);
	}
</style>
