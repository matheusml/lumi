<script lang="ts">
	/**
	 * Adventure Complete Page
	 *
	 * Celebrates completion without emphasizing scores.
	 */

	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'
	import { LumiButton, Icon } from '$lib/components'
	import { adventureLimitService } from '$lib/services'
	import { getTranslations, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'

	const correct = $derived(parseInt($page.url.searchParams.get('correct') ?? '0'))
	const total = $derived(parseInt($page.url.searchParams.get('total') ?? '5'))

	let canStart = $state(true)
	let remaining = $state(3)
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

	$effect(() => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('lumi-limits')
			if (stored) {
				try {
					adventureLimitService.loadState(JSON.parse(stored))
				} catch {
					// Ignore parse errors
				}
			}
			canStart = adventureLimitService.canStartAdventure()
			remaining = adventureLimitService.getRemainingAdventures()
		}
	})

	function startMathAdventure() {
		if (canStart) {
			goto('/adventure?type=math')
		}
	}

	function startGrammarAdventure() {
		if (canStart) {
			goto('/adventure?type=grammar')
		}
	}

	function startLogicAdventure() {
		if (canStart) {
			goto('/adventure?type=logic')
		}
	}
</script>

<svelte:head>
	<title>{t.complete.title} - {t.home.title}</title>
</svelte:head>

<main class="complete">
	<div class="celebration">
		<span class="emoji">🎉</span>
		<h1 class="title">{t.complete.congratulations}</h1>
		<p class="message">{t.complete.message}</p>
	</div>

	<div class="summary">
		<p class="summary-text">
			{t.complete.youGot}
			{correct}
			{t.complete.of}
			{total}
			{t.complete.problems}
		</p>
		{#if correct === total}
			<p class="encouragement">{t.complete.perfect} ⭐</p>
		{:else if correct >= total * 0.6}
			<p class="encouragement">{t.complete.great} 💪</p>
		{:else}
			<p class="encouragement">{t.complete.goodJob} 🌟</p>
		{/if}
	</div>

	{#if canStart}
		<div class="action-area">
			<p class="choose-next">{t.complete.chooseNext}</p>

			<div class="adventure-buttons">
				<LumiButton onclick={startMathAdventure} size="large">
					<Icon name="math" size={28} />
					{t.home.math}
				</LumiButton>
				<LumiButton onclick={startGrammarAdventure} size="large" variant="secondary">
					<Icon name="book" size={28} />
					{t.home.grammar}
				</LumiButton>
				<LumiButton onclick={startLogicAdventure} size="large" variant="tertiary">
					<Icon name="puzzle" size={28} />
					{t.home.logic}
				</LumiButton>
			</div>

			{#if remaining !== Infinity}
				<p class="remaining">
					{remaining}
					{remaining === 1 ? t.home.adventureRemaining : t.home.adventuresRemaining}
				</p>
			{/if}
		</div>
	{:else}
		<div class="limit-reached">
			<p class="limit-message">{t.home.limitReached} 🎉</p>
			<p class="outdoor-message">{t.home.encourageOutdoor}</p>
		</div>
	{/if}
</main>

<style>
	.complete {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-screen-horizontal);
		gap: var(--spacing-2xl);
		text-align: center;
	}

	.celebration {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		animation: scaleIn 0.5s ease-out;
	}

	.emoji {
		font-size: clamp(3rem, 12vw, 5rem);
		animation: gentlePulse 2s ease-in-out infinite;
	}

	.title {
		font-size: var(--font-size-display-large);
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
	}

	.message {
		font-size: var(--font-size-heading-medium);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.summary {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		background-color: var(--color-surface);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-md);
	}

	.summary-text {
		font-size: var(--font-size-body-large);
		color: var(--color-text-primary);
		margin: 0;
	}

	.encouragement {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.action-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		width: 100%;
		max-width: 400px;
	}

	.choose-next {
		font-size: var(--font-size-body-large);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.adventure-buttons {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		width: 100%;
	}

	.remaining {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-muted);
		margin: 0;
	}

	.limit-reached {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		background-color: var(--color-surface);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
	}

	.limit-message {
		font-size: var(--font-size-body-large);
		color: var(--color-text-primary);
		margin: 0;
	}

	.outdoor-message {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		margin: 0;
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes gentlePulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}
</style>
