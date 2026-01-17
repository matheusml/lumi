<script lang="ts">
	/**
	 * Adventure Page
	 *
	 * The main learning experience - 5 problems per adventure.
	 */

	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { onMount, onDestroy } from 'svelte'
	import { localizedPath, localizedUrl } from '$lib/utils/navigation'
	import {
		LumiButton,
		ChoiceButton,
		ProgressDots,
		SpeakerButton,
		CountableObject,
		AnimatedEquation,
		PatternCircle,
		LetterDisplay,
		WordDisplay,
		LetterSequence
	} from '$lib/components'
	import { problemService } from '$lib/problems'
	import {
		difficultyManager,
		adventureLimitService,
		speechService,
		ageService
	} from '$lib/services'
	import { getTranslations, localize, getSpeechLanguage, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'
	import type {
		Problem,
		AnswerValue,
		AnswerState,
		ProblemResult,
		AdventureCategory
	} from '$lib/types'
	import { PROBLEMS_PER_ADVENTURE } from '$lib/types'

	// Adventure type from URL
	const adventureType = $derived(
		($page.url.searchParams.get('type') as AdventureCategory) || 'math'
	)

	// i18n state
	let t = $state<Translations>(getTranslations())
	let unsubscribeLang: (() => void) | null = null
	let unsubscribeAge: (() => void) | null = null

	// Adventure state
	let problems: Problem[] = $state([])
	let currentIndex = $state(0)
	let results: ProblemResult[] = $state([])

	// Current problem state
	let selectedAnswer: AnswerValue | null = $state(null)
	let answerStates: Map<string, AnswerState> = $state(new Map())
	let hasAnswered = $state(false)
	let isCorrect = $state(false)

	// Auto-progress timeout (for correct answers)
	let autoProgressTimeout: ReturnType<typeof setTimeout> | null = null

	// Derived
	const currentProblem = $derived(problems[currentIndex])
	const completedCount = $derived(results.length)
	const isLastProblem = $derived(currentIndex === problems.length - 1)
	const isToddlerMode = $derived(ageService.getAge() <= 4)

	onMount(() => {
		// Subscribe to language changes
		unsubscribeLang = subscribe(() => {
			t = getTranslations()
		})

		// If age changes during adventure, go back home (problems need regeneration)
		unsubscribeAge = ageService.subscribe(() => {
			goto(localizedPath('/'))
		})

		// Load state and generate problems
		loadState()
		generateProblems()
	})

	onDestroy(() => {
		// Clean up subscriptions
		unsubscribeLang?.()
		unsubscribeAge?.()
		// Clean up auto-progress timeout
		if (autoProgressTimeout) {
			clearTimeout(autoProgressTimeout)
		}
	})

	function loadState() {
		if (typeof window === 'undefined') return

		// Load difficulty progress
		const progressData = localStorage.getItem('lumi-progress')
		if (progressData) {
			try {
				difficultyManager.loadProgress(JSON.parse(progressData))
			} catch {
				// Ignore
			}
		}

		// Load seen signatures
		const seenData = localStorage.getItem('lumi-seen')
		if (seenData) {
			try {
				const parsed = JSON.parse(seenData)
				const map = new Map(Object.entries(parsed).map(([k, v]) => [k, new Date(v as string)]))
				problemService.loadSeenSignatures(map)
			} catch {
				// Ignore
			}
		}
	}

	function generateProblems() {
		const difficulties = difficultyManager.getAllDifficulties()

		// Get age-appropriate problem types for this adventure
		const problemTypes = ageService.getProblemTypesForAge(adventureType)
		const problemTypesSet = new Set<string>(problemTypes)
		const filteredDifficulties = new Map(
			[...difficulties].filter(([type]) => problemTypesSet.has(type))
		)

		// Generate problems using the filtered types
		const generatedProblems: Problem[] = []
		const shuffledTypes = shuffle([...problemTypes])

		for (let i = 0; i < PROBLEMS_PER_ADVENTURE; i++) {
			const type = shuffledTypes[i % shuffledTypes.length]
			const difficulty = filteredDifficulties.get(type) || 1
			const problem = problemService.generateProblem(type, difficulty)

			if (problem) {
				generatedProblems.push(problem)
			} else {
				// Fallback: try other types
				for (const fallbackType of problemTypes) {
					if (fallbackType !== type) {
						const fallbackDifficulty = filteredDifficulties.get(fallbackType) || 1
						const fallbackProblem = problemService.generateProblem(fallbackType, fallbackDifficulty)
						if (fallbackProblem) {
							generatedProblems.push(fallbackProblem)
							break
						}
					}
				}
			}
		}

		problems = generatedProblems

		// Auto-speak first problem if voice is enabled
		if (problems.length > 0) {
			const autoVoice = localStorage.getItem('lumi-auto-voice') === 'true'
			if (autoVoice) {
				setTimeout(() => {
					speechService.speak(localize(problems[0].prompt), {
						lang: getSpeechLanguage() as 'pt-BR' | 'en-US' | 'de-DE' | 'fr-FR' | 'es-ES'
					})
				}, 500)
			}
		}
	}

	// Shuffle helper
	function shuffle<T>(array: T[]): T[] {
		const result = [...array]
		for (let i = result.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[result[i], result[j]] = [result[j], result[i]]
		}
		return result
	}

	function selectAnswer(answer: AnswerValue) {
		if (hasAnswered) return

		selectedAnswer = answer
		hasAnswered = true

		// Check if correct
		isCorrect = answersMatch(answer, currentProblem.correctAnswer)

		// Update answer states
		const newStates = new Map<string, AnswerState>()
		for (const choice of currentProblem.answerChoices) {
			const key = answerKey(choice)
			if (answersMatch(choice, currentProblem.correctAnswer)) {
				newStates.set(key, 'correct')
			} else if (answersMatch(choice, answer)) {
				newStates.set(key, 'incorrect')
			} else {
				newStates.set(key, 'default')
			}
		}
		answerStates = newStates

		// Record result
		const result: ProblemResult = {
			problemId: currentProblem.id,
			problemType: currentProblem.type,
			difficulty: currentProblem.difficulty,
			isCorrect,
			answeredAt: new Date()
		}
		results = [...results, result]

		// Update difficulty
		difficultyManager.recordAnswer(isCorrect, currentProblem.type)
		saveProgress()

		// Auto-progress to next problem after 1.5s if correct
		if (isCorrect) {
			autoProgressTimeout = setTimeout(() => {
				nextProblem()
			}, 1500)
		}
	}

	function retryProblem() {
		// Reset answer state so they can try the same problem again
		selectedAnswer = null
		answerStates = new Map()
		hasAnswered = false
		isCorrect = false
	}

	function nextProblem() {
		// Clear any pending auto-progress timeout
		if (autoProgressTimeout) {
			clearTimeout(autoProgressTimeout)
			autoProgressTimeout = null
		}
		if (isLastProblem) {
			// Complete adventure
			adventureLimitService.recordAdventure()
			saveLimits()
			goto(
				localizedUrl('/complete', {
					correct: results.filter((r) => r.isCorrect).length.toString(),
					total: results.length.toString()
				})
			)
		} else {
			// Move to next problem
			currentIndex += 1
			selectedAnswer = null
			answerStates = new Map()
			hasAnswered = false
			isCorrect = false

			// Auto-speak next problem
			const autoVoice = localStorage.getItem('lumi-auto-voice') === 'true'
			if (autoVoice && problems[currentIndex]) {
				setTimeout(() => {
					speechService.speak(localize(problems[currentIndex].prompt), {
						lang: getSpeechLanguage() as 'pt-BR' | 'en-US' | 'de-DE' | 'fr-FR' | 'es-ES'
					})
				}, 300)
			}
		}
	}

	function saveProgress() {
		if (typeof window === 'undefined') return
		localStorage.setItem('lumi-progress', JSON.stringify(difficultyManager.getAllProgress()))

		// Save seen signatures
		const seen = problemService.getSeenSignatures()
		const seenObj: Record<string, string> = {}
		for (const [k, v] of seen) {
			seenObj[k] = v.toISOString()
		}
		localStorage.setItem('lumi-seen', JSON.stringify(seenObj))
	}

	function saveLimits() {
		if (typeof window === 'undefined') return
		localStorage.setItem('lumi-limits', JSON.stringify(adventureLimitService.getState()))
	}

	function answersMatch(a: AnswerValue, b: AnswerValue): boolean {
		if (a.type !== b.type) return false
		if (a.type === 'number' && b.type === 'number') return a.value === b.value
		if (a.type === 'side' && b.type === 'side') return a.value === b.value
		if (a.type === 'pattern' && b.type === 'pattern') {
			return JSON.stringify(a.value) === JSON.stringify(b.value)
		}
		if (a.type === 'letter' && b.type === 'letter') return a.value === b.value
		if (a.type === 'object' && b.type === 'object') return a.value === b.value
		return false
	}

	function answerKey(answer: AnswerValue): string {
		if (answer.type === 'number') return `num-${answer.value}`
		if (answer.type === 'side') return `side-${answer.value}`
		if (answer.type === 'pattern') return `pattern-${answer.value.join('-')}`
		if (answer.type === 'letter') return `letter-${answer.value}`
		if (answer.type === 'object') return `object-${answer.value}`
		return 'unknown'
	}

	function getAnswerState(answer: AnswerValue): AnswerState {
		return answerStates.get(answerKey(answer)) ?? 'default'
	}
</script>

<svelte:head>
	<title>{t.home.title}</title>
</svelte:head>

<main class="adventure" class:toddler-mode={isToddlerMode}>
	{#if currentProblem}
		<header class="header">
			<button
				class="home-button"
				onclick={() => goto(localizedPath('/'))}
				aria-label={t.adventure.backToHome}
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
					<polyline points="9 22 9 12 15 12 15 22" />
				</svg>
			</button>
			<ProgressDots
				total={PROBLEMS_PER_ADVENTURE}
				current={currentIndex}
				completed={completedCount}
			/>
			<div class="header-spacer"></div>
		</header>

		<div class="problem-area">
			<!-- Prompt with speaker button -->
			<div class="prompt-row">
				<h2 class="prompt">{localize(currentProblem.prompt)}</h2>
				<SpeakerButton text={localize(currentProblem.prompt)} lang={getSpeechLanguage()} />
			</div>

			<!-- Visual display -->
			<div class="visual">
				{#if currentProblem.visual.type === 'objects'}
					<CountableObject
						objectId={currentProblem.visual.elements[0].object}
						count={currentProblem.visual.elements[0].count}
					/>
				{:else if currentProblem.visual.type === 'equation'}
					<AnimatedEquation
						objectId={currentProblem.visual.elements[0].object}
						operandA={currentProblem.visual.elements[0].count}
						operandB={currentProblem.visual.elements[1].count}
						operator={currentProblem.visual.operator ?? '+'}
					/>
				{:else if currentProblem.visual.type === 'comparison'}
					<div class="comparison">
						<button
							class="comparison-side"
							class:selected={selectedAnswer?.type === 'side' && selectedAnswer.value === 'left'}
							class:correct={getAnswerState({ type: 'side', value: 'left' }) === 'correct'}
							class:incorrect={getAnswerState({ type: 'side', value: 'left' }) === 'incorrect'}
							onclick={() => selectAnswer({ type: 'side', value: 'left' })}
							disabled={hasAnswered}
						>
							<CountableObject
								objectId={currentProblem.visual.elements[0].object}
								count={currentProblem.visual.elements[0].count}
								maxPerRow={4}
							/>
						</button>
						<span class="vs">{t.common.or}</span>
						<button
							class="comparison-side"
							class:selected={selectedAnswer?.type === 'side' && selectedAnswer.value === 'right'}
							class:correct={getAnswerState({ type: 'side', value: 'right' }) === 'correct'}
							class:incorrect={getAnswerState({ type: 'side', value: 'right' }) === 'incorrect'}
							onclick={() => selectAnswer({ type: 'side', value: 'right' })}
							disabled={hasAnswered}
						>
							<CountableObject
								objectId={currentProblem.visual.elements[1].object}
								count={currentProblem.visual.elements[1].count}
								maxPerRow={4}
							/>
						</button>
					</div>
				{:else if currentProblem.visual.type === 'pattern'}
					<div class="pattern">
						{#each currentProblem.visual.elements as element, i}
							<PatternCircle
								colorId={element.object}
								isUnknown={element.object === 'unknown'}
								size="large"
								index={i}
							/>
						{/each}
					</div>
				{:else if currentProblem.visual.type === 'letter'}
					<LetterDisplay letter={currentProblem.visual.displayText || ''} size="large" />
				{:else if currentProblem.visual.type === 'word'}
					<WordDisplay
						word={currentProblem.visual.displayText || ''}
						emoji={currentProblem.visual.elements[0]?.object}
						missingIndex={currentProblem.visual.missingIndex}
						highlightFirst={currentProblem.type === 'initial-letter'}
					/>
				{:else if currentProblem.visual.type === 'letter-sequence'}
					<LetterSequence
						letters={currentProblem.visual.elements.map((e) => e.object)}
						unknownIndex={currentProblem.visual.elements.findIndex((e) => e.object === '?')}
					/>
				{:else if currentProblem.visual.type === 'logic-group'}
					<div class="logic-group">
						{#each currentProblem.visual.elements as element, i}
							<button
								class="logic-item"
								class:correct={getAnswerState({ type: 'object', value: element.object }) ===
									'correct'}
								class:incorrect={getAnswerState({ type: 'object', value: element.object }) ===
									'incorrect'}
								onclick={() => selectAnswer({ type: 'object', value: element.object })}
								disabled={hasAnswered}
								style="--delay: {i * 100}ms"
							>
								<span class="logic-emoji">{element.object}</span>
							</button>
						{/each}
					</div>
				{:else if currentProblem.visual.type === 'logic-matching'}
					<div class="logic-matching">
						<div class="matching-source">
							<span class="matching-source-emoji">{currentProblem.visual.sourceObject}</span>
							<span class="matching-arrow">→</span>
							<span class="matching-question">?</span>
						</div>
					</div>
				{:else if currentProblem.visual.type === 'logic-sequence'}
					<div class="logic-sequence">
						{#each currentProblem.visual.elements as element, i}
							{#if element.object === 'unknown'}
								<div class="sequence-unknown" style="--delay: {i * 200}ms">?</div>
							{:else}
								<span class="sequence-emoji" style="--delay: {i * 200}ms">{element.object}</span>
							{/if}
							{#if element.object !== 'unknown'}
								<span class="sequence-arrow" style="--delay: {i * 200 + 100}ms">→</span>
							{/if}
						{/each}
					</div>
				{/if}
			</div>

			<!-- Answer choices (not for comparison or logic-group which have inline selection) -->
			{#if currentProblem.type !== 'comparison' && currentProblem.visual.type !== 'logic-group'}
				<div
					class="choices"
					class:emoji-choices={currentProblem.answerChoices[0]?.type === 'object'}
				>
					{#each currentProblem.answerChoices as choice}
						<ChoiceButton
							state={getAnswerState(choice)}
							onclick={() => selectAnswer(choice)}
							disabled={hasAnswered}
						>
							{#if choice.type === 'number'}
								{choice.value}
							{:else if choice.type === 'pattern'}
								<PatternCircle colorId={choice.value[0]} size="small" />
							{:else if choice.type === 'letter'}
								{choice.value}
							{:else if choice.type === 'object'}
								<span class="choice-emoji">{choice.value}</span>
							{/if}
						</ChoiceButton>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Feedback and next button -->
		{#if hasAnswered}
			<div class="feedback" class:correct={isCorrect}>
				<p class="feedback-text">
					{isCorrect ? `${t.adventure.correct} 🎉` : `${t.adventure.tryAgain} 💪`}
				</p>
				{#if !isCorrect && currentProblem.hint}
					<div class="hint-row">
						<p class="hint-text">{localize(currentProblem.hint)}</p>
						<SpeakerButton text={localize(currentProblem.hint)} lang={getSpeechLanguage()} />
					</div>
				{/if}
				{#if !isCorrect}
					<LumiButton onclick={retryProblem} variant="primary">
						{t.adventure.tryAgainButton}
					</LumiButton>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="loading">
			<p>{t.adventure.preparing}</p>
		</div>
	{/if}
</main>

<style>
	.adventure {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: var(--spacing-screen-horizontal);
		padding-top: var(--spacing-sm);
		gap: var(--spacing-xl);
	}

	/* On larger screens, add top padding since pickers are absolutely positioned */
	@media (min-width: 480px) {
		.adventure {
			padding-top: var(--spacing-lg);
		}
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.home-button {
		display: flex;
		align-items: center;
		justify-content: center;

		width: var(--touch-standard);
		height: var(--touch-standard);

		border: 2px solid var(--color-border);
		border-radius: var(--radius-full);
		background-color: var(--color-surface);

		color: var(--color-text-secondary);
		cursor: pointer;

		transition:
			transform var(--transition-fast),
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			color var(--transition-fast);
	}

	.home-button:hover {
		border-color: var(--color-secondary);
		color: var(--color-secondary);
	}

	.home-button:active {
		transform: scale(0.96);
	}

	.header-spacer {
		width: var(--touch-standard);
	}

	.problem-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xl);
	}

	.visual {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 120px;
		max-width: 100%;
	}

	.comparison {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
		max-width: 100%;
	}

	.comparison-side {
		padding: var(--spacing-md);
		border: 3px solid transparent;
		border-radius: var(--radius-xl);
		background-color: transparent;
		cursor: pointer;
		flex: 0 1 auto;
		transition:
			transform var(--transition-fast),
			border-color var(--transition-fast),
			background-color var(--transition-fast);
	}

	.comparison-side:hover:not(:disabled) {
		transform: scale(1.02);
	}

	.comparison-side:active:not(:disabled) {
		transform: scale(0.98);
	}

	.comparison-side.selected {
		border-color: var(--color-secondary);
		background-color: var(--color-secondary-light);
	}

	.comparison-side.correct {
		border-color: var(--color-success-dark);
		background-color: var(--color-success);
	}

	.comparison-side.incorrect {
		border-color: var(--color-try-again-dark);
		background-color: var(--color-try-again);
	}

	.comparison-side:disabled {
		cursor: default;
	}

	.vs {
		font-size: var(--font-size-heading-medium);
		color: var(--color-text-muted);
	}

	.pattern {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
		max-width: 100%;
	}

	.logic-group {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-lg);
		padding: var(--spacing-sm);
	}

	.logic-item {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 100px;
		height: 100px;

		border: 3px solid var(--color-border);
		border-radius: var(--radius-xl);
		background-color: var(--color-surface);

		cursor: pointer;
		transition:
			transform var(--transition-fast),
			border-color var(--transition-fast),
			background-color var(--transition-fast);

		animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
		animation-delay: var(--delay, 0ms);
	}

	@keyframes popIn {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		70% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.logic-item:hover:not(:disabled) {
		border-color: var(--color-primary);
		transform: scale(1.05);
	}

	.logic-item:active:not(:disabled) {
		transform: scale(0.98);
	}

	.logic-item.correct {
		border-color: var(--color-success-dark);
		background-color: var(--color-success);
	}

	.logic-item.incorrect {
		border-color: var(--color-try-again-dark);
		background-color: var(--color-try-again);
	}

	.logic-item:disabled {
		cursor: default;
	}

	.logic-emoji {
		font-size: 48px;
	}

	/* Matching visual */
	.logic-matching {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.matching-source {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.matching-source-emoji {
		font-size: 64px;
		animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
	}

	.matching-arrow {
		font-size: 36px;
		color: var(--color-text-muted);
		animation: fadeSlideIn 0.4s ease-out 0.3s backwards;
	}

	.matching-question {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		border: 3px dashed var(--color-primary);
		border-radius: var(--radius-xl);
		font-size: 36px;
		font-weight: 700;
		color: var(--color-primary);
		animation:
			fadeSlideIn 0.4s ease-out 0.5s backwards,
			gentlePulse 2s ease-in-out 0.9s infinite;
	}

	@keyframes bounceIn {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		60% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes fadeSlideIn {
		0% {
			transform: translateX(-10px);
			opacity: 0;
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes gentlePulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	/* Sequence visual */
	.logic-sequence {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
		justify-content: center;
	}

	.sequence-emoji {
		font-size: 48px;
		animation: sequenceAppear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
		animation-delay: var(--delay, 0ms);
	}

	.sequence-arrow {
		font-size: 24px;
		color: var(--color-text-muted);
		animation: arrowSlide 0.3s ease-out backwards;
		animation-delay: var(--delay, 0ms);
	}

	.sequence-unknown {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		border: 3px dashed var(--color-primary);
		border-radius: var(--radius-lg);
		font-size: 28px;
		font-weight: 700;
		color: var(--color-primary);
		animation:
			sequenceAppear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards,
			gentlePulse 2s ease-in-out infinite;
		animation-delay: var(--delay, 0ms), calc(var(--delay, 0ms) + 0.5s);
	}

	@keyframes sequenceAppear {
		0% {
			transform: scale(0) rotate(-10deg);
			opacity: 0;
		}
		70% {
			transform: scale(1.15) rotate(0deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	@keyframes arrowSlide {
		0% {
			transform: translateX(-10px);
			opacity: 0;
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}

	/* Emoji choices styling */
	.emoji-choices {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-md);
	}

	.choice-emoji {
		font-size: 32px;
	}

	.prompt-row {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--spacing-md);
	}

	.prompt {
		font-size: var(--font-size-heading-large);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
		text-align: center;
	}

	.choices {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--spacing-md);
	}

	.feedback {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		border-radius: var(--radius-xl);
		animation: slideUp 0.3s ease-out;
	}

	.feedback.correct {
		background-color: var(--color-success);
	}

	.feedback:not(.correct) {
		background-color: var(--color-try-again);
	}

	.feedback-text {
		font-size: var(--font-size-heading-medium);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
	}

	.hint-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
	}

	.hint-text {
		font-size: var(--font-size-body);
		color: var(--color-text-secondary);
		margin: 0;
		text-align: center;
		font-style: italic;
	}

	.loading {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* Toddler mode: larger touch targets for ages 3-4 */
	.adventure.toddler-mode {
		--touch-choice-button: 6rem;
	}

	.toddler-mode .logic-item {
		width: 120px;
		height: 120px;
	}

	.toddler-mode .logic-emoji {
		font-size: 56px;
	}

	.toddler-mode .choice-emoji {
		font-size: 40px;
	}

	.toddler-mode .matching-source-emoji {
		font-size: 80px;
	}

	.toddler-mode .matching-question {
		width: 100px;
		height: 100px;
		font-size: 44px;
	}

	.toddler-mode .sequence-emoji {
		font-size: 56px;
	}

	.toddler-mode .sequence-unknown {
		width: 80px;
		height: 80px;
		font-size: 36px;
	}

	.toddler-mode .comparison-side {
		padding: var(--spacing-lg);
	}
</style>
