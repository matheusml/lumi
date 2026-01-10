/**
 * Session and Progress Types
 *
 * Types for tracking learning sessions, progress, and daily limits.
 */

import type { ProblemType, DifficultyLevel, ProblemResult } from './problem'

/** A completed learning session (adventure) */
export interface Session {
	id: string
	startedAt: Date
	endedAt: Date
	problemsCompleted: number
	problemsCorrect: number
	results: ProblemResult[]
}

/** Progress tracking for a specific activity type */
export interface ActivityProgress {
	activityType: ProblemType
	currentDifficulty: DifficultyLevel
	problemsAttempted: number
	problemsCorrect: number
	consecutiveCorrect: number
	consecutiveIncorrect: number
}

/** Daily adventure count tracker */
export interface DailyAdventureCount {
	date: string // ISO date string (YYYY-MM-DD)
	count: number
}

/** Child profile and settings */
export interface Child {
	id: string
	name: string
	createdAt: Date

	// Settings
	dailyAdventureLimit: number // Default: 3
	preferredLanguage: 'pt-BR' | 'en'
	autoVoiceOverEnabled: boolean

	// Progress
	activityProgress: Record<ProblemType, ActivityProgress>
	sessions: Session[]

	// Seen problems (signatures)
	seenProblems: Map<string, Date>
}

/** User preferences stored in localStorage */
export interface UserPreferences {
	language: 'pt-BR' | 'en'
	autoVoiceOver: boolean
	dailyLimit: number
	soundEnabled: boolean
}

/** Default values */
export const DEFAULT_DAILY_LIMIT = 3
export const DEFAULT_LIMIT_ENABLED = false
export const PROBLEMS_PER_ADVENTURE = 5
export const MAX_DAILY_LIMIT = 10
export const MIN_DAILY_LIMIT = 1

/** Create default activity progress */
export function createDefaultActivityProgress(activityType: ProblemType): ActivityProgress {
	return {
		activityType,
		currentDifficulty: 1,
		problemsAttempted: 0,
		problemsCorrect: 0,
		consecutiveCorrect: 0,
		consecutiveIncorrect: 0
	}
}

/** Create default child profile */
export function createDefaultChild(name: string = 'Crianca'): Child {
	const problemTypes: ProblemType[] = [
		'counting',
		'addition',
		'subtraction',
		'comparison',
		'patterns'
	]

	return {
		id: crypto.randomUUID(),
		name,
		createdAt: new Date(),
		dailyAdventureLimit: DEFAULT_DAILY_LIMIT,
		preferredLanguage: 'pt-BR',
		autoVoiceOverEnabled: true,
		activityProgress: Object.fromEntries(
			problemTypes.map((type) => [type, createDefaultActivityProgress(type)])
		) as Record<ProblemType, ActivityProgress>,
		sessions: [],
		seenProblems: new Map()
	}
}
