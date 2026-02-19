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
	<h3>
		<span class="title-icon"><MusicIcon /></span>
		Choose Audio Source
	</h3>

	<div class="option-group">
		<label class="option-label" class:selected={transcribeMode === 'upload'}>
			<input
				type="radio"
				name="transcribeMode"
				value="upload"
				checked={transcribeMode === 'upload'}
				onchange={() => handleModeChange('upload')}
				{disabled}
			/>
			<div class="option-content">
				<div class="option-header">
					<span class="option-icon"><FolderIcon /></span>
					<strong>Local File</strong>
				</div>
				<small>Select an audio file from your device (.mp3, .wav, .m4a)</small>
			</div>
		</label>

		<label class="option-label" class:selected={transcribeMode === 'record'}>
			<input
				type="radio"
				name="transcribeMode"
				value="record"
				checked={transcribeMode === 'record'}
				onchange={() => handleModeChange('record')}
				{disabled}
			/>
			<div class="option-content">
				<div class="option-header">
					<span class="option-icon"><MicIcon /></span>
					<strong>Record Audio</strong>
				</div>
				<small>Record audio directly from your microphone</small>
			</div>
		</label>

		<div class="or-divider">
			<span>or</span>
		</div>

		<label class="option-label demo-option" class:selected={transcribeMode === 'demo'}>
			<input
				type="radio"
				name="transcribeMode"
				value="demo"
				checked={transcribeMode === 'demo'}
				onchange={() => handleModeChange('demo')}
				{disabled}
			/>
			<div class="option-content">
				<strong>Demo File</strong>
				<small><a href={resolve('/rich.mp3')} target="_blank">Listen →</a></small>
			</div>
		</label>
	</div>

	{#if transcribeMode === 'upload'}
		<FileUpload bind:selectedFile {onFileSelect} {disabled} />
	{:else if transcribeMode === 'record'}
		<AudioRecorder bind:transcribeMode bind:selectedFile {onFileSelect} {disabled} />
	{/if}
</div>

<style>
	.transcribe-options {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		margin-bottom: 1.25rem;
	}

	.transcribe-options h3 {
		margin: 0 0 1.25rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.title-icon {
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.title-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.option-group {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		margin-bottom: 1rem;
	}

	.option-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		background: var(--color-background-main);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.option-label:hover {
		border-color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
	}

	.option-label.selected {
		border-color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
		box-shadow: 0 0 0 3px var(--color-accent-primary-alpha);
	}

	.option-label input[type='radio'] {
		width: 18px;
		height: 18px;
		margin: 0;
		accent-color: var(--color-primary);
		cursor: pointer;
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.option-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.option-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-secondary);
	}

	.option-icon :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.option-content strong {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.option-content small {
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
		margin-left: 1.625rem;
	}

	.option-content small a {
		color: var(--color-primary);
		font-weight: 500;
		text-decoration: none;
		transition: color 0.15s;
	}

	.option-content small a:hover {
		text-decoration: underline;
	}

	.or-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0.25rem 0;
		position: relative;
	}

	.or-divider span {
		background: var(--color-card);
		padding: 0 0.75rem;
		font-weight: 500;
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		position: relative;
	}

	.or-divider::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--color-border-light);
		top: 50%;
	}

	.demo-option {
		padding: 0.625rem 1rem !important;
	}

	.demo-option .option-content {
		flex-direction: row !important;
		align-items: center;
		gap: 0.5rem !important;
	}

	.demo-option strong {
		font-size: 0.875rem !important;
	}

	.demo-option small {
		margin-left: 0 !important;
		font-size: 0.8125rem !important;
	}

	@media (max-width: 600px) {
		.transcribe-options {
			padding: 1rem;
		}

		.option-label {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.option-content small {
			margin-left: 0;
		}
	}
</style>
