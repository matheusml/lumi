import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AdventureLimitService } from './adventure-limit';
import { DEFAULT_DAILY_LIMIT, MAX_DAILY_LIMIT, MIN_DAILY_LIMIT } from '$lib/types';

describe('AdventureLimitService', () => {
	let service: AdventureLimitService;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-15T10:00:00'));
		service = new AdventureLimitService();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('initialization', () => {
		it('should initialize with default daily limit', () => {
			expect(service.getDailyLimit()).toBe(DEFAULT_DAILY_LIMIT);
		});

		it('should start with zero adventures today', () => {
			expect(service.getTodayCount()).toBe(0);
		});

		it('should allow adventures when starting fresh', () => {
			expect(service.canStartAdventure()).toBe(true);
		});

		it('should have remaining adventures equal to limit', () => {
			expect(service.getRemainingAdventures()).toBe(DEFAULT_DAILY_LIMIT);
		});

		it('should have limit enabled by default', () => {
			expect(service.isLimitEnabled()).toBe(true);
		});
	});

	describe('recordAdventure', () => {
		it('should increment today count when recording adventure', () => {
			expect(service.getTodayCount()).toBe(0);

			service.recordAdventure();
			expect(service.getTodayCount()).toBe(1);

			service.recordAdventure();
			expect(service.getTodayCount()).toBe(2);
		});

		it('should decrease remaining adventures', () => {
			expect(service.getRemainingAdventures()).toBe(DEFAULT_DAILY_LIMIT);

			service.recordAdventure();
			expect(service.getRemainingAdventures()).toBe(DEFAULT_DAILY_LIMIT - 1);
		});
	});

	describe('canStartAdventure', () => {
		it('should return true when under limit', () => {
			expect(service.canStartAdventure()).toBe(true);

			service.recordAdventure();
			expect(service.canStartAdventure()).toBe(true);
		});

		it('should return false when at limit', () => {
			for (let i = 0; i < DEFAULT_DAILY_LIMIT; i++) {
				service.recordAdventure();
			}
			expect(service.canStartAdventure()).toBe(false);
		});

		it('should always return true when limit is disabled', () => {
			// Reach the limit
			for (let i = 0; i < DEFAULT_DAILY_LIMIT; i++) {
				service.recordAdventure();
			}
			expect(service.canStartAdventure()).toBe(false);

			// Disable limit
			service.setLimitEnabled(false);
			expect(service.canStartAdventure()).toBe(true);
		});
	});

	describe('getRemainingAdventures', () => {
		it('should return correct remaining count', () => {
			expect(service.getRemainingAdventures()).toBe(3);

			service.recordAdventure();
			expect(service.getRemainingAdventures()).toBe(2);

			service.recordAdventure();
			expect(service.getRemainingAdventures()).toBe(1);

			service.recordAdventure();
			expect(service.getRemainingAdventures()).toBe(0);
		});

		it('should never return negative', () => {
			for (let i = 0; i < DEFAULT_DAILY_LIMIT + 2; i++) {
				service.recordAdventure();
			}
			expect(service.getRemainingAdventures()).toBe(0);
		});

		it('should return Infinity when limit is disabled', () => {
			service.setLimitEnabled(false);
			expect(service.getRemainingAdventures()).toBe(Infinity);
		});
	});

	describe('daily reset', () => {
		it('should reset count on new day', () => {
			// Record adventures today
			service.recordAdventure();
			service.recordAdventure();
			expect(service.getTodayCount()).toBe(2);

			// Move to next day
			vi.setSystemTime(new Date('2024-01-16T10:00:00'));

			// Count should reset
			expect(service.getTodayCount()).toBe(0);
			expect(service.canStartAdventure()).toBe(true);
		});

		it('should reset remaining adventures on new day', () => {
			// Use all adventures
			for (let i = 0; i < DEFAULT_DAILY_LIMIT; i++) {
				service.recordAdventure();
			}
			expect(service.getRemainingAdventures()).toBe(0);

			// Move to next day
			vi.setSystemTime(new Date('2024-01-16T10:00:00'));

			expect(service.getRemainingAdventures()).toBe(DEFAULT_DAILY_LIMIT);
		});
	});

	describe('setDailyLimit', () => {
		it('should allow setting daily limit', () => {
			service.setDailyLimit(5);
			expect(service.getDailyLimit()).toBe(5);
		});

		it('should clamp to MIN_DAILY_LIMIT', () => {
			service.setDailyLimit(0);
			expect(service.getDailyLimit()).toBe(MIN_DAILY_LIMIT);

			service.setDailyLimit(-5);
			expect(service.getDailyLimit()).toBe(MIN_DAILY_LIMIT);
		});

		it('should clamp to MAX_DAILY_LIMIT', () => {
			service.setDailyLimit(100);
			expect(service.getDailyLimit()).toBe(MAX_DAILY_LIMIT);
		});

		it('should update remaining adventures when limit changes', () => {
			service.recordAdventure();
			expect(service.getRemainingAdventures()).toBe(2); // 3 - 1

			service.setDailyLimit(5);
			expect(service.getRemainingAdventures()).toBe(4); // 5 - 1
		});
	});

	describe('limit toggle', () => {
		it('should enable and disable limit', () => {
			expect(service.isLimitEnabled()).toBe(true);

			service.setLimitEnabled(false);
			expect(service.isLimitEnabled()).toBe(false);

			service.setLimitEnabled(true);
			expect(service.isLimitEnabled()).toBe(true);
		});
	});

	describe('resetTodayCount', () => {
		it('should reset today count to zero', () => {
			service.recordAdventure();
			service.recordAdventure();
			expect(service.getTodayCount()).toBe(2);

			service.resetTodayCount();
			expect(service.getTodayCount()).toBe(0);
		});

		it('should restore remaining adventures', () => {
			for (let i = 0; i < DEFAULT_DAILY_LIMIT; i++) {
				service.recordAdventure();
			}
			expect(service.getRemainingAdventures()).toBe(0);

			service.resetTodayCount();
			expect(service.getRemainingAdventures()).toBe(DEFAULT_DAILY_LIMIT);
		});
	});

	describe('persistence', () => {
		it('should get state for persistence', () => {
			service.recordAdventure();
			service.setDailyLimit(5);
			service.setLimitEnabled(false);

			const state = service.getState();
			expect(state.dailyCount.count).toBe(1);
			expect(state.dailyLimit).toBe(5);
			expect(state.limitEnabled).toBe(false);
		});

		it('should load state from storage', () => {
			const savedState = {
				dailyCount: { date: '2024-01-15', count: 2 },
				dailyLimit: 4,
				limitEnabled: true,
			};

			service.loadState(savedState);

			expect(service.getTodayCount()).toBe(2);
			expect(service.getDailyLimit()).toBe(4);
			expect(service.isLimitEnabled()).toBe(true);
		});

		it('should reset count when loading old date', () => {
			// Load state from yesterday
			const savedState = {
				dailyCount: { date: '2024-01-14', count: 2 },
				dailyLimit: 3,
				limitEnabled: true,
			};

			service.loadState(savedState);

			// Count should reset for today
			expect(service.getTodayCount()).toBe(0);
		});

		it('should handle partial state load', () => {
			const partialState = {
				dailyLimit: 7,
			};

			service.loadState(partialState);

			expect(service.getDailyLimit()).toBe(7);
			expect(service.getTodayCount()).toBe(0); // Unchanged
			expect(service.isLimitEnabled()).toBe(true); // Unchanged
		});
	});
});
