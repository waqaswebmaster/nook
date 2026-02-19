<script lang="ts">
	import MessageSquareIcon from 'virtual:icons/lucide/message-square';
	import BrainIcon from 'virtual:icons/lucide/brain';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';
	import ShapesIcon from 'virtual:icons/lucide/shapes';
	import ChevronRightIcon from 'virtual:icons/lucide/chevron-right';
	import CardInterface from '$lib/components/common/CardInterface.svelte';
	import SectionCard from '$lib/components/common/SectionCard.svelte';
	import ContentArea from '$lib/components/common/ContentArea.svelte';
	import Toolbar from '$lib/components/common/Toolbar.svelte';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { getCurrentLanguageFromPage, getTokenizerPaths } from '$lib/i18n-utils';

	// Get current language and create localized tokenizer paths
	const currentLang = $derived(getCurrentLanguageFromPage($page));
	const tokenizerPaths = $derived(getTokenizerPaths(currentLang));
</script>

<div class="tokenizers-container">
	<CardInterface>
		<Toolbar modelInfo="Count LLM Tokens" ModelIcon={SparklesIcon} variant="studio" />
		<ContentArea>
			<div class="main-content">
				<SectionCard rotation={-0.5} animationDelay={0}>
					<div class="tokenizers-header">
						<h1>
							<span class="header-icon"><SparklesIcon /></span>
							Count LLM Tokens
						</h1>
						<p class="header-description">
							Calculate how many tokens your text will use with different AI models. Token counts
							affect context limits for AI conversations.
						</p>
					</div>
				</SectionCard>

				<SectionCard rotation={0.3} animationDelay={0.1}>
					<div class="tokenizer-cards">
						<a href={resolve(tokenizerPaths.anthropic)} class="tokenizer-card claude-card">
							<div class="card-decoration"></div>
							<div class="card-content">
								<div class="card-icon">
									<BrainIcon />
								</div>
								<h2>Anthropic Claude</h2>
								<p class="card-description">
									Count tokens for Claude models including Claude Opus 4.1, Sonnet 4, and Haiku
								</p>
								<div class="card-action">
									<span>Open Tokenizer</span>
									<ChevronRightIcon />
								</div>
							</div>
						</a>

						<a href={resolve(tokenizerPaths.openai)} class="tokenizer-card chatgpt-card">
							<div class="card-decoration"></div>
							<div class="card-content">
								<div class="card-icon">
									<MessageSquareIcon />
								</div>
								<h2>OpenAI ChatGPT</h2>
								<p class="card-description">
									Count tokens for GPT-4, GPT-4o, GPT-3.5 Turbo, and other OpenAI models
								</p>
								<div class="card-action">
									<span>Open Tokenizer</span>
									<ChevronRightIcon />
								</div>
							</div>
						</a>

						<a href={resolve(tokenizerPaths.gemini)} class="tokenizer-card gemini-card">
							<div class="card-decoration"></div>
							<div class="card-content">
								<div class="card-icon">
									<ShapesIcon />
								</div>
								<h2>Google Gemini</h2>
								<p class="card-description">Count tokens for Gemini models</p>
								<div class="card-action">
									<span>Open Tokenizer</span>
									<ChevronRightIcon />
								</div>
							</div>
						</a>
					</div>
				</SectionCard>

				<SectionCard rotation={-0.2} animationDelay={0.2}>
					<div class="info-section">
						<h3>What are tokens?</h3>
						<p>
							Tokens are the basic units that language models process. A token can be as short as
							one character or as long as one word. On average:
						</p>
						<ul>
							<li>1 token ≈ 4 characters in English</li>
						</ul>
						<p>
							Different models use different tokenization methods, so the same text may result in
							different token counts.
						</p>
					</div>
				</SectionCard>
			</div>
		</ContentArea>
	</CardInterface>
</div>

