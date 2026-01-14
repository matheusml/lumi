/**
 * Problem System
 *
 * Exports for the problem generation system.
 */

export { problemService, ProblemService } from './problem-service'
export type { ProblemGenerator, GeneratorResult } from './generator'
export { generateNumberChoices } from './generator'
export { visualObjects, patternColors, getRandomObject, shuffle } from './visual-objects'
export type { VisualObjectInfo, PatternColorId } from './visual-objects'

// Math generators (for testing)
export { CountingProblemGenerator } from './counting-generator'
export { AdditionProblemGenerator } from './addition-generator'
export { SubtractionProblemGenerator } from './subtraction-generator'
export { ComparisonProblemGenerator } from './comparison-generator'
export { PatternProblemGenerator } from './pattern-generator'

// Logic generators
export { OddOneOutGenerator } from './logic-generator'
export { MatchingProblemGenerator } from './matching-generator'
export { SequenceProblemGenerator } from './sequence-generator'
export { SortingProblemGenerator } from './sorting-generator'

// Grammar generators
export {
	LetterRecognitionGenerator,
	AlphabetOrderGenerator,
	InitialLetterGenerator,
	WordCompletionGenerator
} from './grammar'

// Grammar data
export type { LetterInfo, WordInfo } from './grammar-data'
export {
	portugueseAlphabet,
	vowels,
	consonants,
	commonConsonants,
	getLetterInfo,
	getLetterIndex,
	getLetterAtIndex,
	getLettersForDifficulty,
	wordBank,
	getWordsByInitialLetter,
	getWordsForCompletionDifficulty,
	getRandomWord
} from './grammar-data'
