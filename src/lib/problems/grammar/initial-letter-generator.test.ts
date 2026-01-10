import { describe, it, expect } from 'vitest'
import { InitialLetterGenerator } from './initial-letter-generator'
import type { DifficultyLevel } from '$lib/types'

describe('InitialLetterGenerator', () => {
	const generator = new InitialLetterGenerator()

	describe('problemType', () => {
		it('should be initial-letter', () => {
			expect(generator.problemType).toBe('initial-letter')
		})
	})

	describe('generate', () => {
		it('should generate a valid initial letter problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('initial-letter')
			expect(result!.signature).toMatch(/^initial-letter:d1:\w+$/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('word')
			expect(problem.visual.displayText).toBeDefined()
			expect(problem.visual.elements.length).toBe(1)
			expect(problem.prompt.ptBR).toContain('Com qual letra começa')
			expect(problem.prompt.en).toContain('start with')
			expect(problem.correctAnswer.type).toBe('letter')
			expect(problem.answerChoices.length).toBe(4)
		})

		it('should have correct answer matching word initial', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem
			const correctLetter = (problem.correctAnswer as { type: 'letter'; value: string }).value
			const displayText = problem.visual.displayText!

			expect(displayText[0].toUpperCase()).toBe(correctLetter)
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

		it('should use vowels only at difficulty 1', () => {
			const vowels = ['A', 'E', 'I', 'O', 'U']
			const signatures = generator.allPossibleSignatures(1)

			// All words at difficulty 1 should start with vowels
			for (const sig of signatures) {
				const word = sig.split(':')[2]
				expect(vowels).toContain(word[0].toUpperCase())
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
				expect(sig).toMatch(/^initial-letter:d2:\w+$/)
			}
		})

		it('should have more words available at higher difficulties', () => {
			const sig1 = generator.allPossibleSignatures(1)
			const sig4 = generator.allPossibleSignatures(4)

			expect(sig4.length).toBeGreaterThanOrEqual(sig1.length)
		})
	})
})
