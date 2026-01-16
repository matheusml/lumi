<script lang="ts">
	/**
	 * FAQ Page
	 *
	 * Frequently asked questions about Lumi.
	 * Includes FAQ schema markup for SEO and AI visibility.
	 */

	import { goto } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'
	import { Icon, LumiMascot } from '$lib/components'
	import { localizedPath } from '$lib/utils/navigation'
	import { getTranslations, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'

	interface Props {
		data: { lang: string }
	}

	let { data }: Props = $props()

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

	function goHome() {
		goto(localizedPath('/'))
	}

	const SITE_URL = 'https://playlumi.app'

	// FAQ items derived from translations
	const faqKeys = [
		'antiAddictive',
		'noStreaksRewards',
		'reallyFree',
		'ages',
		'offline',
		'subjects',
		'dailyLimit',
		'privacy',
		'languages',
		'voice',
		'leaderboard',
		'comparison',
		'openSource',
		'adaptiveDifficulty'
	] as const

	// Generate FAQ schema for SEO - must be derived from current translations
	let faqSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqKeys.map((key) => ({
			'@type': 'Question',
			name: t.faq.questions[key].question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: t.faq.questions[key].answer
			}
		}))
	})

	let jsonLdFaq = $derived(JSON.stringify(faqSchema))

	// Construct script tag to avoid ESLint parsing issues with <script in template literals
	let ldScriptFaq = $derived(
		'<scr' + 'ipt type="application/ld+json">' + jsonLdFaq + '</scr' + 'ipt>'
	)
</script>

<svelte:head>
	<title>{t.faq.title} - Lumi</title>
	<meta name="description" content={t.faq.metaDescription} />
	<meta
		name="keywords"
		content="FAQ, anti-addictive app, educational app questions, educational app for kids, ethical ed-tech, screen time, humane technology"
	/>
	<link rel="canonical" href={`${SITE_URL}/${data.lang}/faq`} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`${SITE_URL}/${data.lang}/faq`} />
	<meta property="og:title" content={`${t.faq.title} - Lumi`} />
	<meta property="og:description" content={t.faq.metaDescription} />
	<meta property="og:site_name" content="Lumi" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={`${t.faq.title} - Lumi`} />
	<meta name="twitter:description" content={t.faq.metaDescription} />

	<!-- FAQ Schema -->
	{@html ldScriptFaq}
</svelte:head>

<main class="faq">
	<div class="content">
		<button class="back-button" onclick={goHome}>
			<Icon name="arrow-left" size={20} />
			{t.common.back}
		</button>

		<header class="header">
			<div class="logo">
				<LumiMascot size={48} />
				<h1>{t.faq.title}</h1>
			</div>
			<p class="subtitle">
				{t.faq.subtitle}
			</p>
		</header>

		<div class="faq-list">
			{#each faqKeys as key, index}
				<details class="faq-item" id={`faq-${index}`}>
					<summary class="faq-question">
						<span>{t.faq.questions[key].question}</span>
						<Icon name="chevron-down" size={20} />
					</summary>
					<p class="faq-answer">{t.faq.questions[key].answer}</p>
				</details>
			{/each}
		</div>

		<section class="more-questions">
			<h2>{t.faq.stillHaveQuestions}</h2>
			<p>
				{t.faq.stillHaveQuestionsDescription}
			</p>
			<a
				href="https://github.com/matheusml/lumi/issues"
				target="_blank"
				rel="noopener noreferrer"
				class="github-link"
			>
				<Icon name="github" size={20} />
				{t.faq.askOnGitHub}
			</a>
		</section>
	</div>
</main>

<style>
	.faq {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--spacing-screen-horizontal);
		padding-top: var(--spacing-lg);
		overflow-y: auto;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		max-width: 700px;
		width: 100%;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		background: none;
		border: none;
		font-family: var(--font-family);
		font-size: var(--font-size-body-medium);
		font-weight: 500;
		color: var(--color-text-secondary);
		cursor: pointer;
		padding: var(--spacing-sm) 0;
		align-self: flex-start;
	}

	.back-button:hover {
		color: var(--color-text-primary);
	}

	.header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.logo h1 {
		font-size: var(--font-size-heading-large);
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
	}

	.subtitle {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.faq-item {
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
		overflow: hidden;
	}

	.faq-question {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		cursor: pointer;
		font-size: var(--font-size-body-medium);
		font-weight: 600;
		color: var(--color-text-primary);
		list-style: none;
	}

	.faq-question::-webkit-details-marker {
		display: none;
	}

	.faq-question span {
		flex: 1;
	}

	.faq-item[open] .faq-question :global(svg) {
		transform: rotate(180deg);
	}

	.faq-question :global(svg) {
		flex-shrink: 0;
		color: var(--color-text-muted);
		transition: transform var(--transition-fast);
	}

	.faq-answer {
		padding: 0 var(--spacing-md) var(--spacing-md);
		margin: 0;
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.more-questions {
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: var(--spacing-lg);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
		margin-top: var(--spacing-md);
	}

	.more-questions h2 {
		font-size: var(--font-size-heading-small);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-sm) 0;
	}

	.more-questions p {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		margin: 0 0 var(--spacing-md) 0;
		line-height: 1.5;
	}

	.github-link {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		background-color: var(--color-background);
		border: 1px solid rgba(0, 0, 0, 0.08);
		font-family: var(--font-family);
		font-size: var(--font-size-body-medium);
		font-weight: 500;
		color: var(--color-text-secondary);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius-lg);
		text-decoration: none;
		width: fit-content;
	}

	.github-link:hover {
		color: var(--color-text-primary);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	@media (min-width: 480px) {
		.logo h1 {
			font-size: var(--font-size-display-large);
		}
	}
</style>
