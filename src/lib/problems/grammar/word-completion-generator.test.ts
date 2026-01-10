import { describe, it, expect } from 'vitest'
import { WordCompletionGenerator } from './word-completion-generator'
import type { DifficultyLevel } from '$lib/types'

describe('WordCompletionGenerator', () => {
	const generator = new WordCompletionGenerator()

	describe('problemType', () => {
		it('should be word-completion', () => {
			expect(generator.problemType).toBe('word-completion')
		})
	})

	describe('generate', () => {
		it('should generate a valid word completion problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('word-completion')
			expect(result!.signature).toMatch(/^word-completion:d1:\w+:\d+$/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('word')
			expect(problem.visual.displayText).toBeDefined()
			expect(problem.visual.elements.length).toBe(1)
			expect(problem.visual.missingIndex).toBeDefined()
			expect(problem.prompt.ptBR).toBe('Complete a palavra')
			expect(problem.prompt.en).toBe('Complete the word')
			expect(problem.correctAnswer.type).toBe('letter')
			expect(problem.answerChoices.length).toBe(4)
		})

		it('should have correct answer matching the missing letter', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem
			const correctLetter = (problem.correctAnswer as { type: 'letter'; value: string }).value
			const displayText = problem.visual.displayText!
			const missingIndex = problem.visual.missingIndex!

			expect(displayText[missingIndex].toUpperCase()).toBe(correctLetter)
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

		it('should have first position missing for difficulty 1', () => {
			const signatures = generator.allPossibleSignatures(1)
			for (const sig of signatures) {
				const missingIndex = parseInt(sig.split(':')[3])
				expect(missingIndex).toBe(0)
			}
		})

		it('should have last position missing for difficulty 2', () => {
			const signatures = generator.allPossibleSignatures(2)
			for (const sig of signatures) {
				const parts = sig.split(':')
				const word = parts[2]
				const missingIndex = parseInt(parts[3])
				expect(missingIndex).toBe(word.length - 1)
			}
		})

		it('should have any position missing for difficulties 3-4', () => {
			for (const difficulty of [3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				const missingIndices = new Set(signatures.map((sig) => parseInt(sig.split(':')[3])))
				// Should have multiple different missing positions
				expect(missingIndices.size).toBeGreaterThan(1)
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
				expect(sig).toMatch(/^word-completion:d2:\w+:\d+$/)
			}
		})

		it('should have more variations at higher difficulties', () => {
			const sig1 = generator.allPossibleSignatures(1)
			const sig4 = generator.allPossibleSignatures(4)

			expect(sig4.length).toBeGreaterThan(sig1.length)
		})
	})
})
