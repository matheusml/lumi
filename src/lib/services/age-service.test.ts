import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
	AgeService,
	DEFAULT_AGE,
	MIN_AGE,
	MAX_AGE,
	VALID_AGES,
	AGE_DIFFICULTY_MAP,
	type ChildAge
} from './age-service'

describe('AgeService', () => {
	let service: AgeService

	beforeEach(() => {
		service = new AgeService()
		// Clear any localStorage mocks
		vi.stubGlobal('localStorage', {
			getItem: vi.fn(),
			setItem: vi.fn(),
			removeItem: vi.fn(),
			clear: vi.fn()
		})
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	describe('initialization', () => {
		it('should initialize with default age', () => {
			expect(service.getAge()).toBe(DEFAULT_AGE)
		})

		it('should have correct default age constant', () => {
			expect(DEFAULT_AGE).toBe(5)
		})

		it('should have correct age range constants', () => {
			expect(MIN_AGE).toBe(3)
			expect(MAX_AGE).toBe(7)
		})

		it('should have all valid ages defined', () => {
			expect(VALID_AGES).toEqual([3, 4, 5, 6, 7])
		})
	})

	describe('setAge', () => {
		it('should set valid ages', () => {
			for (const age of VALID_AGES) {
				service.setAge(age)
				expect(service.getAge()).toBe(age)
			}
		})

		it('should ignore invalid ages', () => {
			service.setAge(5)
			expect(service.getAge()).toBe(5)

			// Try to set invalid age
			service.setAge(2 as ChildAge)
			expect(service.getAge()).toBe(5) // Unchanged

			service.setAge(8 as ChildAge)
			expect(service.getAge()).toBe(5) // Unchanged

			service.setAge(0 as ChildAge)
			expect(service.getAge()).toBe(5) // Unchanged
		})

		it('should save to localStorage when age changes', () => {
			service.setAge(4)
			expect(localStorage.setItem).toHaveBeenCalledWith('lumi-age', JSON.stringify({ age: 4 }))
		})
	})

	describe('getStartingDifficulty', () => {
		it('should return difficulty 1 for ages 3-4', () => {
			service.setAge(3)
			expect(service.getStartingDifficulty()).toBe(1)

			service.setAge(4)
			expect(service.getStartingDifficulty()).toBe(1)
		})

		it('should return difficulty 2 for ages 5-6', () => {
			service.setAge(5)
			expect(service.getStartingDifficulty()).toBe(2)

			service.setAge(6)
			expect(service.getStartingDifficulty()).toBe(2)
		})

		it('should return difficulty 3 for age 7', () => {
			service.setAge(7)
			expect(service.getStartingDifficulty()).toBe(3)
		})

		it('should have correct difficulty map', () => {
			expect(AGE_DIFFICULTY_MAP).toEqual({
				3: 1,
				4: 1,
				5: 2,
				6: 2,
				7: 3
			})
		})
	})

	describe('subscribe', () => {
		it('should notify subscribers when age changes', () => {
			const callback = vi.fn()
			service.subscribe(callback)

			service.setAge(4)
			expect(callback).toHaveBeenCalledWith(4)

			service.setAge(7)
			expect(callback).toHaveBeenCalledWith(7)
		})

		it('should allow unsubscribing', () => {
			const callback = vi.fn()
			const unsubscribe = service.subscribe(callback)

			service.setAge(4)
			expect(callback).toHaveBeenCalledTimes(1)

			unsubscribe()

			service.setAge(6)
			expect(callback).toHaveBeenCalledTimes(1) // Not called again
		})

		it('should support multiple subscribers', () => {
			const callback1 = vi.fn()
			const callback2 = vi.fn()

			service.subscribe(callback1)
			service.subscribe(callback2)

			service.setAge(3)

			expect(callback1).toHaveBeenCalledWith(3)
			expect(callback2).toHaveBeenCalledWith(3)
		})
	})

	describe('persistence', () => {
		it('should get state for persistence', () => {
			service.setAge(6)
			const state = service.getState()
			expect(state).toEqual({ age: 6 })
		})

		it('should load state from storage', () => {
			service.loadState({ age: 4 })
			expect(service.getAge()).toBe(4)
		})

		it('should handle invalid age in loaded state', () => {
			service.loadState({ age: 10 })
			expect(service.getAge()).toBe(DEFAULT_AGE) // Unchanged from default
		})

		it('should handle missing age in loaded state', () => {
			service.loadState({})
			expect(service.getAge()).toBe(DEFAULT_AGE)
		})

		it('should handle undefined data', () => {
			service.loadState({ age: undefined })
			expect(service.getAge()).toBe(DEFAULT_AGE)
		})
	})
})
