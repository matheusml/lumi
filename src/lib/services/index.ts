/**
 * Services
 *
 * Core services for the application.
 */

export {
	DifficultyManager,
	difficultyManager,
	MIN_DIFFICULTY,
	MAX_DIFFICULTY,
	CORRECT_TO_LEVEL_UP,
	INCORRECT_TO_LEVEL_DOWN
} from './difficulty-manager'

export { AdventureLimitService, adventureLimitService, type DailyCount } from './adventure-limit'

export { speechService, type SpeechOptions } from './speech'

export {
	AgeService,
	ageService,
	initAge,
	type ChildAge,
	DEFAULT_AGE,
	MIN_AGE,
	MAX_AGE,
	VALID_AGES,
	AGE_DIFFICULTY_MAP,
	AGE_PROBLEM_TYPES
} from './age-service'

// Re-export language URL helper from i18n
export { setLanguageFromUrl } from '$lib/i18n'
