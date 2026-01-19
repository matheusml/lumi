<script lang="ts">
	/**
	 * AnalyticsTab - Progress and statistics tab
	 *
	 * Shows today's adventure count and progress by activity.
	 */

	import { getTranslations, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'
	import type { ProblemType } from '$lib/types'
	import { onMount, onDestroy } from 'svelte'

	interface Props {
		todayCount: number
		activityProgress: Record<ProblemType, { difficulty: number; accuracy: number }>
		onResetToday: () => void
	}

	let { todayCount, activityProgress, onResetToday }: Props = $props()

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

	function getActivityName(type: ProblemType): string {
		const names: Record<ProblemType, string> = {
			counting: t.parents.counting,
			addition: t.parents.addition,
			subtraction: t.parents.subtraction,
			comparison: t.parents.comparison,
			patterns: t.parents.patterns,
			'odd-one-out': t.parents.oddOneOut,
			matching: t.parents.matching,
			sequence: t.parents.sequence,
			sorting: t.parents.sorting,
			'shape-recognition': t.parents.shapeRecognition,
			'color-recognition': t.parents.colorRecognition,
			'letter-recognition': t.parents.letterRecognition,
			'alphabet-order': t.parents.alphabetOrder,
			'initial-letter': t.parents.initialLetter,
			'word-completion': t.parents.wordCompletion,
			'emotion-scenario': t.parents.emotionScenario,
			'kindness-choices': t.parents.kindnessChoices
		}
		return names[type]
	}

	const mathActivities: ProblemType[] = [
		'counting',
		'addition',
		'subtraction',
		'comparison',
		'patterns'
	]
	const logicActivities: ProblemType[] = [
		'odd-one-out',
		'matching',
		'sequence',
		'shape-recognition',
		'color-recognition'
	]
	const grammarActivities: ProblemType[] = [
		'letter-recognition',
		'alphabet-order',
		'initial-letter',
		'word-completion'
	]
	const socialEmotionalActivities: ProblemType[] = ['emotion-scenario', 'kindness-choices']
</script>

<div class="analytics-tab">
	<section class="section">
		<h2 class="section-title">{t.parents.today}</h2>
		<div class="card today-card">
			<p class="stat">
				<span class="stat-value">{todayCount}</span>
				<span class="stat-label">{t.parents.adventuresCompleted}</span>
			</p>
			{#if todayCount > 0}
				<button class="text-button" onclick={onResetToday}>{t.parents.resetToday}</button>
			{/if}
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">{t.parents.progressByActivity}</h2>

		<div class="category">
			<h3 class="category-title">{t.home.math}</h3>
			<div class="progress-grid">
				{#each mathActivities as type}
					{@const data = activityProgress[type]}
					<div class="progress-card">
						<h4 class="progress-title">{getActivityName(type)}</h4>
						<div class="progress-stats">
							<span class="progress-stat">
								{t.parents.level}: <strong>{data.difficulty}</strong>/4
							</span>
							<span class="progress-stat">
								{t.parents.accuracy}: <strong>{data.accuracy}%</strong>
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="category">
			<h3 class="category-title">{t.home.logic}</h3>
			<div class="progress-grid">
				{#each logicActivities as type}
					{@const data = activityProgress[type]}
					<div class="progress-card">
						<h4 class="progress-title">{getActivityName(type)}</h4>
						<div class="progress-stats">
							<span class="progress-stat">
								{t.parents.level}: <strong>{data.difficulty}</strong>/4
							</span>
							<span class="progress-stat">
								{t.parents.accuracy}: <strong>{data.accuracy}%</strong>
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="category">
			<h3 class="category-title">{t.home.grammar}</h3>
			<div class="progress-grid">
				{#each grammarActivities as type}
					{@const data = activityProgress[type]}
					<div class="progress-card">
						<h4 class="progress-title">{getActivityName(type)}</h4>
						<div class="progress-stats">
							<span class="progress-stat">
								{t.parents.level}: <strong>{data.difficulty}</strong>/4
							</span>
							<span class="progress-stat">
								{t.parents.accuracy}: <strong>{data.accuracy}%</strong>
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="category">
			<h3 class="category-title">{t.home.socialEmotional}</h3>
			<div class="progress-grid">
				{#each socialEmotionalActivities as type}
					{@const data = activityProgress[type]}
					<div class="progress-card">
						<h4 class="progress-title">{getActivityName(type)}</h4>
						<div class="progress-stats">
							<span class="progress-stat">
								{t.parents.level}: <strong>{data.difficulty}</strong>/4
							</span>
							<span class="progress-stat">
								{t.parents.accuracy}: <strong>{data.accuracy}%</strong>
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>

<style>
	.analytics-tab {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.section-title {
		font-size: var(--font-size-body-large);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
	}

	.card {
		background-color: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: var(--spacing-md);
		box-shadow: var(--shadow-sm);
	}

	.today-card {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.stat {
		display: flex;
		align-items: baseline;
		gap: var(--spacing-sm);
		margin: 0;
	}

	.stat-value {
		font-size: var(--font-size-display-small);
		font-weight: 700;
		color: var(--color-primary);
	}

	.stat-label {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
	}

	.text-button {
		background: none;
		border: none;
		font-family: var(--font-family);
		font-size: var(--font-size-body-small);
		color: var(--color-text-muted);
		cursor: pointer;
		padding: var(--spacing-xs);
		text-decoration: underline;
		align-self: flex-start;
	}

	.text-button:hover {
		color: var(--color-text-secondary);
	}

	.category {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.category-title {
		font-size: var(--font-size-body-medium);
		font-weight: 600;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.progress-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: var(--spacing-sm);
	}

	.progress-card {
		background-color: var(--color-surface);
		border-radius: var(--radius-md);
		padding: var(--spacing-sm) var(--spacing-md);
		box-shadow: var(--shadow-sm);
	}

	.progress-title {
		font-size: var(--font-size-body-small);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-xs) 0;
	}

	.progress-stats {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.progress-stat {
		font-size: var(--font-size-body-small);
		color: var(--color-text-secondary);
	}

	@media (min-width: 768px) {
		.progress-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.progress-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
