/**
 * Shape Recognition Problem Generator
 *
 * Generates "Find the [shape]!" problems for young children (ages 3-4).
 * Shows shape choices and asks to find a specific shape.
 *
 * Signature format: shape:d{difficulty}:{shapeId}
 */

import type { Problem, DifficultyLevel, AnswerValue, LocalizedString } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from './generator'
import { shuffle } from './visual-objects'

interface Shape {
	id: string
	emoji: string
	name: LocalizedString
}

/** Basic shapes for young children */
const SHAPES: Shape[] = [
	{
		id: 'circle',
		emoji: '🔵',
		name: { en: 'circle', ptBR: 'círculo', de: 'Kreis', fr: 'cercle', es: 'círculo' }
	},
	{
		id: 'square',
		emoji: '🟧',
		name: { en: 'square', ptBR: 'quadrado', de: 'Quadrat', fr: 'carré', es: 'cuadrado' }
	},
	{
		id: 'triangle',
		emoji: '🔺',
		name: { en: 'triangle', ptBR: 'triângulo', de: 'Dreieck', fr: 'triangle', es: 'triángulo' }
	},
	{
		id: 'star',
		emoji: '⭐',
		name: { en: 'star', ptBR: 'estrela', de: 'Stern', fr: 'étoile', es: 'estrella' }
	},
	{
		id: 'heart',
		emoji: '❤️',
		name: { en: 'heart', ptBR: 'coração', de: 'Herz', fr: 'cœur', es: 'corazón' }
	},
	{
		id: 'diamond',
		emoji: '🔷',
		name: { en: 'diamond', ptBR: 'losango', de: 'Raute', fr: 'losange', es: 'rombo' }
	}
]

export class ShapeRecognitionGenerator implements ProblemGenerator {
	readonly problemType = 'shape-recognition' as const

	/**
	 * Get available shapes for difficulty level
	 * Lower difficulties use fewer, more distinct shapes
	 */
	private getShapesForDifficulty(difficulty: DifficultyLevel): Shape[] {
		switch (difficulty) {
			case 1:
				return SHAPES.slice(0, 3) // circle, square, triangle
			case 2:
				return SHAPES.slice(0, 4) // + star
			case 3:
				return SHAPES.slice(0, 5) // + heart
			case 4:
				return SHAPES // all shapes
		}
	}

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const availableShapes = this.getShapesForDifficulty(difficulty)

		for (const shape of shuffle(availableShapes)) {
			const signature = this.makeSignature(difficulty, shape.id)

			if (!excluding.has(signature)) {
				const problem = this.createProblem(shape, difficulty, availableShapes)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		return this.getShapesForDifficulty(difficulty).map((shape) =>
			this.makeSignature(difficulty, shape.id)
		)
	}

	private makeSignature(difficulty: DifficultyLevel, shapeId: string): string {
		return `shape:d${difficulty}:${shapeId}`
	}

	private createProblem(
		targetShape: Shape,
		difficulty: DifficultyLevel,
		availableShapes: Shape[]
	): Problem {
		// Get distractor shapes (wrong answers)
		const distractors = shuffle(availableShapes.filter((s) => s.id !== targetShape.id)).slice(0, 2)

		// Create all options (target + 2 distractors = 3 choices for young children)
		const allOptions = shuffle([targetShape, ...distractors])

		// Create answer choices
		const choices: AnswerValue[] = allOptions.map((shape) => ({
			type: 'object' as const,
			value: shape.emoji
		}))

		// Visual elements for the choices
		const elements = allOptions.map((shape) => ({
			object: shape.emoji,
			count: 1
		}))

		return {
			id: crypto.randomUUID(),
			type: 'shape-recognition',
			difficulty,
			signature: this.makeSignature(difficulty, targetShape.id),
			visual: {
				type: 'logic-group',
				elements
			},
			prompt: {
				ptBR: `Encontre o ${targetShape.name.ptBR}!`,
				en: `Find the ${targetShape.name.en}!`,
				de: `Finde ${targetShape.name.de === 'Kreis' || targetShape.name.de === 'Stern' ? 'den' : targetShape.name.de === 'Herz' || targetShape.name.de === 'Quadrat' || targetShape.name.de === 'Dreieck' ? 'das' : 'die'} ${targetShape.name.de}!`,
				fr: `Trouve le ${targetShape.name.fr}!`,
				es: `¡Encuentra ${targetShape.name.es === 'estrella' ? 'la' : 'el'} ${targetShape.name.es}!`
			},
			correctAnswer: { type: 'object', value: targetShape.emoji },
			answerChoices: choices,
			hint: {
				ptBR: `Olhe bem para cada forma!`,
				en: `Look carefully at each shape!`,
				de: `Schau dir jede Form genau an!`,
				fr: `Regarde bien chaque forme!`,
				es: `¡Mira bien cada forma!`
			}
		}
	}
}
