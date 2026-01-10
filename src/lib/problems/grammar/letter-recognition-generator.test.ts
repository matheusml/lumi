import { describe, it, expect } from 'vitest'
import { LetterRecognitionGenerator } from './letter-recognition-generator'
import type { DifficultyLevel } from '$lib/types'

describe('LetterRecognitionGenerator', () => {
	const generator = new LetterRecognitionGenerator()

	describe('problemType', () => {
		it('should be letter-recognition', () => {
			expect(generator.problemType).toBe('letter-recognition')
		})
	})

	describe('generate', () => {
		it('should generate a valid letter recognition problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('letter-recognition')
			expect(result!.signature).toMatch(/^letter-recognition:d1:[A-Z]:upper$/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('letter')
			expect(problem.visual.displayText).toBeDefined()
			expect(problem.prompt.ptBR).toBe('Qual é a letra?')
			expect(problem.prompt.en).toBe('What letter is this?')
			expect(problem.correctAnswer.type).toBe('letter')
			expect(problem.answerChoices.length).toBe(4)
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

		it('should generate lowercase letters at difficulty 4', () => {
			// Generate multiple problems to increase chance of getting lowercase
			const signatures = generator.allPossibleSignatures(4)
			const hasLowercase = signatures.some((sig) => sig.endsWith(':lower'))
			expect(hasLowercase).toBe(true)
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
				expect(sig).toMatch(/^letter-recognition:d2:[A-Z]:(upper|lower)$/)
			}
		})

		it('should include both cases at difficulty 4', () => {
			const signatures = generator.allPossibleSignatures(4)
			const upperCount = signatures.filter((s) => s.endsWith(':upper')).length
			const lowerCount = signatures.filter((s) => s.endsWith(':lower')).length

			expect(upperCount).toBeGreaterThan(0)
			expect(lowerCount).toBeGreaterThan(0)
		})

		it('should only have uppercase at difficulties 1-3', () => {
			for (const difficulty of [1, 2, 3] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				const hasLowercase = signatures.some((s) => s.endsWith(':lower'))
				expect(hasLowercase).toBe(false)
			}
		})
	})
})
