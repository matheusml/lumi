<script lang="ts">
	/**
	 * Home Page
	 *
	 * Welcome screen with philosophy cards and adventure buttons.
	 */

	import { goto } from '$app/navigation'
	import { Icon, LumiMascot, AdventureTiles, SEO } from '$lib/components'
	import { adventureLimitService } from '$lib/services'
	import { getTranslationsForLang } from '$lib/i18n'

	interface Props {
		data: { lang: string }
	}

	let { data }: Props = $props()

	let canStart = $state(true)
	let remaining = $state(3)

	// Use $derived to reactively get translations based on the URL language
	let t = $derived(getTranslationsForLang(data.lang))

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

	function openParentZone() {
		goto(`/${data.lang}/parents`)
	}
</script>

<SEO
	title="Lumi - Anti-addictive educational app for children"
	description="Lumi is a free, open-source educational app for children. No points, streaks, or addictive mechanics. Respects screen time with daily limits and encourages outdoor play."
	path=""
	lang={data.lang}
/>

<main class="home">
	<div class="content">
		<div class="logo">
			<LumiMascot size={48} />
			<h1 class="logo-text">{t.home.title}</h1>
		</div>

		<p class="headline">{t.home.tagline}</p>

		<p class="philosophy">{t.home.philosophy}</p>

		<div class="philosophy-cards">
			<div class="philosophy-card dont">
				<h3 class="philosophy-title">{t.home.whatWeDont}</h3>
				<ul class="philosophy-list">
					<li>{t.home.dontList.noPoints}</li>
					<li>{t.home.dontList.noStreaks}</li>
					<li>{t.home.dontList.noLeaderboards}</li>
					<li>{t.home.dontList.noTimedChallenges}</li>
					<li>{t.home.dontList.noNotifications}</li>
					<li>{t.home.dontList.noFlashyAnimations}</li>
				</ul>
			</div>

			<div class="philosophy-card do">
				<h3 class="philosophy-title">{t.home.whatWeDo}</h3>
				<ul class="philosophy-list">
					<li>{t.home.doList.shortAdventures}</li>
					<li>{t.home.doList.dailyLimits}</li>
					<li>{t.home.doList.celebrateCompletion}</li>
					<li>{t.home.doList.calmAnimations}</li>
					<li>{t.home.doList.encourageOutdoor}</li>
					<li>{t.home.doList.adaptiveDifficulty}</li>
				</ul>
			</div>
		</div>

		{#if canStart}
			<div class="action-area">
				<h2 class="action-heading">{t.home.startAdventure}</h2>
				<AdventureTiles {canStart} {t} />

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

		<footer class="footer">
			<div class="footer-links">
				<a href={`/${data.lang}/about`} class="footer-link">{t.home.about}</a>
				<a href={`/${data.lang}/faq`} class="footer-link">{t.home.faq}</a>
				<a
					href="https://github.com/matheusml/lumi"
					target="_blank"
					rel="noopener noreferrer"
					class="footer-link"
				>
					<Icon name="github" size={16} />
					{t.home.openSource}
				</a>
			</div>
			<button class="parent-link" onclick={openParentZone}>
				<Icon name="settings" size={16} />
				{t.home.parentZone}
			</button>
		</footer>
	</div>
</main>

<style>
	.home {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--spacing-screen-horizontal);
		padding-top: var(--spacing-lg);
		overflow-y: auto;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--spacing-md);
		max-width: 500px;
		width: 100%;
	}

	.logo {
		display: flex;
		flex-direction: row;
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
		padding-right: 100px; /* Avoid overlap with language/age pickers */
	}

	@media (min-width: 480px) {
		.headline {
			padding-right: 0; /* Pickers have more room on larger screens */
		}
	}

	.philosophy {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		line-height: 1.5;
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
		align-items: stretch;
		gap: var(--spacing-sm);
		width: 100%;
		margin-top: var(--spacing-sm);
	}

	.action-heading {
		font-size: var(--font-size-heading-small);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-top: auto;
		padding-top: var(--spacing-lg);
		flex-wrap: wrap;
		gap: var(--spacing-sm);
	}

	.footer-links {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	.footer-link,
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
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius-lg);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
		text-decoration: none;
		transition:
			color var(--transition-fast),
			background-color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	.footer-link:hover,
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
