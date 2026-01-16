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
	{ word: 'abelha', emoji: '🐝', syllables: ['a', 'be', 'lha'], namePtBR: 'abelha', nameEn: 'bee' },
	{
		word: 'aviao',
		emoji: '✈️',
		syllables: ['a', 'vi', 'ao'],
		namePtBR: 'avião',
		nameEn: 'airplane'
	},
	{ word: 'agua', emoji: '💧', syllables: ['a', 'gua'], namePtBR: 'água', nameEn: 'water' },
	{
		word: 'aranha',
		emoji: '🕷️',
		syllables: ['a', 'ra', 'nha'],
		namePtBR: 'aranha',
		nameEn: 'spider'
	},

	// B
	{ word: 'bola', emoji: '⚽', syllables: ['bo', 'la'], namePtBR: 'bola', nameEn: 'ball' },
	{
		word: 'banana',
		emoji: '🍌',
		syllables: ['ba', 'na', 'na'],
		namePtBR: 'banana',
		nameEn: 'banana'
	},
	{ word: 'barco', emoji: '⛵', syllables: ['bar', 'co'], namePtBR: 'barco', nameEn: 'boat' },
	{
		word: 'boneca',
		emoji: '🪆',
		syllables: ['bo', 'ne', 'ca'],
		namePtBR: 'boneca',
		nameEn: 'doll'
	},

	// C
	{ word: 'casa', emoji: '🏠', syllables: ['ca', 'sa'], namePtBR: 'casa', nameEn: 'house' },
	{
		word: 'cachorro',
		emoji: '🐕',
		syllables: ['ca', 'chor', 'ro'],
		namePtBR: 'cachorro',
		nameEn: 'dog'
	},
	{ word: 'carro', emoji: '🚗', syllables: ['car', 'ro'], namePtBR: 'carro', nameEn: 'car' },
	{
		word: 'coelho',
		emoji: '🐰',
		syllables: ['co', 'e', 'lho'],
		namePtBR: 'coelho',
		nameEn: 'rabbit'
	},

	// D
	{ word: 'dado', emoji: '🎲', syllables: ['da', 'do'], namePtBR: 'dado', nameEn: 'dice' },
	{ word: 'dente', emoji: '🦷', syllables: ['den', 'te'], namePtBR: 'dente', nameEn: 'tooth' },
	{
		word: 'dinossauro',
		emoji: '🦕',
		syllables: ['di', 'nos', 'sau', 'ro'],
		namePtBR: 'dinossauro',
		nameEn: 'dinosaur'
	},

	// E
	{
		word: 'elefante',
		emoji: '🐘',
		syllables: ['e', 'le', 'fan', 'te'],
		namePtBR: 'elefante',
		nameEn: 'elephant'
	},
	{
		word: 'estrela',
		emoji: '⭐',
		syllables: ['es', 'tre', 'la'],
		namePtBR: 'estrela',
		nameEn: 'star'
	},
	{
		word: 'escola',
		emoji: '🏫',
		syllables: ['es', 'co', 'la'],
		namePtBR: 'escola',
		nameEn: 'school'
	},

	// F
	{ word: 'flor', emoji: '🌸', syllables: ['flor'], namePtBR: 'flor', nameEn: 'flower' },
	{ word: 'fogo', emoji: '🔥', syllables: ['fo', 'go'], namePtBR: 'fogo', nameEn: 'fire' },
	{
		word: 'formiga',
		emoji: '🐜',
		syllables: ['for', 'mi', 'ga'],
		namePtBR: 'formiga',
		nameEn: 'ant'
	},

	// G
	{ word: 'gato', emoji: '🐱', syllables: ['ga', 'to'], namePtBR: 'gato', nameEn: 'cat' },
	{
		word: 'girafa',
		emoji: '🦒',
		syllables: ['gi', 'ra', 'fa'],
		namePtBR: 'girafa',
		nameEn: 'giraffe'
	},
	{
		word: 'galinha',
		emoji: '🐔',
		syllables: ['ga', 'li', 'nha'],
		namePtBR: 'galinha',
		nameEn: 'chicken'
	},

	// H
	{
		word: 'hipopotamo',
		emoji: '🦛',
		syllables: ['hi', 'po', 'po', 'ta', 'mo'],
		namePtBR: 'hipopótamo',
		nameEn: 'hippo'
	},

	// I
	{
		word: 'igreja',
		emoji: '⛪',
		syllables: ['i', 'gre', 'ja'],
		namePtBR: 'igreja',
		nameEn: 'church'
	},
	{ word: 'ilha', emoji: '🏝️', syllables: ['i', 'lha'], namePtBR: 'ilha', nameEn: 'island' },

	// J
	{
		word: 'joaninha',
		emoji: '🐞',
		syllables: ['jo', 'a', 'ni', 'nha'],
		namePtBR: 'joaninha',
		nameEn: 'ladybug'
	},

	// L
	{ word: 'lua', emoji: '🌙', syllables: ['lu', 'a'], namePtBR: 'lua', nameEn: 'moon' },
	{ word: 'leao', emoji: '🦁', syllables: ['le', 'ao'], namePtBR: 'leão', nameEn: 'lion' },
	{ word: 'livro', emoji: '📖', syllables: ['li', 'vro'], namePtBR: 'livro', nameEn: 'book' },
	{
		word: 'laranja',
		emoji: '🍊',
		syllables: ['la', 'ran', 'ja'],
		namePtBR: 'laranja',
		nameEn: 'orange'
	},

	// M
	{ word: 'maca', emoji: '🍎', syllables: ['ma', 'ca'], namePtBR: 'maçã', nameEn: 'apple' },
	{
		word: 'macaco',
		emoji: '🐒',
		syllables: ['ma', 'ca', 'co'],
		namePtBR: 'macaco',
		nameEn: 'monkey'
	},
	{
		word: 'melancia',
		emoji: '🍉',
		syllables: ['me', 'lan', 'ci', 'a'],
		namePtBR: 'melancia',
		nameEn: 'watermelon'
	},

	// N
	{ word: 'nuvem', emoji: '☁️', syllables: ['nu', 'vem'], namePtBR: 'nuvem', nameEn: 'cloud' },
	{ word: 'navio', emoji: '🚢', syllables: ['na', 'vi', 'o'], namePtBR: 'navio', nameEn: 'ship' },

	// O
	{ word: 'ovo', emoji: '🥚', syllables: ['o', 'vo'], namePtBR: 'ovo', nameEn: 'egg' },
	{ word: 'olho', emoji: '👁️', syllables: ['o', 'lho'], namePtBR: 'olho', nameEn: 'eye' },

	// P
	{ word: 'pato', emoji: '🦆', syllables: ['pa', 'to'], namePtBR: 'pato', nameEn: 'duck' },
	{
		word: 'passaro',
		emoji: '🐦',
		syllables: ['pas', 'sa', 'ro'],
		namePtBR: 'pássaro',
		nameEn: 'bird'
	},
	{ word: 'peixe', emoji: '🐟', syllables: ['pei', 'xe'], namePtBR: 'peixe', nameEn: 'fish' },
	{ word: 'pizza', emoji: '🍕', syllables: ['piz', 'za'], namePtBR: 'pizza', nameEn: 'pizza' },

	// Q
	{ word: 'queijo', emoji: '🧀', syllables: ['quei', 'jo'], namePtBR: 'queijo', nameEn: 'cheese' },

	// R
	{ word: 'rato', emoji: '🐭', syllables: ['ra', 'to'], namePtBR: 'rato', nameEn: 'mouse' },
	{
		word: 'relogio',
		emoji: '⏰',
		syllables: ['re', 'lo', 'gi', 'o'],
		namePtBR: 'relógio',
		nameEn: 'clock'
	},

	// S
	{ word: 'sol', emoji: '☀️', syllables: ['sol'], namePtBR: 'sol', nameEn: 'sun' },
	{ word: 'sapo', emoji: '🐸', syllables: ['sa', 'po'], namePtBR: 'sapo', nameEn: 'frog' },
	{
		word: 'sapato',
		emoji: '👟',
		syllables: ['sa', 'pa', 'to'],
		namePtBR: 'sapato',
		nameEn: 'shoe'
	},

	// T
	{
		word: 'tartaruga',
		emoji: '🐢',
		syllables: ['tar', 'ta', 'ru', 'ga'],
		namePtBR: 'tartaruga',
		nameEn: 'turtle'
	},
	{ word: 'tigre', emoji: '🐯', syllables: ['ti', 'gre'], namePtBR: 'tigre', nameEn: 'tiger' },
	{
		word: 'tomate',
		emoji: '🍅',
		syllables: ['to', 'ma', 'te'],
		namePtBR: 'tomate',
		nameEn: 'tomato'
	},

	// U
	{ word: 'uva', emoji: '🍇', syllables: ['u', 'va'], namePtBR: 'uva', nameEn: 'grape' },
	{ word: 'urso', emoji: '🐻', syllables: ['ur', 'so'], namePtBR: 'urso', nameEn: 'bear' },

	// V
	{ word: 'vaca', emoji: '🐄', syllables: ['va', 'ca'], namePtBR: 'vaca', nameEn: 'cow' },
	{
		word: 'violao',
		emoji: '🎸',
		syllables: ['vi', 'o', 'lao'],
		namePtBR: 'violão',
		nameEn: 'guitar'
	},

	// X
	{ word: 'xicara', emoji: '☕', syllables: ['xi', 'ca', 'ra'], namePtBR: 'xícara', nameEn: 'cup' },

	// Z
	{ word: 'zebra', emoji: '🦓', syllables: ['ze', 'bra'], namePtBR: 'zebra', nameEn: 'zebra' }
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
