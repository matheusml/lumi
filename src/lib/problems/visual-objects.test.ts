import { describe, it, expect } from 'vitest';
import {
	visualObjects,
	patternColors,
	getRandomObject,
	getRandomObjectFrom,
	shuffle,
} from './visual-objects';

describe('visualObjects', () => {
	it('should have at least 8 visual objects', () => {
		expect(visualObjects.length).toBeGreaterThanOrEqual(8);
	});

	it('should have required properties for each object', () => {
		for (const obj of visualObjects) {
			expect(obj.id).toBeDefined();
			expect(obj.emoji).toBeDefined();
			expect(obj.namePtBR).toBeDefined();
			expect(obj.nameEn).toBeDefined();
			expect(obj.singularPtBR).toBeDefined();
			expect(obj.quantifierPtBR).toBeDefined();
		}
	});

	it('should have unique IDs', () => {
		const ids = visualObjects.map((obj) => obj.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);
	});
});

describe('patternColors', () => {
	it('should have at least 4 pattern colors', () => {
		expect(patternColors.length).toBeGreaterThanOrEqual(4);
	});

	it('should have id and color for each pattern color', () => {
		for (const color of patternColors) {
			expect(color.id).toBeDefined();
			expect(color.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
		}
	});
});

describe('getRandomObject', () => {
	it('should return a visual object', () => {
		const obj = getRandomObject();
		expect(obj).toBeDefined();
		expect(obj.id).toBeDefined();
		expect(obj.emoji).toBeDefined();
	});

	it('should return objects from the visualObjects array', () => {
		for (let i = 0; i < 10; i++) {
			const obj = getRandomObject();
			expect(visualObjects).toContainEqual(obj);
		}
	});
});

describe('getRandomObjectFrom', () => {
	it('should return an object from the specified subset', () => {
		const subset = ['apple', 'star'];
		for (let i = 0; i < 10; i++) {
			const obj = getRandomObjectFrom(subset);
			expect(subset).toContain(obj.id);
		}
	});

	it('should return first object if no matching IDs', () => {
		const obj = getRandomObjectFrom(['nonexistent']);
		expect(obj).toBe(visualObjects[0]);
	});

	it('should work with single ID', () => {
		const obj = getRandomObjectFrom(['apple']);
		expect(obj.id).toBe('apple');
	});
});

describe('shuffle', () => {
	it('should return an array of the same length', () => {
		const input = [1, 2, 3, 4, 5];
		const result = shuffle(input);
		expect(result.length).toBe(input.length);
	});

	it('should contain all original elements', () => {
		const input = [1, 2, 3, 4, 5];
		const result = shuffle(input);
		for (const item of input) {
			expect(result).toContain(item);
		}
	});

	it('should not modify the original array', () => {
		const input = [1, 2, 3, 4, 5];
		const original = [...input];
		shuffle(input);
		expect(input).toEqual(original);
	});

	it('should handle empty arrays', () => {
		const result = shuffle([]);
		expect(result).toEqual([]);
	});

	it('should handle single-element arrays', () => {
		const result = shuffle([42]);
		expect(result).toEqual([42]);
	});

	it('should produce different orderings (probabilistic)', () => {
		const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const results = new Set<string>();

		for (let i = 0; i < 20; i++) {
			results.add(JSON.stringify(shuffle(input)));
		}

		// With high probability, we should get multiple different orderings
		expect(results.size).toBeGreaterThan(1);
	});
});
