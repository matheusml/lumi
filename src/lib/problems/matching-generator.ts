/**
 * Matching Problem Generator
 *
 * Generates "what goes together?" problems.
 * Shows one object and asks which of 4 options matches/belongs with it.
 *
 * Signature format: logic:matching:d{difficulty}:{pairId}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from './generator'
import { shuffle } from './visual-objects'
import { ageService } from '$lib/services'

/** A matching pair definition */
interface MatchingPair {
	id: string
	source: { emoji: string; namePtBR: string }
	match: { emoji: string; namePtBR: string }
	relationPtBR: string // Description of relationship
}

/**
 * Matching pairs organized by difficulty
 * Lower difficulties have more obvious connections
 */
const matchingPairs: Record<DifficultyLevel, MatchingPair[]> = {
	1: [
		// Very obvious pairs - animals and what they eat/need
		{
			id: 'dog-bone',
			source: { emoji: '🐕', namePtBR: 'cachorro' },
			match: { emoji: '🦴', namePtBR: 'osso' },
			relationPtBR: 'come'
		},
		{
			id: 'cat-fish',
			source: { emoji: '🐱', namePtBR: 'gato' },
			match: { emoji: '🐟', namePtBR: 'peixe' },
			relationPtBR: 'come'
		},
		{
			id: 'rabbit-carrot',
			source: { emoji: '🐰', namePtBR: 'coelho' },
			match: { emoji: '🥕', namePtBR: 'cenoura' },
			relationPtBR: 'come'
		},
		{
			id: 'bird-nest',
			source: { emoji: '🐦', namePtBR: 'pássaro' },
			match: { emoji: '🪺', namePtBR: 'ninho' },
			relationPtBR: 'mora no'
		},
		{
			id: 'bee-flower',
			source: { emoji: '🐝', namePtBR: 'abelha' },
			match: { emoji: '🌸', namePtBR: 'flor' },
			relationPtBR: 'visita'
		}
	],
	2: [
		// Weather and related items
		{
			id: 'rain-umbrella',
			source: { emoji: '🌧️', namePtBR: 'chuva' },
			match: { emoji: '☂️', namePtBR: 'guarda-chuva' },
			relationPtBR: 'precisa de'
		},
		{
			id: 'sun-sunglasses',
			source: { emoji: '☀️', namePtBR: 'sol' },
			match: { emoji: '😎', namePtBR: 'óculos de sol' },
			relationPtBR: 'precisa de'
		},
		{
			id: 'snow-gloves',
			source: { emoji: '❄️', namePtBR: 'neve' },
			match: { emoji: '🧤', namePtBR: 'luvas' },
			relationPtBR: 'precisa de'
		},
		{
			id: 'moon-stars',
			source: { emoji: '🌙', namePtBR: 'lua' },
			match: { emoji: '⭐', namePtBR: 'estrelas' },
			relationPtBR: 'aparece com'
		},
		{
			id: 'wind-kite',
			source: { emoji: '💨', namePtBR: 'vento' },
			match: { emoji: '🪁', namePtBR: 'pipa' },
			relationPtBR: 'faz voar'
		}
	],
	3: [
		// Tools and their use
		{
			id: 'pencil-paper',
			source: { emoji: '✏️', namePtBR: 'lápis' },
			match: { emoji: '📄', namePtBR: 'papel' },
			relationPtBR: 'escreve no'
		},
		{
			id: 'key-lock',
			source: { emoji: '🔑', namePtBR: 'chave' },
			match: { emoji: '🔒', namePtBR: 'cadeado' },
			relationPtBR: 'abre o'
		},
		{
			id: 'brush-palette',
			source: { emoji: '🖌️', namePtBR: 'pincel' },
			match: { emoji: '🎨', namePtBR: 'tinta' },
			relationPtBR: 'usa'
		},
		{
			id: 'scissors-ribbon',
			source: { emoji: '✂️', namePtBR: 'tesoura' },
			match: { emoji: '🎀', namePtBR: 'fita' },
			relationPtBR: 'corta'
		},
		{
			id: 'hammer-nail',
			source: { emoji: '🔨', namePtBR: 'martelo' },
			match: { emoji: '📌', namePtBR: 'prego' },
			relationPtBR: 'bate no'
		}
	],
	4: [
		// More pairs - still child-friendly
		{
			id: 'cow-milk',
			source: { emoji: '🐄', namePtBR: 'vaca' },
			match: { emoji: '🥛', namePtBR: 'leite' },
			relationPtBR: 'dá'
		},
		{
			id: 'chicken-egg',
			source: { emoji: '🐔', namePtBR: 'galinha' },
			match: { emoji: '🥚', namePtBR: 'ovo' },
			relationPtBR: 'bota'
		},
		{
			id: 'spider-web',
			source: { emoji: '🕷️', namePtBR: 'aranha' },
			match: { emoji: '🕸️', namePtBR: 'teia' },
			relationPtBR: 'faz'
		},
		{
			id: 'baby-bottle',
			source: { emoji: '👶', namePtBR: 'bebê' },
			match: { emoji: '🍼', namePtBR: 'mamadeira' },
			relationPtBR: 'usa'
		},
		{
			id: 'monkey-banana',
			source: { emoji: '🐵', namePtBR: 'macaco' },
			match: { emoji: '🍌', namePtBR: 'banana' },
			relationPtBR: 'come'
		}
	]
}

