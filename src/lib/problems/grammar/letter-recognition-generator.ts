/**
 * Letter Recognition Problem Generator
 *
 * Generates letter recognition problems: "Qual é a letra?"
 * Shows a letter, child selects which letter it is.
 *
 * Signature format: letter-recognition:d{difficulty}:{letter}:{case}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from '../generator'
import { getLettersForDifficulty, type LetterInfo } from '../grammar-data'

/** Shuffle helper */
function shuffle<T>(array: T[]): T[] {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

export class LetterRecognitionGenerator implements ProblemGenerator {
	readonly problemType = 'letter-recognition' as const

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const letters = getLettersForDifficulty(difficulty)

		// Try to find an unused letter
		for (const letterInfo of shuffle(letters)) {
			// Always display lowercase, choices are uppercase
			const letterCase = 'lower' as const
			const signature = this.makeSignature(difficulty, letterInfo.uppercase, letterCase)

			if (!excluding.has(signature)) {
				const problem = this.createProblem(letterInfo, letterCase, difficulty)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		const letters = getLettersForDifficulty(difficulty)
		const signatures: string[] = []

		for (const letterInfo of letters) {
			// Always lowercase display
			signatures.push(this.makeSignature(difficulty, letterInfo.uppercase, 'lower'))
		}

		return signatures
	}

	private makeSignature(
		difficulty: DifficultyLevel,
		letter: string,
		letterCase: 'upper' | 'lower'
	): string {
		return `letter-recognition:d${difficulty}:${letter}:${letterCase}`
	}

	private createProblem(
		letterInfo: LetterInfo,
		letterCase: 'upper' | 'lower',
		difficulty: DifficultyLevel
	): Problem {
		const displayLetter = letterInfo.lowercase
		const letters = getLettersForDifficulty(difficulty)

		// Generate answer choices (4 letters including correct one)
		const otherLetters = shuffle(letters.filter((l) => l.uppercase !== letterInfo.uppercase))
		const choiceLetters = [letterInfo, ...otherLetters.slice(0, 3)]

		const choices: AnswerValue[] = shuffle(choiceLetters).map((l) => ({
			type: 'letter' as const,
			value: l.uppercase
		}))

		return {
			id: crypto.randomUUID(),
			type: 'letter-recognition',
			difficulty,
			signature: this.makeSignature(difficulty, letterInfo.uppercase, letterCase),
			visual: {
				type: 'letter',
				elements: [],
				displayText: displayLetter,
				letterCase
			},
			prompt: {
				ptBR: 'Qual é a letra?',
				en: 'What letter is this?',
				de: 'Welcher Buchstabe ist das?',
				fr: 'Quelle est cette lettre?'
			},
			correctAnswer: { type: 'letter', value: letterInfo.uppercase },
			answerChoices: choices,
			hint: {
				ptBR: 'Olhe bem para o formato da letra. Já viu ela em alguma palavra?',
				en: 'Look closely at the shape. Have you seen this letter in any words?',
				de: 'Schau dir die Form genau an. Hast du diesen Buchstaben in Wörtern gesehen?',
				fr: 'Regarde bien la forme. As-tu vu cette lettre dans des mots?'
			}
		}
	}
}
