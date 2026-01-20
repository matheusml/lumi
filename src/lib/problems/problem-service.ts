/**
 * Problem Service
 *
 * Manages problem generation across all types with deduplication and history management.
 * Uses lazy loading for generators to improve initial bundle size and load time.
 */

import type { Problem, ProblemType, DifficultyLevel } from '$lib/types'
import type { ProblemGenerator } from './generator'
import { shuffle } from './visual-objects'

/** Saturation threshold for evicting old problems */
const SATURATION_THRESHOLD = 0.8
const EVICTION_RATIO = 0.5

/**
 * Generator loader functions - these use dynamic imports to lazy-load generators
 * Only the generators actually used will be loaded, improving initial bundle size
 */
const generatorLoaders: Record<ProblemType, () => Promise<ProblemGenerator>> = {
	// Math generators
	counting: async () => {
		const { CountingProblemGenerator } = await import('./counting-generator')
		return new CountingProblemGenerator()
	},
	addition: async () => {
		const { AdditionProblemGenerator } = await import('./addition-generator')
		return new AdditionProblemGenerator()
	},
	subtraction: async () => {
		const { SubtractionProblemGenerator } = await import('./subtraction-generator')
		return new SubtractionProblemGenerator()
	},
	comparison: async () => {
		const { ComparisonProblemGenerator } = await import('./comparison-generator')
		return new ComparisonProblemGenerator()
	},
	// Logic generators
	'odd-one-out': async () => {
		const { OddOneOutGenerator } = await import('./logic-generator')
		return new OddOneOutGenerator()
	},
	matching: async () => {
		const { MatchingProblemGenerator } = await import('./matching-generator')
		return new MatchingProblemGenerator()
	},
	sequence: async () => {
		const { SequenceProblemGenerator } = await import('./sequence-generator')
		return new SequenceProblemGenerator()
	},
	patterns: async () => {
		const { PatternProblemGenerator } = await import('./pattern-generator')
		return new PatternProblemGenerator()
	},
	sorting: async () => {
		const { SortingProblemGenerator } = await import('./sorting-generator')
		return new SortingProblemGenerator()
	},
	'shape-recognition': async () => {
		const { ShapeRecognitionGenerator } = await import('./shape-recognition-generator')
		return new ShapeRecognitionGenerator()
	},
	'color-recognition': async () => {
		const { ColorRecognitionGenerator } = await import('./color-recognition-generator')
		return new ColorRecognitionGenerator()
	},
	// Grammar generators
	'letter-recognition': async () => {
		const { LetterRecognitionGenerator } = await import('./grammar')
		return new LetterRecognitionGenerator()
	},
	'alphabet-order': async () => {
		const { AlphabetOrderGenerator } = await import('./grammar')
		return new AlphabetOrderGenerator()
	},
	'initial-letter': async () => {
		const { InitialLetterGenerator } = await import('./grammar')
		return new InitialLetterGenerator()
	},
	'word-completion': async () => {
		const { WordCompletionGenerator } = await import('./grammar')
		return new WordCompletionGenerator()
	},
	// Social-emotional generators
	'emotion-scenario': async () => {
		const { EmotionScenarioGenerator } = await import('./social-emotional')
		return new EmotionScenarioGenerator()
	},
	'kindness-choices': async () => {
		const { KindnessGenerator } = await import('./social-emotional')
		return new KindnessGenerator()
	}
}

export class ProblemService {
	/** Cached generators - loaded on demand */
	private generators: Partial<Record<ProblemType, ProblemGenerator>> = {}
	private seenSignatures: Map<string, Date> = new Map()

	/**
	 * Get a generator, loading it lazily if needed
	 */
	private async getGenerator(type: ProblemType): Promise<ProblemGenerator | null> {
		// Return cached generator if available
		if (this.generators[type]) {
			return this.generators[type]!
		}

		// Load generator on demand
		const loader = generatorLoaders[type]
		if (!loader) return null

		const generator = await loader()
		this.generators[type] = generator
		return generator
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
	 * Generate a single problem of a specific type (async for lazy loading)
	 */
	async generateProblem(type: ProblemType, difficulty: DifficultyLevel): Promise<Problem | null> {
		const generator = await this.getGenerator(type)
		if (!generator) return null

		// Check saturation and evict if needed
		this.checkAndEvict(generator, difficulty)

		const result = generator.generate(difficulty, this.getExclusionSet())
		if (result) {
			this.seenSignatures.set(result.signature, new Date())
			return result.problem
		}

		return null
	}

	/**
	 * Generate a mixed set of problems for an adventure (async for lazy loading)
	 * @param count Number of problems to generate
	 * @param difficulties Map of problem type to difficulty level
	 */
	async generateAdventureProblems(
		count: number,
		difficulties: Map<ProblemType, DifficultyLevel>
	): Promise<Problem[]> {
		const problems: Problem[] = []
		const types: ProblemType[] = ['counting', 'addition', 'subtraction', 'comparison']

		// Shuffle types for variety
		const shuffledTypes = shuffle(types)

		for (let i = 0; i < count; i++) {
			const type = shuffledTypes[i % shuffledTypes.length]
			const difficulty = difficulties.get(type) || 1
			const problem = await this.generateProblem(type, difficulty)

			if (problem) {
				problems.push(problem)
			} else {
				// If we couldn't generate for this type, try others
				for (const fallbackType of types) {
					if (fallbackType !== type) {
						const fallbackDifficulty = difficulties.get(fallbackType) || 1
						const fallbackProblem = await this.generateProblem(fallbackType, fallbackDifficulty)
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
	private checkAndEvict(generator: ProblemGenerator, difficulty: DifficultyLevel): void {
		const allSignatures = generator.allPossibleSignatures(difficulty)
		const seenCount = allSignatures.filter((sig) => this.seenSignatures.has(sig)).length
		const saturation = seenCount / allSignatures.length

		if (saturation >= SATURATION_THRESHOLD) {
			this.evictOldest(generator, difficulty, Math.floor(seenCount * EVICTION_RATIO))
		}
	}

	/**
	 * Evict the oldest seen problems of a specific type/difficulty
	 */
	private evictOldest(
		generator: ProblemGenerator,
		difficulty: DifficultyLevel,
		count: number
	): void {
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
