/**
 * Word Completion Problem Generator
 *
 * Generates word completion problems: "Complete a palavra"
 * Shows a word with one letter missing, child selects the missing letter.
 *
 * Signature format: word-completion:d{difficulty}:{word}:{missingIndex}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from '../generator'
import { getWordsForCompletionDifficulty, portugueseAlphabet, type WordInfo } from '../grammar-data'

/** Shuffle helper */
function shuffle<T>(array: T[]): T[] {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

interface CompletionConfig {
	missingPositions: 'first' | 'last' | 'any'
}

export class WordCompletionGenerator implements ProblemGenerator {
	readonly problemType = 'word-completion' as const

	/**
	 * Configuration per difficulty level
	 */
	private getConfig(difficulty: DifficultyLevel): CompletionConfig {
		switch (difficulty) {
			case 1:
				return { missingPositions: 'first' }
			case 2:
				return { missingPositions: 'last' }
			case 3:
			case 4:
				return { missingPositions: 'any' }
		}
	}

	/**
	 * Get valid missing positions for a word based on config
	 */
	private getMissingPositions(word: string, config: CompletionConfig): number[] {
		switch (config.missingPositions) {
			case 'first':
				return [0]
			case 'last':
				return [word.length - 1]
			case 'any':
				// Any position except first and last for variety
				return Array.from({ length: word.length }, (_, i) => i)
		}
	}

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const words = getWordsForCompletionDifficulty(difficulty)
		const config = this.getConfig(difficulty)

		for (const wordInfo of shuffle(words)) {
			const positions = this.getMissingPositions(wordInfo.word, config)

			for (const missingIndex of shuffle(positions)) {
				const signature = this.makeSignature(difficulty, wordInfo.word, missingIndex)

				if (!excluding.has(signature)) {
					const problem = this.createProblem(wordInfo, missingIndex, difficulty)
					return { problem, signature }
				}
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		const words = getWordsForCompletionDifficulty(difficulty)
		const config = this.getConfig(difficulty)
		const signatures: string[] = []

		for (const wordInfo of words) {
			const positions = this.getMissingPositions(wordInfo.word, config)
			for (const missingIndex of positions) {
				signatures.push(this.makeSignature(difficulty, wordInfo.word, missingIndex))
			}
		}

		return signatures
	}

	private makeSignature(difficulty: DifficultyLevel, word: string, missingIndex: number): string {
		return `word-completion:d${difficulty}:${word}:${missingIndex}`
	}

	private createProblem(
		wordInfo: WordInfo,
		missingIndex: number,
		difficulty: DifficultyLevel
	): Problem {
		const correctLetter = wordInfo.word[missingIndex].toUpperCase()

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
			type: 'word-completion',
			difficulty,
			signature: this.makeSignature(difficulty, wordInfo.word, missingIndex),
			visual: {
				type: 'word',
				elements: [{ object: wordInfo.emoji, count: 1 }],
				displayText: wordInfo.word,
				missingIndex
			},
			prompt: {
				ptBR: 'Complete a palavra',
				en: 'Complete the word',
				de: 'Vervollständige das Wort',
				fr: 'Complète le mot'
			},
			correctAnswer: { type: 'letter', value: correctLetter },
			answerChoices: choices
		}
	}
}
