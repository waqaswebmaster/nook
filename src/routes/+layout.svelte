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
	import MenuIcon from 'virtual:icons/lucide/menu';
	import XIcon from 'virtual:icons/lucide/x';
	import ThemeToggle from '$lib/components/common/ThemeToggle.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Toaster } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import { getCurrentLanguage, createLocalizedLink, locales } from '$lib/i18n-utils';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const currentLang = $derived(getCurrentLanguage(page.url.pathname));

	function isActive(path: string): boolean {
		if (page.url.pathname === path) return true;
		const isLanguageHomePage = locales.some((locale) => path === `/${locale}`);
		if (!isLanguageHomePage && path !== '/' && page.url.pathname.startsWith(path + '/'))
			return true;
		return false;
	}

	const DEFAULT_TITLE = 'Nook';

	const getLocalizedNavLinks = (currentLang: string) => [
		{ path: createLocalizedLink('/', currentLang), label: 'Home', icon: 'home' },
		{ path: createLocalizedLink('/chat', currentLang), label: 'Chat', icon: 'chat' },
		{ path: createLocalizedLink('/transcribe', currentLang), label: 'Transcribe', icon: 'mic' },
		{ path: createLocalizedLink('/text-to-speech', currentLang), label: 'TTS', icon: 'speech' },
		{
			path: createLocalizedLink('/background-remover', currentLang),
			label: 'BG Remover',
			icon: 'image'
		},
		{ path: createLocalizedLink('/count-tokens', currentLang), label: 'Tokens', icon: 'calculator' }
	];

	let isMobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isMobileMenuOpen) closeMobileMenu();
	}

	$effect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
			const handleOutsideClick = (e: MouseEvent) => {
				const drawer = document.querySelector('.mobile-drawer');
				if (drawer && !drawer.contains(e.target as Node)) {
					e.stopPropagation();
					closeMobileMenu();
				}
			};
			const timeoutId = setTimeout(() => {
				document.addEventListener('click', handleOutsideClick);
			}, 100);
			return () => {
				clearTimeout(timeoutId);
				document.removeEventListener('click', handleOutsideClick);
			};
		} else {
			document.body.style.overflow = '';
		}
	});

	const iconMap: Record<string, any> = {
		home: HomeIcon,
		chat: MessageSquareIcon,
		mic: MicIcon,
		speech: SpeechIcon,
		image: ImageIcon,
		calculator: CalculatorIcon
	};
</script>

