import { describe, it, expect, beforeEach } from 'vitest'
import {
	DifficultyManager,
	MIN_DIFFICULTY,
	MAX_DIFFICULTY,
	CORRECT_TO_LEVEL_UP,
	INCORRECT_TO_LEVEL_DOWN
} from './difficulty-manager'

describe('DifficultyManager', () => {
	let manager: DifficultyManager

	beforeEach(() => {
		manager = new DifficultyManager()
	})

	describe('initialization', () => {
		it('should initialize with default difficulty for all problem types', () => {
			// Math types
			expect(manager.getDifficulty('counting')).toBe(MIN_DIFFICULTY)
			expect(manager.getDifficulty('addition')).toBe(MIN_DIFFICULTY)
			expect(manager.getDifficulty('subtraction')).toBe(MIN_DIFFICULTY)
			expect(manager.getDifficulty('comparison')).toBe(MIN_DIFFICULTY)
			expect(manager.getDifficulty('patterns')).toBe(MIN_DIFFICULTY)
			// Grammar types
			expect(manager.getDifficulty('letter-recognition')).toBe(MIN_DIFFICULTY)
			expect(manager.getDifficulty('alphabet-order')).toBe(MIN_DIFFICULTY)
			expect(manager.getDifficulty('initial-letter')).toBe(MIN_DIFFICULTY)
			expect(manager.getDifficulty('word-completion')).toBe(MIN_DIFFICULTY)
		})

		it('should return all difficulties as a map', () => {
			const difficulties = manager.getAllDifficulties()
			expect(difficulties.size).toBe(9) // 5 math + 4 grammar
			expect(difficulties.get('counting')).toBe(MIN_DIFFICULTY)
			expect(difficulties.get('letter-recognition')).toBe(MIN_DIFFICULTY)
		})
	})

	describe('recordAnswer - level up', () => {
		it('should level up after 3 consecutive correct answers', () => {
			expect(manager.getDifficulty('counting')).toBe(1)

			manager.recordAnswer(true, 'counting')
			expect(manager.getDifficulty('counting')).toBe(1)

			manager.recordAnswer(true, 'counting')
			expect(manager.getDifficulty('counting')).toBe(1)

			manager.recordAnswer(true, 'counting')
			expect(manager.getDifficulty('counting')).toBe(2)
		})

		it('should reset consecutive count after leveling up', () => {
			// Level up from 1 to 2
			for (let i = 0; i < CORRECT_TO_LEVEL_UP; i++) {
				manager.recordAnswer(true, 'addition')
			}
			expect(manager.getDifficulty('addition')).toBe(2)

			// Only 2 more correct - should not level up yet
			manager.recordAnswer(true, 'addition')
			manager.recordAnswer(true, 'addition')
			expect(manager.getDifficulty('addition')).toBe(2)

			// Third correct should level up to 3
			manager.recordAnswer(true, 'addition')
			expect(manager.getDifficulty('addition')).toBe(3)
		})

		it('should not exceed MAX_DIFFICULTY', () => {
			// Level up to max
			for (let i = 0; i < CORRECT_TO_LEVEL_UP * 4; i++) {
				manager.recordAnswer(true, 'subtraction')
			}
			expect(manager.getDifficulty('subtraction')).toBe(MAX_DIFFICULTY)

			// More correct answers should not increase past max
			for (let i = 0; i < CORRECT_TO_LEVEL_UP; i++) {
				manager.recordAnswer(true, 'subtraction')
			}
			expect(manager.getDifficulty('subtraction')).toBe(MAX_DIFFICULTY)
		})
	})

	describe('recordAnswer - level down', () => {
		it('should level down after 2 consecutive incorrect answers', () => {
			// First level up
			for (let i = 0; i < CORRECT_TO_LEVEL_UP; i++) {
				manager.recordAnswer(true, 'comparison')
			}
			expect(manager.getDifficulty('comparison')).toBe(2)

			// Now get 2 wrong
			manager.recordAnswer(false, 'comparison')
			expect(manager.getDifficulty('comparison')).toBe(2)

			manager.recordAnswer(false, 'comparison')
			expect(manager.getDifficulty('comparison')).toBe(1)
		})

		it('should not go below MIN_DIFFICULTY', () => {
			// At minimum already
			expect(manager.getDifficulty('patterns')).toBe(MIN_DIFFICULTY)

			// Multiple incorrect answers
			for (let i = 0; i < INCORRECT_TO_LEVEL_DOWN * 2; i++) {
				manager.recordAnswer(false, 'patterns')
			}
			expect(manager.getDifficulty('patterns')).toBe(MIN_DIFFICULTY)
		})

		it('should reset consecutive incorrect count after leveling down', () => {
			// Level up to 3
			for (let i = 0; i < CORRECT_TO_LEVEL_UP * 2; i++) {
				manager.recordAnswer(true, 'counting')
			}
			expect(manager.getDifficulty('counting')).toBe(3)

			// Level down to 2
			for (let i = 0; i < INCORRECT_TO_LEVEL_DOWN; i++) {
				manager.recordAnswer(false, 'counting')
			}
			expect(manager.getDifficulty('counting')).toBe(2)

			// Only 1 more incorrect - should not level down yet
			manager.recordAnswer(false, 'counting')
			expect(manager.getDifficulty('counting')).toBe(2)

			// Second incorrect should level down
			manager.recordAnswer(false, 'counting')
			expect(manager.getDifficulty('counting')).toBe(1)
		})
	})

	describe('recordAnswer - streak reset', () => {
		it('should reset correct streak when answer is incorrect', () => {
			manager.recordAnswer(true, 'addition')
			manager.recordAnswer(true, 'addition')
			// 2 correct in a row

			manager.recordAnswer(false, 'addition')
			// Streak broken

			manager.recordAnswer(true, 'addition')
			manager.recordAnswer(true, 'addition')
			// Only 2 correct now

			expect(manager.getDifficulty('addition')).toBe(1)

			manager.recordAnswer(true, 'addition')
			expect(manager.getDifficulty('addition')).toBe(2)
		})

		it('should reset incorrect streak when answer is correct', () => {
			// Level up first
			for (let i = 0; i < CORRECT_TO_LEVEL_UP; i++) {
				manager.recordAnswer(true, 'subtraction')
			}
			expect(manager.getDifficulty('subtraction')).toBe(2)

			// Get 1 wrong
			manager.recordAnswer(false, 'subtraction')

			// Then get 1 right - resets incorrect streak
			manager.recordAnswer(true, 'subtraction')

			// Now 1 wrong should not trigger level down
			manager.recordAnswer(false, 'subtraction')
			expect(manager.getDifficulty('subtraction')).toBe(2)
		})
	})

	describe('progress tracking', () => {
		it('should track problems attempted', () => {
			manager.recordAnswer(true, 'counting')
			manager.recordAnswer(false, 'counting')
			manager.recordAnswer(true, 'counting')

			const progress = manager.getProgress('counting')
			expect(progress.problemsAttempted).toBe(3)
		})

		it('should track problems correct', () => {
			manager.recordAnswer(true, 'counting')
			manager.recordAnswer(false, 'counting')
			manager.recordAnswer(true, 'counting')

			const progress = manager.getProgress('counting')
			expect(progress.problemsCorrect).toBe(2)
		})

		it('should calculate accuracy percentage', () => {
			manager.recordAnswer(true, 'addition')
			manager.recordAnswer(true, 'addition')
			manager.recordAnswer(false, 'addition')
			manager.recordAnswer(true, 'addition')

			expect(manager.getAccuracy('addition')).toBe(75)
		})

		it('should return 0 accuracy for no attempts', () => {
			expect(manager.getAccuracy('comparison')).toBe(0)
		})
	})

	describe('persistence', () => {
		it('should get all progress for persistence', () => {
			manager.recordAnswer(true, 'counting')
			manager.recordAnswer(true, 'addition')

			const allProgress = manager.getAllProgress()
			expect(allProgress.counting.problemsAttempted).toBe(1)
			expect(allProgress.addition.problemsAttempted).toBe(1)
		})

		it('should load progress from storage', () => {
			const savedProgress = {
				// Math
				counting: {
					activityType: 'counting' as const,
					currentDifficulty: 3 as const,
					problemsAttempted: 10,
					problemsCorrect: 8,
					consecutiveCorrect: 1,
					consecutiveIncorrect: 0
				},
				addition: {
					activityType: 'addition' as const,
					currentDifficulty: 2 as const,
					problemsAttempted: 5,
					problemsCorrect: 3,
					consecutiveCorrect: 0,
					consecutiveIncorrect: 1
				},
				subtraction: {
					activityType: 'subtraction' as const,
					currentDifficulty: 1 as const,
					problemsAttempted: 0,
					problemsCorrect: 0,
					consecutiveCorrect: 0,
					consecutiveIncorrect: 0
				},
				comparison: {
					activityType: 'comparison' as const,
					currentDifficulty: 1 as const,
					problemsAttempted: 0,
					problemsCorrect: 0,
					consecutiveCorrect: 0,
					consecutiveIncorrect: 0
				},
				patterns: {
					activityType: 'patterns' as const,
					currentDifficulty: 1 as const,
					problemsAttempted: 0,
					problemsCorrect: 0,
					consecutiveCorrect: 0,
					consecutiveIncorrect: 0
				},
				// Logic
				'odd-one-out': {
					activityType: 'odd-one-out' as const,
					currentDifficulty: 1 as const,
					problemsAttempted: 0,
					problemsCorrect: 0,
					consecutiveCorrect: 0,
					consecutiveIncorrect: 0
				},
				// Grammar
				'letter-recognition': {
					activityType: 'letter-recognition' as const,
					currentDifficulty: 1 as const,
					problemsAttempted: 0,
					problemsCorrect: 0,
					consecutiveCorrect: 0,
					consecutiveIncorrect: 0
				},
				'alphabet-order': {
					activityType: 'alphabet-order' as const,
					currentDifficulty: 1 as const,
					problemsAttempted: 0,
					problemsCorrect: 0,
					consecutiveCorrect: 0,
					consecutiveIncorrect: 0
				},
				'initial-letter': {
					activityType: 'initial-letter' as const,
					currentDifficulty: 1 as const,
					problemsAttempted: 0,
					problemsCorrect: 0,
					consecutiveCorrect: 0,
					consecutiveIncorrect: 0
				},
				'word-completion': {
					activityType: 'word-completion' as const,
					currentDifficulty: 1 as const,
					problemsAttempted: 0,
					problemsCorrect: 0,
					consecutiveCorrect: 0,
					consecutiveIncorrect: 0
				}
			}

			manager.loadProgress(savedProgress)

			expect(manager.getDifficulty('counting')).toBe(3)
			expect(manager.getDifficulty('addition')).toBe(2)
			expect(manager.getProgress('counting').problemsAttempted).toBe(10)
		})
	})

	describe('reset', () => {
		it('should reset progress for a specific activity type', () => {
			// Make some progress
			for (let i = 0; i < CORRECT_TO_LEVEL_UP; i++) {
				manager.recordAnswer(true, 'counting')
			}
			expect(manager.getDifficulty('counting')).toBe(2)

			// Reset
			manager.resetProgress('counting')

			expect(manager.getDifficulty('counting')).toBe(1)
			expect(manager.getProgress('counting').problemsAttempted).toBe(0)
		})

		it('should reset all progress', () => {
			// Make some progress
			for (let i = 0; i < CORRECT_TO_LEVEL_UP; i++) {
				manager.recordAnswer(true, 'counting')
				manager.recordAnswer(true, 'addition')
			}
			expect(manager.getDifficulty('counting')).toBe(2)
			expect(manager.getDifficulty('addition')).toBe(2)

			// Reset all
			manager.resetAllProgress()

			expect(manager.getDifficulty('counting')).toBe(1)
			expect(manager.getDifficulty('addition')).toBe(1)
		})
	})
})
