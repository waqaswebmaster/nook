<script lang="ts">
	import CardInterface from '$lib/components/common/CardInterface.svelte';
	import ContentArea from '$lib/components/common/ContentArea.svelte';
	import Toolbar from '$lib/components/common/Toolbar.svelte';
	import { resolve } from '$app/paths';
	import { locales } from '$lib/i18n-utils';

	interface Language {
		code: string;
		name: string;
		nativeName: string;
	}

	// Language metadata - this should match the locales from Wuchale config
	const languageMetadata: Record<string, { name: string; nativeName: string }> = {
		en: { name: 'English', nativeName: 'English' },
		es: { name: 'Spanish', nativeName: 'Español' },
		ja: { name: 'Japanese', nativeName: '日本語' },
		sv: { name: 'Swedish', nativeName: 'Svenska' },
		uk: { name: 'Ukrainian', nativeName: 'Українська' }
	};

	// Create available languages from Wuchale locales
	const availableLanguages: Language[] = locales.map((code) => ({
		code,
		name: languageMetadata[code]?.name || code.toUpperCase(),
		nativeName: languageMetadata[code]?.nativeName || code.toUpperCase()
	}));
</script>

<svelte:head>
	<title>Language Settings - Nook</title>
	<meta name="description" content="Change the language settings for the Nook application" />
</svelte:head>

<CardInterface>
	<Toolbar modelInfo="Language Settings"></Toolbar>

	<ContentArea>
		<div class="language-settings">
			<div class="settings-section">
				<h2>Select Language</h2>
				<p class="description">
					Choose your preferred language for the interface. Click on a language to switch to that
					version of the application.
				</p>

				<div class="language-grid">
					{#each availableLanguages as language (language.code)}
						<a
							href={resolve(language.code === 'en' ? '/' : `/${language.code}/`)}
							class="language-card"
						>
							<div class="language-code">{language.code.toUpperCase()}</div>
							<div class="language-info">
								<div class="language-name">{language.name}</div>
								<div class="language-native">{language.nativeName}</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</ContentArea>
</CardInterface>

<style>
	.language-settings {
		max-width: 800px;
		margin: 0 auto;
	}

	.settings-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
	}

	.description {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}

	.language-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 0.75rem;
		margin: 1rem 0;
	}

	.language-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 1rem;
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-xs);
		text-decoration: none;
		transition: all 0.15s ease;
		cursor: pointer;
	}

	.language-card:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
	}

	.language-code {
		padding: 0.375rem 0.75rem;
		background: var(--color-accent-primary-alpha);
		color: var(--color-primary);
		border-radius: var(--radius-sm);
		font-weight: 600;
		font-size: 0.8125rem;
	}

	.language-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		text-align: center;
	}

	.language-name {
		font-weight: 600;
		color: var(--color-text-primary);
		font-size: 0.9375rem;
	}

	.language-native {
		font-weight: 400;
		color: var(--color-text-tertiary);
		font-size: 0.8125rem;
	}

	@media (max-width: 600px) {
		.language-grid {
			grid-template-columns: 1fr;
		}

		h2 {
			font-size: 1.125rem;
		}
	}

	@media (max-width: 400px) {
		.language-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.language-card {
			padding: 1rem 0.75rem;
			gap: 0.5rem;
		}
	}
</style>
