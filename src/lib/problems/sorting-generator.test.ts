import { describe, it, expect } from 'vitest'
import { SortingProblemGenerator } from './sorting-generator'
import type { DifficultyLevel } from '$lib/types'

describe('SortingProblemGenerator', () => {
	const generator = new SortingProblemGenerator()

	describe('problemType', () => {
		it('should be sorting', () => {
			expect(generator.problemType).toBe('sorting')
		})
	})

	describe('generate', () => {
		it('should generate a valid sorting problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('sorting')
			expect(result!.signature).toMatch(/^logic:sorting:d1:/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('logic-matching')
			expect(problem.visual.elements.length).toBe(3) // 1 correct + 2 distractors (3 categories per difficulty)
			expect(problem.visual.sourceObject).toBeDefined()
			expect(problem.correctAnswer.type).toBe('object')
			expect(problem.answerChoices.length).toBe(3)
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

		it('should have 2 distractor categories different from correct', () => {
			for (let i = 0; i < 10; i++) {
				const result = generator.generate(2, new Set())
				const correctAnswer = result!.problem.correctAnswer as { type: 'object'; value: string }
				const choices = result!.problem.answerChoices as { type: 'object'; value: string }[]

				const distractors = choices.filter((c) => c.value !== correctAnswer.value)
				expect(distractors.length).toBe(2) // 3 categories per difficulty - 1 correct = 2 distractors
				for (const distractor of distractors) {
					expect(distractor.value).not.toBe(correctAnswer.value)
				}
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
		it('should return 15 signatures per difficulty (3 categories × 5 items)', () => {
			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				expect(signatures.length).toBe(15)
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
				expect(sig).toMatch(/^logic:sorting:d3:/)
			}
		})

		it('should include category and object IDs in signature', () => {
			const signatures = generator.allPossibleSignatures(1)
			// Format: logic:sorting:d{difficulty}:{categoryId}:{objectId}
			expect(signatures).toContain('logic:sorting:d1:fruits:apple')
			expect(signatures).toContain('logic:sorting:d1:animals:dog')
			expect(signatures).toContain('logic:sorting:d1:vehicles:car')
		})
	})

	describe('difficulty progression', () => {
		it('should have Fruits, Animals, Vehicles at difficulty 1', () => {
			const signatures = generator.allPossibleSignatures(1)
			const categories = [...new Set(signatures.map((s) => s.split(':')[3]))]
			expect(categories.sort()).toEqual(['animals', 'fruits', 'vehicles'])
		})

		it('should have Food, Toys, Nature at difficulty 2', () => {
			const signatures = generator.allPossibleSignatures(2)
			const categories = [...new Set(signatures.map((s) => s.split(':')[3]))]
			expect(categories.sort()).toEqual(['food', 'nature', 'toys'])
		})

		it('should have Sea Animals, Insects, Clothes at difficulty 3', () => {
			const signatures = generator.allPossibleSignatures(3)
			const categories = [...new Set(signatures.map((s) => s.split(':')[3]))]
			expect(categories.sort()).toEqual(['clothes', 'insects', 'sea-animals'])
		})

		it('should have Musical Instruments, Tools, School at difficulty 4', () => {
			const signatures = generator.allPossibleSignatures(4)
			const categories = [...new Set(signatures.map((s) => s.split(':')[3]))]
			expect(categories.sort()).toEqual(['musical', 'school', 'tools'])
		})

		it('should have different categories for each difficulty level', () => {
			const categoriesByDifficulty = new Map<DifficultyLevel, Set<string>>()

			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				const categories = new Set(signatures.map((s) => s.split(':')[3]))
				categoriesByDifficulty.set(difficulty, categories)
			}

			// Each difficulty should have its own set of categories
			expect(categoriesByDifficulty.get(1)).not.toEqual(categoriesByDifficulty.get(2))
			expect(categoriesByDifficulty.get(2)).not.toEqual(categoriesByDifficulty.get(3))
			expect(categoriesByDifficulty.get(3)).not.toEqual(categoriesByDifficulty.get(4))
		})
	})

	describe('localization', () => {
		it('should have all 5 languages in prompt', () => {
			const result = generator.generate(1, new Set())
			const prompt = result!.problem.prompt

			expect(prompt.en).toBe('Where does this belong?')
			expect(prompt.ptBR).toBe('Onde isso pertence?')
			expect(prompt.de).toBe('Wohin gehört das?')
			expect(prompt.fr).toBe('Où cela appartient-il?')
			expect(prompt.es).toBe('¿Dónde pertenece esto?')
		})

		it('should have all 5 languages in hint', () => {
			const result = generator.generate(1, new Set())
			const hint = result!.problem.hint

			expect(hint!.en).toBeDefined()
			expect(hint!.ptBR).toBeDefined()
			expect(hint!.de).toBeDefined()
			expect(hint!.fr).toBeDefined()
			expect(hint!.es).toBeDefined()
		})
	})
})
