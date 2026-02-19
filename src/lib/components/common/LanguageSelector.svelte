<script lang="ts">
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';

	interface Language {
		code: string;
		name: string;
		nativeName: string;
	}

	interface Props {
		languages: Language[];
		selectedLanguage: string;
		onLanguageChange: (languageCode: string) => void;
	}

	let { languages, selectedLanguage, onLanguageChange }: Props = $props();

	let isExpanded = $state(false);

	function handleLanguageChange(languageCode: string) {
		onLanguageChange(languageCode);
		isExpanded = false;
	}

	function getSelectedLanguage() {
		return languages.find((language) => language.code === selectedLanguage);
	}

	/*
	onMount(() => {
		if (window.document) {
			window.document.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (window.document) {
			window.document.removeEventListener('click', handleClickOutside);
		}
	});
	*/
</script>

<div class="language-selector-container">
	<button
		class="language-selector-button"
		class:expanded={isExpanded}
		onclick={() => (isExpanded = !isExpanded)}
	>
		<span class="selected-language">
			{getSelectedLanguage()?.name || 'Select Language'}
		</span>
		<span class="arrow-icon" class:rotated={isExpanded}>
			<ChevronDownIcon />
		</span>
	</button>

	{#if isExpanded}
		<div class="language-dropdown">
			{#each languages as language (language.code)}
				<div class="language-option" class:selected={language.code === selectedLanguage}>
					<button class="language-btn" onclick={() => handleLanguageChange(language.code)}>
						<div class="language-info">
							<span class="language-name">{language.name}</span>
							<span class="language-native">{language.nativeName}</span>
						</div>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-selector-container {
		position: relative;
		width: 100%;
		min-width: 200px;
	}

	.language-selector-button {
		width: 100%;
		padding: var(--sp-2) var(--sp-3);
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all var(--transition-fast);
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: var(--shadow-xs);
		font-family: var(--font-family-primary);
		border-radius: var(--radius-md);
		color: var(--color-text-primary);
	}

	.language-selector-button:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	.language-selector-button.expanded {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-primary-subtle);
	}

	.selected-language {
		color: var(--color-text-primary);
		text-align: left;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.arrow-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-tertiary);
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.arrow-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.arrow-icon.rotated {
		transform: rotate(180deg);
	}

	.language-dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
		max-height: 300px;
		overflow-y: auto;
		z-index: 100;
		animation: dropdownOpen 0.15s ease-out;
	}

	@keyframes dropdownOpen {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.language-option {
		border-bottom: 1px solid var(--color-border-light);
		transition: background 0.15s;
	}

	.language-option:last-child {
		border-bottom: none;
	}

	.language-option:hover {
		background: var(--color-background-secondary);
	}

	.language-option.selected {
		background: var(--color-primary-subtle);
	}

	.language-btn {
		width: 100%;
		padding: var(--sp-2) var(--sp-3);
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		font-family: var(--font-family-primary);
	}

	.language-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.language-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.language-native {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--color-text-secondary);
	}

	.language-dropdown::-webkit-scrollbar {
		width: 6px;
	}

	.language-dropdown::-webkit-scrollbar-track {
		background: var(--color-background-secondary);
	}

	.language-dropdown::-webkit-scrollbar-thumb {
		background: var(--color-text-disabled);
		border-radius: var(--radius-full);
	}

	@media (max-width: 768px) {
		.language-selector-container {
			min-width: auto;
		}
	}
</style>
