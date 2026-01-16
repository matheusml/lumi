<script lang="ts">
	/**
	 * Language Picker Component
	 *
	 * Dropdown for selecting the app language.
	 */

	import { onMount, onDestroy } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { getLanguage, languages, subscribe } from './index'
	import { stripLanguagePrefix } from '$lib/utils/navigation'
	import type { SupportedLanguage } from './types'

	let isOpen = $state(false)
	let currentLang = $state<SupportedLanguage>(getLanguage())

	// Subscribe to language changes
	let unsubscribe: (() => void) | null = null

	onMount(() => {
		currentLang = getLanguage()
		unsubscribe = subscribe((lang) => {
			currentLang = lang
		})
	})

	onDestroy(() => {
		unsubscribe?.()
	})

	function selectLanguage(lang: SupportedLanguage) {
		isOpen = false

		// Get current path without language prefix
		const currentPath = $page.url.pathname
		const pathWithoutLang = stripLanguagePrefix(currentPath)

		// Build new path with selected language
		const newPath = `/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`

		// Preserve query params
		const search = $page.url.search
		goto(newPath + search)
	}

	function toggleDropdown() {
		isOpen = !isOpen
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement
		if (!target.closest('.language-picker')) {
			isOpen = false
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="language-picker">
	<button
		class="picker-button"
		onclick={toggleDropdown}
		aria-expanded={isOpen}
		aria-label="Select language"
	>
		<span class="flag">{languages[currentLang].flag}</span>
		<span class="lang-code">{currentLang === 'pt-BR' ? 'PT' : currentLang.toUpperCase()}</span>
		<svg class="chevron" class:open={isOpen} width="12" height="12" viewBox="0 0 12 12">
			<path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" />
		</svg>
	</button>

	{#if isOpen}
		<div class="dropdown">
			{#each Object.values(languages) as lang}
				<button
					class="dropdown-item"
					class:selected={lang.code === currentLang}
					onclick={() => selectLanguage(lang.code)}
				>
					<span class="flag">{lang.flag}</span>
					<span class="lang-name">{lang.name}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-picker {
		position: relative;
		z-index: 100;
	}

	.picker-button {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background-color: var(--color-surface);
		cursor: pointer;
		font-family: var(--font-family);
		font-size: var(--font-size-body-small);
		color: var(--color-text-secondary);
		transition:
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
		min-height: var(--touch-minimum);
	}

	.picker-button:hover {
		border-color: var(--color-secondary);
	}

	.picker-button:focus {
		outline: none;
		border-color: var(--color-secondary);
		box-shadow: 0 0 0 2px var(--color-secondary-light);
	}

	.flag {
		font-size: 1rem;
		line-height: 1;
	}

	.lang-code {
		font-weight: 500;
	}

	.chevron {
		transition: transform var(--transition-fast);
	}

	.chevron.open {
		transform: rotate(180deg);
	}

	.dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: var(--spacing-xs);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
		min-width: 150px;
		overflow: hidden;
		animation: fadeIn 0.15s ease-out;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		border: none;
		background: none;
		cursor: pointer;
		font-family: var(--font-family);
		font-size: var(--font-size-body-small);
		color: var(--color-text-primary);
		text-align: left;
		transition: background-color var(--transition-fast);
		min-height: var(--touch-minimum);
	}

	.dropdown-item:hover {
		background-color: var(--color-surface-hover);
	}

	.dropdown-item.selected {
		background-color: var(--color-secondary-light);
	}

	.lang-name {
		flex: 1;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
