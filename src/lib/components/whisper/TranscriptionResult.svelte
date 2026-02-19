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
	<div class="result">
		<div class="result-content">
			<div class="result-header">
				<h3>
					<span class="header-icon"><FileTextIcon /></span>
					Transcription Result
				</h3>
				<div class="result-actions">
					{#if transcriptionData?.transcription?.length}
						<div class="tab-selectors">
							<button class:active={activeTab === 'text'} onclick={() => (activeTab = 'text')}>
								Text
							</button>
							<button class:active={activeTab === 'srt'} onclick={() => (activeTab = 'srt')}>
								SRT
							</button>
						</div>
					{/if}

					<button class="copy-btn" onclick={copyToClipboard} class:copied={hasCopied}>
						{#if hasCopied}
							<span class="copy-icon"><CheckCircleIcon /></span>
							Copied!
						{:else}
							<span class="copy-icon"><ClipboardIcon /></span>
							Copy
						{/if}
					</button>
				</div>
			</div>

			<div class="result-text-container">
				{#if !transcriptionData?.transcription?.length || activeTab === 'text'}
					<p class="result-text">{text}</p>
				{:else if activeTab === 'srt' && transcriptionData?.transcription?.length}
					<pre class="srt-preview">{convertToSRT()}</pre>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.result-wrapper {
		display: flex;
		margin: 1.5rem 0;
		width: 100%;
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.result {
		position: relative;
		width: 100%;
	}

	.result-content {
		padding: 1.5rem;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
		flex-wrap: wrap;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border-light);
	}

	.result-content h3 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.header-icon {
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.header-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.result-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	/* Tab selectors */
	.tab-selectors {
		display: flex;
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.tab-selectors button {
		padding: 0.5rem 1rem;
		background: var(--color-card);
		border: none;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		transition: all 0.15s ease;
		font-family: inherit;
	}

	.tab-selectors button:not(:last-child) {
		border-right: 1px solid var(--color-border-light);
	}

	.tab-selectors button:hover:not(.active) {
		background: var(--color-accent-primary-alpha);
	}

	.tab-selectors button.active {
		background: var(--color-primary);
		color: white;
	}

	/* Result text container */
	.result-text-container {
		background: var(--color-accent-primary-alpha);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		min-height: 100px;
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

	/* SRT Preview */
	.srt-preview {
		font-family: monospace;
		font-size: 0.875rem;
		line-height: 1.5;
		white-space: pre-wrap;
		background: var(--color-card);
		padding: 1rem;
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-sm);
		overflow-x: auto;
		margin: 0;
		color: var(--color-text-primary);
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: opacity 0.15s ease;
		font-family: inherit;
	}

	.copy-btn:hover {
		opacity: 0.85;
	}

	.copy-btn.copied {
		background: var(--color-success);
	}

	.copy-icon {
		display: flex;
		align-items: center;
	}

	.copy-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	/* Custom scrollbar */
	.result-text-container::-webkit-scrollbar {
		width: 6px;
	}

	.result-text-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.result-text-container::-webkit-scrollbar-thumb {
		background: var(--color-border-light);
		border-radius: 3px;
	}

	.result-text-container::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-secondary);
	}

	@media (max-width: 600px) {
		.result-content {
			padding: 1.25rem;
		}

		.result-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.result-content h3 {
			font-size: 1rem;
		}

		.result-actions {
			width: 100%;
			flex-direction: column;
			align-items: stretch;
			gap: 0.5rem;
		}

		.tab-selectors {
			width: 100%;
		}

		.tab-selectors button {
			flex: 1;
		}

		.copy-btn {
			width: 100%;
			justify-content: center;
		}

		.result-text-container {
			padding: 1rem;
		}
	}
</style>