<style>
	.tokenizers-container {
		margin: 0 auto;
		animation: fadeIn 0.35s ease-out;
	}

	.main-content {
		transition: all 0.3s ease;
	}

	/* .main-content.disabled {
		opacity: 0.3;
		pointer-events: none;
		filter: grayscale(50%);
	} */

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

	.tokenizers-header {
		text-align: center;
		margin: 0;
		padding: 0;
		background: transparent;
		border: none;
		box-shadow: none;
		transform: none;
	}

	.tokenizers-header h1 {
		margin: 0 0 var(--sp-3) 0;
		font-family: var(--font-family-primary);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--sp-2);
	}

	.header-icon {
		display: flex;
		align-items: center;
		color: var(--color-primary);
	}

	.header-icon :global(svg) {
		width: 1.75rem;
		height: 1.75rem;
	}

	.header-description {
		margin: 0;
		font-size: 1rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.tokenizer-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--sp-5);
		margin-bottom: var(--sp-6);
	}

	.tokenizer-card {
		display: block;
		text-decoration: none;
		color: var(--color-text-primary);
		background: var(--color-card);
		border: 1px solid var(--color-border-light);
		padding: 0;
		box-shadow: var(--shadow-sm);
		transition: all var(--transition-fast);
		position: relative;
		overflow: hidden;
		border-radius: var(--radius-lg);
	}

	.tokenizer-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-lg);
		border-color: var(--color-primary);
	}

	.card-decoration {
		position: absolute;
		top: -10px;
		right: -10px;
		width: 80px;
		height: 80px;
		opacity: 0.15;
		border-radius: 50%;
		z-index: 0;
	}

	.claude-card .card-decoration {
		background: var(--color-primary);
	}

	.chatgpt-card .card-decoration {
		background: var(--color-success);
		left: -10px;
		right: auto;
	}

	.gemini-card .card-decoration {
		background: var(--color-warning);
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
	}

	.card-content {
		padding: var(--sp-5);
		position: relative;
		z-index: 1;
	}

	.card-icon {
		margin-bottom: var(--sp-4);
		width: fit-content;
		padding: var(--sp-3);
		background: var(--color-primary-subtle);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-primary);
	}

	.card-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.claude-card:hover .card-icon {
		background: var(--color-primary);
		color: #fff;
	}

	.chatgpt-card:hover .card-icon {
		background: var(--color-success);
		color: #fff;
	}

	.gemini-card:hover .card-icon {
		background: var(--color-warning);
		color: #000;
	}

	.tokenizer-card h2 {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 var(--sp-2) 0;
		color: var(--color-text-primary);
	}

	.card-description {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin: 0 0 var(--sp-4) 0;
	}

	.card-action {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--color-primary);
		padding: var(--sp-2) var(--sp-3);
		background: var(--color-primary-subtle);
		border-radius: var(--radius-md);
		width: fit-content;
		transition: all var(--transition-fast);
	}

	.card-action :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.tokenizer-card:hover .card-action {
		background: var(--color-primary);
		color: #fff;
	}

	.info-section {
		background: transparent;
		border: none;
		padding: 0;
		box-shadow: none;
		transform: none;
	}

	.info-section h3 {
		margin: 0 0 var(--sp-3) 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.info-section p {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: 0 0 var(--sp-3) 0;
	}

	.info-section ul {
		margin: 0 0 var(--sp-3) 0;
		padding-left: var(--sp-5);
	}

	.info-section li {
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: var(--sp-1) 0;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.tokenizers-header h1 {
			font-size: 1.5rem;
		}

		.tokenizer-cards {
			grid-template-columns: 1fr;
			gap: var(--sp-4);
		}

		.card-content {
			padding: var(--sp-4);
		}
	}

	@media (max-width: 600px) {
		.tokenizers-header h1 {
			font-size: 1.25rem;
		}

		.header-description {
			font-size: 0.9375rem;
		}
	}
</style>
