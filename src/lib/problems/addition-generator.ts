/**
 * Addition Problem Generator
 *
 * Generates addition problems: "{a} + {b} = ?"
 * Signature format: addition:d{difficulty}:{a}+{b}
 */

import type { Problem, DifficultyLevel } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from './generator'
import { generateNumberChoices } from './generator'
import { getRandomObject, shuffle } from './visual-objects'

export class AdditionProblemGenerator implements ProblemGenerator {
	readonly problemType = 'addition' as const

	/** Maximum sum for each difficulty level */
	private maxSum(difficulty: DifficultyLevel): number {
		switch (difficulty) {
			case 1:
				return 5
			case 2:
				return 10
			case 3:
				return 15
			case 4:
				return 20
		}
	}

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const max = this.maxSum(difficulty)
		const pairs: [number, number][] = []

		// Generate all valid (a, b) pairs where a + b <= max and both >= 1
		for (let a = 1; a <= max - 1; a++) {
			for (let b = 1; b <= max - a; b++) {
				pairs.push([a, b])
			}
		}

		for (const [a, b] of shuffle(pairs)) {
			const signature = this.makeSignature(difficulty, a, b)
			if (!excluding.has(signature)) {
				const problem = this.createProblem(a, b, difficulty)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		const max = this.maxSum(difficulty)
		const signatures: string[] = []

		for (let a = 1; a <= max - 1; a++) {
			for (let b = 1; b <= max - a; b++) {
				signatures.push(this.makeSignature(difficulty, a, b))
			}
		}

		return signatures
	}

	private makeSignature(difficulty: DifficultyLevel, a: number, b: number): string {
		return `addition:d${difficulty}:${a}+${b}`
	}

	private createProblem(a: number, b: number, difficulty: DifficultyLevel): Problem {
		const object = getRandomObject()
		const sum = a + b

		return {
			id: crypto.randomUUID(),
			type: 'addition',
			difficulty,
			signature: this.makeSignature(difficulty, a, b),
			visual: {
				type: 'equation',
				operator: '+',
				elements: [
					{ object: object.id, count: a, position: 'left' },
					{ object: object.id, count: b, position: 'right' }
				]
			},
			prompt: {
				ptBR: `${a} + ${b} = ?`,
				en: `${a} + ${b} = ?`,
				de: `${a} + ${b} = ?`,
				fr: `${a} + ${b} = ?`
			},
			correctAnswer: { type: 'number', value: sum },
			answerChoices: generateNumberChoices(sum),
			hint: {
				ptBR: `Conte ${a}, depois conte mais ${b} a partir daí.`,
				en: `Count ${a}, then count ${b} more from there.`,
				de: `Zähle ${a}, dann zähle ${b} weiter.`,
				fr: `Compte ${a}, puis compte ${b} de plus.`
			}
		}
	}
}
