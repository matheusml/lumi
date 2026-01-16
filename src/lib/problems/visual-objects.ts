/**
 * Visual Objects
 *
 * Available objects for problems with their localized names.
 */

export interface VisualObjectInfo {
	id: string
	emoji: string
	namePtBR: string
	nameEn: string
	nameDe: string
	nameFr: string
	nameEs: string
	singularPtBR: string
	singularEs: string
	quantifierPtBR: string // "Quantos" (masc) or "Quantas" (fem)
	quantifierEs: string // "Cuántos" (masc) or "Cuántas" (fem)
}

export const visualObjects: VisualObjectInfo[] = [
	{
		id: 'apple',
		emoji: '🍎',
		namePtBR: 'maçãs',
		nameEn: 'apples',
		nameDe: 'Äpfel',
		nameFr: 'pommes',
		nameEs: 'manzanas',
		singularPtBR: 'maçã',
		singularEs: 'manzana',
		quantifierPtBR: 'Quantas',
		quantifierEs: 'Cuántas'
	},
	{
		id: 'star',
		emoji: '⭐',
		namePtBR: 'estrelas',
		nameEn: 'stars',
		nameDe: 'Sterne',
		nameFr: 'étoiles',
		nameEs: 'estrellas',
		singularPtBR: 'estrela',
		singularEs: 'estrella',
		quantifierPtBR: 'Quantas',
		quantifierEs: 'Cuántas'
	},
	{
		id: 'bird',
		emoji: '🐦',
		namePtBR: 'pássaros',
		nameEn: 'birds',
		nameDe: 'Vögel',
		nameFr: 'oiseaux',
		nameEs: 'pájaros',
		singularPtBR: 'pássaro',
		singularEs: 'pájaro',
		quantifierPtBR: 'Quantos',
		quantifierEs: 'Cuántos'
	},
	{
		id: 'banana',
		emoji: '🍌',
		namePtBR: 'bananas',
		nameEn: 'bananas',
		nameDe: 'Bananen',
		nameFr: 'bananes',
		nameEs: 'plátanos',
		singularPtBR: 'banana',
		singularEs: 'plátano',
		quantifierPtBR: 'Quantas',
		quantifierEs: 'Cuántos'
	},
	{
		id: 'flower',
		emoji: '🌸',
		namePtBR: 'flores',
		nameEn: 'flowers',
		nameDe: 'Blumen',
		nameFr: 'fleurs',
		nameEs: 'flores',
		singularPtBR: 'flor',
		singularEs: 'flor',
		quantifierPtBR: 'Quantas',
		quantifierEs: 'Cuántas'
	},
	{
		id: 'heart',
		emoji: '❤️',
		namePtBR: 'corações',
		nameEn: 'hearts',
		nameDe: 'Herzen',
		nameFr: 'coeurs',
		nameEs: 'corazones',
		singularPtBR: 'coração',
		singularEs: 'corazón',
		quantifierPtBR: 'Quantos',
		quantifierEs: 'Cuántos'
	},
	{
		id: 'butterfly',
		emoji: '🦋',
		namePtBR: 'borboletas',
		nameEn: 'butterflies',
		nameDe: 'Schmetterlinge',
		nameFr: 'papillons',
		nameEs: 'mariposas',
		singularPtBR: 'borboleta',
		singularEs: 'mariposa',
		quantifierPtBR: 'Quantas',
		quantifierEs: 'Cuántas'
	},
	{
		id: 'fish',
		emoji: '🐟',
		namePtBR: 'peixes',
		nameEn: 'fish',
		nameDe: 'Fische',
		nameFr: 'poissons',
		nameEs: 'peces',
		singularPtBR: 'peixe',
		singularEs: 'pez',
		quantifierPtBR: 'Quantos',
		quantifierEs: 'Cuántos'
	}
]

/** Pattern colors for pattern problems */
export const patternColors = [
	{ id: 'circle_red', color: '#EF4444' },
	{ id: 'circle_blue', color: '#3B82F6' },
	{ id: 'circle_green', color: '#22C55E' },
	{ id: 'circle_yellow', color: '#EAB308' }
] as const

export type PatternColorId = (typeof patternColors)[number]['id']

/** Get a random visual object */
export function getRandomObject(): VisualObjectInfo {
	return visualObjects[Math.floor(Math.random() * visualObjects.length)]
}

/** Get a random object from a subset */
export function getRandomObjectFrom(ids: string[]): VisualObjectInfo {
	const filtered = visualObjects.filter((obj) => ids.includes(obj.id))
	return filtered[Math.floor(Math.random() * filtered.length)] || visualObjects[0]
}

/** Shuffle an array (Fisher-Yates) */
export function shuffle<T>(array: T[]): T[] {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}
