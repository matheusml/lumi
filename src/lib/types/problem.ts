/**
 * Problem Types
 *
 * Core types for the problem generation and display system.
 */

/** Math problem types */
export type MathProblemType = 'counting' | 'addition' | 'subtraction' | 'comparison' | 'patterns'

/** Grammar problem types */
export type GrammarProblemType =
	| 'letter-recognition'
	| 'alphabet-order'
	| 'initial-letter'
	| 'word-completion'

/** All available problem types */
export type ProblemType = MathProblemType | GrammarProblemType

/** Adventure category */
export type AdventureCategory = 'math' | 'grammar'

/** All math problem types */
export const MATH_PROBLEM_TYPES: MathProblemType[] = [
	'counting',
	'addition',
	'subtraction',
	'comparison',
	'patterns'
]

/** All grammar problem types */
export const GRAMMAR_PROBLEM_TYPES: GrammarProblemType[] = [
	'letter-recognition',
	'alphabet-order',
	'initial-letter',
	'word-completion'
]

/** Difficulty levels (1-4) */
export type DifficultyLevel = 1 | 2 | 3 | 4

/** Localized string for multi-language support */
export interface LocalizedString {
	ptBR: string
	en: string
}

/** Visual element representing countable objects */
export interface VisualElement {
	object: string // Emoji or image identifier
	count: number
	position?: 'left' | 'right' // For comparison problems
}

/** Visual representation of a problem */
export interface ProblemVisual {
	type: 'objects' | 'equation' | 'pattern' | 'comparison' | 'letter' | 'word' | 'letter-sequence'
	elements: VisualElement[]
	operator?: '+' | '-' // For equations
	// Grammar-specific fields
	displayText?: string // For letter/word display
	missingIndex?: number // For word-completion (which position is missing)
	letterCase?: 'upper' | 'lower' // For letter display
}

/** Answer value - can be number, letter, object selection, or pattern */
export type AnswerValue =
	| { type: 'number'; value: number }
	| { type: 'side'; value: 'left' | 'right' }
	| { type: 'pattern'; value: string[] }
	| { type: 'letter'; value: string }

/** A single problem */
export interface Problem {
	id: string
	type: ProblemType
	difficulty: DifficultyLevel
	signature: string // Unique identifier for deduplication

	visual: ProblemVisual
	prompt: LocalizedString

	correctAnswer: AnswerValue
	answerChoices: AnswerValue[]
}

/** Result of answering a problem */
export interface ProblemResult {
	problemId: string
	problemType: ProblemType
	difficulty: DifficultyLevel
	isCorrect: boolean
	answeredAt: Date
}

/** Answer choice state for UI */
export type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect'
