import { describe, it, expect } from 'vitest'
import { ShapeRecognitionGenerator } from './shape-recognition-generator'
import type { DifficultyLevel } from '$lib/types'

describe('ShapeRecognitionGenerator', () => {
	const generator = new ShapeRecognitionGenerator()

	describe('problemType', () => {
		it('should be shape-recognition', () => {
			expect(generator.problemType).toBe('shape-recognition')
		})
	})

	describe('generate', () => {
		it('should generate a valid shape recognition problem', () => {
			const result = generator.generate(1, new Set())
			expect(result).not.toBeNull()
			expect(result!.problem.type).toBe('shape-recognition')
			expect(result!.signature).toMatch(/^shape:d1:/)
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

		it('should have distractors different from target shape', () => {
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
			expect(generator.allPossibleSignatures(1).length).toBe(3) // circle, square, triangle
			expect(generator.allPossibleSignatures(2).length).toBe(4) // + star
			expect(generator.allPossibleSignatures(3).length).toBe(5) // + heart
			expect(generator.allPossibleSignatures(4).length).toBe(6) // + diamond
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
				expect(sig).toMatch(/^shape:d3:/)
			}
		})

		it('should include shape ID in signature', () => {
			const signatures = generator.allPossibleSignatures(1)
			const shapeIds = signatures.map((s) => s.split(':')[2])
			expect(shapeIds).toContain('circle')
			expect(shapeIds).toContain('square')
			expect(shapeIds).toContain('triangle')
		})
	})

	describe('difficulty progression', () => {
		it('should use only 3 shapes at difficulty 1', () => {
			const signatures = generator.allPossibleSignatures(1)
			const shapeIds = signatures.map((s) => s.split(':')[2])
			expect(shapeIds.sort()).toEqual(['circle', 'square', 'triangle'])
		})

		it('should use all 6 shapes at difficulty 4', () => {
			const signatures = generator.allPossibleSignatures(4)
			const shapeIds = signatures.map((s) => s.split(':')[2])
			expect(shapeIds.sort()).toEqual(['circle', 'diamond', 'heart', 'square', 'star', 'triangle'])
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

		it('should use correct French article with apostrophe for étoile', () => {
			// Generate problems until we find a star
			let found = false
			for (let i = 0; i < 50; i++) {
				const result = generator.generate(4, new Set())
				if (result!.signature.endsWith(':star')) {
					expect(result!.problem.prompt.fr).toBe("Trouve l'étoile!")
					found = true
					break
				}
			}
			expect(found).toBe(true)
		})

		it('should use correct German articles', () => {
			// Generate problems until we find specific shapes
			const germansFound = {
				circle: false, // den Kreis
				square: false, // das Quadrat
				star: false // den Stern
			}

			for (let i = 0; i < 100; i++) {
				const result = generator.generate(4, new Set())
				const shapeId = result!.signature.split(':')[2]

				if (shapeId === 'circle' && !germansFound.circle) {
					expect(result!.problem.prompt.de).toBe('Finde den Kreis!')
					germansFound.circle = true
				} else if (shapeId === 'square' && !germansFound.square) {
					expect(result!.problem.prompt.de).toBe('Finde das Quadrat!')
					germansFound.square = true
				} else if (shapeId === 'star' && !germansFound.star) {
					expect(result!.problem.prompt.de).toBe('Finde den Stern!')
					germansFound.star = true
				}

				if (germansFound.circle && germansFound.square && germansFound.star) break
			}

			expect(germansFound.circle).toBe(true)
			expect(germansFound.square).toBe(true)
			expect(germansFound.star).toBe(true)
		})

		it('should use correct Portuguese articles', () => {
			// Generate problems until we find a star (which uses 'a' article)
			let found = false
			for (let i = 0; i < 50; i++) {
				const result = generator.generate(4, new Set())
				if (result!.signature.endsWith(':star')) {
					expect(result!.problem.prompt.ptBR).toBe('Encontre a estrela!')
					found = true
					break
				}
			}
			expect(found).toBe(true)
		})

		it('should use correct Spanish articles', () => {
			// Generate problems until we find a star (which uses 'la' article)
			let found = false
			for (let i = 0; i < 50; i++) {
				const result = generator.generate(4, new Set())
				if (result!.signature.endsWith(':star')) {
					expect(result!.problem.prompt.es).toBe('¡Encuentra la estrella!')
					found = true
					break
				}
			}
			expect(found).toBe(true)
		})
	})
})
