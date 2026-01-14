/**
 * Grammar Data
 *
 * Exports letter and word data for grammar problems.
 */

export type { LetterInfo } from './letters'
export {
	portugueseAlphabet,
	vowels,
	consonants,
	commonConsonants,
	getLetterInfo,
	getLetterIndex,
	getLetterAtIndex,
	getLettersForDifficulty
} from './letters'

export type { WordInfo } from './words'
export {
	wordBank,
	getWordsByInitialLetter,
	getWordsBySyllableCount,
	getWordsForSyllableDifficulty,
	getWordsForCompletionDifficulty,
	getRandomWord,
	getLocalizedWord
} from './words'
