/**
 * Initial Letter Problem Generator
 *
 * Generates initial letter problems: "Com qual letra começa?"
 * Shows a word with emoji, child selects the starting letter.
 *
 * Signature format: initial-letter:d{difficulty}:{word}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from '../generator'
import {
	wordBank,
	vowels,
	commonConsonants,
	portugueseAlphabet,
	type WordInfo
} from '../grammar-data'

/** Shuffle helper */
function shuffle<T>(array: T[]): T[] {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

export class InitialLetterGenerator implements ProblemGenerator {
	readonly problemType = 'initial-letter' as const

	/**
	 * Get words appropriate for each difficulty level
	 */
	private getWordsForDifficulty(difficulty: DifficultyLevel): WordInfo[] {
		switch (difficulty) {
			case 1:
				// Words starting with vowels only
				return wordBank.filter((w) =>
					vowels.some((v) => v.uppercase === w.word[0].toUpperCase())
				)
			case 2:
				// Words starting with vowels or common consonants
				const validLetters = [
					...vowels.map((v) => v.uppercase),
					...commonConsonants.map((c) => c.uppercase)
				]
				return wordBank.filter((w) => validLetters.includes(w.word[0].toUpperCase()))
			case 3:
			case 4:
				// All words
				return wordBank
		}
	}

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const words = this.getWordsForDifficulty(difficulty)

		for (const word of shuffle(words)) {
			const signature = this.makeSignature(difficulty, word.word)

			if (!excluding.has(signature)) {
				const problem = this.createProblem(word, difficulty)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		const words = this.getWordsForDifficulty(difficulty)
		return words.map((w) => this.makeSignature(difficulty, w.word))
	}

	private makeSignature(difficulty: DifficultyLevel, word: string): string {
		return `initial-letter:d${difficulty}:${word}`
	}

	private createProblem(wordInfo: WordInfo, difficulty: DifficultyLevel): Problem {
		const correctLetter = wordInfo.word[0].toUpperCase()

		// Get other letters for wrong choices
		const otherLetters = portugueseAlphabet
			.filter((l) => l.uppercase !== correctLetter)
			.map((l) => l.uppercase)

		const wrongChoices = shuffle(otherLetters).slice(0, 3)
		const allChoices = shuffle([correctLetter, ...wrongChoices])

		const choices: AnswerValue[] = allChoices.map((letter) => ({
			type: 'letter' as const,
			value: letter
		}))

		return {
			id: crypto.randomUUID(),
			type: 'initial-letter',
			difficulty,
			signature: this.makeSignature(difficulty, wordInfo.word),
			visual: {
				type: 'word',
				elements: [{ object: wordInfo.emoji, count: 1 }],
				displayText: wordInfo.word
			},
			prompt: {
				ptBR: `Com qual letra começa "${wordInfo.namePtBR}"?`,
				en: `What letter does "${wordInfo.nameEn}" start with?`
			},
			correctAnswer: { type: 'letter', value: correctLetter },
			answerChoices: choices
		}
	}
}
