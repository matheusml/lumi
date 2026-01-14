import { describe, it, expect } from 'vitest'
import { OddOneOutGenerator } from './logic-generator'
import type { DifficultyLevel } from '$lib/types'

describe('OddOneOutGenerator', () => {
	const generator = new OddOneOutGenerator()

	describe('problemType', () => {
		it('should be odd-one-out', () => {
			expect(generator.problemType).toBe('odd-one-out')
		})
	})

	describe('generate', () => {
		it('should generate a valid odd-one-out problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('odd-one-out')
			expect(result!.signature).toMatch(/^logic:odd-one-out:d1:/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('logic-group')
			expect(problem.visual.elements.length).toBe(4) // 3 from category + 1 odd
			expect(problem.prompt.ptBR).toBe('Qual não é do mesmo grupo?')
			expect(problem.prompt.en).toBe("Which one doesn't belong?")
			expect(problem.correctAnswer.type).toBe('object')
			expect(problem.answerChoices.length).toBe(4)
		})

		it('should have object answer choices with emojis', () => {
			const result = generator.generate(2, new Set())
			const choices = result!.problem.answerChoices

			for (const choice of choices) {
				expect(choice.type).toBe('object')
				// Emojis are non-empty strings
				expect((choice as { type: 'object'; value: string }).value.length).toBeGreaterThan(0)
			}
		})

		it('should have 4 visual elements', () => {
			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const result = generator.generate(difficulty, new Set())
				expect(result).not.toBeNull()
				expect(result!.problem.visual.elements.length).toBe(4)
			}
		})

		it('should include correct answer in answer choices', () => {
			for (let i = 0; i < 10; i++) {
				const result = generator.generate(2, new Set())
				const correctAnswer = result!.problem.correctAnswer as { type: 'object'; value: string }
				const choices = result!.problem.answerChoices as { type: 'object'; value: string }[]

				const matchingChoice = choices.find((c) => c.value === correctAnswer.value)
				expect(matchingChoice).toBeDefined()
			}
		})

		it('should exclude specified signatures', () => {
			const allSignatures = generator.allPossibleSignatures(1)
			// Exclude all but a few signatures
			const excluding = new Set(allSignatures.slice(0, -5))

			const result = generator.generate(1, excluding)
			expect(result).not.toBeNull()
			expect(excluding.has(result!.signature)).toBe(false)
		})

		it('should return null when all signatures are excluded', () => {
			const allSignatures = generator.allPossibleSignatures(1)
			const excluding = new Set(allSignatures)

			const result = generator.generate(1, excluding)
			expect(result).toBeNull()
		})

		it('should have categoryHint in visual', () => {
			const result = generator.generate(1, new Set())
			expect(result!.problem.visual.categoryHint).toBeDefined()
			expect(result!.problem.visual.categoryHint!.length).toBeGreaterThan(0)
		})
	})

	describe('allPossibleSignatures', () => {
		it('should return signatures for each difficulty', () => {
			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				expect(signatures.length).toBeGreaterThan(0)
			}
		})

		it('should have unique signatures within difficulty', () => {
			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				const unique = new Set(signatures)
				expect(unique.size).toBe(signatures.length)
			}
		})

		it('should follow the correct format', () => {
			const signatures = generator.allPossibleSignatures(3)
			for (const sig of signatures) {
				expect(sig).toMatch(/^logic:odd-one-out:d3:/)
			}
		})

		it('should have different categories for different difficulties', () => {
			const sig1 = generator.allPossibleSignatures(1)
			const sig4 = generator.allPossibleSignatures(4)

			// Extract category IDs
			const categories1 = sig1.map((s) => s.split(':')[3])
			const categories4 = sig4.map((s) => s.split(':')[3])

			// Categories should be different between difficulty 1 and 4
			const uniqueCat1 = new Set(categories1)
			const uniqueCat4 = new Set(categories4)
			const overlap = [...uniqueCat1].filter((c) => uniqueCat4.has(c))
			expect(overlap.length).toBe(0)
		})
	})

	describe('difficulty progression', () => {
		it('should have different categories per difficulty level', () => {
			const categoriesByDifficulty = new Map<DifficultyLevel, Set<string>>()

			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				const categories = new Set(signatures.map((s) => s.split(':')[3]))
				categoriesByDifficulty.set(difficulty, categories)
			}

			// Each difficulty should have its own set of categories
			expect(categoriesByDifficulty.get(1)).not.toEqual(categoriesByDifficulty.get(2))
			expect(categoriesByDifficulty.get(2)).not.toEqual(categoriesByDifficulty.get(3))
			expect(categoriesByDifficulty.get(3)).not.toEqual(categoriesByDifficulty.get(4))
		})
	})
})
