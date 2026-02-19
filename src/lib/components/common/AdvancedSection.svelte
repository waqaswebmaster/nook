<script lang="ts">
	import SettingsIcon from 'virtual:icons/lucide/settings';
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import { advancedExpanded } from '$lib/stores';
	import type { Snippet } from 'svelte';

	interface Props {
		Icon?: typeof SettingsIcon;
		children: Snippet;
	}

	let { Icon = SettingsIcon, children }: Props = $props();

	function handleToggle() {
		$advancedExpanded = !$advancedExpanded;
	}
</script>

<div class="advanced-params">
	<button class="params-toggle" onclick={handleToggle}>
		<span class="toggle-emoji"><Icon /></span>
		<span>Advanced Parameters</span>
		<span class="toggle-icon" class:rotated={$advancedExpanded}>
			<ChevronDownIcon />
		</span>
	</button>
	{#if $advancedExpanded}
		<div class="params-grid">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.advanced-params {
		background: var(--color-background-secondary);
		padding: 1.25rem;
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		box-sizing: border-box;
	}

	.params-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--sp-2) 0;
		background: none;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		cursor: pointer;
		font-family: var(--font-family-primary);
		transition: color var(--transition-fast);
	}

	.toggle-emoji {
		font-size: 1.125rem;
		margin-right: var(--sp-2);
		display: flex;
		align-items: center;
		color: var(--color-text-tertiary);
	}

	.toggle-emoji :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.params-toggle:hover {
		color: var(--color-text-primary);
	}

	.params-toggle:hover .toggle-emoji {
		color: var(--color-primary);
	}

	.toggle-icon {
		transition: transform 0.2s ease;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		color: var(--color-text-tertiary);
	}

	.toggle-icon :global(svg) {
		width: 18px;
		height: 18px;
	}

	.toggle-icon.rotated {
		transform: rotate(180deg);
	}

	.params-grid {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
		margin-top: var(--sp-3);
		animation: slideDown 0.2s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.advanced-params {
			padding: var(--sp-3);
		}
	}
</style>
