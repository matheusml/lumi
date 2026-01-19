<script lang="ts">
	/**
	 * About Page
	 *
	 * Comprehensive information about Lumi for SEO and AI visibility.
	 * Explains what Lumi is, its anti-addictive philosophy, and why it exists.
	 */

	import { goto } from '$app/navigation'
	import { Icon, LumiMascot, SEO } from '$lib/components'
	import { getTranslationsForLang } from '$lib/i18n'

	interface Props {
		data: { lang: string }
	}

	let { data }: Props = $props()

	// Use $derived to reactively get translations based on the URL language
	let t = $derived(getTranslationsForLang(data.lang))

	function goHome() {
		goto(`/${data.lang}`)
	}
</script>

<SEO title={t.about.title} description={t.about.metaDescription} path="/about" lang={data.lang} />

<main class="about">
	<div class="content">
		<button class="back-button" onclick={goHome}>
			<Icon name="arrow-left" size={20} />
			{t.common.back}
		</button>

		<header class="header">
			<div class="logo">
				<LumiMascot size={48} />
				<h1>{t.about.title}</h1>
			</div>
		</header>

		<article class="article">
			<section class="section">
				<h2>{t.about.whatIsLumi}</h2>
				<p>
					<strong>{t.about.whatIsLumiIntro}</strong>
					{t.about.whatIsLumiIntroEnd}
					<em>{t.about.whatIsLumiIntroHighlight}</em>.
				</p>
				<p>
					{t.about.whatIsLumiDescription}
				</p>
			</section>

			<section class="section">
				<h2>{t.about.problemTitle}</h2>
				<p>
					{t.about.problemIntro}
					<strong>{t.about.problemDarkPatterns}</strong>
					borrowed from social media and gambling to keep kids hooked:
				</p>
				<ul>
					<li><strong>{t.about.problemList.points}</strong></li>
					<li><strong>{t.about.problemList.streaks}</strong></li>
					<li><strong>{t.about.problemList.leaderboards}</strong></li>
					<li><strong>{t.about.problemList.timedChallenges}</strong></li>
					<li><strong>{t.about.problemList.pushNotifications}</strong></li>
					<li><strong>{t.about.problemList.flashyAnimations}</strong></li>
				</ul>
				<p>
					{t.about.problemConclusion}
				</p>
			</section>

			<section class="section">
				<h2>{t.about.approachTitle}</h2>
				<p>
					{t.about.approachIntro}
					<strong>{t.about.approachHumaneTech}</strong>{t.about.approachIntroEnd}
				</p>

				<div class="principles">
					<div class="principle">
						<h3>{t.about.principles.dailyLimits.title}</h3>
						<p>
							{t.about.principles.dailyLimits.description}
						</p>
					</div>

					<div class="principle">
						<h3>{t.about.principles.noRewards.title}</h3>
						<p>
							{t.about.principles.noRewards.description}
						</p>
					</div>

					<div class="principle">
						<h3>{t.about.principles.noStreaks.title}</h3>
						<p>
							{t.about.principles.noStreaks.description}
						</p>
					</div>

					<div class="principle">
						<h3>{t.about.principles.calmDesign.title}</h3>
						<p>
							{t.about.principles.calmDesign.description}
						</p>
					</div>

					<div class="principle">
						<h3>{t.about.principles.noNotifications.title}</h3>
						<p>
							{t.about.principles.noNotifications.description}
						</p>
					</div>

					<div class="principle">
						<h3>{t.about.principles.adaptiveDifficulty.title}</h3>
						<p>
							{t.about.principles.adaptiveDifficulty.description}
						</p>
					</div>
				</div>
			</section>

			<section class="section">
				<h2>{t.about.featuresTitle}</h2>
				<ul>
					<li>{t.about.features.learningTopics}</li>
					<li>{t.about.features.ageAppropriate}</li>
					<li>{t.about.features.multipleLanguages}</li>
					<li>{t.about.features.voiceSupport}</li>
					<li>{t.about.features.offlineFirst}</li>
					<li>{t.about.features.parentDashboard}</li>
					<li>{t.about.features.completelyFree}</li>
					<li>{t.about.features.openSourceFeature}</li>
				</ul>
			</section>

			<section class="section">
				<h2>{t.about.privacyTitle}</h2>
				<p>
					Lumi collects <strong>{t.about.privacyZeroData}</strong>{t.about.privacyDescription}
				</p>
			</section>

			<section class="section">
				<h2>{t.about.openSourceTitle}</h2>
				<p>
					Lumi is <strong>{t.about.openSourceFree}</strong>{t.about.openSourceDescription}
				</p>
				<a
					href="https://github.com/matheusml/lumi"
					target="_blank"
					rel="noopener noreferrer"
					class="github-link"
				>
					<Icon name="github" size={20} />
					{t.about.viewOnGitHub}
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
