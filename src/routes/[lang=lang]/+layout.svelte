<script lang="ts">
	/**
	 * Language Layout
	 *
	 * Sets the language from the URL parameter and provides app-wide UI elements.
	 */

	import '../../app.css'
	import { onMount } from 'svelte'
	import { setLanguageFromUrl, initAge, ageService } from '$lib/services'
	import { difficultyManager } from '$lib/services/difficulty-manager'
	import LanguagePicker from '$lib/i18n/LanguagePicker.svelte'
	import AgePicker from '$lib/components/AgePicker.svelte'

	interface Props {
		data: { lang: string }
		children: import('svelte').Snippet
	}

	let { data, children }: Props = $props()

	// Set language from URL param whenever it changes
	$effect(() => {
		setLanguageFromUrl(data.lang)
	})

	onMount(() => {
		initAge()

		// Set initial starting difficulty based on age
		difficultyManager.setDefaultStartingDifficulty(ageService.getStartingDifficulty())

		// Update difficulty when age changes
		ageService.subscribe(() => {
			difficultyManager.setDefaultStartingDifficulty(ageService.getStartingDifficulty())
		})
	})
</script>

<div class="app-container">
	<div class="pickers-container">
		<AgePicker />
		<LanguagePicker />
	</div>
	<div class="content-container">
		{@render children()}
	</div>
</div>

<style>
	.app-container {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	/* Mobile-first: pickers in document flow at top-right */
	.pickers-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm);
		z-index: 50;
		flex-shrink: 0;
	}

	.content-container {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	/* Larger screens: absolute position for cleaner layout */
	@media (min-width: 480px) {
		.app-container {
			position: relative;
		}

		.pickers-container {
			position: absolute;
			top: var(--spacing-md);
			right: var(--spacing-md);
			padding: 0;
			flex-direction: column;
			align-items: flex-end;
		}
	}
</style>
