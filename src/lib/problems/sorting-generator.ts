/**
 * Sorting Problem Generator
 *
 * Generates "where does this belong?" problems.
 * Shows one object and asks which category it belongs to.
 * This is the inverse of odd-one-out - child identifies where something DOES belong.
 *
 * Signature format: logic:sorting:d{difficulty}:{categoryId}:{objectId}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from './generator'
import { shuffle } from './visual-objects'

/** Category definition for sorting problems */
interface SortingCategory {
	id: string
	namePtBR: string
	nameEn: string
	nameDe: string
	nameFr: string
	emoji: string // Representative emoji for the category
	members: SortingObject[]
}

/** Object for sorting problems */
interface SortingObject {
	id: string
	emoji: string
}

/**
 * Categories organized by difficulty
 * Each difficulty level has distinct, non-overlapping categories
 */
const categories: Record<DifficultyLevel, SortingCategory[]> = {
	1: [
		{
			id: 'fruits',
			namePtBR: 'Frutas',
			nameEn: 'Fruits',
			nameDe: 'Obst',
			nameFr: 'Fruits',
			emoji: '🍎',
			members: [
				{ id: 'apple', emoji: '🍎' },
				{ id: 'banana', emoji: '🍌' },
				{ id: 'orange', emoji: '🍊' },
				{ id: 'grape', emoji: '🍇' },
				{ id: 'strawberry', emoji: '🍓' }
			]
		},
		{
			id: 'animals',
			namePtBR: 'Animais',
			nameEn: 'Animals',
			nameDe: 'Tiere',
			nameFr: 'Animaux',
			emoji: '🐕',
			members: [
				{ id: 'dog', emoji: '🐕' },
				{ id: 'cat', emoji: '🐱' },
				{ id: 'rabbit', emoji: '🐰' },
				{ id: 'bear', emoji: '🐻' },
				{ id: 'mouse', emoji: '🐭' }
			]
		},
		{
			id: 'vehicles',
			namePtBR: 'Veículos',
			nameEn: 'Vehicles',
			nameDe: 'Fahrzeuge',
			nameFr: 'Véhicules',
			emoji: '🚗',
			members: [
				{ id: 'car', emoji: '🚗' },
				{ id: 'bus', emoji: '🚌' },
				{ id: 'bike', emoji: '🚲' },
				{ id: 'plane', emoji: '✈️' },
				{ id: 'boat', emoji: '⛵' }
			]
		}
	],
	2: [
		{
			id: 'food',
			namePtBR: 'Comida',
			nameEn: 'Food',
			nameDe: 'Essen',
			nameFr: 'Nourriture',
			emoji: '🍕',
			members: [
				{ id: 'pizza', emoji: '🍕' },
				{ id: 'hamburger', emoji: '🍔' },
				{ id: 'hotdog', emoji: '🌭' },
				{ id: 'sandwich', emoji: '🥪' },
				{ id: 'taco', emoji: '🌮' }
			]
		},
		{
			id: 'toys',
			namePtBR: 'Brinquedos',
			nameEn: 'Toys',
			nameDe: 'Spielzeug',
			nameFr: 'Jouets',
			emoji: '🧸',
			members: [
				{ id: 'teddy', emoji: '🧸' },
				{ id: 'ball', emoji: '🏐' },
				{ id: 'kite', emoji: '🪁' },
				{ id: 'blocks', emoji: '🧱' },
				{ id: 'doll', emoji: '🪆' }
			]
		},
		{
			id: 'nature',
			namePtBR: 'Natureza',
			nameEn: 'Nature',
			nameDe: 'Natur',
			nameFr: 'Nature',
			emoji: '🌳',
			members: [
				{ id: 'tree', emoji: '🌳' },
				{ id: 'flower', emoji: '🌸' },
				{ id: 'leaf', emoji: '🍃' },
				{ id: 'mushroom', emoji: '🍄' },
				{ id: 'sun', emoji: '☀️' }
			]
		}
	],
	3: [
		{
			id: 'sea-animals',
			namePtBR: 'Animais do Mar',
			nameEn: 'Sea Animals',
			nameDe: 'Meerestiere',
			nameFr: 'Animaux Marins',
			emoji: '🐟',
			members: [
				{ id: 'fish', emoji: '🐟' },
				{ id: 'whale', emoji: '🐋' },
				{ id: 'dolphin', emoji: '🐬' },
				{ id: 'octopus', emoji: '🐙' },
				{ id: 'crab', emoji: '🦀' }
			]
		},
		{
			id: 'insects',
			namePtBR: 'Insetos',
			nameEn: 'Insects',
			nameDe: 'Insekten',
			nameFr: 'Insectes',
			emoji: '🦋',
			members: [
				{ id: 'butterfly', emoji: '🦋' },
				{ id: 'bee', emoji: '🐝' },
				{ id: 'ladybug', emoji: '🐞' },
				{ id: 'ant', emoji: '🐜' },
				{ id: 'caterpillar', emoji: '🐛' }
			]
		},
		{
			id: 'clothes',
			namePtBR: 'Roupas',
			nameEn: 'Clothes',
			nameDe: 'Kleidung',
			nameFr: 'Vêtements',
			emoji: '👕',
			members: [
				{ id: 'shirt', emoji: '👕' },
				{ id: 'pants', emoji: '👖' },
				{ id: 'dress', emoji: '👗' },
				{ id: 'shoe', emoji: '👟' },
				{ id: 'hat', emoji: '🧢' }
			]
		}
	],
	4: [
		{
			id: 'musical',
			namePtBR: 'Instrumentos',
			nameEn: 'Instruments',
			nameDe: 'Instrumente',
			nameFr: 'Instruments',
			emoji: '🎸',
			members: [
				{ id: 'guitar', emoji: '🎸' },
				{ id: 'piano', emoji: '🎹' },
				{ id: 'drum', emoji: '🥁' },
				{ id: 'violin', emoji: '🎻' },
				{ id: 'trumpet', emoji: '🎺' }
			]
		},
		{
			id: 'tools',
			namePtBR: 'Ferramentas',
			nameEn: 'Tools',
			nameDe: 'Werkzeuge',
			nameFr: 'Outils',
			emoji: '🔨',
			members: [
				{ id: 'hammer', emoji: '🔨' },
				{ id: 'wrench', emoji: '🔧' },
				{ id: 'screwdriver', emoji: '🪛' },
				{ id: 'axe', emoji: '🪓' },
				{ id: 'saw', emoji: '🪚' }
			]
		},
		{
			id: 'school',
			namePtBR: 'Escola',
			nameEn: 'School',
			nameDe: 'Schule',
			nameFr: 'École',
			emoji: '📚',
			members: [
				{ id: 'book', emoji: '📚' },
				{ id: 'pencil', emoji: '✏️' },
				{ id: 'ruler', emoji: '📏' },
				{ id: 'backpack', emoji: '🎒' },
				{ id: 'notebook', emoji: '📓' }
			]
		}
	]
}

