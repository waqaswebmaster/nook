<script lang="ts">
	import MessageSquareIcon from 'virtual:icons/lucide/message-square';
	import MicIcon from 'virtual:icons/lucide/mic';
	import ImageIcon from 'virtual:icons/lucide/image';
	import SpeechIcon from 'virtual:icons/lucide/speech';
	import CalculatorIcon from 'virtual:icons/lucide/calculator';
	import ShieldCheckIcon from 'virtual:icons/lucide/shield-check';
	import WifiOffIcon from 'virtual:icons/lucide/wifi-off';
	import ZapIcon from 'virtual:icons/lucide/zap';
	import ToolCard from '$lib/components/common/ToolCard.svelte';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { getCurrentLanguageFromPage, createLocalizedLink } from '$lib/i18n-utils';

	const currentLang = $derived(getCurrentLanguageFromPage($page));
	const chatLink = $derived(resolve(createLocalizedLink('/chat', currentLang)));
	const transcribeLink = $derived(resolve(createLocalizedLink('/transcribe', currentLang)));
	const ttsLink = $derived(resolve(createLocalizedLink('/text-to-speech', currentLang)));
	const backgroundLink = $derived(resolve(createLocalizedLink('/background-remover', currentLang)));
	const tokensLink = $derived(resolve(createLocalizedLink('/count-tokens', currentLang)));
</script>

<div class="landing">
	<!-- ═══ HERO ═══ -->
	<section class="hero">
		<div class="hero-badge">
			<ShieldCheckIcon style="width: 14px; height: 14px;" />
			<span>100% Private &middot; On-Device AI</span>
		</div>
		<h1 class="hero-title">Local AI Tools</h1>
		<p class="hero-subtitle">
			Free, powerful AI tools that run entirely in your browser — no servers, no uploads, works
			offline.
		</p>
		<div class="hero-actions">
			<a href={chatLink} class="btn btn-primary">Start Chatting</a>
			<a href={transcribeLink} class="btn btn-secondary">Transcribe Audio</a>
		</div>
		<div class="hero-features">
			<div class="hero-feature">
				<ShieldCheckIcon style="width: 16px; height: 16px;" />
				<span>Private by design</span>
			</div>
			<div class="hero-feature">
				<WifiOffIcon style="width: 16px; height: 16px;" />
				<span>Works offline</span>
			</div>
			<div class="hero-feature">
				<ZapIcon style="width: 16px; height: 16px;" />
				<span>WebAssembly powered</span>
			</div>
		</div>
	</section>

	<!-- ═══ TOOLS GRID ═══ -->
	<section class="tools-section">
		<h2 class="section-title">Tools</h2>
		<div class="tools-grid">
			<ToolCard
				href={chatLink}
				title="Chat"
				description="Chat with LLMs like Gemma3 completely on-device via llama.cpp"
				icon={MessageSquareIcon}
				chips={['Gemma3', 'On-Device', 'llama.cpp']}
			/>
			<ToolCard
				href={transcribeLink}
				title="Transcribe Audio"
				description="Convert speech to text using Whisper AI — upload or record live"
				icon={MicIcon}
				chips={['Whisper', 'Record', 'Subtitles']}
			/>
			<ToolCard
				href={ttsLink}
				title="Text to Speech"
				description="Natural-sounding voice synthesis with Kitten, Piper, or Kokoro"
				icon={SpeechIcon}
				chips={['Kokoro', 'Piper', 'Kitten TTS']}
			/>
			<ToolCard
				href={backgroundLink}
				title="Remove Background"
				description="AI-powered background removal with RMBG or BEN2 models"
				icon={ImageIcon}
				chips={['RMBG v1.4', 'BEN2', 'Batch']}
			/>
			<ToolCard
				href={tokensLink}
				title="Count Tokens"
				description="Estimate token usage for prompts across OpenAI and Anthropic models"
				icon={CalculatorIcon}
				chips={['OpenAI', 'Anthropic', 'Gemini']}
			/>
		</div>
	</section>

	<!-- ═══ FOOTER NOTE ═══ -->
	<footer class="landing-footer">
		<p>
			All processing happens locally in your browser using WebAssembly. No data is sent to external
			servers.
		</p>
	</footer>
