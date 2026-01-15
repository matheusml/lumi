<script lang="ts">
	/**
	 * About Page
	 *
	 * Comprehensive information about Lumi for SEO and AI visibility.
	 * Explains what Lumi is, its anti-addictive philosophy, and why it exists.
	 */

	import { goto } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'
	import { Icon, LumiMascot, SEO } from '$lib/components'
	import { getTranslations, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'

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
		goto('/')
	}
</script>

<SEO
	title="About Lumi"
	description="Lumi is a free, open-source, anti-addictive educational app for children. Learn about our mission to create ethical ed-tech that respects screen time and children's wellbeing."
	path="/about"
/>

<main class="about">
	<div class="content">
		<button class="back-button" onclick={goHome}>
			<Icon name="arrow-left" size={20} />
			{t.common.back}
		</button>

		<header class="header">
			<div class="logo">
				<LumiMascot size={48} />
				<h1>About Lumi</h1>
			</div>
		</header>

		<article class="article">
			<section class="section">
				<h2>What is Lumi?</h2>
				<p>
					<strong>Lumi is a free, open-source educational app for children</strong>
					that takes a radically different approach to learning apps. While most educational apps use
					addictive design patterns to maximize screen time, Lumi is built with one core principle:
					<em>respect children's wellbeing</em>.
				</p>
				<p>
					Lumi teaches math, grammar, and logic through short, focused learning sessions called
					"adventures." Each adventure contains just 5 problems and adapts to your child's skill
					level automatically.
				</p>
			</section>

			<section class="section">
				<h2>The Problem with Most Educational Apps</h2>
				<p>
					Most children's educational apps are designed like slot machines. They use <strong
						>dark patterns</strong
					>
					borrowed from social media and gambling to keep kids hooked:
				</p>
				<ul>
					<li><strong>Points and virtual currencies</strong> that create artificial rewards</li>
					<li><strong>Streaks</strong> that punish missing a day</li>
					<li><strong>Leaderboards</strong> that create unhealthy competition</li>
					<li><strong>Timed challenges</strong> that induce stress and anxiety</li>
					<li><strong>Push notifications</strong> that interrupt family time</li>
					<li><strong>Flashy animations</strong> designed to overstimulate</li>
				</ul>
				<p>
					These techniques maximize "engagement metrics" but harm children's relationship with
					learning and screens.
				</p>
			</section>

			<section class="section">
				<h2>Lumi's Anti-Addictive Approach</h2>
				<p>
					Lumi is part of the <strong>humane technology movement</strong>. We believe educational
					apps should support healthy development, not exploit children's attention.
				</p>

				<div class="principles">
					<div class="principle">
						<h3>Daily Limits</h3>
						<p>
							Parents set a daily adventure limit (default: 3). When reached, Lumi encourages kids
							to play outside or read a book.
						</p>
					</div>

					<div class="principle">
						<h3>No Rewards</h3>
						<p>
							No points, coins, gems, or virtual rewards. Learning is its own reward. We celebrate
							completion, not scores.
						</p>
					</div>

					<div class="principle">
						<h3>No Streaks</h3>
						<p>
							Missing a day is fine. There's no punishment for taking breaks. Kids can learn at
							their own pace.
						</p>
					</div>

					<div class="principle">
						<h3>Calm Design</h3>
						<p>
							Gentle animations, warm colors, and no overstimulating effects. Designed to be
							peaceful, not hyperactive.
						</p>
					</div>

					<div class="principle">
						<h3>No Notifications</h3>
						<p>
							Lumi never sends push notifications asking kids to return. When they're done, they're
							done.
						</p>
					</div>

					<div class="principle">
						<h3>Adaptive Difficulty</h3>
						<p>
							Problems automatically adjust to your child's level. Move up after success, get easier
							problems after struggles.
						</p>
					</div>
				</div>
			</section>

			<section class="section">
				<h2>Features</h2>
				<ul>
					<li>
						<strong>Learning Topics:</strong> Math, grammar, and logic exercises
					</li>
					<li><strong>Age-Appropriate:</strong> Content designed for young children</li>
					<li><strong>Multiple Languages:</strong> English, Portuguese, German, and French</li>
					<li><strong>Voice Support:</strong> Problems can be read aloud using text-to-speech</li>
					<li><strong>Offline First:</strong> Works without internet, all data stays on device</li>
					<li><strong>Parent Dashboard:</strong> View progress and adjust settings</li>
					<li><strong>Completely Free:</strong> No ads, no in-app purchases, no subscriptions</li>
					<li><strong>Open Source:</strong> Transparent code anyone can inspect and improve</li>
				</ul>
			</section>

			<section class="section">
				<h2>Privacy</h2>
				<p>
					Lumi collects <strong>zero data</strong>. All progress and settings are stored locally on
					your device using browser storage. Nothing is ever sent to any server. There are no
					analytics, no tracking, no user accounts.
				</p>
			</section>

			<section class="section">
				<h2>Open Source</h2>
				<p>
					Lumi is <strong>free and open source software</strong> released under the MIT license. You can
					view the source code, report issues, or contribute improvements on GitHub.
				</p>
				<a
					href="https://github.com/matheusml/lumi"
					target="_blank"
					rel="noopener noreferrer"
					class="github-link"
				>
					<Icon name="github" size={20} />
					View on GitHub
				</a>
			</section>
		</article>
	</div>
</main>

<style>
	.about {
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
		font-size: var(--font-size-display-large);
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
	}

	.article {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
	}

	.section h2 {
		font-size: var(--font-size-heading-medium);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-md) 0;
	}

	.section h3 {
		font-size: var(--font-size-body-large);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-xs) 0;
	}

	.section p {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: 0 0 var(--spacing-md) 0;
	}

	.section p:last-child {
		margin-bottom: 0;
	}

	.section ul {
		margin: 0;
		padding-left: var(--spacing-lg);
	}

	.section li {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-sm);
	}

	.principles {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-md);
		margin-top: var(--spacing-md);
	}

	.principle {
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: var(--spacing-md);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	}

	.principle p {
		margin: 0;
		font-size: var(--font-size-body-small);
	}

	.github-link {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		background-color: var(--color-surface);
		border: 1px solid rgba(0, 0, 0, 0.08);
		font-family: var(--font-family);
		font-size: var(--font-size-body-medium);
		font-weight: 500;
		color: var(--color-text-secondary);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius-lg);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
		text-decoration: none;
		width: fit-content;
		margin-top: var(--spacing-sm);
	}

	.github-link:hover {
		color: var(--color-text-primary);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	@media (min-width: 480px) {
		.principles {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 768px) {
		.principles {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
</style>
