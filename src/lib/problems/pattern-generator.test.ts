import { describe, it, expect } from 'vitest';
import { PatternProblemGenerator } from './pattern-generator';
import { patternColors } from './visual-objects';
import type { DifficultyLevel } from '$lib/types';

describe('PatternProblemGenerator', () => {
	const generator = new PatternProblemGenerator();

	describe('problemType', () => {
		it('should be patterns', () => {
			expect(generator.problemType).toBe('patterns');
		});
	});

	describe('generate', () => {
		it('should generate a valid pattern problem', () => {
			const result = generator.generate(1, new Set());
			expect(result).not.toBeNull();
			expect(result!.problem.type).toBe('patterns');
			expect(result!.signature).toMatch(/^patterns:d1:/);
		});

		it('should generate problems with correct structure', () => {
			const result = generator.generate(2, new Set());
			const problem = result!.problem;

			expect(problem.id).toBeDefined();
			expect(problem.difficulty).toBe(2);
			expect(problem.visual.type).toBe('pattern');
			expect(problem.visual.elements.length).toBeGreaterThan(0);
			expect(problem.prompt.ptBR).toBe('O que vem depois?');
			expect(problem.prompt.en).toBe('What comes next?');
			expect(problem.correctAnswer.type).toBe('pattern');
			expect(problem.answerChoices.length).toBe(4); // All pattern colors
		});

		it('should have pattern answer choices', () => {
			const result = generator.generate(2, new Set());
			const choices = result!.problem.answerChoices;

			for (const choice of choices) {
				expect(choice.type).toBe('pattern');
				expect((choice as { type: 'pattern'; value: string[] }).value).toBeInstanceOf(Array);
			}
		});

		it('should include unknown element as last in display', () => {
			const result = generator.generate(2, new Set());
			const elements = result!.problem.visual.elements;
			const lastElement = elements[elements.length - 1];

			expect(lastElement.object).toBe('unknown');
		});

		it('should use valid pattern color IDs', () => {
			const validColorIds = patternColors.map((c) => c.id);

			for (let i = 0; i < 10; i++) {
				const result = generator.generate(3, new Set());
				const elements = result!.problem.visual.elements;

				// Check all non-unknown elements use valid colors
				for (const element of elements) {
					if (element.object !== 'unknown') {
						expect(validColorIds).toContain(element.object);
					}
				}
			}
		});

		it('should have correct answer from pattern colors', () => {
			const validColorIds = patternColors.map((c) => c.id);

			for (let i = 0; i < 10; i++) {
				const result = generator.generate(2, new Set());
				const answer = result!.problem.correctAnswer as { type: 'pattern'; value: string[] };
				expect(answer.value.length).toBe(1);
				expect(validColorIds).toContain(answer.value[0]);
			}
		});

		it('should exclude specified signatures', () => {
			const allSignatures = generator.allPossibleSignatures(1);
			const excluding = new Set(allSignatures.slice(0, -1));

			const result = generator.generate(1, excluding);
			expect(result).not.toBeNull();
			expect(excluding.has(result!.signature)).toBe(false);
		});

		it('should return null when all signatures are excluded', () => {
			const allSignatures = generator.allPossibleSignatures(1);
			const excluding = new Set(allSignatures);

			const result = generator.generate(1, excluding);
			expect(result).toBeNull();
		});
	});

	describe('allPossibleSignatures', () => {
		it('should return 3 templates per difficulty', () => {
			for (const difficulty of [1, 2, 3, 4] as DifficultyLevel[]) {
				const signatures = generator.allPossibleSignatures(difficulty);
				expect(signatures.length).toBe(3);
			}
		});

		it('should have unique signatures within difficulty', () => {
			const signatures = generator.allPossibleSignatures(2);
			const unique = new Set(signatures);
			expect(unique.size).toBe(signatures.length);
		});

		it('should follow the correct format', () => {
			const signatures = generator.allPossibleSignatures(3);
			for (const sig of signatures) {
				expect(sig).toMatch(/^patterns:d3:/);
			}
		});

		it('should have different templates for different difficulties', () => {
			const sig1 = generator.allPossibleSignatures(1);
			const sig4 = generator.allPossibleSignatures(4);

			// Extract pattern hashes
			const hashes1 = sig1.map((s) => s.split(':')[2]);
			const hashes4 = sig4.map((s) => s.split(':')[2]);

			// Some templates should be different between difficulty levels
			const overlap = hashes1.filter((h) => hashes4.includes(h));
			expect(overlap.length).toBeLessThan(3);
		});
	});
});
