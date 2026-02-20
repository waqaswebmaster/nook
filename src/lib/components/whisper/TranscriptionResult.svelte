<script lang="ts">
	import subsrt from 'subsrt-ts';
	import FileTextIcon from 'virtual:icons/lucide/file-text';
	import CheckCircleIcon from 'virtual:icons/lucide/check-circle';
	import ClipboardIcon from 'virtual:icons/lucide/clipboard';

	interface Props {
		text: string;
		transcriptionData?: {
			transcription: Array<{
				text: string;
				timestamps: {
					from: string;
					to: string;
				};
			}>;
		};
	}

	let { text, transcriptionData }: Props = $props();

	let activeTab = $state<'text' | 'srt'>('text');
	let hasCopied = $state(false);

	// Convert transcription data to SRT format using subsrt-ts
	function convertToSRT(): string {
		if (!transcriptionData?.transcription?.length) return '';

		// Transform transcription data to subsrt format
		const captions = transcriptionData.transcription.map((segment, index) => {
			// Convert timestamp format from "hh:mm:ss,mmm" to milliseconds
			const startMs = timestampToMs(segment.timestamps.from);
			const endMs = timestampToMs(segment.timestamps.to);

			return {
				type: 'caption' as const,
				index: index + 1,
				start: startMs,
				end: endMs,
				duration: endMs - startMs,
				content: segment.text.trim(),
				text: segment.text.trim()
			};
		});

		// Generate SRT content using subsrt-ts
		return subsrt.build(captions, { format: 'srt' });
	}

	// Helper function to convert SRT timestamp format to milliseconds
	function timestampToMs(timestamp: string): number {
		// timestamp format: "hh:mm:ss,mmm"
		const [time, ms] = timestamp.split(',');
		const [hours, minutes, seconds] = time.split(':').map(Number);

		return (hours * 3600 + minutes * 60 + seconds) * 1000 + Number(ms);
	}

	async function copyToClipboard() {
		try {
			const contentToCopy = activeTab === 'text' ? text : convertToSRT();
			await navigator.clipboard.writeText(contentToCopy);
			hasCopied = true;
			setTimeout(() => {
				hasCopied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy to clipboard:', err);
		}
	}
</script>

<div class="result-wrapper">
	<div class="result-header">
		<div class="result-tabs">
			{#if transcriptionData?.transcription?.length}
				<button
					class="tab"
					class:active={activeTab === 'text'}
					onclick={() => (activeTab = 'text')}
				>
					Text
				</button>
				<button class="tab" class:active={activeTab === 'srt'} onclick={() => (activeTab = 'srt')}>
					SRT
				</button>
			{:else}
				<span class="result-label"><FileTextIcon /> Output</span>
			{/if}
		</div>

		<button class="copy-btn" onclick={copyToClipboard} class:copied={hasCopied}>
			{#if hasCopied}
				<CheckCircleIcon /> Copied
			{:else}
				<ClipboardIcon /> Copy
			{/if}
		</button>
	</div>

	<div class="result-body">
		{#if !transcriptionData?.transcription?.length || activeTab === 'text'}
			<p class="result-text">{text}</p>
		{:else if activeTab === 'srt' && transcriptionData?.transcription?.length}
			<pre class="srt-preview">{convertToSRT()}</pre>
		{/if}
	</div>
</div>

<style>
	.result-wrapper {
		animation: fadeIn 0.25s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--sp-3);
		gap: var(--sp-3);
	}

	.result-tabs {
		display: flex;
		align-items: center;
		gap: var(--sp-1);
	}

	.result-label {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.result-label :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}

	.tab {
		padding: 0.25rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		background: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-family: var(--font-family-primary);
		transition:
			color 0.15s,
			background 0.15s,
			border-color 0.15s;
	}

	.tab:hover {
		background: var(--color-background-secondary);
	}

	.tab.active {
		color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
		border-color: var(--color-primary);
	}

	.copy-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		background: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-family: var(--font-family-primary);
		transition:
			color 0.15s,
			border-color 0.15s;
	}

	.copy-btn :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}

	.copy-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-text-primary);
	}

	.copy-btn.copied {
		color: var(--color-success, #16a34a);
		border-color: var(--color-success, #16a34a);
	}

	.result-body {
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--sp-4);
		max-height: 400px;
		overflow-y: auto;
	}

	.result-text {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--color-text-primary);
		white-space: pre-wrap;
		word-break: break-word;
	}

	.srt-preview {
		margin: 0;
		font-family: monospace;
		font-size: 0.8125rem;
		line-height: 1.5;
		white-space: pre-wrap;
		color: var(--color-text-primary);
	}

	.result-body::-webkit-scrollbar {
		width: 5px;
	}

	.result-body::-webkit-scrollbar-track {
		background: transparent;
	}

	.result-body::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: 3px;
	}

	@media (max-width: 480px) {
		.result-header {
			flex-direction: column;
			align-items: stretch;
		}

		.result-tabs {
			width: 100%;
		}

		.tab {
			flex: 1;
			text-align: center;
		}
	}
</style>
