/**
 * Logic Problem Generator - Odd One Out
 *
 * Generates "which one doesn't belong?" problems.
 * Shows 4 objects where 3 belong to a category and 1 doesn't.
 *
 * Signature format: logic:odd-one-out:d{difficulty}:{categoryId}:{oddObjectId}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from './generator'
import { shuffle } from './visual-objects'

/** Category definition for logic problems */
interface LogicCategory {
	id: string
	namePtBR: string
	nameEn: string
	members: LogicObject[]
}

/** Object for logic problems */
interface LogicObject {
	id: string
	emoji: string
	namePtBR: string
	nameEn: string
}

/**
 * Categories organized by difficulty
 * Lower difficulties use more visually distinct categories
 */
const categories: Record<DifficultyLevel, LogicCategory[]> = {
	1: [
		{
			id: 'fruits',
			namePtBR: 'frutas',
			nameEn: 'fruits',
			members: [
				{ id: 'apple', emoji: '🍎', namePtBR: 'maçã', nameEn: 'apple' },
				{ id: 'banana', emoji: '🍌', namePtBR: 'banana', nameEn: 'banana' },
				{ id: 'orange', emoji: '🍊', namePtBR: 'laranja', nameEn: 'orange' },
				{ id: 'grape', emoji: '🍇', namePtBR: 'uva', nameEn: 'grape' },
				{ id: 'strawberry', emoji: '🍓', namePtBR: 'morango', nameEn: 'strawberry' }
			]
		},
		{
			id: 'animals',
			namePtBR: 'animais',
			nameEn: 'animals',
			members: [
				{ id: 'dog', emoji: '🐕', namePtBR: 'cachorro', nameEn: 'dog' },
				{ id: 'cat', emoji: '🐱', namePtBR: 'gato', nameEn: 'cat' },
				{ id: 'bird', emoji: '🐦', namePtBR: 'pássaro', nameEn: 'bird' },
				{ id: 'fish', emoji: '🐟', namePtBR: 'peixe', nameEn: 'fish' },
				{ id: 'rabbit', emoji: '🐰', namePtBR: 'coelho', nameEn: 'rabbit' }
			]
		},
		{
			id: 'vehicles',
			namePtBR: 'veículos',
			nameEn: 'vehicles',
			members: [
				{ id: 'car', emoji: '🚗', namePtBR: 'carro', nameEn: 'car' },
				{ id: 'bus', emoji: '🚌', namePtBR: 'ônibus', nameEn: 'bus' },
				{ id: 'bike', emoji: '🚲', namePtBR: 'bicicleta', nameEn: 'bicycle' },
				{ id: 'plane', emoji: '✈️', namePtBR: 'avião', nameEn: 'airplane' },
				{ id: 'boat', emoji: '⛵', namePtBR: 'barco', nameEn: 'boat' }
			]
		}
	],
	2: [
		{
			id: 'food',
			namePtBR: 'comidas',
			nameEn: 'food',
			members: [
				{ id: 'pizza', emoji: '🍕', namePtBR: 'pizza', nameEn: 'pizza' },
				{ id: 'hamburger', emoji: '🍔', namePtBR: 'hambúrguer', nameEn: 'hamburger' },
				{ id: 'hotdog', emoji: '🌭', namePtBR: 'cachorro-quente', nameEn: 'hot dog' },
				{ id: 'fries', emoji: '🍟', namePtBR: 'batata frita', nameEn: 'french fries' },
				{ id: 'sandwich', emoji: '🥪', namePtBR: 'sanduíche', nameEn: 'sandwich' }
			]
		},
		{
			id: 'nature',
			namePtBR: 'natureza',
			nameEn: 'nature',
			members: [
				{ id: 'tree', emoji: '🌳', namePtBR: 'árvore', nameEn: 'tree' },
				{ id: 'flower', emoji: '🌸', namePtBR: 'flor', nameEn: 'flower' },
				{ id: 'sun', emoji: '☀️', namePtBR: 'sol', nameEn: 'sun' },
				{ id: 'cloud', emoji: '☁️', namePtBR: 'nuvem', nameEn: 'cloud' },
				{ id: 'rainbow', emoji: '🌈', namePtBR: 'arco-íris', nameEn: 'rainbow' }
			]
		},
		{
			id: 'sports',
			namePtBR: 'esportes',
			nameEn: 'sports',
			members: [
				{ id: 'soccer', emoji: '⚽', namePtBR: 'futebol', nameEn: 'soccer' },
				{ id: 'basketball', emoji: '🏀', namePtBR: 'basquete', nameEn: 'basketball' },
				{ id: 'tennis', emoji: '🎾', namePtBR: 'tênis', nameEn: 'tennis' },
				{ id: 'volleyball', emoji: '🏐', namePtBR: 'vôlei', nameEn: 'volleyball' },
				{ id: 'baseball', emoji: '⚾', namePtBR: 'beisebol', nameEn: 'baseball' }
			]
		}
	],
	3: [
		{
			id: 'insects',
			namePtBR: 'insetos',
			nameEn: 'insects',
			members: [
				{ id: 'butterfly', emoji: '🦋', namePtBR: 'borboleta', nameEn: 'butterfly' },
				{ id: 'bee', emoji: '🐝', namePtBR: 'abelha', nameEn: 'bee' },
				{ id: 'ladybug', emoji: '🐞', namePtBR: 'joaninha', nameEn: 'ladybug' },
				{ id: 'ant', emoji: '🐜', namePtBR: 'formiga', nameEn: 'ant' },
				{ id: 'caterpillar', emoji: '🐛', namePtBR: 'lagarta', nameEn: 'caterpillar' }
			]
		},
		{
			id: 'sea-animals',
			namePtBR: 'animais do mar',
			nameEn: 'sea animals',
			members: [
				{ id: 'fish', emoji: '🐟', namePtBR: 'peixe', nameEn: 'fish' },
				{ id: 'whale', emoji: '🐋', namePtBR: 'baleia', nameEn: 'whale' },
				{ id: 'dolphin', emoji: '🐬', namePtBR: 'golfinho', nameEn: 'dolphin' },
				{ id: 'octopus', emoji: '🐙', namePtBR: 'polvo', nameEn: 'octopus' },
				{ id: 'crab', emoji: '🦀', namePtBR: 'caranguejo', nameEn: 'crab' }
			]
		},
		{
			id: 'clothes',
			namePtBR: 'roupas',
			nameEn: 'clothes',
			members: [
				{ id: 'shirt', emoji: '👕', namePtBR: 'camiseta', nameEn: 'shirt' },
				{ id: 'pants', emoji: '👖', namePtBR: 'calça', nameEn: 'pants' },
				{ id: 'dress', emoji: '👗', namePtBR: 'vestido', nameEn: 'dress' },
				{ id: 'shoe', emoji: '👟', namePtBR: 'tênis', nameEn: 'sneaker' },
				{ id: 'hat', emoji: '🧢', namePtBR: 'boné', nameEn: 'cap' }
			]
		}
	],
	4: [
		{
			id: 'farm-animals',
			namePtBR: 'animais da fazenda',
			nameEn: 'farm animals',
			members: [
				{ id: 'cow', emoji: '🐄', namePtBR: 'vaca', nameEn: 'cow' },
				{ id: 'pig', emoji: '🐷', namePtBR: 'porco', nameEn: 'pig' },
				{ id: 'chicken', emoji: '🐔', namePtBR: 'galinha', nameEn: 'chicken' },
				{ id: 'horse', emoji: '🐴', namePtBR: 'cavalo', nameEn: 'horse' },
				{ id: 'sheep', emoji: '🐑', namePtBR: 'ovelha', nameEn: 'sheep' }
			]
		},
		{
			id: 'wild-animals',
			namePtBR: 'animais selvagens',
			nameEn: 'wild animals',
			members: [
				{ id: 'lion', emoji: '🦁', namePtBR: 'leão', nameEn: 'lion' },
				{ id: 'elephant', emoji: '🐘', namePtBR: 'elefante', nameEn: 'elephant' },
				{ id: 'giraffe', emoji: '🦒', namePtBR: 'girafa', nameEn: 'giraffe' },
				{ id: 'zebra', emoji: '🦓', namePtBR: 'zebra', nameEn: 'zebra' },
				{ id: 'monkey', emoji: '🐒', namePtBR: 'macaco', nameEn: 'monkey' }
			]
		},
		{
			id: 'musical',
			namePtBR: 'instrumentos musicais',
			nameEn: 'musical instruments',
			members: [
				{ id: 'guitar', emoji: '🎸', namePtBR: 'guitarra', nameEn: 'guitar' },
				{ id: 'piano', emoji: '🎹', namePtBR: 'piano', nameEn: 'piano' },
				{ id: 'drum', emoji: '🥁', namePtBR: 'tambor', nameEn: 'drum' },
				{ id: 'violin', emoji: '🎻', namePtBR: 'violino', nameEn: 'violin' },
				{ id: 'trumpet', emoji: '🎺', namePtBR: 'trompete', nameEn: 'trumpet' }
			]
		}
	]
}

