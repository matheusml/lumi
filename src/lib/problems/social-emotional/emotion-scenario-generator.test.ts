import { describe, it, expect } from 'vitest'
import { EmotionScenarioGenerator } from './emotion-scenario-generator'
import type { DifficultyLevel } from '$lib/types'

describe('EmotionScenarioGenerator', () => {
	const generator = new EmotionScenarioGenerator()

	describe('problemType', () => {
		it('should be emotion-scenario', () => {
			expect(generator.problemType).toBe('emotion-scenario')
		})
	})

	describe('generate', () => {
		it('should generate a valid emotion-scenario problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('emotion-scenario')
			expect(result!.signature).toMatch(/^social-emotional:emotion-scenario:d1:/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('scenario')
			expect(problem.visual.elements.length).toBe(1)
			expect(problem.prompt.en).toContain('How would you feel?')
			expect(problem.correctAnswer.type).toBe('object')
			expect(problem.answerChoices.length).toBeGreaterThanOrEqual(3)
		})

		it('should have object answer choices with emotion emojis and labels', () => {
			const result = generator.generate(2, new Set())
			const choices = result!.problem.answerChoices

			for (const choice of choices) {
				expect(choice.type).toBe('object')
				const objChoice = choice as {
					type: 'object'
					value: string
					label?: Record<string, string>
				}
				expect(objChoice.value.length).toBeGreaterThan(0)
				expect(objChoice.label).toBeDefined()
				expect(objChoice.label!.en).toBeDefined()
				expect(objChoice.label!.ptBR).toBeDefined()
				expect(objChoice.label!.de).toBeDefined()
				expect(objChoice.label!.fr).toBeDefined()
				expect(objChoice.label!.es).toBeDefined()
			}
		})

		it('should have label on correct answer', () => {
			const result = generator.generate(2, new Set())
			const correctAnswer = result!.problem.correctAnswer as {
				type: 'object'
				value: string
				label?: Record<string, string>
			}

			expect(correctAnswer.label).toBeDefined()
			expect(correctAnswer.label!.en).toBeDefined()
		})

		it('should have 1 visual element with the scenario emoji', () => {
			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const result = generator.generate(difficulty, new Set())
				expect(result).not.toBeNull()
				expect(result!.problem.visual.elements.length).toBe(1)
				expect(result!.problem.visual.elements[0].count).toBe(1)
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

		it('should have hint text in all languages', () => {
			const result = generator.generate(1, new Set())
			expect(result!.problem.hint).toBeDefined()
			expect(result!.problem.hint!.ptBR).toBeDefined()
			expect(result!.problem.hint!.en).toBeDefined()
			expect(result!.problem.hint!.de).toBeDefined()
			expect(result!.problem.hint!.fr).toBeDefined()
			expect(result!.problem.hint!.es).toBeDefined()
		})

		it('should have displayText in visual', () => {
			const result = generator.generate(1, new Set())
			expect(result!.problem.visual.displayText).toBeDefined()
		})
	})

	describe('allPossibleSignatures', () => {
		it('should return signatures for each difficulty', () => {
			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty)
				expect(signatures.length).toBeGreaterThan(0)
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
				expect(sig).toMatch(/^social-emotional:emotion-scenario:d3:/)
			}
		})

		it('should have more scenarios at higher difficulties', () => {
			const sig1 = generator.allPossibleSignatures(1)
			const sig4 = generator.allPossibleSignatures(4)

			expect(sig4.length).toBeGreaterThan(sig1.length)
		})
	})

	describe('difficulty progression', () => {
		it('should have simple scenarios at difficulty 1', () => {
			const signatures = generator.allPossibleSignatures(1)
			const scenarios = signatures.map((s) => s.split(':')[3])

			expect(scenarios).toContain('gift')
			expect(scenarios).toContain('toy-broken')
		})

		it('should have everyday scenarios at difficulty 2', () => {
			const signatures = generator.allPossibleSignatures(2)
			const scenarios = signatures.map((s) => s.split(':')[3])

			expect(scenarios).toContain('birthday-party')
			expect(scenarios).toContain('thunder')
		})

		it('should have social scenarios at difficulty 3', () => {
			const signatures = generator.allPossibleSignatures(3)
			const scenarios = signatures.map((s) => s.split(':')[3])

			expect(scenarios).toContain('friend-visit')
			expect(scenarios).toContain('dark-room')
		})

		it('should have nuanced scenarios at difficulty 4', () => {
			const signatures = generator.allPossibleSignatures(4)
			const scenarios = signatures.map((s) => s.split(':')[3])

			expect(scenarios).toContain('theme-park')
			expect(scenarios).toContain('pet-sick')
		})
	})
})
