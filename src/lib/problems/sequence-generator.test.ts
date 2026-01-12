import { describe, it, expect } from 'vitest'
import { SequenceProblemGenerator } from './sequence-generator'
import type { DifficultyLevel } from '$lib/types'

describe('SequenceProblemGenerator', () => {
	const generator = new SequenceProblemGenerator()

	describe('problemType', () => {
		it('should be sequence', () => {
			expect(generator.problemType).toBe('sequence')
		})
	})

	describe('generate', () => {
		it('should generate a valid sequence problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('sequence')
			expect(result!.signature).toMatch(/^logic:sequence:d1:/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('logic-sequence')
			expect(problem.visual.elements.length).toBeGreaterThan(1) // At least 2 elements (steps + unknown)
			expect(problem.prompt.ptBR).toBe('O que vem depois?')
			expect(problem.prompt.en).toBe('What comes next?')
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

		it('should have unknown as last element in visual', () => {
			for (let i = 0; i < 10; i++) {
				const result = generator.generate(2, new Set())
				const elements = result!.problem.visual.elements
				const lastElement = elements[elements.length - 1]

				expect(lastElement.object).toBe('unknown')
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
		it('should return 3 sequences per difficulty', () => {
			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				expect(signatures.length).toBe(3)
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
				expect(sig).toMatch(/^logic:sequence:d3:/)
			}
		})
	})

	describe('difficulty progression', () => {
		it('should have different sequences per difficulty level', () => {
			const sequencesByDifficulty = new Map<DifficultyLevel, Set<string>>()

			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				const sequences = new Set(signatures.map((s) => s.split(':')[3]))
				sequencesByDifficulty.set(difficulty, sequences)
			}

			// Each difficulty should have its own set of sequences
			expect(sequencesByDifficulty.get(1)).not.toEqual(sequencesByDifficulty.get(2))
			expect(sequencesByDifficulty.get(2)).not.toEqual(sequencesByDifficulty.get(3))
			expect(sequencesByDifficulty.get(3)).not.toEqual(sequencesByDifficulty.get(4))
		})
	})
})
