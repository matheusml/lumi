/**
 * Age Service
 *
 * Manages the child's age setting and provides age-based starting difficulty.
 * Ages 3-7 map to different starting difficulties for problem types.
 * Also provides age-appropriate problem type filtering.
 */

import type {
	DifficultyLevel,
	MathProblemType,
	GrammarProblemType,
	LogicProblemType,
	SocialEmotionalProblemType,
	AdventureCategory,
	ProblemType
} from '$lib/types'

export type ChildAge = 3 | 4 | 5 | 6 | 7

export const DEFAULT_AGE: ChildAge = 5
export const MIN_AGE: ChildAge = 3
export const MAX_AGE: ChildAge = 7
export const VALID_AGES: ChildAge[] = [3, 4, 5, 6, 7]

const STORAGE_KEY = 'lumi-age'

/**
 * Maps child age to starting difficulty for problem types.
 * - Ages 3-4: Difficulty 1 (very basic)
 * - Ages 5-6: Difficulty 2 (moderate)
 * - Age 7: Difficulty 3 (more challenging)
 */
export const AGE_DIFFICULTY_MAP: Record<ChildAge, DifficultyLevel> = {
	3: 1,
	4: 1,
	5: 2,
	6: 2,
	7: 3
}

/**
 * Maps child age to appropriate problem types for each adventure category.
 * - Ages 3-4: Focus on counting, comparison, patterns, matching (no arithmetic operations)
 * - Ages 5+: Gradually introduce addition, subtraction, and more complex problems
 */
export const AGE_PROBLEM_TYPES: Record<
	ChildAge,
	{
		math: MathProblemType[]
		grammar: GrammarProblemType[]
		logic: LogicProblemType[]
		'social-emotional': SocialEmotionalProblemType[]
	}
> = {
	3: {
		math: ['counting', 'comparison'],
		grammar: ['letter-recognition'],
		logic: ['matching', 'shape-recognition', 'color-recognition'], // Simple recognition for 3yo
		'social-emotional': ['kindness-choices'] // Simple kindness scenarios with labels
	},
	4: {
		math: ['counting', 'comparison'],
		grammar: ['letter-recognition'],
		logic: ['matching', 'odd-one-out', 'shape-recognition', 'color-recognition'],
		'social-emotional': ['kindness-choices', 'emotion-scenario'] // Add emotion scenarios
	},
	5: {
		math: ['counting', 'addition', 'comparison'],
		grammar: ['letter-recognition', 'alphabet-order'],
		logic: ['matching', 'patterns', 'odd-one-out', 'sorting', 'sequence'],
		'social-emotional': ['emotion-scenario', 'kindness-choices']
	},
	6: {
		math: ['counting', 'addition', 'subtraction', 'comparison'],
		grammar: ['letter-recognition', 'alphabet-order', 'initial-letter'],
		logic: ['matching', 'patterns', 'odd-one-out', 'sorting', 'sequence'],
		'social-emotional': ['emotion-scenario', 'kindness-choices']
	},
	7: {
		math: ['counting', 'addition', 'subtraction', 'comparison'],
		grammar: ['letter-recognition', 'alphabet-order', 'initial-letter', 'word-completion'],
		logic: ['matching', 'patterns', 'odd-one-out', 'sorting', 'sequence'],
		'social-emotional': ['emotion-scenario', 'kindness-choices']
	}
}

type AgeSubscriber = (age: ChildAge) => void

export class AgeService {
	private currentAge: ChildAge = DEFAULT_AGE
	private subscribers: Set<AgeSubscriber> = new Set()

	/**
	 * Load state from storage data
	 */
	loadState(data: { age?: number }): void {
		if (data.age !== undefined && this.isValidAge(data.age)) {
			this.currentAge = data.age as ChildAge
			this.notifySubscribers()
		}
	}

	/**
	 * Get state for persistence
	 */
	getState(): { age: ChildAge } {
		return { age: this.currentAge }
	}

	/**
	 * Get the current age
	 */
	getAge(): ChildAge {
		return this.currentAge
	}

	/**
	 * Set the child's age
	 */
	setAge(age: ChildAge): void {
		if (!this.isValidAge(age)) {
			return
		}
		this.currentAge = age
		this.saveToStorage()
		this.notifySubscribers()
	}

	/**
	 * Get the starting difficulty based on current age
	 */
	getStartingDifficulty(): DifficultyLevel {
		return AGE_DIFFICULTY_MAP[this.currentAge]
	}

	/**
	 * Get age-appropriate problem types for a given adventure category
	 */
	getProblemTypesForAge(
		category: AdventureCategory
	):
		| MathProblemType[]
		| GrammarProblemType[]
		| LogicProblemType[]
		| SocialEmotionalProblemType[]
		| ProblemType[] {
		if (category === 'mixed') {
			// Return all problem types for the current age
			const ageTypes = AGE_PROBLEM_TYPES[this.currentAge]
			return [
				...ageTypes.math,
				...ageTypes.grammar,
				...ageTypes.logic,
				...ageTypes['social-emotional']
			]
		}
		return AGE_PROBLEM_TYPES[this.currentAge][category]
	}

	/**
	 * Subscribe to age changes
	 * @returns Unsubscribe function
	 */
	subscribe(callback: AgeSubscriber): () => void {
		this.subscribers.add(callback)
		return () => {
			this.subscribers.delete(callback)
		}
	}

	/**
	 * Check if a value is a valid age
	 */
	private isValidAge(value: number): value is ChildAge {
		return VALID_AGES.includes(value as ChildAge)
	}

	/**
	 * Notify all subscribers of age change
	 */
	private notifySubscribers(): void {
		for (const callback of this.subscribers) {
			callback(this.currentAge)
		}
	}

	/**
	 * Save current age to localStorage
	 */
	private saveToStorage(): void {
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.getState()))
		}
	}
}

// Singleton instance
export const ageService = new AgeService()

/**
 * Initialize age service from localStorage
 * Call this on app mount
 */
export function initAge(): void {
	if (typeof window === 'undefined') return

	const stored = localStorage.getItem(STORAGE_KEY)
	if (stored) {
		try {
			const data = JSON.parse(stored)
			ageService.loadState(data)
		} catch {
			// Invalid data, use defaults
		}
	}
}
