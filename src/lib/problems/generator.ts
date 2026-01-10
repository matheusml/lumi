/**
 * Problem Generator Interface
 *
 * Base interface for all problem generators.
 */

import type { Problem, ProblemType, DifficultyLevel, AnswerValue } from '$lib/types'

/** Result of generating a problem */
export interface GeneratorResult {
	problem: Problem
	signature: string
}

/** Base interface for problem generators */
export interface ProblemGenerator {
	/** The type of problems this generator creates */
	problemType: ProblemType

	/**
	 * Generate a problem for the given difficulty, excluding problems with signatures in the set
	 * @param difficulty The difficulty level (1-4)
	 * @param excluding Set of signatures to avoid
	 * @returns A problem and its signature, or null if no unique problem can be generated
	 */
	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null

	/**
	 * Returns all possible signatures for a given difficulty level
	 * Used to calculate saturation for history eviction
	 */
	allPossibleSignatures(difficulty: DifficultyLevel): string[]
}

/**
 * Generate number answer choices near the correct answer
 * @param correct The correct answer
 * @param count Number of choices to generate (default 4)
 */
export function generateNumberChoices(correct: number, count: number = 4): AnswerValue[] {
	const choices = new Set<number>([correct])
	const nearby = [correct - 2, correct - 1, correct + 1, correct + 2].filter((n) => n >= 0)

	// Add nearby numbers first
	for (const n of shuffle(nearby)) {
		choices.add(n)
		if (choices.size >= count) break
	}

	// Fill remaining if needed
	let extra = 0
	while (choices.size < count) {
		extra += 1
		const above = correct + extra + 2
		const below = correct - extra - 2
		if (below >= 0) choices.add(below)
		if (choices.size < count) choices.add(above)
	}

	return Array.from(choices)
		.sort((a, b) => a - b)
		.map((value) => ({ type: 'number' as const, value }))
}

/** Shuffle helper */
function shuffle<T>(array: T[]): T[] {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}
