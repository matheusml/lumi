<script lang="ts">
	/**
	 * Age Picker Component
	 *
	 * Dropdown for selecting the child's age (3-7).
	 * Age affects starting difficulty for problem types.
	 */

	import { onMount, onDestroy } from 'svelte'
	import { ageService, VALID_AGES, type ChildAge } from '$lib/services/age-service'
	import { getTranslations, subscribe as subscribeLanguage } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'

	let isOpen = $state(false)
	let currentAge = $state<ChildAge>(ageService.getAge())
	let t = $state<Translations>(getTranslations())
	let unsubscribeAge: (() => void) | null = null
	let unsubscribeLang: (() => void) | null = null

	onMount(() => {
		currentAge = ageService.getAge()
		t = getTranslations()

		unsubscribeAge = ageService.subscribe((age) => {
			currentAge = age
		})

		unsubscribeLang = subscribeLanguage(() => {
			t = getTranslations()
		})
	})

	onDestroy(() => {
		unsubscribeAge?.()
		unsubscribeLang?.()
	})

	function selectAge(age: ChildAge) {
		ageService.setAge(age)
		isOpen = false
	}

	function toggleDropdown() {
		isOpen = !isOpen
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement
		if (!target.closest('.age-picker')) {
			isOpen = false
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="age-picker" class:open={isOpen}>
	<button
		class="picker-button"
		onclick={toggleDropdown}
		aria-expanded={isOpen}
		aria-label={t.agePicker.ariaLabel}
	>
		<span class="age-icon">👶</span>
		<span class="age-value">{currentAge} {t.agePicker.years}</span>
		<svg class="chevron" class:open={isOpen} width="12" height="12" viewBox="0 0 12 12">
			<path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" />
		</svg>
	</button>

	{#if isOpen}
		<div class="dropdown">
			{#each VALID_AGES as age}
				<button
					class="dropdown-item"
					class:selected={age === currentAge}
					onclick={() => selectAge(age)}
				>
					<span class="age-number">{age}</span>
					<span class="age-label">{t.agePicker.yearsOld}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.age-picker {
		position: relative;
		z-index: 100;
	}

	.age-picker.open {
		z-index: 200;
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

	.age-icon {
		font-size: 1rem;
		line-height: 1;
	}

	.age-value {
		font-weight: 600;
		color: var(--color-text-primary);
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
		min-width: 120px;
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
		background-color: var(--color-primary-light);
	}

	.age-number {
		font-weight: 600;
		min-width: 1.5rem;
	}

	.age-label {
		color: var(--color-text-secondary);
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
