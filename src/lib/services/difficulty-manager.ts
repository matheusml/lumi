/**
 * Difficulty Manager
 *
 * Manages adaptive difficulty based on performance.
 * Level UP: After 3 consecutive correct answers
 * Level DOWN: After 2 consecutive incorrect answers
 */

import type { ProblemType, DifficultyLevel, ActivityProgress } from '$lib/types'
import { createDefaultActivityProgress } from '$lib/types'

export const MIN_DIFFICULTY: DifficultyLevel = 1
export const MAX_DIFFICULTY: DifficultyLevel = 4
export const CORRECT_TO_LEVEL_UP = 3
export const INCORRECT_TO_LEVEL_DOWN = 2

export class DifficultyManager {
	private progress: Map<ProblemType, ActivityProgress> = new Map()
	private defaultStartingDifficulty: DifficultyLevel = MIN_DIFFICULTY

	constructor() {
		this.initializeProgress()
	}

	/**
	 * Set the default starting difficulty for new problem types.
	 * Used by age service to adjust difficulty based on child's age.
	 * Also updates existing problem types that haven't been played yet.
	 */
	setDefaultStartingDifficulty(difficulty: DifficultyLevel): void {
		this.defaultStartingDifficulty = difficulty

		// Update all problem types that haven't been played yet
		for (const progress of this.progress.values()) {
			if (progress.problemsAttempted === 0) {
				progress.currentDifficulty = difficulty
			}
		}
	}

	/**
	 * Get the current default starting difficulty
	 */
	getDefaultStartingDifficulty(): DifficultyLevel {
		return this.defaultStartingDifficulty
	}

	private initializeProgress(): void {
		const types: ProblemType[] = [
			// Math
			'counting',
			'addition',
			'subtraction',
			'comparison',
			'patterns',
			// Grammar
			'letter-recognition',
			'alphabet-order',
			'initial-letter',
			'word-completion'
		]
		for (const type of types) {
			this.progress.set(type, createDefaultActivityProgress(type, this.defaultStartingDifficulty))
		}
	}

	/**
	 * Load progress from storage
	 */
	loadProgress(data: Record<ProblemType, ActivityProgress>): void {
		for (const [type, progress] of Object.entries(data)) {
			this.progress.set(type as ProblemType, progress)
		}
	}

	/**
	 * Get all progress for persistence
	 */
	getAllProgress(): Record<ProblemType, ActivityProgress> {
		const result: Partial<Record<ProblemType, ActivityProgress>> = {}
		for (const [type, progress] of this.progress) {
			result[type] = progress
		}
		return result as Record<ProblemType, ActivityProgress>
	}

	/**
	 * Get current difficulty for an activity type
	 */
	getDifficulty(activityType: ProblemType): DifficultyLevel {
		return this.progress.get(activityType)?.currentDifficulty ?? MIN_DIFFICULTY
	}

	/**
	 * Get all difficulties as a map (for ProblemService)
	 */
	getAllDifficulties(): Map<ProblemType, DifficultyLevel> {
		const result = new Map<ProblemType, DifficultyLevel>()
		for (const [type, progress] of this.progress) {
			result.set(type, progress.currentDifficulty)
		}
		return result
	}

	/**
	 * Get progress for an activity type
	 */
	getProgress(activityType: ProblemType): ActivityProgress {
		return (
			this.progress.get(activityType) ??
			createDefaultActivityProgress(activityType, this.defaultStartingDifficulty)
		)
	}

	/**
	 * Record an answer and update difficulty
	 * @returns The new difficulty level
	 */
	recordAnswer(correct: boolean, activityType: ProblemType): DifficultyLevel {
		let progress = this.progress.get(activityType)
		if (!progress) {
			progress = createDefaultActivityProgress(activityType, this.defaultStartingDifficulty)
			this.progress.set(activityType, progress)
		}

		// Update attempt counts
		progress.problemsAttempted += 1
		if (correct) {
			progress.problemsCorrect += 1
		}

		if (correct) {
			progress.consecutiveCorrect += 1
			progress.consecutiveIncorrect = 0

			// Level up after 3 correct in a row
			if (progress.consecutiveCorrect >= CORRECT_TO_LEVEL_UP) {
				progress.currentDifficulty = Math.min(
					progress.currentDifficulty + 1,
					MAX_DIFFICULTY
				) as DifficultyLevel
				progress.consecutiveCorrect = 0
			}
		} else {
			progress.consecutiveIncorrect += 1
			progress.consecutiveCorrect = 0

			// Level down after 2 incorrect in a row
			if (progress.consecutiveIncorrect >= INCORRECT_TO_LEVEL_DOWN) {
				progress.currentDifficulty = Math.max(
					progress.currentDifficulty - 1,
					MIN_DIFFICULTY
				) as DifficultyLevel
				progress.consecutiveIncorrect = 0
			}
		}

		return progress.currentDifficulty
	}

	/**
	 * Reset progress for a specific activity type
	 */
	resetProgress(activityType: ProblemType): void {
		this.progress.set(
			activityType,
			createDefaultActivityProgress(activityType, this.defaultStartingDifficulty)
		)
	}

	/**
	 * Reset all progress
	 */
	resetAllProgress(): void {
		this.initializeProgress()
	}

	/**
	 * Get accuracy percentage for an activity type
	 */
	getAccuracy(activityType: ProblemType): number {
		const progress = this.progress.get(activityType)
		if (!progress || progress.problemsAttempted === 0) {
			return 0
		}
		return Math.round((progress.problemsCorrect / progress.problemsAttempted) * 100)
	}
}

// Singleton instance
export const difficultyManager = new DifficultyManager()
