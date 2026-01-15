import { describe, it, expect, beforeEach } from 'vitest'
import { ComparisonProblemGenerator } from './comparison-generator'
import { ageService } from '$lib/services'
import type { DifficultyLevel } from '$lib/types'

describe('ComparisonProblemGenerator', () => {
	const generator = new ComparisonProblemGenerator()

	// Reset age to default before each test to ensure consistent behavior
	beforeEach(() => {
		ageService.setAge(5)
	})

	describe('problemType', () => {
		it('should be comparison', () => {
			expect(generator.problemType).toBe('comparison')
		})
	})

	describe('generate', () => {
		it('should generate a valid comparison problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('comparison')
			expect(result!.signature).toMatch(/^comparison:d1:\d+v\d+$/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('comparison')
			expect(problem.visual.elements.length).toBe(2)
			expect(problem.prompt.ptBR).toBe('Qual lado tem mais?')
			expect(problem.prompt.en).toBe('Which side has more?')
			expect(problem.correctAnswer.type).toBe('side')
			expect(problem.answerChoices.length).toBe(2)
		})

		it('should have left and right answer choices', () => {
			const result = generator.generate(2, new Set())
			const choices = result!.problem.answerChoices

			const sideValues = choices.map((c) => (c as { type: 'side'; value: string }).value)
			expect(sideValues).toContain('left')
			expect(sideValues).toContain('right')
		})

		it('should set correct answer based on which side has more', () => {
			for (let i = 0; i < 20; i++) {
				const result = generator.generate(3, new Set())
				const problem = result!.problem

				const leftCount = problem.visual.elements[0].count
				const rightCount = problem.visual.elements[1].count
				const correctSide = (problem.correctAnswer as { type: 'side'; value: string }).value

				if (leftCount > rightCount) {
					expect(correctSide).toBe('left')
				} else {
					expect(correctSide).toBe('right')
				}
			}
		})

		it('should respect minimum difference for each difficulty', () => {
			const minDiffs: Record<DifficultyLevel, number> = {
				1: 4, // Large obvious differences
				2: 3,
				3: 2,
				4: 1
			}

			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const result = generator.generate(difficulty, new Set())
				const problem = result!.problem

				const leftCount = problem.visual.elements[0].count
				const rightCount = problem.visual.elements[1].count
				const diff = Math.abs(leftCount - rightCount)

				expect(diff).toBeGreaterThanOrEqual(minDiffs[difficulty])
			}
		})

		it('should never have equal sides', () => {
			for (let i = 0; i < 20; i++) {
				const result = generator.generate(4, new Set())
				const problem = result!.problem

				const leftCount = problem.visual.elements[0].count
				const rightCount = problem.visual.elements[1].count

				expect(leftCount).not.toBe(rightCount)
			}
		})

		it('should use food/nature objects', () => {
			const expectedObjects = ['banana', 'apple', 'star', 'flower']
			for (let i = 0; i < 10; i++) {
				const result = generator.generate(2, new Set())
				const objectId = result!.problem.visual.elements[0].object
				expect(expectedObjects).toContain(objectId)
			}
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
		it('should return unique signatures', () => {
			const signatures = generator.allPossibleSignatures(2)
			const unique = new Set(signatures)
			expect(unique.size).toBe(signatures.length)
		})

		it('should use consistent ordering (smaller first)', () => {
			const signatures = generator.allPossibleSignatures(3)
			for (const sig of signatures) {
				const match = sig.match(/comparison:d\d+:(\d+)v(\d+)/)
				expect(match).not.toBeNull()
				const left = parseInt(match![1])
				const right = parseInt(match![2])
				expect(left).toBeLessThan(right)
			}
		})

		it('should follow the correct format', () => {
			const signatures = generator.allPossibleSignatures(2)
			for (const sig of signatures) {
				expect(sig).toMatch(/^comparison:d2:\d+v\d+$/)
			}
		})
	})

	describe('age-adaptive ranges', () => {
		it('should cap at max 5 for age 3 at all difficulty levels', () => {
			ageService.setAge(3)

			// All difficulty levels should cap at 5 for age 3
			for (const difficulty of [1, 2, 3, 4] as const) {
				for (let i = 0; i < 10; i++) {
					const result = generator.generate(difficulty, new Set())
					const problem = result!.problem
					const leftCount = problem.visual.elements[0].count
					const rightCount = problem.visual.elements[1].count

					expect(leftCount).toBeGreaterThanOrEqual(1)
					expect(leftCount).toBeLessThanOrEqual(5)
					expect(rightCount).toBeGreaterThanOrEqual(1)
					expect(rightCount).toBeLessThanOrEqual(5)
				}
			}
		})

		it('should cap at max 10 for age 4 at all difficulty levels', () => {
			ageService.setAge(4)

			// All difficulty levels should cap at 10 for age 4
			for (const difficulty of [1, 2, 3, 4] as const) {
				for (let i = 0; i < 10; i++) {
					const result = generator.generate(difficulty, new Set())
					const problem = result!.problem
					const leftCount = problem.visual.elements[0].count
					const rightCount = problem.visual.elements[1].count

					expect(leftCount).toBeGreaterThanOrEqual(1)
					expect(leftCount).toBeLessThanOrEqual(10)
					expect(rightCount).toBeGreaterThanOrEqual(1)
					expect(rightCount).toBeLessThanOrEqual(10)
				}
			}
		})

		it('should use standard larger ranges for ages 5+ at higher difficulties', () => {
			ageService.setAge(5)
			// Difficulty 2 should use range [1, 15] for older children
			let foundHigherThan10 = false
			for (let i = 0; i < 50; i++) {
				const result = generator.generate(2, new Set())
				const problem = result!.problem
				const leftCount = problem.visual.elements[0].count
				const rightCount = problem.visual.elements[1].count

				if (leftCount > 10 || rightCount > 10) foundHigherThan10 = true
			}
			expect(foundHigherThan10).toBe(true)
		})
	})
})
