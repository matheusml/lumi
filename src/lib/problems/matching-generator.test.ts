import { describe, it, expect } from 'vitest'
import { MatchingProblemGenerator } from './matching-generator'
import type { DifficultyLevel } from '$lib/types'

describe('MatchingProblemGenerator', () => {
	const generator = new MatchingProblemGenerator()

	describe('problemType', () => {
		it('should be matching', () => {
			expect(generator.problemType).toBe('matching')
		})
	})

	describe('generate', () => {
		it('should generate a valid matching problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('matching')
			expect(result!.signature).toMatch(/^logic:matching:d1:/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('logic-matching')
			expect(problem.visual.sourceObject).toBeDefined()
			expect(problem.visual.elements.length).toBe(4) // 4 answer choices
			expect(problem.prompt.ptBR).toBe('O que combina?')
			expect(problem.prompt.en).toBe('What goes together?')
			expect(problem.correctAnswer.type).toBe('object')
			expect(problem.answerChoices.length).toBe(4)
		})

		it('should have object answer choices with emojis', () => {
			const result = generator.generate(2, new Set())
			const choices = result!.problem.answerChoices

			for (const choice of choices) {
				expect(choice.type).toBe('object')
				expect((choice as { type: 'object'; value: string }).value.length).toBeGreaterThan(0)
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
		it('should return 5 pairs per difficulty', () => {
			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				expect(signatures.length).toBe(5)
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
				expect(sig).toMatch(/^logic:matching:d3:/)
			}
		})
	})

	describe('difficulty progression', () => {
		it('should have different pairs per difficulty level', () => {
			const pairsByDifficulty = new Map<DifficultyLevel, Set<string>>()

			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				const pairs = new Set(signatures.map((s) => s.split(':')[3]))
				pairsByDifficulty.set(difficulty, pairs)
			}

			// Each difficulty should have its own set of pairs
			expect(pairsByDifficulty.get(1)).not.toEqual(pairsByDifficulty.get(2))
			expect(pairsByDifficulty.get(2)).not.toEqual(pairsByDifficulty.get(3))
			expect(pairsByDifficulty.get(3)).not.toEqual(pairsByDifficulty.get(4))
		})
	})
})
