import { describe, it, expect, beforeEach } from 'vitest';
import { ProblemService } from './problem-service';
import type { ProblemType, DifficultyLevel } from '$lib/types';

describe('ProblemService', () => {
	let service: ProblemService;

	beforeEach(() => {
		service = new ProblemService();
	});

	describe('generateProblem', () => {
		it('should generate a counting problem', () => {
			const problem = service.generateProblem('counting', 1);
			expect(problem).not.toBeNull();
			expect(problem!.type).toBe('counting');
		});

		it('should generate an addition problem', () => {
			const problem = service.generateProblem('addition', 2);
			expect(problem).not.toBeNull();
			expect(problem!.type).toBe('addition');
		});

		it('should generate a subtraction problem', () => {
			const problem = service.generateProblem('subtraction', 1);
			expect(problem).not.toBeNull();
			expect(problem!.type).toBe('subtraction');
		});

		it('should generate a comparison problem', () => {
			const problem = service.generateProblem('comparison', 3);
			expect(problem).not.toBeNull();
			expect(problem!.type).toBe('comparison');
		});

		it('should generate a patterns problem', () => {
			const problem = service.generateProblem('patterns', 2);
			expect(problem).not.toBeNull();
			expect(problem!.type).toBe('patterns');
		});

		it('should track seen signatures', () => {
			const problem1 = service.generateProblem('counting', 1);
			expect(problem1).not.toBeNull();

			const signatures = service.getSeenSignatures();
			expect(signatures.size).toBe(1);
			expect(signatures.has(problem1!.signature)).toBe(true);
		});

		it('should not repeat problems immediately', () => {
			const seenSignatures = new Set<string>();

			// Generate multiple problems (using difficulty 2 which has 10 possible counting problems)
			// to avoid hitting the saturation threshold
			for (let i = 0; i < 5; i++) {
				const problem = service.generateProblem('counting', 2);
				expect(problem).not.toBeNull();
				expect(seenSignatures.has(problem!.signature)).toBe(false);
				seenSignatures.add(problem!.signature);
			}
		});
	});

	describe('generateAdventureProblems', () => {
		it('should generate the requested number of problems', () => {
			const difficulties = new Map<ProblemType, DifficultyLevel>([
				['counting', 1],
				['addition', 1],
				['subtraction', 1],
				['comparison', 1],
				['patterns', 1],
			]);

			const problems = service.generateAdventureProblems(5, difficulties);
			expect(problems.length).toBe(5);
		});

		it('should generate problems of various types', () => {
			const difficulties = new Map<ProblemType, DifficultyLevel>([
				['counting', 1],
				['addition', 1],
				['subtraction', 1],
				['comparison', 1],
				['patterns', 1],
			]);

			const problems = service.generateAdventureProblems(10, difficulties);
			const types = new Set(problems.map((p) => p.type));

			// Should have variety
			expect(types.size).toBeGreaterThan(1);
		});

		it('should use provided difficulties', () => {
			const difficulties = new Map<ProblemType, DifficultyLevel>([
				['counting', 3],
				['addition', 2],
				['subtraction', 1],
				['comparison', 4],
				['patterns', 2],
			]);

			const problems = service.generateAdventureProblems(20, difficulties);

			for (const problem of problems) {
				const expectedDifficulty = difficulties.get(problem.type);
				expect(problem.difficulty).toBe(expectedDifficulty);
			}
		});

		it('should default to difficulty 1 if not specified', () => {
			const difficulties = new Map<ProblemType, DifficultyLevel>();
			const problems = service.generateAdventureProblems(5, difficulties);

			for (const problem of problems) {
				expect(problem.difficulty).toBe(1);
			}
		});
	});

	describe('markAsSeen', () => {
		it('should add signature to seen set', () => {
			service.markAsSeen('test:signature:123');
			const signatures = service.getSeenSignatures();
			expect(signatures.has('test:signature:123')).toBe(true);
		});
	});

	describe('clearHistory', () => {
		it('should clear all seen signatures', () => {
			service.generateProblem('counting', 1);
			service.generateProblem('addition', 1);
			expect(service.getSeenSignatures().size).toBe(2);

			service.clearHistory();
			expect(service.getSeenSignatures().size).toBe(0);
		});
	});

	describe('loadSeenSignatures', () => {
		it('should load signatures from external source', () => {
			const savedSignatures = new Map<string, Date>([
				['counting:d1:5', new Date('2024-01-01')],
				['addition:d2:3+4', new Date('2024-01-02')],
			]);

			service.loadSeenSignatures(savedSignatures);
			const loaded = service.getSeenSignatures();

			expect(loaded.size).toBe(2);
			expect(loaded.has('counting:d1:5')).toBe(true);
			expect(loaded.has('addition:d2:3+4')).toBe(true);
		});
	});

	describe('saturation and eviction', () => {
		it('should evict old problems when saturation is high', () => {
			// Generate all possible counting problems at difficulty 1 (there are 5)
			const countingProblems: string[] = [];
			for (let i = 0; i < 5; i++) {
				const problem = service.generateProblem('counting', 1);
				if (problem) {
					countingProblems.push(problem.signature);
				}
			}

			// At this point all counting:d1 problems are seen
			// When we try to generate another, it should evict old ones
			const nextProblem = service.generateProblem('counting', 1);

			// Should still be able to generate (eviction happened)
			expect(nextProblem).not.toBeNull();
		});

		it('should allow problems to be regenerated after eviction', () => {
			// Fill up counting problems
			for (let i = 0; i < 5; i++) {
				service.generateProblem('counting', 1);
			}

			// Clear and regenerate
			service.clearHistory();

			// Should be able to generate all again
			for (let i = 0; i < 5; i++) {
				const problem = service.generateProblem('counting', 1);
				expect(problem).not.toBeNull();
			}
		});
	});
});
