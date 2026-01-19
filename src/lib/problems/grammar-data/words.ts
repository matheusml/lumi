/**
 * Word Bank for Grammar Problems
 *
 * Words with syllable breakdowns, emojis, and translations.
 */

import type { SupportedLanguage } from '$lib/i18n'

/** Information about a word */
export interface WordInfo {
	word: string
	emoji: string
	syllables: string[]
	namePtBR: string
	nameEn: string
	nameDe?: string // Falls back to English
	nameFr?: string // Falls back to English
	nameEs?: string // Falls back to English
}

/** Get the localized word for a given language */
export function getLocalizedWord(wordInfo: WordInfo, lang: SupportedLanguage): string {
	if (lang === 'pt-BR') return wordInfo.word
	if (lang === 'de') return wordInfo.nameDe || wordInfo.nameEn
	if (lang === 'fr') return wordInfo.nameFr || wordInfo.nameEn
	if (lang === 'es') return wordInfo.nameEs || wordInfo.nameEn
	return wordInfo.nameEn
}

/** Word bank organized by starting letter */
export const wordBank: WordInfo[] = [
	// A
	{
		word: 'abelha',
		emoji: '🐝',
		syllables: ['a', 'be', 'lha'],
		namePtBR: 'abelha',
		nameEn: 'bee',
		nameDe: 'Biene',
		nameFr: 'abeille',
		nameEs: 'abeja'
	},
	{
		word: 'aviao',
		emoji: '✈️',
		syllables: ['a', 'vi', 'ao'],
		namePtBR: 'avião',
		nameEn: 'airplane',
		nameDe: 'Flugzeug',
		nameFr: 'avion',
		nameEs: 'avión'
	},
	{
		word: 'agua',
		emoji: '💧',
		syllables: ['a', 'gua'],
		namePtBR: 'água',
		nameEn: 'water',
		nameDe: 'Wasser',
		nameFr: 'eau',
		nameEs: 'agua'
	},
	{
		word: 'aranha',
		emoji: '🕷️',
		syllables: ['a', 'ra', 'nha'],
		namePtBR: 'aranha',
		nameEn: 'spider',
		nameDe: 'Spinne',
		nameFr: 'araignée',
		nameEs: 'araña'
	},

	// B
	{
		word: 'bola',
		emoji: '⚽',
		syllables: ['bo', 'la'],
		namePtBR: 'bola',
		nameEn: 'ball',
		nameDe: 'Ball',
		nameFr: 'ballon',
		nameEs: 'pelota'
	},
	{
		word: 'banana',
		emoji: '🍌',
		syllables: ['ba', 'na', 'na'],
		namePtBR: 'banana',
		nameEn: 'banana',
		nameDe: 'Banane',
		nameFr: 'banane',
		nameEs: 'plátano'
	},
	{
		word: 'barco',
		emoji: '⛵',
		syllables: ['bar', 'co'],
		namePtBR: 'barco',
		nameEn: 'boat',
		nameDe: 'Boot',
		nameFr: 'bateau',
		nameEs: 'barco'
	},
	{
		word: 'boneca',
		emoji: '🪆',
		syllables: ['bo', 'ne', 'ca'],
		namePtBR: 'boneca',
		nameEn: 'doll',
		nameDe: 'Puppe',
		nameFr: 'poupée',
		nameEs: 'muñeca'
	},

	// C
	{
		word: 'casa',
		emoji: '🏠',
		syllables: ['ca', 'sa'],
		namePtBR: 'casa',
		nameEn: 'house',
		nameDe: 'Haus',
		nameFr: 'maison',
		nameEs: 'casa'
	},
	{
		word: 'cachorro',
		emoji: '🐕',
		syllables: ['ca', 'chor', 'ro'],
		namePtBR: 'cachorro',
		nameEn: 'dog',
		nameDe: 'Hund',
		nameFr: 'chien',
		nameEs: 'perro'
	},
	{
		word: 'carro',
		emoji: '🚗',
		syllables: ['car', 'ro'],
		namePtBR: 'carro',
		nameEn: 'car',
		nameDe: 'Auto',
		nameFr: 'voiture',
		nameEs: 'coche'
	},
	{
		word: 'coelho',
		emoji: '🐰',
		syllables: ['co', 'e', 'lho'],
		namePtBR: 'coelho',
		nameEn: 'rabbit',
		nameDe: 'Hase',
		nameFr: 'lapin',
		nameEs: 'conejo'
	},

	// D
	{
		word: 'dado',
		emoji: '🎲',
		syllables: ['da', 'do'],
		namePtBR: 'dado',
		nameEn: 'dice',
		nameDe: 'Würfel',
		nameFr: 'dé',
		nameEs: 'dado'
	},
	{
		word: 'dente',
		emoji: '🦷',
		syllables: ['den', 'te'],
		namePtBR: 'dente',
		nameEn: 'tooth',
		nameDe: 'Zahn',
		nameFr: 'dent',
		nameEs: 'diente'
	},
	{
		word: 'dinossauro',
		emoji: '🦕',
		syllables: ['di', 'nos', 'sau', 'ro'],
		namePtBR: 'dinossauro',
		nameEn: 'dinosaur',
		nameDe: 'Dinosaurier',
		nameFr: 'dinosaure',
		nameEs: 'dinosaurio'
	},

	// E
	{
		word: 'elefante',
		emoji: '🐘',
		syllables: ['e', 'le', 'fan', 'te'],
		namePtBR: 'elefante',
		nameEn: 'elephant',
		nameDe: 'Elefant',
		nameFr: 'éléphant',
		nameEs: 'elefante'
	},
	{
		word: 'estrela',
		emoji: '⭐',
		syllables: ['es', 'tre', 'la'],
		namePtBR: 'estrela',
		nameEn: 'star',
		nameDe: 'Stern',
		nameFr: 'étoile',
		nameEs: 'estrella'
	},
	{
		word: 'escola',
		emoji: '🏫',
		syllables: ['es', 'co', 'la'],
		namePtBR: 'escola',
		nameEn: 'school',
		nameDe: 'Schule',
		nameFr: 'école',
		nameEs: 'escuela'
	},

	// F
	{
		word: 'flor',
		emoji: '🌸',
		syllables: ['flor'],
		namePtBR: 'flor',
		nameEn: 'flower',
		nameDe: 'Blume',
		nameFr: 'fleur',
		nameEs: 'flor'
	},
	{
		word: 'fogo',
		emoji: '🔥',
		syllables: ['fo', 'go'],
		namePtBR: 'fogo',
		nameEn: 'fire',
		nameDe: 'Feuer',
		nameFr: 'feu',
		nameEs: 'fuego'
	},
	{
		word: 'formiga',
		emoji: '🐜',
		syllables: ['for', 'mi', 'ga'],
		namePtBR: 'formiga',
		nameEn: 'ant',
		nameDe: 'Ameise',
		nameFr: 'fourmi',
		nameEs: 'hormiga'
	},

	// G
	{
		word: 'gato',
		emoji: '🐱',
		syllables: ['ga', 'to'],
		namePtBR: 'gato',
		nameEn: 'cat',
		nameDe: 'Katze',
		nameFr: 'chat',
		nameEs: 'gato'
	},
	{
		word: 'girafa',
		emoji: '🦒',
		syllables: ['gi', 'ra', 'fa'],
		namePtBR: 'girafa',
		nameEn: 'giraffe',
		nameDe: 'Giraffe',
		nameFr: 'girafe',
		nameEs: 'jirafa'
	},
	{
		word: 'galinha',
		emoji: '🐔',
		syllables: ['ga', 'li', 'nha'],
		namePtBR: 'galinha',
		nameEn: 'chicken',
		nameDe: 'Huhn',
		nameFr: 'poule',
		nameEs: 'gallina'
	},

	// H
	{
		word: 'hipopotamo',
		emoji: '🦛',
		syllables: ['hi', 'po', 'po', 'ta', 'mo'],
		namePtBR: 'hipopótamo',
		nameEn: 'hippo',
		nameDe: 'Nilpferd',
		nameFr: 'hippopotame',
		nameEs: 'hipopótamo'
	},

	// I
	{
		word: 'igreja',
		emoji: '⛪',
		syllables: ['i', 'gre', 'ja'],
		namePtBR: 'igreja',
		nameEn: 'church',
		nameDe: 'Kirche',
		nameFr: 'église',
		nameEs: 'iglesia'
	},
	{
		word: 'ilha',
		emoji: '🏝️',
		syllables: ['i', 'lha'],
		namePtBR: 'ilha',
		nameEn: 'island',
		nameDe: 'Insel',
		nameFr: 'île',
		nameEs: 'isla'
	},

	// J
	{
		word: 'joaninha',
		emoji: '🐞',
		syllables: ['jo', 'a', 'ni', 'nha'],
		namePtBR: 'joaninha',
		nameEn: 'ladybug',
		nameDe: 'Marienkäfer',
		nameFr: 'coccinelle',
		nameEs: 'mariquita'
	},

	// L
	{
		word: 'lua',
		emoji: '🌙',
		syllables: ['lu', 'a'],
		namePtBR: 'lua',
		nameEn: 'moon',
		nameDe: 'Mond',
		nameFr: 'lune',
		nameEs: 'luna'
	},
	{
		word: 'leao',
		emoji: '🦁',
		syllables: ['le', 'ao'],
		namePtBR: 'leão',
		nameEn: 'lion',
		nameDe: 'Löwe',
		nameFr: 'lion',
		nameEs: 'león'
	},
	{
		word: 'livro',
		emoji: '📖',
		syllables: ['li', 'vro'],
		namePtBR: 'livro',
		nameEn: 'book',
		nameDe: 'Buch',
		nameFr: 'livre',
		nameEs: 'libro'
	},
	{
		word: 'laranja',
		emoji: '🍊',
		syllables: ['la', 'ran', 'ja'],
		namePtBR: 'laranja',
		nameEn: 'orange',
		nameDe: 'Orange',
		nameFr: 'orange',
		nameEs: 'naranja'
	},

	// M
	{
		word: 'maca',
		emoji: '🍎',
		syllables: ['ma', 'ca'],
		namePtBR: 'maçã',
		nameEn: 'apple',
		nameDe: 'Apfel',
		nameFr: 'pomme',
		nameEs: 'manzana'
	},
	{
		word: 'macaco',
		emoji: '🐒',
		syllables: ['ma', 'ca', 'co'],
		namePtBR: 'macaco',
		nameEn: 'monkey',
		nameDe: 'Affe',
		nameFr: 'singe',
		nameEs: 'mono'
	},
	{
		word: 'melancia',
		emoji: '🍉',
		syllables: ['me', 'lan', 'ci', 'a'],
		namePtBR: 'melancia',
		nameEn: 'watermelon',
		nameDe: 'Wassermelone',
		nameFr: 'pastèque',
		nameEs: 'sandía'
	},

	// N
	{
		word: 'nuvem',
		emoji: '☁️',
		syllables: ['nu', 'vem'],
		namePtBR: 'nuvem',
		nameEn: 'cloud',
		nameDe: 'Wolke',
		nameFr: 'nuage',
		nameEs: 'nube'
	},
	{
		word: 'navio',
		emoji: '🚢',
		syllables: ['na', 'vi', 'o'],
		namePtBR: 'navio',
		nameEn: 'ship',
		nameDe: 'Schiff',
		nameFr: 'navire',
		nameEs: 'barco'
	},

	// O
	{
		word: 'ovo',
		emoji: '🥚',
		syllables: ['o', 'vo'],
		namePtBR: 'ovo',
		nameEn: 'egg',
		nameDe: 'Ei',
		nameFr: 'œuf',
		nameEs: 'huevo'
	},
	{
		word: 'olho',
		emoji: '👁️',
		syllables: ['o', 'lho'],
		namePtBR: 'olho',
		nameEn: 'eye',
		nameDe: 'Auge',
		nameFr: 'œil',
		nameEs: 'ojo'
	},

	// P
	{
		word: 'pato',
		emoji: '🦆',
		syllables: ['pa', 'to'],
		namePtBR: 'pato',
		nameEn: 'duck',
		nameDe: 'Ente',
		nameFr: 'canard',
		nameEs: 'pato'
	},
	{
		word: 'passaro',
		emoji: '🐦',
		syllables: ['pas', 'sa', 'ro'],
		namePtBR: 'pássaro',
		nameEn: 'bird',
		nameDe: 'Vogel',
		nameFr: 'oiseau',
		nameEs: 'pájaro'
	},
	{
		word: 'peixe',
		emoji: '🐟',
		syllables: ['pei', 'xe'],
		namePtBR: 'peixe',
		nameEn: 'fish',
		nameDe: 'Fisch',
		nameFr: 'poisson',
		nameEs: 'pez'
	},
	{
		word: 'pizza',
		emoji: '🍕',
		syllables: ['piz', 'za'],
		namePtBR: 'pizza',
		nameEn: 'pizza',
		nameDe: 'Pizza',
		nameFr: 'pizza',
		nameEs: 'pizza'
	},

	// Q
	{
		word: 'queijo',
		emoji: '🧀',
		syllables: ['quei', 'jo'],
		namePtBR: 'queijo',
		nameEn: 'cheese',
		nameDe: 'Käse',
		nameFr: 'fromage',
		nameEs: 'queso'
	},

	// R
	{
		word: 'rato',
		emoji: '🐭',
		syllables: ['ra', 'to'],
		namePtBR: 'rato',
		nameEn: 'mouse',
		nameDe: 'Maus',
		nameFr: 'souris',
		nameEs: 'ratón'
	},
	{
		word: 'relogio',
		emoji: '⏰',
		syllables: ['re', 'lo', 'gi', 'o'],
		namePtBR: 'relógio',
		nameEn: 'clock',
		nameDe: 'Uhr',
		nameFr: 'horloge',
		nameEs: 'reloj'
	},

	// S
	{
		word: 'sol',
		emoji: '☀️',
		syllables: ['sol'],
		namePtBR: 'sol',
		nameEn: 'sun',
		nameDe: 'Sonne',
		nameFr: 'soleil',
		nameEs: 'sol'
	},
	{
		word: 'sapo',
		emoji: '🐸',
		syllables: ['sa', 'po'],
		namePtBR: 'sapo',
		nameEn: 'frog',
		nameDe: 'Frosch',
		nameFr: 'grenouille',
		nameEs: 'rana'
	},
	{
		word: 'sapato',
		emoji: '👟',
		syllables: ['sa', 'pa', 'to'],
		namePtBR: 'sapato',
		nameEn: 'shoe',
		nameDe: 'Schuh',
		nameFr: 'chaussure',
		nameEs: 'zapato'
	},

	// T
	{
		word: 'tartaruga',
		emoji: '🐢',
		syllables: ['tar', 'ta', 'ru', 'ga'],
		namePtBR: 'tartaruga',
		nameEn: 'turtle',
		nameDe: 'Schildkröte',
		nameFr: 'tortue',
		nameEs: 'tortuga'
	},
	{
		word: 'tigre',
		emoji: '🐯',
		syllables: ['ti', 'gre'],
		namePtBR: 'tigre',
		nameEn: 'tiger',
		nameDe: 'Tiger',
		nameFr: 'tigre',
		nameEs: 'tigre'
	},
	{
		word: 'tomate',
		emoji: '🍅',
		syllables: ['to', 'ma', 'te'],
		namePtBR: 'tomate',
		nameEn: 'tomato',
		nameDe: 'Tomate',
		nameFr: 'tomate',
		nameEs: 'tomate'
	},

	// U
	{
		word: 'uva',
		emoji: '🍇',
		syllables: ['u', 'va'],
		namePtBR: 'uva',
		nameEn: 'grape',
		nameDe: 'Traube',
		nameFr: 'raisin',
		nameEs: 'uva'
	},
	{
		word: 'urso',
		emoji: '🐻',
		syllables: ['ur', 'so'],
		namePtBR: 'urso',
		nameEn: 'bear',
		nameDe: 'Bär',
		nameFr: 'ours',
		nameEs: 'oso'
	},

	// V
	{
		word: 'vaca',
		emoji: '🐄',
		syllables: ['va', 'ca'],
		namePtBR: 'vaca',
		nameEn: 'cow',
		nameDe: 'Kuh',
		nameFr: 'vache',
		nameEs: 'vaca'
	},
	{
		word: 'violao',
		emoji: '🎸',
		syllables: ['vi', 'o', 'lao'],
		namePtBR: 'violão',
		nameEn: 'guitar',
		nameDe: 'Gitarre',
		nameFr: 'guitare',
		nameEs: 'guitarra'
	},

	// X
	{
		word: 'xicara',
		emoji: '☕',
		syllables: ['xi', 'ca', 'ra'],
		namePtBR: 'xícara',
		nameEn: 'cup',
		nameDe: 'Tasse',
		nameFr: 'tasse',
		nameEs: 'taza'
	},

	// Z
	{
		word: 'zebra',
		emoji: '🦓',
		syllables: ['ze', 'bra'],
		namePtBR: 'zebra',
		nameEn: 'zebra',
		nameDe: 'Zebra',
		nameFr: 'zèbre',
		nameEs: 'cebra'
	}
]

