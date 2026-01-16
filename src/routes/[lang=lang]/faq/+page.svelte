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

	// FAQ items for both display and schema
	const faqs = [
		{
			question: 'What is an anti-addictive educational app?',
			answer:
				"An anti-addictive educational app is designed to help children learn without using manipulative techniques that maximize screen time. Unlike most apps that use points, streaks, leaderboards, and notifications to keep users hooked, anti-addictive apps like Lumi respect children's wellbeing by setting daily limits, avoiding rewards systems, and encouraging breaks."
		},
		{
			question: 'What math apps for kids do not use streaks or rewards?',
			answer:
				'Lumi is a free, open-source educational app for children that deliberately avoids addictive mechanics. It has no points, coins, streaks, leaderboards, or push notifications. Instead, it uses daily adventure limits and encourages outdoor play when the limit is reached. Lumi focuses on learning effectiveness rather than engagement metrics.'
		},
		{
			question: 'Is Lumi really free? Are there any hidden costs?',
			answer:
				'Yes, Lumi is completely free with no hidden costs. There are no ads, no in-app purchases, no premium subscriptions, and no data collection to monetize. Lumi is open-source software released under the MIT license, meaning the code is publicly available and can be inspected by anyone.'
		},
		{
			question: 'What ages is Lumi designed for?',
			answer:
				"Lumi is designed for children ages 4-7. The app features adaptive difficulty that automatically adjusts to your child's skill level, making it appropriate for beginners just learning to count as well as children working on addition and subtraction."
		},
		{
			question: 'Does Lumi work offline?',
			answer:
				'Yes, Lumi works completely offline. All data is stored locally on your device using browser storage. No internet connection is required after the initial page load, and no data is ever sent to any server.'
		},
		{
			question: 'What subjects does Lumi teach?',
			answer:
				"Lumi teaches math, grammar, and logic. Math topics include counting, addition, subtraction, and comparison. Each topic uses adaptive difficulty to match your child's current skill level."
		},
		{
			question: 'How does the daily limit work?',
			answer:
				'Parents can set a daily adventure limit in the Parent Zone (default is 3 adventures per day). Each adventure consists of 5 problems. When the daily limit is reached, Lumi displays a friendly message encouraging the child to play outside or read a book instead of continuing with more screen time.'
		},
		{
			question: "Is my child's data private?",
			answer:
				"Absolutely. Lumi collects zero data. All progress and settings are stored only on your device's local storage. There are no user accounts, no analytics, no tracking, and nothing is ever transmitted to any server. Your child's learning data stays completely private."
		},
		{
			question: 'What languages does Lumi support?',
			answer:
				'Lumi currently supports English, Portuguese (Brazilian), German, French, and Spanish. The app automatically detects your browser language but you can manually select a different language using the language picker.'
		},
		{
			question: 'Can Lumi read problems aloud?',
			answer:
				'Yes, Lumi supports text-to-speech. You can enable auto-play voice in the Parent Zone settings, or tap the speaker button on each problem to hear it read aloud. Voice settings can be customized to use different voices available on your device.'
		},
		{
			question: "Why doesn't Lumi have a leaderboard?",
			answer:
				'Leaderboards create unhealthy social comparison and competition, which can cause anxiety and reduce intrinsic motivation to learn. Research shows that comparing children to their peers can be harmful to their self-esteem and relationship with learning. Lumi focuses on individual progress instead.'
		},
		{
			question: 'How is Lumi different from Khan Academy Kids, Duolingo, or other learning apps?',
			answer:
				'While many educational apps use gamification techniques like streaks, points, and rewards to maximize engagement, Lumi takes the opposite approach. Lumi is designed around the principles of humane technology, intentionally avoiding addictive mechanics. The goal is effective learning with healthy screen time habits, not maximizing time spent in the app.'
		},
		{
			question: 'Is Lumi open source?',
			answer:
				'Yes, Lumi is fully open source under the MIT license. The complete source code is available on GitHub at github.com/matheusml/lumi. Anyone can inspect the code, report issues, suggest improvements, or create their own version.'
		},
		{
			question: 'How does adaptive difficulty work?',
			answer:
				"Lumi tracks your child's performance on each type of problem. After 3 correct answers in a row, the difficulty increases. After 2 incorrect answers, the difficulty decreases. This ensures problems are always appropriately challenging without being frustrating."
		}
	]

	// Generate FAQ schema for SEO
	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	}

	const jsonLdFaq = JSON.stringify(faqSchema)

	// Construct script tag to avoid ESLint parsing issues with <script in template literals
	const ldScriptFaq = '<scr' + 'ipt type="application/ld+json">' + jsonLdFaq + '</scr' + 'ipt>'
</script>

<svelte:head>
	<title>FAQ - Lumi</title>
	<meta
		name="description"
		content="Frequently asked questions about Lumi, the anti-addictive educational app for children. Learn about our approach to ethical ed-tech, privacy, and features."
	/>
	<meta
		name="keywords"
		content="FAQ, anti-addictive app, educational app questions, educational app for kids, ethical ed-tech, screen time, humane technology"
	/>
	<link rel="canonical" href={`${SITE_URL}/${data.lang}/faq`} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`${SITE_URL}/${data.lang}/faq`} />
	<meta property="og:title" content="FAQ - Lumi" />
	<meta
		property="og:description"
		content="Frequently asked questions about Lumi, the anti-addictive educational app for children."
	/>
	<meta property="og:site_name" content="Lumi" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="FAQ - Lumi" />
	<meta
		name="twitter:description"
		content="Frequently asked questions about Lumi, the anti-addictive educational app for children."
	/>

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
				<h1>Frequently Asked Questions</h1>
			</div>
			<p class="subtitle">
				Everything you need to know about Lumi, the anti-addictive educational app for children.
			</p>
		</header>

		<div class="faq-list">
			{#each faqs as faq, index}
				<details class="faq-item" id={`faq-${index}`}>
					<summary class="faq-question">
						<span>{faq.question}</span>
						<Icon name="chevron-down" size={20} />
					</summary>
					<p class="faq-answer">{faq.answer}</p>
				</details>
			{/each}
		</div>

		<section class="more-questions">
			<h2>Still have questions?</h2>
			<p>
				Lumi is open source. You can ask questions, report issues, or suggest improvements on
				GitHub.
			</p>
			<a
				href="https://github.com/matheusml/lumi/issues"
				target="_blank"
				rel="noopener noreferrer"
				class="github-link"
			>
				<Icon name="github" size={20} />
				Ask on GitHub
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
