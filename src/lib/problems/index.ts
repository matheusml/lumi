/**
 * Problem System
 *
 * Exports for the problem generation system.
 */

export { problemService, ProblemService } from './problem-service'
export type { ProblemGenerator, GeneratorResult } from './generator'
export { generateNumberChoices } from './generator'
export { visualObjects, patternColors, getRandomObject, shuffle } from './visual-objects'
export type { VisualObjectInfo, PatternColorId } from './visual-objects'

// Individual generators (for testing)
export { CountingProblemGenerator } from './counting-generator'
export { AdditionProblemGenerator } from './addition-generator'
export { SubtractionProblemGenerator } from './subtraction-generator'
export { ComparisonProblemGenerator } from './comparison-generator'
export { PatternProblemGenerator } from './pattern-generator'
