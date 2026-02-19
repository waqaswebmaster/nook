<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Message as MessageType } from '$lib/wllama-config';
	import Message from './Message.svelte';
	import MessageCircleIcon from 'virtual:icons/lucide/message-circle';

	interface Props {
		messages: MessageType[];
		isGenerating?: boolean;
	}

	let { messages = [], isGenerating = false }: Props = $props();

	let chatContainer: HTMLElement | undefined = $state();

	export async function scrollToBottom() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	$effect(() => {
		if (messages.length > 0) {
			scrollToBottom();
		}
	});

	onMount(() => {
		scrollToBottom();
	});
</script>

<div bind:this={chatContainer} class="chat-messages" id="chat-container">
	<div class="chat-decoration"></div>

	<div class="messages-content">
		{#if messages.length === 0 || (messages.length === 1 && messages[0].role === 'system')}
			<div class="empty-state">
				<div class="empty-icon"><MessageCircleIcon /></div>
				<h3>Start a Conversation</h3>
				<p>Type a message below to begin chatting with AI</p>
			</div>
		{:else}
			{#each messages as message, i (i)}
				<Message {message} {isGenerating} isLast={i === messages.length - 1} />
			{/each}
		{/if}
	</div>
</div>

<style>
	.chat-messages {
		flex: 1 1 0;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
		background: var(--color-background-main);
		width: 100%;
		box-sizing: border-box;
		border-left: 1px solid var(--color-border-light);
		border-right: 1px solid var(--color-border-light);
	}

	.chat-decoration {
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--color-border-light);
		z-index: 10;
	}

	.messages-content {
		padding: var(--sp-5);
		min-height: 100%;
		display: flex;
		flex-direction: column;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		min-height: 300px;
		text-align: center;
		padding: var(--sp-6);
		position: relative;
		animation: fadeIn 0.35s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.empty-icon {
		margin-bottom: var(--sp-3);
		animation: float 3s ease-in-out infinite;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-disabled);
	}

	.empty-icon :global(svg) {
		width: 3rem;
		height: 3rem;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}

	.empty-state h3 {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin: 0 0 var(--sp-2) 0;
	}

	.empty-state p {
		font-size: 0.9375rem;
		color: var(--color-text-tertiary);
		margin: 0;
		font-weight: 400;
	}

	.chat-messages::-webkit-scrollbar {
		width: 8px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: var(--color-background-secondary);
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: var(--color-text-disabled);
		border-radius: var(--radius-full);
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-tertiary);
	}

	@media (max-width: 768px) {
		.messages-content {
			padding: var(--sp-3);
		}

		.empty-icon :global(svg) {
			width: 2.5rem;
			height: 2.5rem;
		}

		.empty-state h3 {
			font-size: 1.125rem;
		}

		.empty-state p {
			font-size: 0.875rem;
		}
	}
</style>
