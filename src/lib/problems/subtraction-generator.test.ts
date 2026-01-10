import { describe, it, expect } from 'vitest'
import { SubtractionProblemGenerator } from './subtraction-generator'
import type { DifficultyLevel } from '$lib/types'

describe('SubtractionProblemGenerator', () => {
	const generator = new SubtractionProblemGenerator()

	describe('problemType', () => {
		it('should be subtraction', () => {
			expect(generator.problemType).toBe('subtraction')
		})
	})

	describe('generate', () => {
		it('should generate a valid subtraction problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('subtraction')
			expect(result!.signature).toMatch(/^subtraction:d1:\d+-\d+$/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('equation')
			expect(problem.visual.operator).toBe('-')
			expect(problem.visual.elements.length).toBe(2)
			expect(problem.prompt.ptBR).toMatch(/\d+ - \d+ = \?/)
			expect(problem.prompt.en).toMatch(/\d+ - \d+ = \?/)
			expect(problem.correctAnswer.type).toBe('number')
			expect(problem.answerChoices.length).toBe(4)
		})

		it('should respect max minuend for each difficulty', () => {
			const maxMinuends: Record<DifficultyLevel, number> = {
				1: 5,
				2: 10,
				3: 15,
				4: 20
			}

			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const result = generator.generate(difficulty, new Set())
				const minuend = result!.problem.visual.elements[0].count
				expect(minuend).toBeLessThanOrEqual(maxMinuends[difficulty])
			}
		})

		it('should generate correct difference (positive results only)', () => {
			for (let i = 0; i < 20; i++) {
				const result = generator.generate(4, new Set())
				const problem = result!.problem

				const minuend = problem.visual.elements[0].count
				const subtrahend = problem.visual.elements[1].count
				const difference = (problem.correctAnswer as { type: 'number'; value: number }).value

				expect(minuend - subtrahend).toBe(difference)
				expect(difference).toBeGreaterThanOrEqual(0)
				expect(minuend).toBeGreaterThan(subtrahend)
			}
		})

		it('should use flying objects (bird, butterfly, fish)', () => {
			const flyingObjects = ['bird', 'butterfly', 'fish']
			for (let i = 0; i < 10; i++) {
				const result = generator.generate(2, new Set())
				const objectId = result!.problem.visual.elements[0].object
				expect(flyingObjects).toContain(objectId)
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
			const allSignatures = generator.allPossibleSignatures(1)
			const excluding = new Set(allSignatures.slice(0, -1))

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
			// Max minuend 5: pairs (2,1), (3,1), (3,2), (4,1), (4,2), (4,3), (5,1), (5,2), (5,3), (5,4)
			const signatures = generator.allPossibleSignatures(1)
			expect(signatures.length).toBe(10)
		})

		it('should have unique signatures', () => {
			const signatures = generator.allPossibleSignatures(4)
			const unique = new Set(signatures)
			expect(unique.size).toBe(signatures.length)
		})

		it('should follow the correct format', () => {
			const signatures = generator.allPossibleSignatures(2)
			for (const sig of signatures) {
				expect(sig).toMatch(/^subtraction:d2:\d+-\d+$/)
			}
		})
	})
})
