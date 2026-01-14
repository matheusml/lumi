/**
 * Pattern Problem Generator
 *
 * Generates pattern problems: "What comes next?"
 * Signature format: patterns:d{difficulty}:{patternHash}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from './generator'
import { patternColors, shuffle } from './visual-objects'

export class PatternProblemGenerator implements ProblemGenerator {
	readonly problemType = 'patterns' as const

	/**
	 * Pattern templates for each difficulty level
	 * Numbers represent abstract color indices (0=A, 1=B, 2=C, etc.)
	 */
	private templates(difficulty: DifficultyLevel): number[][] {
		switch (difficulty) {
			case 1:
				return [
					[0, 1, 0, 1, 0], // ABABA -> next is B
					[0, 0, 1, 0, 0, 1, 0], // AABABAA -> next is B (AAB pattern)
					[0, 1, 1, 0, 1, 1, 0] // ABBABBA -> next is B (ABB pattern)
				]
			case 2:
				return [
					[0, 1, 2, 0, 1, 2, 0], // ABCABCA -> next is B
					[0, 1, 0, 1, 0, 1, 0], // ABABABA -> next is B
					[0, 0, 1, 1, 0, 0, 1] // AABBAA -> next is B (AABB pattern)
				]
			case 3:
				return [
					[0, 1, 1, 0, 1, 1, 0], // ABBABBA -> next is B
					[0, 1, 2, 1, 0, 1, 2], // ABCBAB -> next is C (ABCB pattern)
					[0, 0, 0, 1, 0, 0, 0] // AAABAAA -> next is B (AAAB pattern)
				]
			case 4:
				return [
					[0, 1, 2, 3, 0, 1, 2, 3, 0], // ABCDABCDA -> next is B
					[0, 1, 0, 2, 0, 1, 0, 2, 0], // ABACABACA -> next is B
					[0, 1, 2, 2, 1, 0, 0, 1, 2] // Complex pattern
				]
		}
	}

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const availableTemplates = this.templates(difficulty)

		for (const template of shuffle(availableTemplates)) {
			const patternHash = template.join('_')
			const signature = this.makeSignature(difficulty, patternHash)

			if (!excluding.has(signature)) {
				// Map abstract indices to random colors
				const maxIndex = Math.max(...template)
				const colorMapping = this.assignColors(maxIndex + 1)

				const problem = this.createProblem(template, colorMapping, difficulty)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		return this.templates(difficulty).map((template) => {
			const patternHash = template.join('_')
			return this.makeSignature(difficulty, patternHash)
		})
	}

	private makeSignature(difficulty: DifficultyLevel, patternHash: string): string {
		return `patterns:d${difficulty}:${patternHash}`
	}

	private assignColors(count: number): string[] {
		const shuffled = shuffle([...patternColors])
		return shuffled.slice(0, count).map((c) => c.id)
	}

	private createProblem(
		template: number[],
		colorMapping: string[],
		difficulty: DifficultyLevel
	): Problem {
		// The answer is what would continue the pattern
		const answerColorIndex = template[template.length - 1]
		const answerColor = colorMapping[answerColorIndex]

		// Display pattern: all but last, plus "unknown"
		const displayIndices = template.slice(0, -1)
		const elements = [
			...displayIndices.map((index) => ({
				object: colorMapping[index],
				count: 1
			})),
			{ object: 'unknown', count: 1 }
		]

		// Create answer choices (all available colors, shuffled)
		const choices: AnswerValue[] = shuffle([...patternColors]).map((c) => ({
			type: 'pattern' as const,
			value: [c.id]
		}))

		return {
			id: crypto.randomUUID(),
			type: 'patterns',
			difficulty,
			signature: this.makeSignature(difficulty, template.join('_')),
			visual: {
				type: 'pattern',
				elements
			},
			prompt: {
				ptBR: 'O que vem depois?',
				en: 'What comes next?',
				de: 'Was kommt als nächstes?',
				fr: 'Que vient ensuite?'
			},
			correctAnswer: { type: 'pattern', value: [answerColor] },
			answerChoices: choices,
			hint: {
				ptBR: 'Olhe para as cores que se repetem. Qual é o padrão?',
				en: 'Look at the colors that repeat. What is the pattern?',
				de: 'Schau dir die Farben an, die sich wiederholen. Was ist das Muster?',
				fr: 'Regarde les couleurs qui se répètent. Quel est le motif?'
			}
		}
	}
}
