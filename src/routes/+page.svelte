<script lang="ts">
	/**
	 * Home Page
	 *
	 * Welcome screen with philosophy cards and adventure buttons.
	 */

	import { goto } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'
	import { LumiButton, Icon, LumiMascot } from '$lib/components'
	import { adventureLimitService } from '$lib/services'
	import { getTranslations, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'

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
		// Load state from localStorage
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

	function openParentZone() {
		goto('/parents')
	}
</script>

<svelte:head>
	<title>{t.home.title} - {t.home.tagline}</title>
</svelte:head>

<main class="home">
	<div class="content">
		<div class="logo">
			<LumiMascot size={72} />
			<h1 class="logo-text">{t.home.title}</h1>
		</div>

		<p class="headline">{t.home.tagline}</p>

		<div class="philosophy-cards">
			<div class="philosophy-card dont">
				<h3 class="philosophy-title">{t.home.whatWeDont}</h3>
				<ul class="philosophy-list">
					<li>{t.home.dontList.noAds}</li>
					<li>{t.home.dontList.noPoints}</li>
					<li>{t.home.dontList.noNotifications}</li>
					<li>{t.home.dontList.noPressure}</li>
					<li>{t.home.dontList.noComparisons}</li>
				</ul>
			</div>

			<div class="philosophy-card do">
				<h3 class="philosophy-title">{t.home.whatWeDo}</h3>
				<ul class="philosophy-list">
					<li>{t.home.doList.dailyLimit}</li>
					<li>{t.home.doList.private}</li>
					<li>{t.home.doList.calmAnimations}</li>
					<li>{t.home.doList.playfulLearning}</li>
					<li>{t.home.doList.adaptiveDifficulty}</li>
				</ul>
			</div>
		</div>

		{#if canStart}
			<div class="action-area">
				<div class="adventure-buttons">
					<LumiButton onclick={startMathAdventure} size="large"
						><Icon name="math" size={28} /> {t.home.math}</LumiButton
					>
					<LumiButton onclick={startGrammarAdventure} size="large" variant="secondary"
						><Icon name="book" size={28} /> {t.home.grammar}</LumiButton
					>
					<LumiButton onclick={startLogicAdventure} size="large" variant="tertiary"
						><Icon name="puzzle" size={28} /> {t.home.logic}</LumiButton
					>
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
				<p class="encouragement">{t.home.encourageOutdoor}</p>
			</div>
		{/if}
	</div>

	<footer class="footer">
		<button class="parent-link" onclick={openParentZone}>
			<Icon name="settings" size={16} />
			{t.home.parentZone}
		</button>
	</footer>
</main>

<style>
	.home {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--spacing-screen-horizontal);
		padding-top: var(--spacing-xl);
		text-align: center;
		overflow-y: auto;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
		max-width: 500px;
		width: 100%;
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.logo-text {
		font-size: var(--font-size-display-large);
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
	}

	.headline {
		font-size: var(--font-size-heading-medium);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
	}

	/* Philosophy cards - mobile-first: single column default */
	.philosophy-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-sm);
		width: 100%;
	}

	.philosophy-card {
		background-color: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: var(--spacing-md);
		text-align: left;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	}

	.philosophy-card.dont {
		border-top: 3px solid var(--color-try-again);
	}

	.philosophy-card.do {
		border-top: 3px solid var(--color-success);
	}

	.philosophy-title {
		font-size: var(--font-size-body-small);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-sm) 0;
	}

	.philosophy-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.philosophy-list li {
		font-size: var(--font-size-body-small);
		color: var(--color-text-secondary);
		padding-left: var(--spacing-md);
		position: relative;
		line-height: 1.3;
	}

	.dont .philosophy-list li::before {
		content: '✗';
		position: absolute;
		left: 0;
		color: var(--color-try-again);
		font-weight: 600;
	}

	.do .philosophy-list li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--color-success);
		font-weight: 600;
	}

	/* Action area */
	.action-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		width: 100%;
		max-width: 400px;
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

	.encouragement {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		margin: 0;
	}

	/* Footer */
	.footer {
		padding: var(--spacing-lg);
	}

	.parent-link {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		background-color: var(--color-surface);
		border: 1px solid rgba(0, 0, 0, 0.08);
		font-family: var(--font-family);
		font-size: var(--font-size-body-medium);
		font-weight: 500;
		color: var(--color-text-secondary);
		cursor: pointer;
		padding: var(--spacing-sm) var(--spacing-lg);
		border-radius: var(--radius-lg);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
		transition:
			color var(--transition-fast),
			background-color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	.parent-link:hover {
		color: var(--color-text-primary);
		background-color: var(--color-surface);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	/* Larger screens: side-by-side cards */
	@media (min-width: 480px) {
		.philosophy-cards {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
