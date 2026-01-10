/**
 * Visual Objects
 *
 * Available objects for problems with their localized names.
 */

export interface VisualObjectInfo {
	id: string;
	emoji: string;
	namePtBR: string;
	nameEn: string;
	singularPtBR: string;
	quantifierPtBR: string;  // "Quantos" (masc) or "Quantas" (fem)
}

export const visualObjects: VisualObjectInfo[] = [
	{
		id: 'apple',
		emoji: '🍎',
		namePtBR: 'maçãs',
		nameEn: 'apples',
		singularPtBR: 'maçã',
		quantifierPtBR: 'Quantas',
	},
	{
		id: 'star',
		emoji: '⭐',
		namePtBR: 'estrelas',
		nameEn: 'stars',
		singularPtBR: 'estrela',
		quantifierPtBR: 'Quantas',
	},
	{
		id: 'bird',
		emoji: '🐦',
		namePtBR: 'pássaros',
		nameEn: 'birds',
		singularPtBR: 'pássaro',
		quantifierPtBR: 'Quantos',
	},
	{
		id: 'banana',
		emoji: '🍌',
		namePtBR: 'bananas',
		nameEn: 'bananas',
		singularPtBR: 'banana',
		quantifierPtBR: 'Quantas',
	},
	{
		id: 'flower',
		emoji: '🌸',
		namePtBR: 'flores',
		nameEn: 'flowers',
		singularPtBR: 'flor',
		quantifierPtBR: 'Quantas',
	},
	{
		id: 'heart',
		emoji: '❤️',
		namePtBR: 'corações',
		nameEn: 'hearts',
		singularPtBR: 'coração',
		quantifierPtBR: 'Quantos',
	},
	{
		id: 'butterfly',
		emoji: '🦋',
		namePtBR: 'borboletas',
		nameEn: 'butterflies',
		singularPtBR: 'borboleta',
		quantifierPtBR: 'Quantas',
	},
	{
		id: 'fish',
		emoji: '🐟',
		namePtBR: 'peixes',
		nameEn: 'fish',
		singularPtBR: 'peixe',
		quantifierPtBR: 'Quantos',
	},
];

/** Pattern colors for pattern problems */
export const patternColors = [
	{ id: 'circle_red', color: '#EF4444' },
	{ id: 'circle_blue', color: '#3B82F6' },
	{ id: 'circle_green', color: '#22C55E' },
	{ id: 'circle_yellow', color: '#EAB308' },
] as const;

export type PatternColorId = (typeof patternColors)[number]['id'];

/** Get a random visual object */
export function getRandomObject(): VisualObjectInfo {
	return visualObjects[Math.floor(Math.random() * visualObjects.length)];
}

/** Get a random object from a subset */
export function getRandomObjectFrom(ids: string[]): VisualObjectInfo {
	const filtered = visualObjects.filter((obj) => ids.includes(obj.id));
	return filtered[Math.floor(Math.random() * filtered.length)] || visualObjects[0];
}

/** Shuffle an array (Fisher-Yates) */
export function shuffle<T>(array: T[]): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}
