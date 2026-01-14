import { describe, it, expect } from 'vitest'
import { AdditionProblemGenerator } from './addition-generator'
import type { DifficultyLevel } from '$lib/types'

describe('AdditionProblemGenerator', () => {
	const generator = new AdditionProblemGenerator()

	describe('problemType', () => {
		it('should be addition', () => {
			expect(generator.problemType).toBe('addition')
		})
	})

	describe('generate', () => {
		it('should generate a valid addition problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('addition')
			expect(result!.signature).toMatch(/^addition:d1:\d+\+\d+$/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('equation')
			expect(problem.visual.operator).toBe('+')
			expect(problem.visual.elements.length).toBe(2)
			expect(problem.prompt.ptBR).toMatch(/\d+ \+ \d+ = \?/)
			expect(problem.prompt.en).toMatch(/\d+ \+ \d+ = \?/)
			expect(problem.correctAnswer.type).toBe('number')
			expect(problem.answerChoices.length).toBe(4)
		})

		it('should respect max sum for each difficulty', () => {
			const maxSums: Record<DifficultyLevel, number> = {
				1: 5,
				2: 10,
				3: 15,
				4: 20
			}

			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const result = generator.generate(difficulty, new Set())
				const sum = (result!.problem.correctAnswer as { type: 'number'; value: number }).value
				expect(sum).toBeLessThanOrEqual(maxSums[difficulty])
			}
		})

		it('should generate correct sum', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			const leftCount = problem.visual.elements[0].count
			const rightCount = problem.visual.elements[1].count
			const sum = (problem.correctAnswer as { type: 'number'; value: number }).value

			expect(leftCount + rightCount).toBe(sum)
		})

		it('should only use positive numbers', () => {
			for (let i = 0; i < 20; i++) {
				const result = generator.generate(4, new Set())
				const problem = result!.problem

				const leftCount = problem.visual.elements[0].count
				const rightCount = problem.visual.elements[1].count

				expect(leftCount).toBeGreaterThanOrEqual(1)
				expect(rightCount).toBeGreaterThanOrEqual(1)
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
			// Max sum 5: pairs (1,1), (1,2), (1,3), (1,4), (2,1), (2,2), (2,3), (3,1), (3,2), (4,1)
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
				expect(sig).toMatch(/^addition:d2:\d+\+\d+$/)
			}
		})
	})
})
