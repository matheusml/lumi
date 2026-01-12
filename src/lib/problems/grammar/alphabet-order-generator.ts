/**
 * Alphabet Order Problem Generator
 *
 * Generates alphabet sequence problems: "O que vem depois?"
 * Shows a sequence of letters with one missing.
 *
 * Signature format: alphabet-order:d{difficulty}:{startLetter}:{missingIndex}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from '../generator'
import { getLetterAtIndex, type LetterInfo } from '../grammar-data'

/** Shuffle helper */
function shuffle<T>(array: T[]): T[] {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

interface SequenceConfig {
	length: number
	missingPositions: number[] // Which positions can be missing
	maxStartIndex: number // Highest starting letter index
}

export class AlphabetOrderGenerator implements ProblemGenerator {
	readonly problemType = 'alphabet-order' as const

	/**
	 * Configuration per difficulty level
	 */
	private getConfig(difficulty: DifficultyLevel): SequenceConfig {
		switch (difficulty) {
			case 1:
				// A-F range, last position missing (easiest)
				return { length: 4, missingPositions: [3], maxStartIndex: 2 } // A-D to C-F
			case 2:
				// Any 4-letter sequence, last position missing
				return { length: 4, missingPositions: [3], maxStartIndex: 22 }
			case 3:
				// Any 4-letter sequence, middle positions can be missing
				return { length: 4, missingPositions: [1, 2], maxStartIndex: 22 }
			case 4:
				// Longer sequences, any position can be missing
				return { length: 5, missingPositions: [1, 2, 3], maxStartIndex: 21 }
		}
	}

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const config = this.getConfig(difficulty)

		// Generate all valid starting positions
		const startIndices = Array.from({ length: config.maxStartIndex + 1 }, (_, i) => i)

		for (const startIndex of shuffle(startIndices)) {
			for (const missingPos of shuffle([...config.missingPositions])) {
				const signature = this.makeSignature(difficulty, startIndex, missingPos)

				if (!excluding.has(signature)) {
					const problem = this.createProblem(startIndex, missingPos, config.length, difficulty)
					return { problem, signature }
				}
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		const config = this.getConfig(difficulty)
		const signatures: string[] = []

		for (let startIndex = 0; startIndex <= config.maxStartIndex; startIndex++) {
			for (const missingPos of config.missingPositions) {
				signatures.push(this.makeSignature(difficulty, startIndex, missingPos))
			}
		}

		return signatures
	}

	private makeSignature(
		difficulty: DifficultyLevel,
		startIndex: number,
		missingPos: number
	): string {
		return `alphabet-order:d${difficulty}:${startIndex}:${missingPos}`
	}

	private createProblem(
		startIndex: number,
		missingPos: number,
		length: number,
		difficulty: DifficultyLevel
	): Problem {
		// Build the sequence
		const sequence: LetterInfo[] = []
		for (let i = 0; i < length; i++) {
			const letter = getLetterAtIndex(startIndex + i)
			if (letter) sequence.push(letter)
		}

		const correctLetter = sequence[missingPos]
		const displayLetters = sequence.map((l, i) => (i === missingPos ? '?' : l.uppercase))

		// Generate answer choices (correct + 3 nearby letters)
		const correctIndex = startIndex + missingPos

		// Collect nearby indices, expanding range if needed to get at least 3
		const otherIndices: number[] = []
		for (let distance = 1; otherIndices.length < 3 && distance <= 25; distance++) {
			if (correctIndex - distance >= 0) otherIndices.push(correctIndex - distance)
			if (correctIndex + distance < 26) otherIndices.push(correctIndex + distance)
		}

		const otherLetters = otherIndices
			.slice(0, 3)
			.map((i) => getLetterAtIndex(i))
			.filter((l): l is LetterInfo => l !== undefined)

		const choices: AnswerValue[] = shuffle([correctLetter, ...otherLetters]).map((l) => ({
			type: 'letter' as const,
			value: l.uppercase
		}))

		return {
			id: crypto.randomUUID(),
			type: 'alphabet-order',
			difficulty,
			signature: this.makeSignature(difficulty, startIndex, missingPos),
			visual: {
				type: 'letter-sequence',
				elements: displayLetters.map((l) => ({ object: l, count: 1 })),
				displayText: displayLetters.join(' ')
			},
			prompt: {
				ptBR: 'O que vem depois?',
				en: 'What comes next?'
			},
			correctAnswer: { type: 'letter', value: correctLetter.uppercase },
			answerChoices: choices
		}
	}
}
