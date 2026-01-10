/**
 * Comparison Problem Generator
 *
 * Generates comparison problems: "Which side has more?"
 * Signature format: comparison:d{difficulty}:{left}v{right}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from './generator'
import { getRandomObjectFrom, shuffle } from './visual-objects'

export class ComparisonProblemGenerator implements ProblemGenerator {
	readonly problemType = 'comparison' as const

	/** Range of values and minimum difference for each difficulty level */
	private params(difficulty: DifficultyLevel): { range: [number, number]; minDiff: number } {
		switch (difficulty) {
			case 1:
				return { range: [1, 10], minDiff: 4 } // Large obvious differences
			case 2:
				return { range: [1, 15], minDiff: 3 } // Medium differences
			case 3:
				return { range: [1, 20], minDiff: 2 } // Smaller differences
			case 4:
				return { range: [1, 20], minDiff: 1 } // Can be very close
		}
	}

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const {
			range: [min, max],
			minDiff
		} = this.params(difficulty)
		const pairs: [number, number][] = []

		// Generate all valid pairs with at least minDiff difference
		for (let left = min; left <= max; left++) {
			for (let right = min; right <= max; right++) {
				if (Math.abs(left - right) >= minDiff && left !== right) {
					pairs.push([left, right])
				}
			}
		}

		for (const [left, right] of shuffle(pairs)) {
			// Signature uses consistent ordering (smaller first)
			const signature = this.makeSignature(difficulty, Math.min(left, right), Math.max(left, right))
			if (!excluding.has(signature)) {
				const problem = this.createProblem(left, right, difficulty)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		const {
			range: [min, max],
			minDiff
		} = this.params(difficulty)
		const signatures = new Set<string>()

		for (let left = min; left <= max; left++) {
			for (let right = min; right <= max; right++) {
				if (Math.abs(left - right) >= minDiff && left !== right) {
					// Use consistent ordering in signature
					const sig = this.makeSignature(difficulty, Math.min(left, right), Math.max(left, right))
					signatures.add(sig)
				}
			}
		}

		return Array.from(signatures)
	}

	private makeSignature(difficulty: DifficultyLevel, left: number, right: number): string {
		return `comparison:d${difficulty}:${left}v${right}`
	}

	private createProblem(left: number, right: number, difficulty: DifficultyLevel): Problem {
		const object = getRandomObjectFrom(['banana', 'apple', 'star', 'flower'])
		const correctSide = left > right ? 'left' : 'right'

		const answerChoices: AnswerValue[] = [
			{ type: 'side', value: 'left' },
			{ type: 'side', value: 'right' }
		]

		return {
			id: crypto.randomUUID(),
			type: 'comparison',
			difficulty,
			signature: this.makeSignature(difficulty, Math.min(left, right), Math.max(left, right)),
			visual: {
				type: 'comparison',
				elements: [
					{ object: object.id, count: left, position: 'left' },
					{ object: object.id, count: right, position: 'right' }
				]
			},
			prompt: {
				ptBR: 'Qual lado tem mais?',
				en: 'Which side has more?'
			},
			correctAnswer: { type: 'side', value: correctSide },
			answerChoices
		}
	}
}
