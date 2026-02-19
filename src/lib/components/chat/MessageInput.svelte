<script lang="ts">
	import { onMount } from 'svelte';
	import MessageCircleIcon from 'virtual:icons/lucide/message-circle';
	import LightbulbIcon from 'virtual:icons/lucide/lightbulb';
	import SendIcon from 'virtual:icons/lucide/send';
	import SquareIcon from 'virtual:icons/lucide/square';

	interface Props {
		value: string;
		isGenerating?: boolean;
		onSend: () => void;
		onStop?: () => void;
		placeholder?: string;
	}

	let {
		value = $bindable(),
		isGenerating = false,
		onSend,
		onStop,
		placeholder = 'Type your message...'
	}: Props = $props();

	let inputElement: HTMLTextAreaElement | undefined = $state();

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (!isGenerating && value.trim()) {
				onSend();
			}
		}
	}

	function focusAfterMount(node: HTMLTextAreaElement) {
		if (node && !node.disabled) {
			node.focus();
		}
	}

	export function focus() {
		if (inputElement) {
			inputElement.focus();
		}
	}

	onMount(() => {
		focus();
	});
</script>

<div class="input-area">
	<div class="message-input" class:is-disabled={isGenerating}>
		<textarea
			id="chat"
			bind:this={inputElement}
			bind:value
			{placeholder}
			rows="1"
			use:focusAfterMount
			onkeydown={handleKeyDown}
		></textarea>
		{#if isGenerating && onStop}
			<button onclick={onStop} class="stop-btn" aria-label="Stop generation">
				<SquareIcon />
			</button>
		{:else}
			<button
				onclick={onSend}
				disabled={isGenerating || !value.trim()}
				class="send-btn"
				aria-label="Send message"
			>
				<SendIcon />
			</button>
		{/if}
	</div>

	<div class="disclaimer">
		<span class="disclaimer-icon"><LightbulbIcon /></span>
		Model responses may not always be accurate.
	</div>
</div>

<style>
	.input-area {
		padding: 1rem 1.25rem;
		border-top: 1px solid var(--color-border-light);
	}

	.message-input {
		display: flex;
		align-items: flex-end;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: border-color 0.2s ease;
		margin-bottom: 0.5rem;
	}

	.message-input:focus-within:not(.is-disabled) {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-accent-primary-alpha);
	}

	.message-input.is-disabled {
		opacity: 0.6;
	}

	textarea {
		flex-grow: 1;
		padding: 0.75rem 1rem;
		border: none;
		resize: none;
		font-family: var(--font-family-primary);
		font-size: 0.9375rem;
		font-weight: 400;
		line-height: 1.5;
		background: transparent;
		min-height: 22px;
		max-height: 120px;
		outline: none;
		color: var(--color-text-primary);
	}

	textarea::placeholder {
		color: var(--color-text-disabled);
	}

	.send-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		margin: 6px;
		align-self: center;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.send-btn :global(svg) {
		width: 18px;
		height: 18px;
	}

	.send-btn:hover:not(:disabled) {
		background: var(--color-primary-hover);
		transform: scale(1.05);
	}

	.send-btn:active:not(:disabled) {
		transform: scale(0.95);
	}

	.send-btn:disabled {
		background: var(--color-background-disabled);
		cursor: not-allowed;
		opacity: 0.5;
	}

	.stop-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		margin: 6px;
		align-self: center;
		background: var(--color-danger);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.stop-btn :global(svg) {
		width: 18px;
		height: 18px;
	}

	.stop-btn:hover {
		background: var(--color-danger-hover);
		transform: scale(1.05);
	}

	.disclaimer {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
	}

	.disclaimer-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-tertiary);
	}

	.disclaimer-icon :global(svg) {
		width: 0.75rem;
		height: 0.75rem;
	}

	@media (max-width: 600px) {
		.input-area {
			padding: 0.75rem;
		}

		textarea {
			font-size: 0.875rem;
		}

		.send-btn,
		.stop-btn {
			width: 36px;
			height: 36px;
		}
	}
</style>
