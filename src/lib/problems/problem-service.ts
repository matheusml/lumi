/**
 * Problem Service
 *
 * Manages problem generation across all types with deduplication and history management.
 */

import type { Problem, ProblemType, DifficultyLevel } from '$lib/types'
import type { ProblemGenerator } from './generator'
import { CountingProblemGenerator } from './counting-generator'
import { AdditionProblemGenerator } from './addition-generator'
import { SubtractionProblemGenerator } from './subtraction-generator'
import { ComparisonProblemGenerator } from './comparison-generator'
import { PatternProblemGenerator } from './pattern-generator'
import { OddOneOutGenerator } from './logic-generator'
import { MatchingProblemGenerator } from './matching-generator'
import { SequenceProblemGenerator } from './sequence-generator'
import { SortingProblemGenerator } from './sorting-generator'
import {
	LetterRecognitionGenerator,
	AlphabetOrderGenerator,
	InitialLetterGenerator,
	WordCompletionGenerator
} from './grammar'
import { shuffle } from './visual-objects'

/** Saturation threshold for evicting old problems */
const SATURATION_THRESHOLD = 0.8
const EVICTION_RATIO = 0.5

export class ProblemService {
	private generators: Record<ProblemType, ProblemGenerator>
	private seenSignatures: Map<string, Date> = new Map()

	constructor() {
		this.generators = {
			// Math generators
			counting: new CountingProblemGenerator(),
			addition: new AdditionProblemGenerator(),
			subtraction: new SubtractionProblemGenerator(),
			comparison: new ComparisonProblemGenerator(),
			// Logic generators
			'odd-one-out': new OddOneOutGenerator(),
			matching: new MatchingProblemGenerator(),
			sequence: new SequenceProblemGenerator(),
			patterns: new PatternProblemGenerator(),
			sorting: new SortingProblemGenerator(),
			// Grammar generators
			'letter-recognition': new LetterRecognitionGenerator(),
			'alphabet-order': new AlphabetOrderGenerator(),
			'initial-letter': new InitialLetterGenerator(),
			'word-completion': new WordCompletionGenerator()
		}
	}

	/**
	 * Load seen signatures from storage
	 */
	loadSeenSignatures(signatures: Map<string, Date>): void {
		this.seenSignatures = new Map(signatures)
	}

	/**
	 * Get all seen signatures for persistence
	 */
	getSeenSignatures(): Map<string, Date> {
		return new Map(this.seenSignatures)
	}

	/**
	 * Get seen signatures as a Set (for generators)
	 */
	private getExclusionSet(): Set<string> {
		return new Set(this.seenSignatures.keys())
	}

	/**
	 * Generate a single problem of a specific type
	 */
	generateProblem(type: ProblemType, difficulty: DifficultyLevel): Problem | null {
		const generator = this.generators[type]
		if (!generator) return null

		// Check saturation and evict if needed
		this.checkAndEvict(type, difficulty)

		const result = generator.generate(difficulty, this.getExclusionSet())
		if (result) {
			this.seenSignatures.set(result.signature, new Date())
			return result.problem
		}

		return null
	}

	/**
	 * Generate a mixed set of problems for an adventure
	 * @param count Number of problems to generate
	 * @param difficulties Map of problem type to difficulty level
	 */
	generateAdventureProblems(
		count: number,
		difficulties: Map<ProblemType, DifficultyLevel>
	): Problem[] {
		const problems: Problem[] = []
		const types: ProblemType[] = ['counting', 'addition', 'subtraction', 'comparison']

		// Shuffle types for variety
		const shuffledTypes = shuffle(types)

		for (let i = 0; i < count; i++) {
			const type = shuffledTypes[i % shuffledTypes.length]
			const difficulty = difficulties.get(type) || 1
			const problem = this.generateProblem(type, difficulty)

			if (problem) {
				problems.push(problem)
			} else {
				// If we couldn't generate for this type, try others
				for (const fallbackType of types) {
					if (fallbackType !== type) {
						const fallbackDifficulty = difficulties.get(fallbackType) || 1
						const fallbackProblem = this.generateProblem(fallbackType, fallbackDifficulty)
						if (fallbackProblem) {
							problems.push(fallbackProblem)
							break
						}
					}
				}
			}
		}

		return problems
	}

	/**
	 * Check saturation and evict old problems if needed
	 */
	private checkAndEvict(type: ProblemType, difficulty: DifficultyLevel): void {
		const generator = this.generators[type]
		if (!generator) return

		const allSignatures = generator.allPossibleSignatures(difficulty)
		const seenCount = allSignatures.filter((sig) => this.seenSignatures.has(sig)).length
		const saturation = seenCount / allSignatures.length

		if (saturation >= SATURATION_THRESHOLD) {
			this.evictOldest(type, difficulty, Math.floor(seenCount * EVICTION_RATIO))
		}
	}

	/**
	 * Evict the oldest seen problems of a specific type/difficulty
	 */
	private evictOldest(type: ProblemType, difficulty: DifficultyLevel, count: number): void {
		const generator = this.generators[type]
		if (!generator) return

		const allSignatures = generator.allPossibleSignatures(difficulty)
		const seenEntries = allSignatures
			.filter((sig) => this.seenSignatures.has(sig))
			.map((sig) => ({ sig, date: this.seenSignatures.get(sig)! }))
			.sort((a, b) => a.date.getTime() - b.date.getTime())

		// Remove oldest entries
		for (let i = 0; i < Math.min(count, seenEntries.length); i++) {
			this.seenSignatures.delete(seenEntries[i].sig)
		}
	}

	/**
	 * Mark a specific problem as seen (for external tracking)
	 */
	markAsSeen(signature: string): void {
		this.seenSignatures.set(signature, new Date())
	}

	/**
	 * Clear all seen signatures (for testing)
	 */
	clearHistory(): void {
		this.seenSignatures.clear()
	}
}

// Singleton instance
export const problemService = new ProblemService()
