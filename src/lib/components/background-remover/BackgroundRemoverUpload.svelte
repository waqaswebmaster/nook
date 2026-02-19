<script lang="ts">
	import FolderIcon from 'virtual:icons/lucide/folder';
	import ImageIcon from 'virtual:icons/lucide/image';
	import StarIcon from 'virtual:icons/lucide/star';
	import Trash2Icon from 'virtual:icons/lucide/trash-2';
	import UploadIcon from 'virtual:icons/lucide/upload';
	import ZapIcon from 'virtual:icons/lucide/zap';

	interface Props {
		mode: 'single' | 'batch';
		selectedFile?: File | null;
		selectedFiles?: File[];
		onFileSelect?: (file: File) => void;
		onFilesSelect?: (files: File[]) => void;
		onExampleUse?: () => void;
		disabled?: boolean;
	}

	let {
		mode = 'single',
		selectedFile = $bindable(),
		selectedFiles = $bindable([]),
		onFileSelect,
		onFilesSelect,
		onExampleUse,
		disabled = false
	}: Props = $props();

	let fileInputElement: HTMLInputElement | undefined = $state();
	let isDragging = $state(false);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			if (mode === 'single') {
				const file = target.files[0];
				selectedFile = file;
				onFileSelect?.(file);
			} else {
				const filesArray = Array.from(target.files);
				selectedFiles = filesArray;
				onFilesSelect?.(filesArray);
			}
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (disabled) return;
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;

		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			isDragging = false;
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		if (disabled) return;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			if (mode === 'single') {
				const file = files[0];
				selectedFile = file;
				onFileSelect?.(file);
			} else {
				const filesArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
				if (filesArray.length > 0) {
					selectedFiles = filesArray;
					onFilesSelect?.(filesArray);
				}
			}
		}
	}

	function openFileDialog() {
		fileInputElement?.click();
	}

	function removeFile(index: number) {
		if (mode === 'batch') {
			const newFiles = selectedFiles.filter((_, i) => i !== index);
			selectedFiles = newFiles;
			onFilesSelect?.(newFiles);
		}
	}

	function clearAllFiles() {
		if (mode === 'single') {
			selectedFile = null;
		} else {
			selectedFiles = [];
			onFilesSelect?.([]);
		}
	}

	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		if (img.src.startsWith('blob:')) {
			URL.revokeObjectURL(img.src);
		}
	}

	// Computed properties for conditional rendering
	let hasFiles = $derived(mode === 'single' ? selectedFile !== null : selectedFiles.length > 0);
</script>

