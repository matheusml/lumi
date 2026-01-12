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
	namePtBR: string
	steps: { emoji: string; namePtBR: string }[]
}

/**
 * Logical sequences organized by difficulty
 * Lower difficulties have more concrete/visual progressions
 */
const sequences: Record<DifficultyLevel, LogicalSequence[]> = {
	1: [
		// Life cycles - very concrete
		{
			id: 'egg-chick-chicken',
			namePtBR: 'ciclo da galinha',
			steps: [
				{ emoji: '🥒', namePtBR: 'ovo' },
				{ emoji: '🐣', namePtBR: 'pintinho nascendo' },
				{ emoji: '🐤', namePtBR: 'pintinho' },
				{ emoji: '🐔', namePtBR: 'galinha' }
			]
		},
		{
			id: 'seed-sprout-tree',
			namePtBR: 'crescimento da árvore',
			steps: [
				{ emoji: '🌰', namePtBR: 'semente' },
				{ emoji: '🌱', namePtBR: 'broto' },
				{ emoji: '🌿', namePtBR: 'planta' },
				{ emoji: '🌳', namePtBR: 'árvore' }
			]
		},
		{
			id: 'caterpillar-cocoon-butterfly',
			namePtBR: 'ciclo da borboleta',
			steps: [
				{ emoji: '🐛', namePtBR: 'lagarta' },
				{ emoji: '🪺', namePtBR: 'casulo' },
				{ emoji: '🦋', namePtBR: 'borboleta' }
			]
		}
	],
	2: [
		// Time of day
		{
			id: 'morning-noon-night',
			namePtBR: 'partes do dia',
			steps: [
				{ emoji: '🌅', namePtBR: 'amanhecer' },
				{ emoji: '☀️', namePtBR: 'dia' },
				{ emoji: '🌇', namePtBR: 'entardecer' },
				{ emoji: '🌙', namePtBR: 'noite' }
			]
		},
		// Seasons
		{
			id: 'seasons',
			namePtBR: 'estações do ano',
			steps: [
				{ emoji: '🌸', namePtBR: 'primavera' },
				{ emoji: '☀️', namePtBR: 'verão' },
				{ emoji: '🍂', namePtBR: 'outono' },
				{ emoji: '❄️', namePtBR: 'inverno' }
			]
		},
		// Moon phases
		{
			id: 'moon-phases',
			namePtBR: 'fases da lua',
			steps: [
				{ emoji: '🌑', namePtBR: 'lua nova' },
				{ emoji: '🌓', namePtBR: 'quarto crescente' },
				{ emoji: '🌕', namePtBR: 'lua cheia' },
				{ emoji: '🌗', namePtBR: 'quarto minguante' }
			]
		}
	],
	3: [
		// Cooking/preparation
		{
			id: 'wheat-flour-bread',
			namePtBR: 'fazer pão',
			steps: [
				{ emoji: '🌾', namePtBR: 'trigo' },
				{ emoji: '🥣', namePtBR: 'massa' },
				{ emoji: '🍞', namePtBR: 'pão' }
			]
		},
		{
			id: 'cow-milk-cheese',
			namePtBR: 'fazer queijo',
			steps: [
				{ emoji: '🐄', namePtBR: 'vaca' },
				{ emoji: '🥛', namePtBR: 'leite' },
				{ emoji: '🧀', namePtBR: 'queijo' }
			]
		},
		// Weather progression
		{
			id: 'cloud-rain-rainbow',
			namePtBR: 'tempo',
			steps: [
				{ emoji: '☁️', namePtBR: 'nuvem' },
				{ emoji: '🌧️', namePtBR: 'chuva' },
				{ emoji: '🌈', namePtBR: 'arco-íris' }
			]
		}
	],
	4: [
		// Growth stages
		{
			id: 'baby-child-adult',
			namePtBR: 'crescimento',
			steps: [
				{ emoji: '👶', namePtBR: 'bebê' },
				{ emoji: '🧒', namePtBR: 'criança' },
				{ emoji: '🧑', namePtBR: 'adulto' },
				{ emoji: '🧓', namePtBR: 'idoso' }
			]
		},
		// Building
		{
			id: 'brick-wall-house',
			namePtBR: 'construção',
			steps: [
				{ emoji: '🧱', namePtBR: 'tijolo' },
				{ emoji: '🏗️', namePtBR: 'construção' },
				{ emoji: '🏠', namePtBR: 'casa' }
			]
		},
		// Water cycle
		{
			id: 'water-cycle',
			namePtBR: 'ciclo da água',
			steps: [
				{ emoji: '🌊', namePtBR: 'mar' },
				{ emoji: '☁️', namePtBR: 'nuvem' },
				{ emoji: '🌧️', namePtBR: 'chuva' },
				{ emoji: '🏞️', namePtBR: 'rio' }
			]
		}
	]
}

/** Get distractor objects from other sequences */
function getDistractors(excludeSequenceId: string): string[] {
	const distractors: string[] = []
	const seen = new Set<string>()

	for (const level of [1, 2, 3, 4] as DifficultyLevel[]) {
		for (const seq of sequences[level]) {
			if (seq.id !== excludeSequenceId) {
				for (const step of seq.steps) {
					if (!seen.has(step.emoji)) {
						distractors.push(step.emoji)
						seen.add(step.emoji)
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
		const usedEmojis = new Set(steps.map((s) => s.emoji))
		const distractors = shuffle(getDistractors(sequence.id))
			.filter((d) => !usedEmojis.has(d))
			.slice(0, 3)

		// Create all 4 options
		const allOptions = shuffle([answer.emoji, ...distractors])

		// Create answer choices
		const choices: AnswerValue[] = allOptions.map((emoji) => ({
			type: 'object' as const,
			value: emoji
		}))

		// Visual elements: display steps + unknown placeholder
		const elements = [
			...displaySteps.map((step) => ({
				object: step.emoji,
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
				en: 'What comes next?'
			},
			correctAnswer: { type: 'object', value: answer.emoji },
			answerChoices: choices
		}
	}
}