export class SortingProblemGenerator implements ProblemGenerator {
	readonly problemType = 'sorting' as const

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const availableCategories = categories[difficulty]

		for (const category of shuffle(availableCategories)) {
			for (const obj of shuffle(category.members)) {
				const signature = this.makeSignature(difficulty, category.id, obj.id)

				if (!excluding.has(signature)) {
					const problem = this.createProblem(category, obj, difficulty)
					return { problem, signature }
				}
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		const signatures: string[] = []

		for (const category of categories[difficulty]) {
			for (const obj of category.members) {
				signatures.push(this.makeSignature(difficulty, category.id, obj.id))
			}
		}

		return signatures
	}

	private makeSignature(difficulty: DifficultyLevel, categoryId: string, objectId: string): string {
		return `logic:sorting:d${difficulty}:${categoryId}:${objectId}`
	}

	private createProblem(
		correctCategory: SortingCategory,
		targetObject: SortingObject,
		difficulty: DifficultyLevel
	): Problem {
		// Get 3 other categories as wrong choices
		const otherCategories = shuffle(
			categories[difficulty].filter((c) => c.id !== correctCategory.id)
		).slice(0, 3)

		// Create all 4 category choices
		const allCategories = shuffle([correctCategory, ...otherCategories])

		// Create answer choices (category emojis)
		const choices: AnswerValue[] = allCategories.map((cat) => ({
			type: 'object' as const,
			value: cat.emoji
		}))

		// Visual elements for category labels
		const elements = allCategories.map((cat) => ({
			object: cat.emoji,
			count: 1
		}))

		return {
			id: crypto.randomUUID(),
			type: 'sorting',
			difficulty,
			signature: this.makeSignature(difficulty, correctCategory.id, targetObject.id),
			visual: {
				type: 'logic-matching',
				elements,
				sourceObject: targetObject.emoji
			},
			prompt: {
				ptBR: 'Onde isso pertence?',
				en: 'Where does this belong?',
				de: 'Wohin gehört das?',
				fr: 'Où cela appartient-il?'
			},
			correctAnswer: { type: 'object', value: correctCategory.emoji },
			answerChoices: choices,
			hint: {
				ptBR: `Pense: isso é um tipo de ${correctCategory.namePtBR.toLowerCase()}?`,
				en: `Think: is this a type of ${correctCategory.nameEn.toLowerCase()}?`,
				de: `Denk nach: Ist das eine Art von ${correctCategory.nameDe}?`,
				fr: `Réfléchis: est-ce un type de ${correctCategory.nameFr.toLowerCase()}?`
			}
		}
	}
}