<svelte:head>
	<title>{page.data.seo?.title || DEFAULT_TITLE}</title>
	<meta name="description" content={page.data.seo?.description || ''} />
	{#if page.data.seo?.url}
		<link rel="canonical" href={page.data.seo?.url} />
	{/if}
	<meta property="og:title" content={page.data.seo?.title || DEFAULT_TITLE} />
	<meta property="og:description" content={page.data.seo?.description || ''} />
	<meta property="og:image" content={page.data.seo?.ogImage || ''} />
	<meta property="og:url" content={page.data.seo?.url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={DEFAULT_TITLE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={page.data.seo?.title || DEFAULT_TITLE} />
	<meta name="twitter:description" content={page.data.seo?.description || ''} />
	<meta name="twitter:image" content={page.data.seo?.ogImage || ''} />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="app-shell">
	<!-- ═══ TOP NAV ═══ -->
	<header class="top-nav">
		<div class="nav-inner">
			<a href={resolve(createLocalizedLink('/', currentLang))} class="brand">
				<span class="brand-mark">N</span>
				<span class="brand-text">Nook</span>
			</a>

			<nav class="nav-links" aria-label="Main navigation">
				{#each getLocalizedNavLinks(currentLang) as link (link.path)}
					{#if link.icon !== 'home'}
						{@const IconComp = iconMap[link.icon]}
						<a href={resolve(link.path)} class="nav-link" class:active={isActive(link.path)}>
							<IconComp style="width: 18px; height: 18px;" />
							<span>{link.label}</span>
						</a>
					{/if}
				{/each}
			</nav>

			<div class="nav-actions">
				<a
					href={resolve(createLocalizedLink('/language', currentLang))}
					class="nav-icon-btn"
					aria-label="Change language"
				>
					<GlobeIcon style="width: 18px; height: 18px;" />
				</a>
				<a
					href="https://github.com/khromov/nook"
					class="nav-icon-btn"
					aria-label="View source on GitHub"
					target="_blank"
					rel="noopener noreferrer"
				>
					<GithubIcon style="width: 18px; height: 18px;" />
				</a>
				<ThemeToggle />
				<button
					class="mobile-menu-btn"
					onclick={toggleMobileMenu}
					aria-label="Open menu"
					aria-expanded={isMobileMenuOpen}
				>
					<MenuIcon style="width: 20px; height: 20px;" />
				</button>
			</div>
		</div>
	</header>

	<!-- ═══ CONTENT ═══ -->
	<main class="main-content" class:fullWidth={page.url.pathname === '/og'}>
		<div class="content-container">
			{@render children?.()}
		</div>
	</main>

	<Footer />
</div>

<!-- ═══ MOBILE DRAWER ═══ -->
{#if isMobileMenuOpen}
	<div class="mobile-overlay" aria-hidden="true"></div>
	<div class="mobile-drawer" role="dialog" aria-label="Navigation menu">
		<div class="drawer-header">
			<span class="brand">
				<span class="brand-mark">N</span>
				<span class="brand-text">Nook</span>
			</span>
			<button class="drawer-close" onclick={closeMobileMenu} aria-label="Close menu">
				<XIcon style="width: 20px; height: 20px;" />
			</button>
		</div>
		<nav class="drawer-nav">
			{#each getLocalizedNavLinks(currentLang) as link (link.path)}
				{@const IconComp = iconMap[link.icon]}
				<a
					href={resolve(link.path)}
					class="drawer-link"
					class:active={isActive(link.path)}
					onclick={closeMobileMenu}
				>
					<IconComp style="width: 20px; height: 20px;" />
					<span>{link.icon === 'home' ? 'Home' : link.label}</span>
				</a>
			{/each}
			<div class="drawer-divider"></div>
			<a
				href={resolve(createLocalizedLink('/language', currentLang))}
				class="drawer-link"
				onclick={closeMobileMenu}
			>
				<GlobeIcon style="width: 20px; height: 20px;" />
				<span>Language</span>
			</a>
			<a
				href="https://github.com/khromov/nook"
				class="drawer-link"
				target="_blank"
				rel="noopener noreferrer"
				onclick={closeMobileMenu}
			>
				<GithubIcon style="width: 20px; height: 20px;" />
				<span>GitHub</span>
			</a>
		</nav>
	</div>
{/if}

<Toaster
	position="bottom-right"
	richColors
	toastOptions={{
		style:
			'border: 1px solid var(--color-border-light); box-shadow: var(--shadow-lg); border-radius: var(--radius-md); font-family: Space Grotesk, sans-serif; font-weight: 500; background: var(--color-card); color: var(--color-text-primary);'
	}}
/>

<style>
	/* ── Global body ── */
	:global(html) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: var(--font-family-primary);
		font-size: 16px;
		line-height: 1.6;
		background: var(--color-background-secondary);
		color: var(--color-text-primary);
		overflow-x: hidden;
		min-height: 100vh;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* ── App shell ── */
	.app-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* ── Top Nav ── */
	.top-nav {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		height: var(--nav-height);
		background: var(--nav-bg);
		backdrop-filter: var(--backdrop-blur);
		-webkit-backdrop-filter: var(--backdrop-blur);
		border-bottom: 1px solid var(--color-border-light);
	}

	.nav-inner {
		max-width: 1200px;
		margin: 0 auto;
		height: 100%;
		display: flex;
		align-items: center;
		gap: var(--sp-6);
		padding: 0 var(--sp-5);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		text-decoration: none;
		color: var(--color-text-primary);
		flex-shrink: 0;
	}

	.brand-mark {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: var(--radius-md);
		background: var(--color-primary);
		color: #fff;
		font-family: var(--font-family-display);
		font-size: 1.25rem;
		letter-spacing: 0.02em;
	}

	.brand-text {
		font-weight: 700;
		font-size: 1.125rem;
		letter-spacing: -0.02em;
	}

	/* Nav links */
	.nav-links {
		display: flex;
		align-items: center;
		gap: var(--sp-1);
		flex: 1;
		min-width: 0;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		padding: var(--sp-2) var(--sp-3);
		text-decoration: none;
		color: var(--color-text-tertiary);
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
		white-space: nowrap;
	}

	.nav-link:hover {
		color: var(--color-text-primary);
		background: var(--color-primary-subtle);
	}

	.nav-link.active {
		color: var(--color-primary);
		background: var(--color-primary-subtle);
		font-weight: 600;
	}

	/* Right actions */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		flex-shrink: 0;
	}

	.nav-icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: var(--radius-md);
		color: var(--color-text-tertiary);
		text-decoration: none;
		transition: all var(--transition-fast);
		border: 1px solid transparent;
	}

	.nav-icon-btn:hover {
		color: var(--color-text-primary);
		background: var(--color-background-tertiary);
		border-color: var(--color-border-light);
	}

	.mobile-menu-btn {
		display: none;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border-light);
		background: var(--color-background-secondary);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.mobile-menu-btn:hover {
		background: var(--color-primary-subtle);
		color: var(--color-primary);
	}

	/* ── Main content ── */
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.main-content.fullWidth .content-container {
		max-width: none;
	}

	.content-container {
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
		padding: var(--sp-6) var(--sp-5);
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	/* ── Global component overrides ── */
	:global(.card-interface) {
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-md);
		width: 100%;
		position: relative;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--sp-3) var(--sp-5);
		background: var(--color-background-secondary);
		border-bottom: 1px solid var(--color-border-light);
		flex-wrap: wrap;
		gap: var(--sp-2);
		flex: 0 0 auto;
	}

	:global(.model-info) {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		letter-spacing: 0.02em;
		word-break: break-word;
		max-width: 100%;
	}

	:global(.content-area) {
		padding: var(--sp-5);
		background: var(--color-card);
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
		box-sizing: border-box;
	}

	:global(.input-area) {
		padding: var(--sp-4) var(--sp-5);
		border-top: 1px solid var(--color-border-light);
		background: var(--color-background-secondary);
		box-sizing: border-box;
		flex: 0 0 auto;
	}

	:global(.disclaimer) {
		margin-top: var(--sp-2);
		font-size: 0.8125rem;
		font-weight: 400;
		color: var(--color-text-tertiary);
		text-align: center;
	}

	:global(.primary-button) {
		padding: var(--sp-3) var(--sp-5);
		background: var(--color-primary);
		color: #fff;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 600;
		transition: all var(--transition-fast);
		box-shadow: var(--shadow-sm);
		font-family: var(--font-family-primary);
		box-sizing: border-box;
	}

	:global(.primary-button:hover) {
		background: var(--color-primary-hover);
		box-shadow: var(--shadow-md);
		transform: translateY(-1px);
	}

	:global(.primary-button:active) {
		transform: translateY(0);
		box-shadow: var(--shadow-xs);
	}

	:global(.primary-button:disabled) {
		background: var(--color-background-disabled);
		color: var(--color-text-disabled);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
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

	/* ── Mobile drawer ── */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		z-index: var(--z-overlay);
		animation: fadeOverlay 0.2s ease;
	}

	@keyframes fadeOverlay {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.mobile-drawer {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 300px;
		max-width: 85vw;
		background: var(--color-background-main);
		border-right: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-xl);
		z-index: var(--z-drawer);
		display: flex;
		flex-direction: column;
		animation: slideDrawer 0.25s ease;
		overflow-y: auto;
	}

	@keyframes slideDrawer {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.drawer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--sp-4) var(--sp-5);
		border-bottom: 1px solid var(--color-border-light);
		flex-shrink: 0;
	}

	.drawer-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border-light);
		background: var(--color-background-secondary);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.drawer-close:hover {
		background: var(--color-background-tertiary);
		color: var(--color-text-primary);
	}

	.drawer-nav {
		display: flex;
		flex-direction: column;
		padding: var(--sp-3);
		gap: var(--sp-1);
	}

	.drawer-link {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		padding: var(--sp-3) var(--sp-4);
		text-decoration: none;
		color: var(--color-text-secondary);
		font-weight: 500;
		font-size: 0.9375rem;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.drawer-link:hover {
		background: var(--color-primary-subtle);
		color: var(--color-text-primary);
	}

	.drawer-link.active {
		background: var(--color-primary-subtle);
		color: var(--color-primary);
		font-weight: 600;
	}

	.drawer-divider {
		height: 1px;
		background: var(--color-border-light);
		margin: var(--sp-2) var(--sp-4);
	}

	/* ── Responsive ── */
	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.nav-icon-btn {
			display: none;
		}

		.mobile-menu-btn {
			display: flex;
		}

		.content-container {
			padding: var(--sp-4) var(--sp-3);
		}

		:global(.toolbar) {
			padding: var(--sp-3) var(--sp-4);
		}

		:global(.content-area) {
			padding: var(--sp-4);
		}

		:global(.input-area) {
			padding: var(--sp-3) var(--sp-4);
		}
	}

	@media (max-width: 480px) {
		.content-container {
			padding: var(--sp-3) var(--sp-2);
		}

		.nav-inner {
			padding: 0 var(--sp-3);
		}
	}
</style>
