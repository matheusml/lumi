/**
 * Problem Types
 *
 * Core types for the problem generation and display system.
 */

/** Available problem types */
export type ProblemType = 'counting' | 'addition' | 'subtraction' | 'comparison' | 'patterns';

/** Difficulty levels (1-4) */
export type DifficultyLevel = 1 | 2 | 3 | 4;

/** Localized string for multi-language support */
export interface LocalizedString {
	ptBR: string;
	en: string;
}

/** Visual element representing countable objects */
export interface VisualElement {
	object: string;  // Emoji or image identifier
	count: number;
	position?: 'left' | 'right';  // For comparison problems
}

/** Visual representation of a problem */
export interface ProblemVisual {
	type: 'objects' | 'equation' | 'pattern' | 'comparison';
	elements: VisualElement[];
	operator?: '+' | '-';  // For equations
}

/** Answer value - can be number, object selection, or pattern */
export type AnswerValue =
	| { type: 'number'; value: number }
	| { type: 'side'; value: 'left' | 'right' }
	| { type: 'pattern'; value: string[] };

/** A single problem */
export interface Problem {
	id: string;
	type: ProblemType;
	difficulty: DifficultyLevel;
	signature: string;  // Unique identifier for deduplication

	visual: ProblemVisual;
	prompt: LocalizedString;

	correctAnswer: AnswerValue;
	answerChoices: AnswerValue[];
}

/** Result of answering a problem */
export interface ProblemResult {
	problemId: string;
	problemType: ProblemType;
	difficulty: DifficultyLevel;
	isCorrect: boolean;
	answeredAt: Date;
}

/** Answer choice state for UI */
export type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';
