<script lang="ts">
	import '$lib/design-system.css';
	import { page } from '$app/state';
	import '@fontsource/space-grotesk/400.css';
	import '@fontsource/space-grotesk/500.css';
	import '@fontsource/space-grotesk/700.css';
	import '@fontsource/bebas-neue';
	import HomeIcon from 'virtual:icons/lucide/home';
	import MessageSquareIcon from 'virtual:icons/lucide/message-square';
	import MicIcon from 'virtual:icons/lucide/mic';
	import ImageIcon from 'virtual:icons/lucide/image';
	import GithubIcon from 'virtual:icons/lucide/github';
	import SpeechIcon from 'virtual:icons/lucide/speech';
	import CalculatorIcon from 'virtual:icons/lucide/calculator';
	import GlobeIcon from 'virtual:icons/lucide/globe';
	import SunIcon from 'virtual:icons/lucide/sun';
	import MoonIcon from 'virtual:icons/lucide/moon';
	import { Toaster } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { getCurrentLanguage, createLocalizedLink, locales } from '$lib/i18n-utils';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// Get current language from URL and generate localized navigation links
	const currentLang = $derived(getCurrentLanguage(page.url.pathname));

	// Check if a path is active
	function isActive(path: string): boolean {
		// Exact match
		if (page.url.pathname === path) {
			return true;
		}
		// Don't allow parent path matching for language home pages
		const isLanguageHomePage = locales.some((locale) => path === `/${locale}`);
		if (!isLanguageHomePage && path !== '/' && page.url.pathname.startsWith(path + '/')) {
			return true;
		}
		return false;
	}

	const DEFAULT_TITLE = 'Ibex Tools';

	const getLocalizedNavLinks = (currentLang: string) => {
		return [
			{ path: createLocalizedLink('/', currentLang), label: '', icon: 'home' },
			{ path: createLocalizedLink('/chat', currentLang), label: 'Chat', icon: 'chat' },
			{ path: createLocalizedLink('/transcribe', currentLang), label: 'Transcribe', icon: 'mic' },
			{ path: createLocalizedLink('/text-to-speech', currentLang), label: 'TTS', icon: 'speech' },
			{
				path: createLocalizedLink('/background-remover', currentLang),
				label: 'BG Remover',
				icon: 'image'
			},
			{
				path: createLocalizedLink('/count-tokens', currentLang),
				label: 'Tokens',
				icon: 'calculator'
			}
		];
	};

	// Navigation: header-only (removed persistent left drawer and its persisted state)
	// Global navigation is rendered in the top header below — no `toolsDrawerOpen` state anymore.

	// Theme (light / dark) — persisted and applied via [data-theme]
	let theme = $state('light');

	$effect(() => {
		if (typeof window !== 'undefined') {
			const s = localStorage.getItem('theme');
			if (s) theme = s;
			document.documentElement.setAttribute('data-theme', theme);
		}
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.classList.add('theme-transition');
		document.documentElement.setAttribute('data-theme', theme);
		if (typeof window !== 'undefined') localStorage.setItem('theme', theme);
		setTimeout(() => document.documentElement.classList.remove('theme-transition'), 400);
	}
</script>

<svelte:head>
	<title>{page.data.seo?.title || DEFAULT_TITLE}</title>
	<meta name="description" content={page.data.seo?.description || ''} />

	{#if page.data.seo?.url}
		<link rel="canonical" href={page.data.seo?.url} />
	{/if}

	<!-- Open Graph meta tags -->
	<meta property="og:title" content={page.data.seo?.title || DEFAULT_TITLE} />
	<meta property="og:description" content={page.data.seo?.description || ''} />
	<meta property="og:image" content={page.data.seo?.ogImage || ''} />
	<meta property="og:url" content={page.data.seo?.url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={DEFAULT_TITLE} />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={page.data.seo?.title || DEFAULT_TITLE} />
	<meta name="twitter:description" content={page.data.seo?.description || ''} />
	<meta name="twitter:image" content={page.data.seo?.ogImage || ''} />
</svelte:head>

<div class="app-wrapper">
	<div class="container" class:fullWidth={page.url.pathname === '/og'}>
		<header class="top-nav studio">
			<div class="top-nav-left">
				<a
					href={resolve(createLocalizedLink('/', currentLang))}
					class="brand-link top-brand"
					aria-label="Ibex Tools home"
				>
					<div class="brand-logo">
						<HomeIcon style="width: 22px; height: 22px; stroke-width: 2.5" />
					</div>
					<div class="brand-title">Ibex Tools</div>
				</a>

				<nav class="top-nav-items" aria-label="Primary">
					{#each getLocalizedNavLinks(currentLang) as link (link.path)}
						<a href={resolve(link.path)} class:active={isActive(link.path)}>
							{#if link.icon === 'chat'}
								<MessageSquareIcon style="width: 18px; height: 18px; stroke-width: 2.5" />
							{:else if link.icon === 'mic'}
								<MicIcon style="width: 18px; height: 18px; stroke-width: 2.5" />
							{:else if link.icon === 'speech'}
								<SpeechIcon style="width: 18px; height: 18px; stroke-width: 2.5" />
							{:else if link.icon === 'image'}
								<ImageIcon style="width: 18px; height: 18px; stroke-width: 2.5" />
							{:else if link.icon === 'calculator'}
								<CalculatorIcon style="width: 18px; height: 18px; stroke-width: 2.5" />
							{/if}
							{#if link.label}
								<span>{link.label}</span>
							{/if}
						</a>
					{/each}
				</nav>
			</div>

			<div class="top-nav-actions">
				<button
					class="theme-toggle"
					onclick={toggleTheme}
					aria-pressed={theme === 'dark'}
					aria-label="Toggle theme"
				>
					{#if theme === 'dark'}
						<SunIcon style="width: 18px; height: 18px; stroke-width: 2" />
					{:else}
						<MoonIcon style="width: 18px; height: 18px; stroke-width: 2" />
					{/if}
				</button>

				<a
					href={resolve(createLocalizedLink('/language', currentLang))}
					class="action-link"
					aria-label="Change language"
				>
					<GlobeIcon style="width: 18px; height: 18px; stroke-width: 2.5" />
				</a>

				<a
					href="https://github.com/khromov/nook"
					class="action-link"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub"
				>
					<GithubIcon style="width: 18px; height: 18px; stroke-width: 2.5" />
				</a>
			</div>
		</header>

		<div class="content-wrapper">
			{@render children?.()}
		</div>
	</div>
</div>

<Toaster
	position="bottom-right"
	theme="light"
	richColors
	toastOptions={{
		style:
			'border: 3px solid #000; box-shadow: 4px 4px 0 #000; border-radius: 8px; font-family: Space Grotesk, sans-serif; font-weight: 600;'
	}}
/>

<style>
	/* Base styles with refined Neo-Brutalist approach */
	:global(html) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: var(--font-family-primary);
		font-size: 16px;
		line-height: 1.5;
		background: var(--color-background-main); /* theme-controlled */
		color: var(--color-text-primary);
		position: relative;
		overflow-x: hidden;
		min-height: 100vh;
		transition:
			background-color var(--transition-smooth),
			color var(--transition-smooth);
	}

	:global(body)::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 40px,
			rgba(0, 0, 0, 0.02) 40px,
			rgba(0, 0, 0, 0.02) 41px
		);
		pointer-events: none;
		z-index: 0;
	}

	:global(body)::after {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--mobile-menu-overlay, transparent);
		pointer-events: var(--mobile-menu-overlay-events, none);
		z-index: 999;
		transition: background 0.3s ease;
	}

	@keyframes gradient-shift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.container.fullWidth {
		width: 100% !important;
		max-width: 9000px;
	}

	.app-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 2;
	}

	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		box-sizing: border-box;
		flex: 1;
		display: grid;
		grid-template-columns: 1fr; /* single-column layout — overlay drawer is the only sidebar */
		gap: 1.5rem;
		align-items: start;
		min-height: calc(100vh - 2rem);
	}

	.content-wrapper {
		width: 100%;
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0; /* Critical for nested flex scrolling */
		transition:
			filter var(--transition-fast) ease,
			opacity var(--transition-fast) ease;
	}

	/* Top header navigation — updated to match the provided design (keeps `.active` unchanged) */
	.top-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.65rem 1rem;
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-primary);
		border-radius: 12px;
		box-shadow: var(--shadow-soft-sm);
		position: sticky;
		top: 0;
		z-index: 60;
	}

	.top-nav-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.top-brand {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		text-decoration: none;
		color: var(--color-text-primary);
		padding: 0.15rem 0.5rem;
		border-radius: 10px;
	}

	.top-nav-items {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.top-nav-items a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.9rem;
		text-decoration: none;
		color: var(--color-text-secondary);
		font-weight: 600;
		border-radius: 9999px; /* pill */
		background: transparent;
		transition:
			background 140ms ease,
			transform 140ms ease,
			color 140ms ease;
		border: 1px solid transparent;
	}

	/* subtle pill hover for non-active items */
	.top-nav-items a:hover {
		background: color-mix(in srgb, var(--color-primary) 6%, transparent);
		color: var(--color-text-primary);
		transform: translateY(-1px);
	}

	/* preserve existing active-tab styling exactly as requested */
	.top-nav-items a.active {
		/* more prominent active — deeper purple wash, subtle lift and border */
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--color-primary) 72%, transparent) 0%,
			color-mix(in srgb, var(--color-primary) 28%, transparent) 100%
		);
		color: var(--color-text-secondary); /* match non-active text (not white) */
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.04),
			0 6px 18px rgba(2, 6, 23, 0.08);
		transform: translateY(-1px);
		border: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
	}

	.top-nav-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* action buttons (theme, language, GitHub) — small rounded containers like the screenshot */
	.top-nav-actions .action-link,
	.top-nav-actions .theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		border: 1px solid var(--color-border-primary);
		background: var(--color-background-main);
		color: var(--color-text-secondary);
		transition:
			background 140ms ease,
			transform 120ms ease;
	}

	.top-nav-actions .action-link:hover,
	.top-nav-actions .theme-toggle:hover {
		transform: translateY(-2px);
		background: color-mix(in srgb, var(--color-primary) 6%, transparent);
		color: var(--color-text-primary);
	}

	/* keep global header 'studio' visually neutral (matches screenshot) */
	.top-nav.studio {
		background: var(--color-background-secondary);
		color: var(--color-text-primary);
		border-radius: 12px;
		box-shadow: var(--shadow-soft-sm);
	}

	.top-nav.studio .brand-logo {
		background: transparent; /* icon only — no filled background */
		color: var(--color-primary);
		border-radius: 0;
		padding: 0;
		width: auto;
		height: auto;
	}

	.top-nav.studio::after {
		display: none; /* remove decorative stripe for global header */
	}

	@media (max-width: 600px) {
		.top-nav-items a span {
			display: none;
		}

		.top-nav {
			padding: 0.5rem;
		}
	}

	/* Shared component styling - Refined Neo-Brutalist */
	:global(.card-interface) {
		border: var(--border-brutalist-thick);
		background: var(--color-background-secondary);
		box-shadow: var(--shadow-brutalist-large);
		width: 100%;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-sizing: border-box;
		border-bottom-right-radius: 16px;
		display: flex;
		flex-direction: column;
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--color-background-secondary);
		border-bottom: 1px solid var(--color-border-primary);
		flex-wrap: wrap;
		gap: 0.5rem;
		flex: 0 0 auto; /* Don't grow/shrink */
	}

	:global(.model-info) {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		word-break: break-word;
		max-width: 100%;
	}

	:global(.content-area) {
		padding: 1.5rem;
		background: var(--color-background-secondary);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-sizing: border-box;
	}

	:global(.input-area) {
		padding: 1rem 1.25rem;
		border-top: var(--border-brutalist-thick);
		background: var(--color-background-secondary);
		box-sizing: border-box;
		flex: 0 0 auto; /* Don't grow/shrink */
	}

	:global(.disclaimer) {
		margin-top: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text-tertiary);
		text-align: center;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.primary-button) {
		padding: 0.875rem 1.75rem;
		background: var(--color-primary);
		color: var(--color-button-text);
		border: 1px solid transparent;
		border-radius: 10px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition:
			transform 160ms ease,
			box-shadow 160ms ease;
		box-shadow: var(--shadow-soft-md);
		text-transform: none;
		letter-spacing: 0.25px;
		font-family: var(--font-family-primary);
		box-sizing: border-box;
	}

	:global(.primary-button:hover) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	:global(.primary-button:active) {
		transform: translate(0);
		box-shadow: var(--shadow-brutalist-small);
	}

	:global(.primary-button:disabled) {
		background: var(--color-background-disabled);
		color: var(--color-text-disabled);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.container {
			padding: 0.75rem;
		}

		.top-nav-items {
			gap: 0.5rem;
			padding: 0.5rem;
		}

		.top-nav-items a {
			padding: 0.625rem;
			font-size: 0.875rem;
		}

		.top-nav-items a span {
			display: none;
		}
		:global(.toolbar) {
			padding: 0.875rem 1rem;
		}

		:global(.model-info) {
			font-size: 0.75rem;
		}

		:global(.content-area) {
			padding: 1rem;
		}

		:global(.input-area) {
			padding: 0.875rem 1rem;
		}
	}

	@media (max-width: 400px) {
		.container {
			padding: 0.5rem;
		}

		.top-nav-items a {
			padding: 0.5rem 0.75rem;
			font-size: 0.8125rem;
		}
	}
</style>
