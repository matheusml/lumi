import { describe, it, expect } from 'vitest'
import { EmotionRecognitionGenerator } from './emotion-recognition-generator'
import type { DifficultyLevel } from '$lib/types'

describe('EmotionRecognitionGenerator', () => {
	const generator = new EmotionRecognitionGenerator()

	describe('problemType', () => {
		it('should be emotion-recognition', () => {
			expect(generator.problemType).toBe('emotion-recognition')
		})
	})

	describe('generate', () => {
		it('should generate a valid emotion-recognition problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('emotion-recognition')
			expect(result!.signature).toMatch(/^social-emotional:emotion-recognition:d1:/)
		})

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set())
			const problem = result!.problem

			expect(problem.id).toBeDefined()
			expect(problem.difficulty).toBe(2)
			expect(problem.visual.type).toBe('emotion')
			expect(problem.visual.elements.length).toBe(1)
			expect(problem.prompt.ptBR).toBe('Como essa pessoa está se sentindo?')
			expect(problem.prompt.en).toBe('How does this person feel?')
			expect(problem.correctAnswer.type).toBe('object')
			expect(problem.answerChoices.length).toBeGreaterThanOrEqual(3)
		})

		it('should have object answer choices with emojis', () => {
			const result = generator.generate(2, new Set())
			const choices = result!.problem.answerChoices

			for (const choice of choices) {
				expect(choice.type).toBe('object')
				expect((choice as { type: 'object'; value: string }).value.length).toBeGreaterThan(0)
			}
		})

		it('should have 1 visual element with the emotion face', () => {
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
				expect(sig).toMatch(/^social-emotional:emotion-recognition:d3:/)
			}
		})

		it('should have more emotions at higher difficulties', () => {
			const sig1 = generator.allPossibleSignatures(1)
			const sig4 = generator.allPossibleSignatures(4)

			expect(sig4.length).toBeGreaterThan(sig1.length)
		})
	})

	describe('difficulty progression', () => {
		it('should have basic emotions at difficulty 1', () => {
			const signatures = generator.allPossibleSignatures(1)
			const emotions = signatures.map((s) => s.split(':')[3])

			expect(emotions).toContain('happy')
			expect(emotions).toContain('sad')
			expect(emotions.length).toBe(2)
		})

		it('should add angry and scared at difficulty 2', () => {
			const signatures = generator.allPossibleSignatures(2)
			const emotions = signatures.map((s) => s.split(':')[3])

			expect(emotions).toContain('angry')
			expect(emotions).toContain('scared')
		})

		it('should add surprised and tired at difficulty 3', () => {
			const signatures = generator.allPossibleSignatures(3)
			const emotions = signatures.map((s) => s.split(':')[3])

			expect(emotions).toContain('surprised')
			expect(emotions).toContain('tired')
		})

		it('should add excited and worried at difficulty 4', () => {
			const signatures = generator.allPossibleSignatures(4)
			const emotions = signatures.map((s) => s.split(':')[3])

			expect(emotions).toContain('excited')
			expect(emotions).toContain('worried')
		})
	})
})
