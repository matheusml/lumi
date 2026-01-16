/**
 * Color Recognition Problem Generator
 *
 * Generates "Find something [color]!" problems for young children (ages 3-4).
 * Shows colored objects and asks to find a specific color.
 *
 * Signature format: color:d{difficulty}:{colorId}
 */

import type { Problem, DifficultyLevel, AnswerValue, LocalizedString } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from './generator'
import { shuffle } from './visual-objects'

interface Color {
	id: string
	emoji: string
	name: LocalizedString
}

/** Basic colors with recognizable emoji objects */
const COLORS: Color[] = [
	{
		id: 'red',
		emoji: '🍎',
		name: { en: 'red', ptBR: 'vermelho', de: 'rot', fr: 'rouge', es: 'rojo' }
	},
	{
		id: 'yellow',
		emoji: '🍌',
		name: { en: 'yellow', ptBR: 'amarelo', de: 'gelb', fr: 'jaune', es: 'amarillo' }
	},
	{
		id: 'green',
		emoji: '🥒',
		name: { en: 'green', ptBR: 'verde', de: 'grün', fr: 'vert', es: 'verde' }
	},
	{
		id: 'blue',
		emoji: '🫐',
		name: { en: 'blue', ptBR: 'azul', de: 'blau', fr: 'bleu', es: 'azul' }
	},
	{
		id: 'orange',
		emoji: '🍊',
		name: { en: 'orange', ptBR: 'laranja', de: 'orange', fr: 'orange', es: 'naranja' }
	},
	{
		id: 'purple',
		emoji: '🍇',
		name: { en: 'purple', ptBR: 'roxo', de: 'lila', fr: 'violet', es: 'morado' }
	}
]

export class ColorRecognitionGenerator implements ProblemGenerator {
	readonly problemType = 'color-recognition' as const

	/**
	 * Get available colors for difficulty level
	 * Lower difficulties use fewer, more distinct colors
	 */
	private getColorsForDifficulty(difficulty: DifficultyLevel): Color[] {
		switch (difficulty) {
			case 1:
				return COLORS.slice(0, 3) // red, yellow, green
			case 2:
				return COLORS.slice(0, 4) // + blue
			case 3:
				return COLORS.slice(0, 5) // + orange
			case 4:
				return COLORS // all colors
		}
	}

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const availableColors = this.getColorsForDifficulty(difficulty)

		for (const color of shuffle(availableColors)) {
			const signature = this.makeSignature(difficulty, color.id)

			if (!excluding.has(signature)) {
				const problem = this.createProblem(color, difficulty, availableColors)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		return this.getColorsForDifficulty(difficulty).map((color) =>
			this.makeSignature(difficulty, color.id)
		)
	}

	private makeSignature(difficulty: DifficultyLevel, colorId: string): string {
		return `color:d${difficulty}:${colorId}`
	}

	private createProblem(
		targetColor: Color,
		difficulty: DifficultyLevel,
		availableColors: Color[]
	): Problem {
		// Get distractor colors (wrong answers)
		const distractors = shuffle(availableColors.filter((c) => c.id !== targetColor.id)).slice(0, 2)

		// Create all options (target + 2 distractors = 3 choices for young children)
		const allOptions = shuffle([targetColor, ...distractors])

		// Create answer choices
		const choices: AnswerValue[] = allOptions.map((color) => ({
			type: 'object' as const,
			value: color.emoji
		}))

		// Visual elements for the choices
		const elements = allOptions.map((color) => ({
			object: color.emoji,
			count: 1
		}))

		return {
			id: crypto.randomUUID(),
			type: 'color-recognition',
			difficulty,
			signature: this.makeSignature(difficulty, targetColor.id),
			visual: {
				type: 'logic-group',
				elements
			},
			prompt: {
				ptBR: `Encontre algo ${targetColor.name.ptBR}!`,
				en: `Find something ${targetColor.name.en}!`,
				de: `Finde etwas ${targetColor.name.de === 'rot' || targetColor.name.de === 'gelb' || targetColor.name.de === 'grün' || targetColor.name.de === 'blau' || targetColor.name.de === 'orange' || targetColor.name.de === 'lila' ? targetColor.name.de + 'es' : targetColor.name.de}!`,
				fr: `Trouve quelque chose de ${targetColor.name.fr}!`,
				es: `¡Encuentra algo ${targetColor.name.es}!`
			},
			correctAnswer: { type: 'object', value: targetColor.emoji },
			answerChoices: choices,
			hint: {
				ptBR: `Olhe bem as cores!`,
				en: `Look at the colors!`,
				de: `Schau dir die Farben an!`,
				fr: `Regarde bien les couleurs!`,
				es: `¡Mira bien los colores!`
			}
		}
	}
}
