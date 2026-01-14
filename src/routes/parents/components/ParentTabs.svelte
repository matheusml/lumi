<script lang="ts">
	/**
	 * ParentTabs - Tab navigation header for parents zone
	 *
	 * Shows title, back button, and tab switcher for Config/Analytics.
	 */

	import { getTranslations, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'
	import { onMount, onDestroy } from 'svelte'

	type TabType = 'config' | 'analytics'

	interface Props {
		activeTab: TabType
		onTabChange: (tab: TabType) => void
		onBack: () => void
	}

	let { activeTab, onTabChange, onBack }: Props = $props()

	let t = $state<Translations>(getTranslations())
	let unsubscribe: (() => void) | null = null

	onMount(() => {
		unsubscribe = subscribe(() => {
			t = getTranslations()
		})
	})

	onDestroy(() => {
		unsubscribe?.()
	})
</script>

<header class="header">
	<div class="header-top">
		<h1 class="title">{t.parents.title}</h1>
		<button class="back-button" onclick={onBack}>← {t.parents.back}</button>
	</div>
	<nav class="tabs">
		<button class="tab" class:active={activeTab === 'config'} onclick={() => onTabChange('config')}>
			{t.parents.configTab}
		</button>
		<button
			class="tab"
			class:active={activeTab === 'analytics'}
			onclick={() => onTabChange('analytics')}
		>
			{t.parents.analyticsTab}
		</button>
	</nav>
</header>

<style>
	.header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title {
		font-size: var(--font-size-heading-medium);
		color: var(--color-text-primary);
		margin: 0;
	}

	.back-button {
		background: none;
		border: none;
		font-family: var(--font-family);
		font-size: var(--font-size-body-small);
		color: var(--color-text-secondary);
		cursor: pointer;
		padding: var(--spacing-xs) var(--spacing-sm);
	}

	.back-button:hover {
		color: var(--color-text-primary);
	}

	.tabs {
		display: flex;
		gap: var(--spacing-xs);
		background-color: var(--color-surface);
		padding: var(--spacing-xs);
		border-radius: var(--radius-md);
	}

	.tab {
		flex: 1;
		padding: var(--spacing-sm) var(--spacing-md);
		font-family: var(--font-family);
		font-size: var(--font-size-body-small);
		font-weight: 500;
		color: var(--color-text-secondary);
		background: none;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			background-color var(--transition-fast),
			color var(--transition-fast);
	}

	.tab:hover {
		color: var(--color-text-primary);
	}

	.tab.active {
		background-color: white;
		color: var(--color-text-primary);
		box-shadow: var(--shadow-sm);
	}

	@media (max-width: 400px) {
		.header-top {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-sm);
		}

		.back-button {
			padding-left: 0;
		}
	}
</style>
