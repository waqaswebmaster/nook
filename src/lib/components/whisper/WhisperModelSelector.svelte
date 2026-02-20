<script lang="ts">
	import LoadingProgress from '$lib/components/common/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/common/ErrorDisplay.svelte';
	import { isOPFSSupported } from '$lib/download-utils';
	import CheckIcon from 'virtual:icons/lucide/check';
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import { PUBLIC_DISABLE_OPFS } from '$env/static/public';

	interface Props {
		selectedModel: string;
		availableModels: Array<{ path: string; name: string }>;
		isLoading?: boolean;
		isReady?: boolean;
		loadedModel?: string;
		error?: boolean;
		downloadProgress?: number;
		previousDownloadProgress?: number;
		usingCachedModel?: boolean;
		hasProgressTracking?: boolean;
		onLoadModel: () => void;
		onChangeModel: () => void;
		onRetry: () => void;
	}

	let {
		selectedModel = $bindable(),
		availableModels,
		isLoading = false,
		isReady = false,
		loadedModel = '',
		error = false,
		downloadProgress = 0,
		previousDownloadProgress = 0,
		usingCachedModel = false,
		hasProgressTracking = true,
		onLoadModel,
		onChangeModel,
		onRetry
	}: Props = $props();

	let opfsSupported = isOPFSSupported(PUBLIC_DISABLE_OPFS === 'true');

	const isCurrentModelReady = $derived.by(() => {
		if (!isReady || !loadedModel) return false;
		const selectedModelObj = availableModels.find((m) => m.path === selectedModel);
		return selectedModelObj?.name === loadedModel;
	});

	// Custom dropdown state
	let open = $state(false);
	let focusedIndex = $state(-1);
	let triggerEl: HTMLButtonElement | undefined = $state();
	let listEl: HTMLUListElement | undefined = $state();

	const selectedLabel = $derived(availableModels.find((m) => m.path === selectedModel)?.name ?? '');

	function toggle() {
		if (isLoading) return;
		open = !open;
		if (open) {
			focusedIndex = availableModels.findIndex((m) => m.path === selectedModel);
			// Focus first option after DOM update
			requestAnimationFrame(() => {
				const items = listEl?.querySelectorAll('[role="option"]');
				if (items && focusedIndex >= 0) (items[focusedIndex] as HTMLElement)?.focus();
			});
		}
	}

	function select(path: string) {
		selectedModel = path;
		open = false;
		triggerEl?.focus();
	}

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			if (!open) toggle();
		}
	}

	function handleListKeydown(e: KeyboardEvent) {
		const count = availableModels.length;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			focusedIndex = (focusedIndex + 1) % count;
			focusItem();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			focusedIndex = (focusedIndex - 1 + count) % count;
			focusItem();
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			if (focusedIndex >= 0) select(availableModels[focusedIndex].path);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			open = false;
			triggerEl?.focus();
		} else if (e.key === 'Home') {
			e.preventDefault();
			focusedIndex = 0;
			focusItem();
		} else if (e.key === 'End') {
			e.preventDefault();
			focusedIndex = count - 1;
			focusItem();
		} else if (e.key === 'Tab') {
			open = false;
		}
	}

	function focusItem() {
		requestAnimationFrame(() => {
			const items = listEl?.querySelectorAll('[role="option"]');
			if (items && focusedIndex >= 0) (items[focusedIndex] as HTMLElement)?.focus();
		});
	}

	function handleClickOutside(e: MouseEvent) {
		if (open && triggerEl && !triggerEl.closest('.dropdown')?.contains(e.target as Node)) {
			open = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="model-selection">
	<div class="model-row">
		<!-- Custom dropdown -->
		<div class="dropdown" class:open class:disabled={isLoading}>
			<button
				bind:this={triggerEl}
				class="dropdown-trigger"
				type="button"
				role="combobox"
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-label="Select model"
				disabled={isLoading}
				onclick={toggle}
				onkeydown={handleTriggerKeydown}
			>
				<span class="dropdown-value">{selectedLabel}</span>
				<span class="dropdown-caret" class:open><ChevronDownIcon /></span>
			</button>

			{#if open}
				<ul
					bind:this={listEl}
					class="dropdown-menu"
					role="listbox"
					aria-label="Models"
					onkeydown={handleListKeydown}
				>
					{#each availableModels as model, i (model.path)}
						<li
							role="option"
							tabindex="-1"
							aria-selected={model.path === selectedModel}
							class="dropdown-item"
							class:selected={model.path === selectedModel}
							class:focused={i === focusedIndex}
							onclick={() => select(model.path)}
							onmouseenter={() => (focusedIndex = i)}
						>
							<span class="item-label">{model.name}</span>
							{#if model.path === selectedModel}
								<span class="item-check"><CheckIcon /></span>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		{#if !isReady}
			<button onclick={onLoadModel} disabled={isLoading} class="load-btn">
				{isLoading ? 'Loading…' : 'Load Model'}
			</button>
		{:else}
			{#if isCurrentModelReady}
				<span class="ready-pill"><CheckIcon /> Ready</span>
			{/if}
			<button onclick={onChangeModel} disabled={isLoading} class="change-btn">
				{isLoading ? 'Changing…' : 'Change'}
			</button>
		{/if}
	</div>

	{#if error}
		<ErrorDisplay
			message="Failed to load transcription model. Please try again."
			buttonText="Retry"
			{onRetry}
			isRetrying={isLoading}
		/>
	{:else if isLoading}
		<LoadingProgress
			topMargin={true}
			title={usingCachedModel
				? 'Loading Cached Model'
				: opfsSupported
					? 'Downloading Model'
					: 'Loading Model'}
			progress={downloadProgress}
			previousProgress={previousDownloadProgress}
			percentageText={/* @wc-include */ hasProgressTracking
				? `${downloadProgress}% Complete`
				: 'Loading...'}
			showPercentage={true}
			message={usingCachedModel
				? 'Loading model from local cache...'
				: opfsSupported
					? 'The transcription model is being downloaded to your browser.'
					: 'Loading model... Progress tracking not available in this browser.'}
		/>
	{/if}
</div>

<style>
	.model-selection {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
	}

	.model-row {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		flex-wrap: wrap;
	}

	/* ── Custom Dropdown ── */
	.dropdown {
		position: relative;
		flex: 1;
		min-width: 180px;
	}

	.dropdown.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	.dropdown-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 44px;
		padding: 0 var(--sp-3);
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		color: var(--color-text-primary);
		font-size: 0.875rem;
		font-weight: 500;
		font-family: var(--font-family-primary);
		cursor: pointer;
		transition:
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	.dropdown-trigger:hover {
		border-color: var(--color-text-tertiary);
	}

	.dropdown-trigger:focus-visible {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-accent-primary-alpha);
	}

	.dropdown.open .dropdown-trigger {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-accent-primary-alpha);
	}

	.dropdown-value {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.dropdown-caret {
		display: flex;
		align-items: center;
		color: var(--color-text-tertiary);
		transition: transform var(--transition-fast);
		flex-shrink: 0;
		margin-left: var(--sp-2);
	}

	.dropdown-caret.open {
		transform: rotate(180deg);
	}

	.dropdown-caret :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	/* ── Menu ── */
	.dropdown-menu {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		z-index: var(--z-dropdown);
		margin: 0;
		padding: var(--sp-1) 0;
		list-style: none;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
		max-height: 240px;
		overflow-y: auto;
		animation: menuIn 0.12s ease-out;
	}

	@keyframes menuIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.dropdown-menu::-webkit-scrollbar {
		width: 5px;
	}

	.dropdown-menu::-webkit-scrollbar-thumb {
		background: var(--color-border-light);
		border-radius: 3px;
	}

	/* ── Item ── */
	.dropdown-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--sp-2) var(--sp-3);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		cursor: pointer;
		border-radius: 0;
		transition:
			background var(--transition-fast),
			color var(--transition-fast);
	}

	.dropdown-item:focus {
		outline: none;
	}

	.dropdown-item.focused,
	.dropdown-item:hover {
		background: var(--color-accent-primary-alpha);
		color: var(--color-text-primary);
	}

	.dropdown-item.selected {
		color: var(--color-primary);
		font-weight: 600;
	}

	.item-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-check {
		display: flex;
		align-items: center;
		color: var(--color-primary);
		flex-shrink: 0;
		margin-left: var(--sp-2);
	}

	.item-check :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}

	/* ── Action buttons ── */
	.load-btn {
		height: 44px;
		padding: 0 var(--sp-5);
		background: var(--color-primary);
		color: #fff;
		border: none;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font-family-primary);
		white-space: nowrap;
		transition: background var(--transition-fast);
	}

	.load-btn:hover:not(:disabled) {
		filter: brightness(1.05);
	}

	.load-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ready-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-primary);
		background: var(--color-accent-primary-alpha);
		border-radius: 999px;
		white-space: nowrap;
	}

	.ready-pill :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}

	.change-btn {
		height: 44px;
		padding: 0 var(--sp-4);
		background: transparent;
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		font-family: var(--font-family-primary);
		white-space: nowrap;
		transition:
			border-color var(--transition-fast),
			color var(--transition-fast);
	}

	.change-btn:hover:not(:disabled) {
		border-color: var(--color-primary);
		color: var(--color-text-primary);
	}

	.change-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 480px) {
		.model-row {
			flex-direction: column;
			align-items: stretch;
		}

		.load-btn,
		.change-btn {
			width: 100%;
			text-align: center;
		}
	}
</style>
