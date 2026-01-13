/**
 * Sequence Problem Generator
 *
 * Generates "what comes next?" problems based on logical progressions.
 * Shows a sequence of objects and asks what logically follows.
 *
 * Signature format: logic:sequence:d{difficulty}:{sequenceId}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from './generator'
import { shuffle } from './visual-objects'

/** A logical sequence definition */
interface LogicalSequence {
	id: string
	steps: string[]
}

/**
 * Logical sequences organized by difficulty
 * Lower difficulties have more concrete/visual progressions
 */
const sequences: Record<DifficultyLevel, LogicalSequence[]> = {
	1: [
		// Life cycles - very concrete
		{ id: 'egg-chick-chicken', steps: ['🥚', '🐣', '🐤', '🐔'] },
		{ id: 'seed-sprout-tree', steps: ['🌰', '🌱', '🌿', '🌳'] },
		{ id: 'sprout-flower-strawberry', steps: ['🌱', '🌸', '🍓'] }
	],
	2: [
		// Time and nature cycles
		{ id: 'morning-noon-night', steps: ['🌅', '☀️', '🌇', '🌙'] },
		{ id: 'seasons', steps: ['🌸', '☀️', '🍂', '❄️'] },
		{ id: 'moon-phases', steps: ['🌑', '🌓', '🌕', '🌗'] }
	],
	3: [
		// Processes
		{ id: 'wheat-flour-bread', steps: ['🌾', '🥣', '🍞'] },
		{ id: 'cow-milk-cheese', steps: ['🐄', '🥛', '🧀'] },
		{ id: 'cloud-rain-rainbow', steps: ['☁️', '🌧️', '🌈'] }
	],
	4: [
		// Complex sequences
		{ id: 'baby-child-adult', steps: ['👶', '🧒', '🧑', '🧓'] },
		{ id: 'brick-wall-house', steps: ['🧱', '🏗️', '🏠'] },
		{ id: 'water-cycle', steps: ['🌊', '☁️', '🌧️', '🏞️'] }
	]
}

/** Get distractor objects from other sequences */
function getDistractors(excludeSequenceId: string): string[] {
	const distractors: string[] = []
	const seen = new Set<string>()

	for (const level of [1, 2, 3, 4] as DifficultyLevel[]) {
		for (const seq of sequences[level]) {
			if (seq.id !== excludeSequenceId) {
				for (const emoji of seq.steps) {
					if (!seen.has(emoji)) {
						distractors.push(emoji)
						seen.add(emoji)
					}
				}
			}
		}
	}

	return distractors
}

export class SequenceProblemGenerator implements ProblemGenerator {
	readonly problemType = 'sequence' as const

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const availableSequences = sequences[difficulty]

		for (const sequence of shuffle(availableSequences)) {
			const signature = this.makeSignature(difficulty, sequence.id)

			if (!excluding.has(signature)) {
				const problem = this.createProblem(sequence, difficulty)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		return sequences[difficulty].map((seq) => this.makeSignature(difficulty, seq.id))
	}

	private makeSignature(difficulty: DifficultyLevel, sequenceId: string): string {
		return `logic:sequence:d${difficulty}:${sequenceId}`
	}

	private createProblem(sequence: LogicalSequence, difficulty: DifficultyLevel): Problem {
		const steps = sequence.steps

		// Show all but the last step, ask what comes next
		const displaySteps = steps.slice(0, -1)
		const answer = steps[steps.length - 1]

		// Get 3 wrong answers from other sequences
		const usedEmojis = new Set(steps)
		const distractors = shuffle(getDistractors(sequence.id))
			.filter((d) => !usedEmojis.has(d))
			.slice(0, 3)

		// Create all 4 options
		const allOptions = shuffle([answer, ...distractors])

		// Create answer choices
		const choices: AnswerValue[] = allOptions.map((emoji) => ({
			type: 'object' as const,
			value: emoji
		}))

		// Visual elements: display steps + unknown placeholder
		const elements = [
			...displaySteps.map((emoji) => ({
				object: emoji,
				count: 1
			})),
			{ object: 'unknown', count: 1 }
		]

		return {
			id: crypto.randomUUID(),
			type: 'sequence',
			difficulty,
			signature: this.makeSignature(difficulty, sequence.id),
			visual: {
				type: 'logic-sequence',
				elements
			},
			prompt: {
				ptBR: 'O que vem depois?',
				en: 'What comes next?',
				de: 'Was kommt als nächstes?',
				fr: 'Que vient ensuite?'
			},
			correctAnswer: { type: 'object', value: answer },
			answerChoices: choices
		}
	}
}
