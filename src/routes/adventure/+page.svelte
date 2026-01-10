<script lang="ts">
	/**
	 * Adventure Page
	 *
	 * The main learning experience - 5 problems per adventure.
	 */

	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import {
		LumiButton,
		ChoiceButton,
		ProgressDots,
		SpeakerButton,
		CountableObject,
		PatternCircle
	} from '$lib/components'
	import { problemService } from '$lib/problems'
	import { difficultyManager, adventureLimitService, speechService } from '$lib/services'
	import type { Problem, AnswerValue, AnswerState, ProblemResult } from '$lib/types'
	import { PROBLEMS_PER_ADVENTURE } from '$lib/types'

	// Adventure state
	let problems: Problem[] = $state([])
	let currentIndex = $state(0)
	let results: ProblemResult[] = $state([])

	// Current problem state
	let selectedAnswer: AnswerValue | null = $state(null)
	let answerStates: Map<string, AnswerState> = $state(new Map())
	let hasAnswered = $state(false)
	let isCorrect = $state(false)

	// Derived
	const currentProblem = $derived(problems[currentIndex])
	const completedCount = $derived(results.length)
	const isLastProblem = $derived(currentIndex === problems.length - 1)

	onMount(() => {
		// Load state and generate problems
		loadState()
		generateProblems()
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
		problems = problemService.generateAdventureProblems(PROBLEMS_PER_ADVENTURE, difficulties)

		// Auto-speak first problem if voice is enabled
		if (problems.length > 0) {
			const autoVoice = localStorage.getItem('lumi-auto-voice') === 'true'
			if (autoVoice) {
				setTimeout(() => {
					speechService.speak(problems[0].prompt.ptBR, { lang: 'pt-BR' })
				}, 500)
			}
		}
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
	}

	function nextProblem() {
		if (isLastProblem) {
			// Complete adventure
			adventureLimitService.recordAdventure()
			saveLimits()
			goto(
				'/complete?' +
					new URLSearchParams({
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
					speechService.speak(problems[currentIndex].prompt.ptBR, { lang: 'pt-BR' })
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
		return false
	}

	function answerKey(answer: AnswerValue): string {
		if (answer.type === 'number') return `num-${answer.value}`
		if (answer.type === 'side') return `side-${answer.value}`
		if (answer.type === 'pattern') return `pattern-${answer.value.join('-')}`
		return 'unknown'
	}

	function getAnswerState(answer: AnswerValue): AnswerState {
		return answerStates.get(answerKey(answer)) ?? 'default'
	}
</script>

<svelte:head>
	<title>Aventura - Lumi</title>
</svelte:head>

<main class="adventure">
	{#if currentProblem}
		<header class="header">
			<button class="home-button" onclick={() => goto('/')} aria-label="Voltar para início">
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
			<!-- Visual display -->
			<div class="visual">
				{#if currentProblem.visual.type === 'objects'}
					<CountableObject
						objectId={currentProblem.visual.elements[0].object}
						count={currentProblem.visual.elements[0].count}
					/>
				{:else if currentProblem.visual.type === 'equation'}
					<div class="equation">
						<CountableObject
							objectId={currentProblem.visual.elements[0].object}
							count={currentProblem.visual.elements[0].count}
							maxPerRow={4}
						/>
						<span class="operator">{currentProblem.visual.operator}</span>
						<CountableObject
							objectId={currentProblem.visual.elements[1].object}
							count={currentProblem.visual.elements[1].count}
							maxPerRow={4}
						/>
					</div>
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
						<span class="vs">ou</span>
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
						{#each currentProblem.visual.elements as element}
							<PatternCircle
								colorId={element.object}
								isUnknown={element.object === 'unknown'}
								size="large"
							/>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Prompt with speaker button -->
			<div class="prompt-row">
				<p class="prompt">{currentProblem.prompt.ptBR}</p>
				<SpeakerButton text={currentProblem.prompt.ptBR} lang="pt-BR" />
			</div>

			<!-- Answer choices (not for comparison) -->
			{#if currentProblem.type !== 'comparison'}
				<div class="choices">
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
					{isCorrect ? 'Muito bem! 🎉' : 'Tente novamente da próxima vez! 💪'}
				</p>
				<LumiButton onclick={nextProblem} variant={isCorrect ? 'primary' : 'secondary'}>
					{isLastProblem ? 'Terminar' : 'Próximo'}
				</LumiButton>
			</div>
		{/if}
	{:else}
		<div class="loading">
			<p>Preparando aventura...</p>
		</div>
	{/if}
</main>

<style>
	.adventure {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: var(--spacing-screen-horizontal);
		padding-top: var(--spacing-lg);
		gap: var(--spacing-xl);
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
		min-height: 150px;
	}

	.equation {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.operator {
		font-size: var(--font-size-number-large);
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.comparison {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.comparison-side {
		padding: var(--spacing-lg);
		border: 3px solid var(--color-border);
		border-radius: var(--radius-xl);
		background-color: var(--color-surface);
		cursor: pointer;
		transition:
			transform var(--transition-fast),
			border-color var(--transition-fast),
			background-color var(--transition-fast);
	}

	.comparison-side:hover:not(:disabled) {
		border-color: var(--color-primary);
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
		gap: var(--spacing-sm);
	}

	.prompt-row {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.prompt {
		font-size: var(--font-size-heading-medium);
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
</style>
