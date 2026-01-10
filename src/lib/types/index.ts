/**
 * Lumi Types
 *
 * Core type definitions for the application.
 */

export type {
	MathProblemType,
	GrammarProblemType,
	LogicProblemType,
	ProblemType,
	AdventureCategory,
	DifficultyLevel,
	LocalizedString,
	VisualElement,
	ProblemVisual,
	AnswerValue,
	Problem,
	ProblemResult,
	AnswerState
} from './problem'

export { MATH_PROBLEM_TYPES, GRAMMAR_PROBLEM_TYPES, LOGIC_PROBLEM_TYPES } from './problem'

export type {
	Session,
	ActivityProgress,
	DailyAdventureCount,
	Child,
	UserPreferences
} from './session'

export {
	DEFAULT_DAILY_LIMIT,
	DEFAULT_LIMIT_ENABLED,
	PROBLEMS_PER_ADVENTURE,
	MAX_DAILY_LIMIT,
	MIN_DAILY_LIMIT,
	createDefaultActivityProgress,
	createDefaultChild
} from './session'
