<script lang="ts">
	import '../app.css'
	import { onMount } from 'svelte'
	import { initLanguage } from '$lib/i18n'
	import { initAge, ageService } from '$lib/services/age-service'
	import { difficultyManager } from '$lib/services/difficulty-manager'
	import LanguagePicker from '$lib/i18n/LanguagePicker.svelte'
	import AgePicker from '$lib/components/AgePicker.svelte'

	interface Props {
		children: import('svelte').Snippet
	}

	let { children }: Props = $props()

	onMount(() => {
		initLanguage()
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
	{@render children()}
</div>

<style>
	.app-container {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.pickers-container {
		position: absolute;
		top: var(--spacing-md);
		right: var(--spacing-md);
		z-index: 50;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--spacing-xs);
	}

	/* Responsive: tighter spacing on mobile */
	@media (max-width: 480px) {
		.pickers-container {
			top: var(--spacing-sm);
			right: var(--spacing-sm);
		}
	}
</style>
