<script lang="ts">
	import type { Message } from '$lib/wllama-config';
	import UserIcon from 'virtual:icons/lucide/user';
	import BotIcon from 'virtual:icons/lucide/bot';
	import MessageCircleIcon from 'virtual:icons/lucide/message-circle';

	interface Props {
		message: Message;
		isGenerating?: boolean;
		isLast?: boolean;
	}

	let { message, isGenerating = false, isLast = false }: Props = $props();
</script>

{#if message.role !== 'system'}
	<div class="message-wrapper {message.role}-wrapper">
		<div class="message {message.role}-message">
			<div class="message-label">
				{#if message.role === 'user'}
					<UserIcon />
					<span>You</span>
				{:else}
					<BotIcon />
					<span>AI</span>
				{/if}
			</div>
			<div class="message-content">
				{#if message.role === 'assistant' && isGenerating && isLast}
					{#if message.content === ''}
						<div class="typing-indicator">
							<span class="dot"></span>
							<span class="dot"></span>
							<span class="dot"></span>
						</div>
					{:else}
						{message.content}
						<span class="cursor-blink">▊</span>
					{/if}
				{:else}
					{message.content}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.message-wrapper {
		display: flex;
		margin-bottom: 0.75rem;
		width: 100%;
		animation: messageSlide 0.3s ease-out;
		padding: 0;
		box-sizing: border-box;
	}

	@keyframes messageSlide {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.user-wrapper {
		justify-content: flex-end;
	}

	.assistant-wrapper {
		justify-content: flex-start;
	}

	.message {
		max-width: 70%;
		word-wrap: break-word;
		overflow-wrap: break-word;
		min-width: 0;
	}

	.message-content {
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
		border-radius: var(--radius-lg);
	}

	.user-message .message-content {
		background: var(--color-primary);
		color: white;
		border-bottom-right-radius: var(--radius-sm);
	}

	.assistant-message .message-content {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		color: var(--color-text-primary);
		border-bottom-left-radius: var(--radius-sm);
	}

	.message-label {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--color-text-tertiary);
		padding: 0 0.25rem;
		margin-bottom: 0.25rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.message-label :global(svg) {
		width: 0.75rem;
		height: 0.75rem;
	}

	.user-message .message-label {
		justify-content: flex-end;
	}

	.typing-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.125rem 0;
	}

	.cursor-blink {
		display: inline-block;
		animation: blink 1s infinite;
		color: var(--color-primary);
		font-weight: normal;
		margin-left: 2px;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	.typing-indicator .dot {
		width: 6px;
		height: 6px;
		background: var(--color-text-tertiary);
		border-radius: 50%;
		display: inline-block;
		animation: bounce-dot 1.4s infinite ease-in-out both;
	}

	.typing-indicator .dot:nth-child(1) {
		animation-delay: -0.32s;
	}
	.typing-indicator .dot:nth-child(2) {
		animation-delay: -0.16s;
	}
	.typing-indicator .dot:nth-child(3) {
		animation-delay: 0s;
	}

	@keyframes bounce-dot {
		0%,
		80%,
		100% {
			transform: scale(0.8) translateY(0);
			opacity: 0.4;
		}
		40% {
			transform: scale(1) translateY(-4px);
			opacity: 1;
		}
	}

	@media (max-width: 600px) {
		.message {
			max-width: 85%;
		}

		.message-content {
			padding: 0.625rem 0.875rem;
			font-size: 0.875rem;
		}
	}
</style>