<div class="background-remover-upload" class:batch-mode={mode === 'batch'}>
	<h3>
		<span class="title-icon"><FolderIcon /></span>
		{mode === 'single' ? 'Choose Image' : 'Batch Processing'}
	</h3>

	<input
		bind:this={fileInputElement}
		type="file"
		accept="image/*"
		multiple={mode === 'batch'}
		onchange={handleFileSelect}
		id={mode === 'single' ? 'image-file' : 'batch-image-files'}
		{disabled}
	/>

	<div
		class="file-upload-label"
		class:disabled
		class:dragging={isDragging}
		class:has-file={hasFiles}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={openFileDialog}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
		role="button"
		tabindex="0"
	>
		<div class="upload-content">
			<span class="upload-icon">
				<UploadIcon />
			</span>
			<p class="upload-text">
				{#if mode === 'single'}
					{#if selectedFile}
						<span class="file-icon"><ImageIcon /></span>
						{selectedFile.name}
					{:else}
						Drop your image here
					{/if}
				{:else if selectedFiles.length > 0}
					<span class="file-icon"><FolderIcon /></span>
					{selectedFiles.length} image{selectedFiles.length === 1 ? '' : 's'} selected
				{:else}
					Drop multiple images here
				{/if}
			</p>
			<p class="upload-hint">
				{#if hasFiles}
					{mode === 'single' ? 'Click to change image' : 'Click to add more images'}
				{:else}
					or click to browse • JPG, PNG, WebP supported
				{/if}
			</p>
		</div>
	</div>

	{#if mode === 'single' && !hasFiles}
		<div class="or-divider">
			<span>OR</span>
		</div>

		<button class="example-button" onclick={onExampleUse} {disabled}>
			<span class="example-icon"><StarIcon /></span>
			Try Example Image
		</button>
	{/if}

	{#if mode === 'batch' && selectedFiles.length > 0}
		<div class="selected-files">
			<div class="files-header">
				<h4>Selected Images ({selectedFiles.length})</h4>
				<button class="clear-all-btn" onclick={clearAllFiles} {disabled}>
					<span class="clear-icon"><Trash2Icon /></span>
					Clear All
				</button>
			</div>

			<div class="files-grid">
				{#each selectedFiles as file, index (file.name + file.size)}
					<div class="file-item">
						<div class="file-preview">
							<img src={URL.createObjectURL(file)} alt={file.name} onload={handleImageLoad} />
						</div>
						<div class="file-info">
							<div class="file-name" title={file.name}>{file.name}</div>
							<div class="file-size">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
						</div>
						<button
							class="remove-file-btn"
							onclick={() => removeFile(index)}
							{disabled}
							aria-label={`Remove ${file.name}`}
						>
							×
						</button>
					</div>
				{/each}
			</div>

			<div class="batch-actions">
				<button
					class="start-batch-btn primary-button"
					onclick={() => onFilesSelect?.(selectedFiles)}
					{disabled}
				>
					<span class="btn-icon"><ZapIcon /></span>
					Process {selectedFiles.length} Image{selectedFiles.length === 1 ? '' : 's'}
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.background-remover-upload {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		padding: 2rem;
		box-shadow: var(--shadow-sm);
		margin-bottom: 1.5rem;
	}

	.background-remover-upload h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.title-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-secondary);
	}

	.title-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.background-remover-upload input[type='file'] {
		display: none;
	}

	.file-upload-label {
		display: block;
		position: relative;
		min-height: 180px;
		background: var(--color-card);
		border: 2px dashed var(--color-border-light);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
		overflow: hidden;
		margin-bottom: 1.5rem;
	}

	.file-upload-label:hover:not(.disabled) {
		border-color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
	}

	.file-upload-label.has-file {
		border-style: solid;
		border-color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
	}

	.file-upload-label.disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.file-upload-label.dragging {
		border-color: var(--color-primary);
		border-style: solid;
		background: var(--color-accent-primary-alpha);
		box-shadow: var(--shadow-md);
	}

	.upload-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		height: 100%;
		min-height: 180px;
	}

	.upload-icon {
		color: var(--color-text-tertiary);
		margin-bottom: 1rem;
		display: flex;
		font-size: 40px;
	}

	.upload-icon :global(svg) {
		width: 40px;
		height: 40px;
	}

	.upload-text {
		font-size: 1rem;
		color: var(--color-text-primary);
		margin: 0 0 0.5rem 0;
		text-align: center;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.file-icon {
		font-size: 1.125rem;
		display: flex;
		align-items: center;
		color: var(--color-text-secondary);
	}

	.file-icon :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.upload-hint {
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
		margin: 0;
		text-align: center;
	}

	.or-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 1rem 0;
		position: relative;
	}

	.or-divider span {
		background: var(--color-card);
		padding: 0 1rem;
		font-weight: 500;
		font-size: 0.8125rem;
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
		transform: translateY(-50%);
	}

	.example-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1.5rem;
		background: transparent;
		color: var(--color-primary);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 500;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
	}

	.example-button:hover:not(:disabled) {
		background: var(--color-accent-primary-alpha);
	}

	.example-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.example-icon {
		font-size: 1.125rem;
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.example-icon :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	/* Batch Mode Specific Styles */
	.selected-files {
		margin-top: 1.5rem;
	}

	.files-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--color-border-light);
	}

	.files-header h4 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.clear-all-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		background: transparent;
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-size: 0.8125rem;
		font-weight: 500;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
	}

	.clear-all-btn:hover:not(:disabled) {
		color: var(--color-danger);
		border-color: var(--color-danger);
	}

	.clear-all-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.clear-icon {
		font-size: 0.875rem;
		display: flex;
		align-items: center;
	}

	.clear-icon :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}

	.files-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.file-item {
		display: flex;
		flex-direction: column;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		overflow: hidden;
		position: relative;
		transition: box-shadow 0.2s;
	}

	.file-item:hover {
		box-shadow: var(--shadow-md);
	}

	.file-preview {
		width: 100%;
		height: 120px;
		overflow: hidden;
		background: var(--color-card);
		border-bottom: 1px solid var(--color-border-light);
	}

	.file-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.file-info {
		padding: 0.75rem;
		flex: 1;
	}

	.file-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
		margin-bottom: 0.25rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-size {
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
	}

	.remove-file-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 24px;
		height: 24px;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
		line-height: 1;
	}

	.remove-file-btn:hover:not(:disabled) {
		background: rgba(0, 0, 0, 0.8);
	}

	.remove-file-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.batch-actions {
		display: flex;
		justify-content: center;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border-light);
	}

	.start-batch-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-weight: 500;
		transition: opacity 0.2s;
		font-family: var(--font-family-primary);
	}

	.start-batch-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.start-batch-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
	}

	.btn-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (max-width: 768px) {
		.background-remover-upload {
			padding: 1.5rem;
		}

		.files-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 0.75rem;
		}

		.files-header {
			flex-direction: column;
			gap: 0.75rem;
			align-items: stretch;
		}

		.clear-all-btn {
			align-self: center;
		}
	}

	@media (max-width: 600px) {
		.background-remover-upload {
			padding: 1.25rem;
		}

		.upload-content {
			padding: 1.5rem;
			min-height: 150px;
		}

		.upload-text {
			font-size: 0.9375rem;
		}

		.upload-hint {
			font-size: 0.8125rem;
		}

		.example-button {
			font-size: 0.875rem;
			padding: 0.625rem 1.25rem;
		}

		.files-grid {
			grid-template-columns: 1fr 1fr;
		}

		.start-batch-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
