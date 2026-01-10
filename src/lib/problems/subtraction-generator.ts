/**
 * Subtraction Problem Generator
 *
 * Generates subtraction problems: "{a} - {b} = ?"
 * Signature format: subtraction:d{difficulty}:{a}-{b}
 */

import type { Problem, DifficultyLevel } from '$lib/types';
import type { ProblemGenerator, GeneratorResult } from './generator';
import { generateNumberChoices } from './generator';
import { getRandomObjectFrom, shuffle } from './visual-objects';

export class SubtractionProblemGenerator implements ProblemGenerator {
	readonly problemType = 'subtraction' as const;

	/** Maximum minuend for each difficulty level */
	private maxMinuend(difficulty: DifficultyLevel): number {
		switch (difficulty) {
			case 1: return 5;
			case 2: return 10;
			case 3: return 15;
			case 4: return 20;
		}
	}

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const max = this.maxMinuend(difficulty);
		const pairs: [number, number][] = [];

		// Generate all valid (a, b) pairs where a > b and both >= 1, a <= max
		for (let a = 2; a <= max; a++) {
			for (let b = 1; b < a; b++) {
				pairs.push([a, b]);
			}
		}

		for (const [a, b] of shuffle(pairs)) {
			const signature = this.makeSignature(difficulty, a, b);
			if (!excluding.has(signature)) {
				const problem = this.createProblem(a, b, difficulty);
				return { problem, signature };
			}
		}

		return null;
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		const max = this.maxMinuend(difficulty);
		const signatures: string[] = [];

		for (let a = 2; a <= max; a++) {
			for (let b = 1; b < a; b++) {
				signatures.push(this.makeSignature(difficulty, a, b));
			}
		}

		return signatures;
	}

	private makeSignature(difficulty: DifficultyLevel, a: number, b: number): string {
		return `subtraction:d${difficulty}:${a}-${b}`;
	}

	private createProblem(a: number, b: number, difficulty: DifficultyLevel): Problem {
		// Use "flying away" objects (birds, butterflies, fish) for subtraction
		const object = getRandomObjectFrom(['bird', 'butterfly', 'fish']);
		const result = a - b;

		return {
			id: crypto.randomUUID(),
			type: 'subtraction',
			difficulty,
			signature: this.makeSignature(difficulty, a, b),
			visual: {
				type: 'equation',
				operator: '-',
				elements: [
					{ object: object.id, count: a, position: 'left' },
					{ object: object.id, count: b, position: 'right' },
				],
			},
			prompt: {
				ptBR: `${a} - ${b} = ?`,
				en: `${a} - ${b} = ?`,
			},
			correctAnswer: { type: 'number', value: result },
			answerChoices: generateNumberChoices(result),
		};
	}
}