</div>

<style>
	/* Base styles */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: var(--font-family-primary);
		font-size: 16px;
		line-height: 1.5;
		background: var(--color-background-main);
		color: var(--color-text-primary);
		overflow-x: hidden;
		transition:
			background-color var(--transition-smooth),
			color var(--transition-smooth);
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

	.main-menu {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		gap: var(--sp-12);
		animation: fadeUp 0.5s ease-out;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── Hero ── */
	.hero {
		text-align: center;
		padding: var(--sp-12) 0 var(--sp-8);
		max-width: 680px;
		margin: 0 auto;
	}

	.title-line {
		background: var(--color-primary);
		color: var(--color-text-inverse);
		padding: 0.5rem 1.25rem;
		display: inline-block;
		border-radius: 8px;
		box-shadow: var(--shadow-soft-sm);
		letter-spacing: 1px;
		text-transform: uppercase;
		font-weight: 700;
	}

	.hero-title {
		font-family: var(--font-family-display);
		font-size: clamp(3rem, 8vw, 5rem);
		line-height: 1;
		margin: 0 0 var(--sp-4) 0;
		letter-spacing: 0.02em;
		color: var(--color-text-primary);
	}

	.hero-subtitle {
		font-size: 1.125rem;
		color: var(--color-text-tertiary);
		margin: 0 0 var(--sp-8) 0;
		line-height: 1.6;
		max-width: 520px;
		margin-left: auto;
		margin-right: auto;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--sp-3);
		flex-wrap: wrap;
		margin-bottom: var(--sp-8);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		padding: var(--sp-3) var(--sp-6);
		border-radius: var(--radius-md);
		font-size: 0.9375rem;
		font-weight: 600;
		text-decoration: none;
		transition: all var(--transition-fast);
		cursor: pointer;
	}

	.btn-primary {
		background: var(--color-primary);
		color: #fff;
		box-shadow: var(--shadow-md);
	}

	.btn-primary:hover {
		background: var(--color-primary-hover);
		box-shadow: var(--shadow-lg);
		transform: translateY(-1px);
	}

	.btn-secondary {
		background: var(--color-card);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-sm);
	}

	.card-number {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: var(--color-step-badge);
		color: var(--color-step-badge-text);
		padding: 0.25rem 0.75rem;
		font-weight: 800;
		font-size: 0.875rem;
		letter-spacing: 0.5px;
		border-radius: 6px;
		text-transform: uppercase;
		box-shadow: var(--shadow-soft-sm);
	}
	.feature-card:hover {
		transform: translate(-3px, -3px);
		box-shadow: 8px 8px 0 var(--color-border-primary);
	}

	.hero-feature {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
		font-weight: 500;
	}

	.icon-container {
		margin-bottom: 1.5rem;
		width: fit-content;
		padding: 0.75rem;
		background: var(--color-background-tertiary);
		border: 1px solid var(--color-border-primary);
		border-radius: 8px;
		box-shadow: var(--shadow-soft-sm);
	}
	.feature-card h2 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin: 0 0 var(--sp-4) 0;
		letter-spacing: -0.01em;
	}

	.tools-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--sp-3);
	}

	/* ── Footer ── */
	.landing-footer {
		text-align: center;
		padding: var(--sp-4) 0 var(--sp-8);
	}

	.landing-footer p {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--color-text-tertiary);
	}

	/* ── Responsive ── */
	@media (min-width: 640px) {
		.tools-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.hero {
			padding: var(--sp-6) 0 var(--sp-4);
		}

		.hero-title {
			font-size: 2.5rem;
		}

		.hero-subtitle {
			font-size: 1rem;
		}

		.hero-features {
			gap: var(--sp-4);
		}

		.landing {
			gap: var(--sp-8);
		}
	}
</style>
