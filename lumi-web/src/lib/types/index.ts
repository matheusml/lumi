/**
 * Lumi Types
 *
 * Core type definitions for the application.
 */

export type {
	ProblemType,
	DifficultyLevel,
	LocalizedString,
	VisualElement,
	ProblemVisual,
	AnswerValue,
	Problem,
	ProblemResult,
	AnswerState,
} from './problem';

export type {
	Session,
	ActivityProgress,
	DailyAdventureCount,
	Child,
	UserPreferences,
} from './session';

export {
	DEFAULT_DAILY_LIMIT,
	PROBLEMS_PER_ADVENTURE,
	MAX_DAILY_LIMIT,
	MIN_DAILY_LIMIT,
	createDefaultActivityProgress,
	createDefaultChild,
} from './session';