/** Get all objects that don't belong to a category (from other difficulties too) */
function getOutsiders(targetCategory: LogicCategory, _difficulty: DifficultyLevel): LogicObject[] {
	const outsiders: LogicObject[] = []
	const targetMemberIds = new Set(targetCategory.members.map((m) => m.id))
	const seenIds = new Set<string>()

	// Collect from all difficulty levels
	for (const level of [1, 2, 3, 4] as DifficultyLevel[]) {
		for (const category of categories[level]) {
			if (category.id !== targetCategory.id) {
				for (const member of category.members) {
					// Avoid duplicates (same object in multiple categories)
					if (!targetMemberIds.has(member.id) && !seenIds.has(member.id)) {
						outsiders.push(member)
						seenIds.add(member.id)
					}
				}
			}
		}
	}

	return outsiders
}

export class OddOneOutGenerator implements ProblemGenerator {
	readonly problemType = 'odd-one-out' as const

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const availableCategories = categories[difficulty]

		for (const category of shuffle(availableCategories)) {
			const outsiders = shuffle(getOutsiders(category, difficulty))

			for (const oddObject of outsiders) {
				const signature = this.makeSignature(difficulty, category.id, oddObject.id)

				if (!excluding.has(signature)) {
					const problem = this.createProblem(category, oddObject, difficulty)
					return { problem, signature }
				}
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		const signatures: string[] = []

		for (const category of categories[difficulty]) {
			const outsiders = getOutsiders(category, difficulty)
			for (const oddObject of outsiders) {
				signatures.push(this.makeSignature(difficulty, category.id, oddObject.id))
			}
		}

		return signatures
	}

	private makeSignature(
		difficulty: DifficultyLevel,
		categoryId: string,
		oddObjectId: string
	): string {
		return `logic:odd-one-out:d${difficulty}:${categoryId}:${oddObjectId}`
	}

	private createProblem(
		category: LogicCategory,
		oddObject: LogicObject,
		difficulty: DifficultyLevel
	): Problem {
		// Pick 3 random members from the category
		const categoryMembers = shuffle(category.members).slice(0, 3)

		// Create all 4 objects (3 from category + 1 odd)
		const allObjects = shuffle([...categoryMembers, oddObject])

		// Create visual elements
		const elements = allObjects.map((obj) => ({
			object: obj.emoji,
			count: 1
		}))

		// Create answer choices (all objects as options)
		const choices: AnswerValue[] = allObjects.map((obj) => ({
			type: 'object' as const,
			value: obj.emoji
		}))

		return {
			id: crypto.randomUUID(),
			type: 'odd-one-out',
			difficulty,
			signature: this.makeSignature(difficulty, category.id, oddObject.id),
			visual: {
				type: 'logic-group',
				elements,
				categoryHint: category.namePtBR
			},
			prompt: {
				ptBR: 'Qual não é do mesmo grupo?',
				en: "Which one doesn't belong?",
				de: 'Was gehört nicht dazu?',
				fr: 'Lequel ne fait pas partie du groupe?'
			},
			correctAnswer: { type: 'object', value: oddObject.emoji },
			answerChoices: choices,
			hint: {
				ptBR: `Três deles são ${category.namePtBR}. Qual é diferente?`,
				en: `Three of them are ${category.nameEn}. Which one is different?`,
				de: `Drei davon sind ${category.nameEn}. Welches ist anders?`,
				fr: `Trois d'entre eux sont des ${category.nameEn}. Lequel est différent?`
			}
		}
	}
}
