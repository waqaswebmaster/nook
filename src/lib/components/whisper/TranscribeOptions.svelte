<script lang="ts">
	import FileUpload from './FileUpload.svelte';
	import AudioRecorder from './AudioRecorder.svelte';
	import MusicIcon from 'virtual:icons/lucide/music';
	import FolderIcon from 'virtual:icons/lucide/folder';
	import MicIcon from 'virtual:icons/lucide/mic';
	import { resolve } from '$app/paths';

	interface Props {
		transcribeMode: 'demo' | 'upload' | 'record';
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		onModeChange: (mode: 'demo' | 'upload' | 'record') => void;
		disabled?: boolean;
	}

	let {
		transcribeMode = $bindable(),
		selectedFile = $bindable(),
		onFileSelect,
		onModeChange,
		disabled = false
	}: Props = $props();

	function handleModeChange(mode: 'demo' | 'upload' | 'record') {
		onModeChange(mode);
	}
</script>

<div class="transcribe-options">
	<div class="tab-bar">
		<button
			class="tab"
			class:active={transcribeMode === 'upload'}
			onclick={() => handleModeChange('upload')}
			{disabled}
		>
			<FolderIcon /> Upload file
		</button>
		<button
			class="tab"
			class:active={transcribeMode === 'record'}
			onclick={() => handleModeChange('record')}
			{disabled}
		>
			<MicIcon /> Record
		</button>
		<button
			class="tab tab-ghost"
			class:active={transcribeMode === 'demo'}
			onclick={() => handleModeChange('demo')}
			{disabled}
		>
			<MusicIcon /> Demo
		</button>
	</div>

	{#if transcribeMode === 'demo'}
		<p class="demo-note">
			A sample audio file will be transcribed.
			<a href={resolve('/rich.mp3')} target="_blank" rel="noopener noreferrer">Listen →</a>
		</p>
	{/if}

	{#if transcribeMode === 'upload'}
		<FileUpload bind:selectedFile {onFileSelect} {disabled} />
	{:else if transcribeMode === 'record'}
		<AudioRecorder bind:transcribeMode bind:selectedFile {onFileSelect} {disabled} />
	{/if}
</div>

<style>
	.transcribe-options {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
	}

	.tab-bar {
		display: flex;
		gap: var(--sp-2);
		border-bottom: 1px solid var(--color-border);
		padding-bottom: var(--sp-2);
	}

	.tab {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.875rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		background: none;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-family: var(--font-family-primary);
		transition:
			color 0.15s,
			background 0.15s;
	}

	.tab :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}

	.tab:hover:not(:disabled) {
		color: var(--color-text-primary);
		background: var(--color-background-secondary);
	}

	.tab.active {
		color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
		font-weight: 600;
	}

	.tab:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.tab-ghost {
		margin-left: auto;
		color: var(--color-text-tertiary);
		font-style: normal;
	}

	.demo-note {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
	}

	.demo-note a {
		color: var(--color-primary);
		font-weight: 500;
		text-decoration: none;
	}

	.demo-note a:hover {
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.tab {
			padding: 0.375rem 0.625rem;
			font-size: 0.75rem;
		}
	}
</style>
