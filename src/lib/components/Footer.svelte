<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { getCurrentLanguage, createLocalizedLink } from '$lib/i18n-utils';
	import GithubIcon from 'virtual:icons/lucide/github';

	const currentLang = $derived(getCurrentLanguage(page.url.pathname));
	const year = new Date().getFullYear();

	const links = $derived([
		{ path: createLocalizedLink('/', currentLang), label: 'Home' },
		{ path: createLocalizedLink('/chat', currentLang), label: 'Chat' },
		{ path: createLocalizedLink('/transcribe', currentLang), label: 'Transcribe' },
		{ path: createLocalizedLink('/text-to-speech', currentLang), label: 'TTS' },
		{ path: createLocalizedLink('/count-tokens', currentLang), label: 'Tokens' }
	]);
</script>

<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<span class="footer-name">Nook</span>
			<span class="footer-tagline">Local AI tools. Private by default.</span>
		</div>

		<nav class="footer-links" aria-label="Footer navigation">
			{#each links as link (link.path)}
				<a href={resolve(link.path)} class="footer-link">{link.label}</a>
			{/each}
		</nav>

		<div class="footer-right">
			<a
				href="https://github.com/khromov/nook"
				class="footer-github"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="GitHub"
			>
				<GithubIcon style="width: 16px; height: 16px;" />
			</a>
			<span class="footer-copy">&copy; {year} Nook</span>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		border-top: 1px solid var(--color-border-light);
		background: var(--color-background-secondary);
		padding: var(--sp-6) var(--sp-5);
		margin-top: auto;
		flex-shrink: 0;
	}

	.footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-5);
		flex-wrap: wrap;
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: var(--sp-1);
	}

	.footer-name {
		font-weight: 700;
		font-size: 0.9375rem;
		color: var(--color-text-primary);
		letter-spacing: -0.01em;
	}

	.footer-tagline {
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
	}

	.footer-links {
		display: flex;
		align-items: center;
		gap: var(--sp-4);
		flex-wrap: wrap;
	}

	.footer-link {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text-tertiary);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.footer-link:hover {
		color: var(--color-primary);
	}

	.footer-right {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}

	.footer-github {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: var(--radius-md);
		color: var(--color-text-tertiary);
		text-decoration: none;
		transition: all var(--transition-fast);
		border: 1px solid transparent;
	}

	.footer-github:hover {
		color: var(--color-text-primary);
		background: var(--color-background-tertiary);
		border-color: var(--color-border-light);
	}

	.footer-copy {
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
	}

	@media (max-width: 768px) {
		.footer-inner {
			flex-direction: column;
			align-items: center;
			text-align: center;
			gap: var(--sp-4);
		}

		.footer-brand {
			align-items: center;
		}

		.footer-links {
			justify-content: center;
		}

		.footer-right {
			justify-content: center;
		}
	}
</style>
