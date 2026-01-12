<script lang="ts">
	import '../app.css'
	import { onMount } from 'svelte'
	import { initLanguage } from '$lib/i18n'
	import LanguagePicker from '$lib/i18n/LanguagePicker.svelte'

	interface Props {
		children: import('svelte').Snippet
	}

	let { children }: Props = $props()

	onMount(() => {
		initLanguage()
	})
</script>

<div class="app-container">
	<div class="language-picker-container">
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

	.language-picker-container {
		position: absolute;
		top: var(--spacing-md);
		right: var(--spacing-md);
		z-index: 50;
	}
</style>