/** Get words by starting letter */
export function getWordsByInitialLetter(letter: string): WordInfo[] {
	return wordBank.filter((w) => w.word[0].toUpperCase() === letter.toUpperCase())
}

/** Get words by syllable count */
export function getWordsBySyllableCount(count: number): WordInfo[] {
	return wordBank.filter((w) => w.syllables.length === count)
}

/** Get words for a difficulty level based on syllable count */
export function getWordsForSyllableDifficulty(difficulty: 1 | 2 | 3 | 4): WordInfo[] {
	switch (difficulty) {
		case 1:
			return wordBank.filter((w) => w.syllables.length <= 2)
		case 2:
			return wordBank.filter((w) => w.syllables.length >= 2 && w.syllables.length <= 3)
		case 3:
			return wordBank.filter((w) => w.syllables.length >= 3 && w.syllables.length <= 4)
		case 4:
			return wordBank.filter((w) => w.syllables.length >= 4)
	}
}

/** Get words for word-completion difficulty based on word length */
export function getWordsForCompletionDifficulty(difficulty: 1 | 2 | 3 | 4): WordInfo[] {
	switch (difficulty) {
		case 1:
			return wordBank.filter((w) => w.word.length <= 4)
		case 2:
			return wordBank.filter((w) => w.word.length >= 4 && w.word.length <= 5)
		case 3:
			return wordBank.filter((w) => w.word.length >= 5 && w.word.length <= 6)
		case 4:
			return wordBank.filter((w) => w.word.length >= 6)
	}
}

/** Get a random word from a list */
export function getRandomWord(words: WordInfo[]): WordInfo | undefined {
	if (words.length === 0) return undefined
	return words[Math.floor(Math.random() * words.length)]
}
