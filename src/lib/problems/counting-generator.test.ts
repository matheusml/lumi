import { describe, it, expect } from 'vitest'
import { CountingProblemGenerator } from './counting-generator'
import type { DifficultyLevel } from '$lib/types'

describe('CountingProblemGenerator', () => {
	const generator = new CountingProblemGenerator()

	describe('problemType', () => {
		it('should be counting', () => {
			expect(generator.problemType).toBe('counting')
		})
	})

	describe('generate', () => {
		it('should generate a valid counting problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('counting')
			expect(result!.signature).toMatch(/^counting:d1:\d+$/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('objects')
			expect(problem.visual.elements.length).toBeGreaterThan(0)
			expect(problem.prompt.ptBR).toBeDefined()
			expect(problem.prompt.en).toBeDefined()
			expect(problem.correctAnswer.type).toBe('number')
			expect(problem.answerChoices.length).toBe(4)
		})

		it('should respect difficulty ranges', () => {
			const difficulties: DifficultyLevel[] = [1, 2, 3, 4]
			const ranges: Record<DifficultyLevel, [number, number]> = {
				1: [1, 5],
				2: [1, 10],
				3: [1, 15],
				4: [1, 20]
			}

			for (const difficulty of difficulties) {
				const result = generator.generate(difficulty, new Set())
				const count = (result!.problem.correctAnswer as { type: 'number'; value: number }).value
				const [min, max] = ranges[difficulty]
				expect(count).toBeGreaterThanOrEqual(min)
				expect(count).toBeLessThanOrEqual(max)
			}
		})

		it('should include correct answer in choices', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem
			const correctValue = (problem.correctAnswer as { type: 'number'; value: number }).value
			const choiceValues = problem.answerChoices.map(
				(c) => (c as { type: 'number'; value: number }).value
			)

			expect(choiceValues).toContain(correctValue)
		})

		it('should exclude specified signatures', () => {
			// Get all signatures for difficulty 1
			const allSignatures = generator.allPossibleSignatures(1)
			const excluding = new Set(allSignatures.slice(0, -1)) // Exclude all but one

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
	})

	describe('allPossibleSignatures', () => {
		it('should return correct number of signatures for difficulty 1', () => {
			const signatures = generator.allPossibleSignatures(1)
			expect(signatures.length).toBe(5) // 1-5
		})

		it('should return correct number of signatures for difficulty 2', () => {
			const signatures = generator.allPossibleSignatures(2)
			expect(signatures.length).toBe(10) // 1-10
		})

		it('should return correct number of signatures for difficulty 3', () => {
			const signatures = generator.allPossibleSignatures(3)
			expect(signatures.length).toBe(15) // 1-15
		})

		it('should return correct number of signatures for difficulty 4', () => {
			const signatures = generator.allPossibleSignatures(4)
			expect(signatures.length).toBe(20) // 1-20
		})

		it('should have unique signatures', () => {
			const signatures = generator.allPossibleSignatures(4)
			const unique = new Set(signatures)
			expect(unique.size).toBe(signatures.length)
		})

		it('should follow the correct format', () => {
			const signatures = generator.allPossibleSignatures(2)
			for (const sig of signatures) {
				expect(sig).toMatch(/^counting:d2:\d+$/)
			}
		})
	})
})
