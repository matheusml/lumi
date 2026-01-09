/**
 * Counting Problem Generator
 *
 * Generates counting problems: "How many [objects] do you see?"
 * Signature format: counting:d{difficulty}:{count}
 */

import type { Problem, DifficultyLevel } from '$lib/types';
import type { ProblemGenerator, GeneratorResult } from './generator';
import { generateNumberChoices } from './generator';
import { getRandomObject, shuffle } from './visual-objects';

export class CountingProblemGenerator implements ProblemGenerator {
	readonly problemType = 'counting' as const;

	/** Range of counts for each difficulty level */
	private countRange(difficulty: DifficultyLevel): [number, number] {
		switch (difficulty) {
			case 1: return [1, 5];
			case 2: return [1, 10];
			case 3: return [1, 15];
			case 4: return [1, 20];
		}
	}

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const [min, max] = this.countRange(difficulty);
		const possibleCounts = shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i));

		for (const count of possibleCounts) {
			const signature = this.makeSignature(difficulty, count);
			if (!excluding.has(signature)) {
				const problem = this.createProblem(count, difficulty);
				return { problem, signature };
			}
		}

		return null;
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		const [min, max] = this.countRange(difficulty);
		return Array.from({ length: max - min + 1 }, (_, i) =>
			this.makeSignature(difficulty, min + i)
		);
	}

	private makeSignature(difficulty: DifficultyLevel, count: number): string {
		return `counting:d${difficulty}:${count}`;
	}

	private createProblem(count: number, difficulty: DifficultyLevel): Problem {
		const object = getRandomObject();

		return {
			id: crypto.randomUUID(),
			type: 'counting',
			difficulty,
			signature: this.makeSignature(difficulty, count),
			visual: {
				type: 'objects',
				elements: [{ object: object.id, count }],
			},
			prompt: {
				ptBR: `${object.quantifierPtBR} ${object.namePtBR} você vê?`,
				en: `How many ${object.nameEn} do you see?`,
			},
			correctAnswer: { type: 'number', value: count },
			answerChoices: generateNumberChoices(count),
		};
	}
}