/** Get distractor objects (wrong answers) from all pairs */
function getDistractors(excludePairId: string): string[] {
	const distractors: string[] = []
	const seen = new Set<string>()

	for (const level of [1, 2, 3, 4] as DifficultyLevel[]) {
		for (const pair of matchingPairs[level]) {
			if (pair.id !== excludePairId) {
				if (!seen.has(pair.match.emoji)) {
					distractors.push(pair.match.emoji)
					seen.add(pair.match.emoji)
				}
				if (!seen.has(pair.source.emoji)) {
					distractors.push(pair.source.emoji)
					seen.add(pair.source.emoji)
				}
			}
		}
	}

	return distractors
}

export class MatchingProblemGenerator implements ProblemGenerator {
	readonly problemType = 'matching' as const

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const availablePairs = matchingPairs[difficulty]

		for (const pair of shuffle(availablePairs)) {
			const signature = this.makeSignature(difficulty, pair.id)

			if (!excluding.has(signature)) {
				const problem = this.createProblem(pair, difficulty)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		return matchingPairs[difficulty].map((pair) => this.makeSignature(difficulty, pair.id))
	}

	private makeSignature(difficulty: DifficultyLevel, pairId: string): string {
		return `logic:matching:d${difficulty}:${pairId}`
	}

	private createProblem(pair: MatchingPair, difficulty: DifficultyLevel): Problem {
		const age = ageService.getAge()
		// Fewer choices for younger children (3 instead of 4)
		const numDistractors = age <= 4 ? 2 : 3

		// Get wrong answers from other pairs
		const distractors = shuffle(getDistractors(pair.id))
			.filter((d) => d !== pair.match.emoji && d !== pair.source.emoji)
			.slice(0, numDistractors)

		// Create all options (3 for young children, 4 for older)
		const allOptions = shuffle([pair.match.emoji, ...distractors])

		// Create answer choices
		const choices: AnswerValue[] = allOptions.map((emoji) => ({
			type: 'object' as const,
			value: emoji
		}))

		// Visual elements for the choices
		const elements = allOptions.map((emoji) => ({
			object: emoji,
			count: 1
		}))

		return {
			id: crypto.randomUUID(),
			type: 'matching',
			difficulty,
			signature: this.makeSignature(difficulty, pair.id),
			visual: {
				type: 'logic-matching',
				elements,
				sourceObject: pair.source.emoji
			},
			prompt: {
				ptBR: 'O que combina?',
				en: 'What goes together?',
				de: 'Was passt zusammen?',
				fr: "Qu'est-ce qui va ensemble?",
				es: '¿Qué va junto?'
			},
			correctAnswer: { type: 'object', value: pair.match.emoji },
			answerChoices: choices,
			hint: {
				ptBR: `Pense: o que o ${pair.source.namePtBR} precisa ou usa?`,
				en: `Think: what does this need or use?`,
				de: 'Denk nach: Was braucht oder benutzt das?',
				fr: 'Réfléchis: de quoi cela a-t-il besoin?',
				es: 'Piensa: ¿qué necesita o usa esto?'
			}
		}
	}
}
