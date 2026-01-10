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
	INCORRECT_TO_LEVEL_DOWN,
} from './difficulty-manager';

export {
	AdventureLimitService,
	adventureLimitService,
	type DailyCount,
} from './adventure-limit';

export { speechService, type SpeechOptions } from './speech';
