import { describe, it, expect } from 'vitest'
import { AlphabetOrderGenerator } from './alphabet-order-generator'
import type { DifficultyLevel } from '$lib/types'

describe('AlphabetOrderGenerator', () => {
	const generator = new AlphabetOrderGenerator()

	describe('problemType', () => {
		it('should be alphabet-order', () => {
			expect(generator.problemType).toBe('alphabet-order')
		})
	})

	describe('generate', () => {
		it('should generate a valid alphabet order problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('alphabet-order')
			expect(result!.signature).toMatch(/^alphabet-order:d1:\d+:\d+$/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('letter-sequence')
			expect(problem.visual.displayText).toBeDefined()
			expect(problem.visual.elements.length).toBeGreaterThan(0)
			expect(problem.prompt.ptBR).toBe('O que vem depois?')
			expect(problem.prompt.en).toBe('What comes next?')
			expect(problem.correctAnswer.type).toBe('letter')
			expect(problem.answerChoices.length).toBe(4)
		})

		it('should have a question mark in the sequence', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem
			const displayText = problem.visual.displayText!

			expect(displayText).toContain('?')
		})

		it('should include correct answer in choices', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem
			const correctValue = (problem.correctAnswer as { type: 'letter'; value: string }).value
			const choiceValues = problem.answerChoices.map(
				(c) => (c as { type: 'letter'; value: string }).value
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

		it('should have missing position at end for difficulty 1', () => {
			const signatures = generator.allPossibleSignatures(1)
			for (const sig of signatures) {
				const missingPos = parseInt(sig.split(':')[3])
				expect(missingPos).toBe(3) // Last position in 4-letter sequence
			}
		})

		it('should have middle missing positions for difficulty 3', () => {
			const signatures = generator.allPossibleSignatures(3)
			for (const sig of signatures) {
				const missingPos = parseInt(sig.split(':')[3])
				expect([1, 2]).toContain(missingPos)
			}
		})
	})

	describe('allPossibleSignatures', () => {
		it('should return signatures for all difficulty levels', () => {
			const difficulties: DifficultyLevel[] = [1, 2, 3, 4]
			for (const difficulty of difficulties) {
				const signatures = generator.allPossibleSignatures(difficulty)
				expect(signatures.length).toBeGreaterThan(0)
			}
		})

		it('should have unique signatures', () => {
			const signatures = generator.allPossibleSignatures(2)
			const unique = new Set(signatures)
			expect(unique.size).toBe(signatures.length)
		})

		it('should follow the correct format', () => {
			const signatures = generator.allPossibleSignatures(2)
			for (const sig of signatures) {
				expect(sig).toMatch(/^alphabet-order:d2:\d+:\d+$/)
			}
		})

		it('should have limited start range for difficulty 1', () => {
			const signatures = generator.allPossibleSignatures(1)
			for (const sig of signatures) {
				const startIndex = parseInt(sig.split(':')[2])
				expect(startIndex).toBeLessThanOrEqual(2) // A-D to C-F range
			}
		})

		it('should have more variations at higher difficulties', () => {
			const sig1 = generator.allPossibleSignatures(1)
			const sig4 = generator.allPossibleSignatures(4)

			expect(sig4.length).toBeGreaterThan(sig1.length)
		})
	})
})
