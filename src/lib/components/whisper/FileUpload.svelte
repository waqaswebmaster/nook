<script lang="ts">
	import FileAudioIcon from 'virtual:icons/lucide/file-audio';
	import UploadIcon from 'virtual:icons/lucide/upload';
	import XIcon from 'virtual:icons/lucide/x';

	interface Props {
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		disabled?: boolean;
	}

	let { selectedFile = $bindable(), onFileSelect, disabled = false }: Props = $props();

	let fileInput: HTMLInputElement | undefined = $state();
	let dragOver = $state(false);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			selectedFile = input.files[0];
			onFileSelect(input.files[0]);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
			selectedFile = event.dataTransfer.files[0];
			onFileSelect(event.dataTransfer.files[0]);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function clearFile() {
		selectedFile = null;
		if (fileInput) {
			fileInput.value = '';
		}
	}
</script>

<div class="file-upload">
	{#if selectedFile}
		<div class="file-selected">
			<div class="file-info">
				<span class="file-icon"><FileAudioIcon /></span>
				<div class="file-details">
					<strong>{selectedFile.name}</strong>
					<small>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</small>
				</div>
			</div>
			<button class="clear-button" onclick={clearFile} {disabled}>
				<XIcon />
			</button>
		</div>
	{:else}
		<div
			class="upload-area"
			class:drag-over={dragOver}
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			role="button"
			tabindex="0"
		>
			<span class="upload-icon"><UploadIcon /></span>
			<p><strong>Drag & Drop Audio File</strong></p>
			<p class="upload-hint">or</p>
			<button onclick={() => fileInput?.click()} {disabled} class="browse-button">
				Browse Files
			</button>
			<input
				bind:this={fileInput}
				type="file"
				accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
				onchange={handleFileSelect}
				style="display: none;"
			/>
		</div>
	{/if}
</div>

<style>
	.file-upload {
		margin-top: 1rem;
	}

	.upload-area {
		border: 2px dashed var(--color-border-light);
		padding: 2rem;
		text-align: center;
		background: var(--color-card);
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s;
		position: relative;
		border-radius: var(--radius-lg);
	}

	.upload-area.drag-over {
		background: var(--color-accent-primary-alpha);
		border-color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	.upload-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
		color: var(--color-text-tertiary);
	}

	.upload-icon :global(svg) {
		width: 2.5rem;
		height: 2.5rem;
	}

	.upload-area p {
		margin: 0.5rem 0;
		font-weight: 500;
	}

	.upload-hint {
		color: var(--color-text-tertiary);
		font-size: 0.875rem;
	}

	.browse-button {
		margin-top: 1rem;
		padding: 0.625rem 1.25rem;
		background: var(--color-primary);
		color: #fff;
		border: none;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-xs);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.2s,
			box-shadow 0.2s;
	}

	.browse-button:hover:not(:disabled) {
		box-shadow: var(--shadow-sm);
		filter: brightness(1.05);
	}

	.browse-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.file-selected {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-sm);
		padding: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: var(--radius-lg);
		animation: slideIn 0.2s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.file-icon {
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.file-icon :global(svg) {
		width: 1.75rem;
		height: 1.75rem;
	}

	.file-details {
		display: flex;
		flex-direction: column;
	}

	.file-details strong {
		font-size: 0.9375rem;
		font-weight: 600;
	}

	.file-details small {
		color: var(--color-text-tertiary);
		font-weight: 400;
	}

	.clear-button {
		padding: 0.4rem;
		background: transparent;
		border: 1px solid var(--color-border-light);
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		color: var(--color-text-tertiary);
	}

	.clear-button :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.clear-button:hover:not(:disabled) {
		background: var(--color-accent-primary-alpha);
		border-color: var(--color-primary);
		color: var(--color-text-primary);
	}

	.clear-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 600px) {
		.upload-area {
			padding: 1.5rem;
		}

		.upload-icon :global(svg) {
			width: 2rem;
			height: 2rem;
		}

		.file-selected {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.clear-button {
			width: 100%;
			padding: 0.625rem;
		}
	}
</style>
