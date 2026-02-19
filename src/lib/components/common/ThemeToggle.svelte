<script lang="ts">
	import SunIcon from 'virtual:icons/lucide/sun';
	import MoonIcon from 'virtual:icons/lucide/moon';

	let theme = $state<'light' | 'dark'>('light');

	function initTheme() {
		if (typeof document === 'undefined') return;
		const stored = localStorage.getItem('nook-theme');
		if (stored === 'dark' || stored === 'light') {
			theme = stored;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'dark';
		}
		document.documentElement.setAttribute('data-theme', theme);
	}

	function toggle() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('nook-theme', theme);
	}

	$effect(() => {
		initTheme();
	});
</script>

<button
	class="theme-toggle"
	onclick={toggle}
	aria-label="Toggle {theme === 'light' ? 'dark' : 'light'} mode"
	title="Toggle theme"
>
	{#if theme === 'light'}
		<MoonIcon style="width: 18px; height: 18px;" />
	{:else}
		<SunIcon style="width: 18px; height: 18px;" />
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
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
		flex-shrink: 0;
	}

	.theme-toggle:hover {
		background: var(--color-primary-subtle);
		color: var(--color-primary);
		border-color: var(--color-primary);
		transform: scale(1.05);
	}
</style>
