import { describe, it, expect } from 'vitest'
import { ColorRecognitionGenerator } from './color-recognition-generator'
import type { DifficultyLevel } from '$lib/types'

describe('ColorRecognitionGenerator', () => {
	const generator = new ColorRecognitionGenerator()

	describe('problemType', () => {
		it('should be color-recognition', () => {
			expect(generator.problemType).toBe('color-recognition')
		})
	})

	describe('generate', () => {
		it('should generate a valid color recognition problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('color-recognition')
			expect(result!.signature).toMatch(/^color:d1:/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('logic-group')
			expect(problem.visual.elements.length).toBe(3)
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

		it('should have distractors different from target color', () => {
			for (let i = 0; i < 10; i++) {
				const result = generator.generate(2, new Set())
				const correctAnswer = result!.problem.correctAnswer as { type: 'object'; value: string }
				const choices = result!.problem.answerChoices as { type: 'object'; value: string }[]

				const distractors = choices.filter((c) => c.value !== correctAnswer.value)
				expect(distractors.length).toBe(2)
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
		it('should return correct number of signatures per difficulty', () => {
			expect(generator.allPossibleSignatures(1).length).toBe(3) // red, yellow, green
			expect(generator.allPossibleSignatures(2).length).toBe(4) // + blue
			expect(generator.allPossibleSignatures(3).length).toBe(5) // + orange
			expect(generator.allPossibleSignatures(4).length).toBe(6) // + purple
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
				expect(sig).toMatch(/^color:d3:/)
			}
		})

		it('should include color ID in signature', () => {
			const signatures = generator.allPossibleSignatures(1)
			const colorIds = signatures.map((s) => s.split(':')[2])
			expect(colorIds).toContain('red')
			expect(colorIds).toContain('yellow')
			expect(colorIds).toContain('green')
		})
	})

	describe('difficulty progression', () => {
		it('should use only 3 colors at difficulty 1', () => {
			const signatures = generator.allPossibleSignatures(1)
			const colorIds = signatures.map((s) => s.split(':')[2])
			expect(colorIds.sort()).toEqual(['green', 'red', 'yellow'])
		})

		it('should use all 6 colors at difficulty 4', () => {
			const signatures = generator.allPossibleSignatures(4)
			const colorIds = signatures.map((s) => s.split(':')[2])
			expect(colorIds.sort()).toEqual(['blue', 'green', 'orange', 'purple', 'red', 'yellow'])
		})
	})

	describe('localization', () => {
		it('should have all 5 languages in prompt', () => {
			const result = generator.generate(1, new Set())
			const prompt = result!.problem.prompt

			expect(prompt.en).toBeDefined()
			expect(prompt.ptBR).toBeDefined()
			expect(prompt.de).toBeDefined()
			expect(prompt.fr).toBeDefined()
			expect(prompt.es).toBeDefined()
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

		it('should include color name in prompt', () => {
			// Generate multiple times to get a red color problem
			let foundRed = false
			for (let i = 0; i < 20; i++) {
				const result = generator.generate(1, new Set())
				if (result!.signature.endsWith(':red')) {
					expect(result!.problem.prompt.en).toContain('red')
					expect(result!.problem.prompt.ptBR).toContain('vermelho')
					foundRed = true
					break
				}
			}
			expect(foundRed).toBe(true)
		})
	})
})
