/**
 * Adventure Limit Service
 *
 * Tracks daily adventure counts to enforce healthy usage limits.
 */

import {
	DEFAULT_DAILY_LIMIT,
	DEFAULT_LIMIT_ENABLED,
	MAX_DAILY_LIMIT,
	MIN_DAILY_LIMIT
} from '$lib/types'

export interface DailyCount {
	date: string // ISO date string (YYYY-MM-DD)
	count: number
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
function getTodayString(): string {
	return new Date().toISOString().split('T')[0]
}

export class AdventureLimitService {
	private dailyCount: DailyCount = { date: getTodayString(), count: 0 }
	private dailyLimit: number = DEFAULT_DAILY_LIMIT
	private limitEnabled: boolean = DEFAULT_LIMIT_ENABLED

	/**
	 * Load state from storage
	 */
	loadState(data: { dailyCount?: DailyCount; dailyLimit?: number; limitEnabled?: boolean }): void {
		if (data.dailyCount) {
			this.dailyCount = data.dailyCount
		}
		if (data.dailyLimit !== undefined) {
			this.dailyLimit = data.dailyLimit
		}
		if (data.limitEnabled !== undefined) {
			this.limitEnabled = data.limitEnabled
		}

		// Reset count if it's a new day
		this.checkAndResetForNewDay()
	}

	/**
	 * Get state for persistence
	 */
	getState(): { dailyCount: DailyCount; dailyLimit: number; limitEnabled: boolean } {
		return {
			dailyCount: this.dailyCount,
			dailyLimit: this.dailyLimit,
			limitEnabled: this.limitEnabled
		}
	}

	/**
	 * Check if it's a new day and reset count if needed
	 */
	private checkAndResetForNewDay(): void {
		const today = getTodayString()
		if (this.dailyCount.date !== today) {
			this.dailyCount = { date: today, count: 0 }
		}
	}

	/**
	 * Check if more adventures are allowed today
	 */
	canStartAdventure(): boolean {
		this.checkAndResetForNewDay()

		if (!this.limitEnabled) {
			return true
		}

		return this.dailyCount.count < this.dailyLimit
	}

	/**
	 * Get remaining adventures for today
	 */
	getRemainingAdventures(): number {
		this.checkAndResetForNewDay()

		if (!this.limitEnabled) {
			return Infinity
		}

		return Math.max(0, this.dailyLimit - this.dailyCount.count)
	}

	/**
	 * Record a completed adventure
	 */
	recordAdventure(): void {
		this.checkAndResetForNewDay()
		this.dailyCount.count += 1
	}

	/**
	 * Get today's adventure count
	 */
	getTodayCount(): number {
		this.checkAndResetForNewDay()
		return this.dailyCount.count
	}

	/**
	 * Get the daily limit
	 */
	getDailyLimit(): number {
		return this.dailyLimit
	}

	/**
	 * Set the daily limit
	 */
	setDailyLimit(limit: number): void {
		this.dailyLimit = Math.max(MIN_DAILY_LIMIT, Math.min(MAX_DAILY_LIMIT, limit))
	}

	/**
	 * Check if limit is enabled
	 */
	isLimitEnabled(): boolean {
		return this.limitEnabled
	}

	/**
	 * Enable or disable the daily limit
	 */
	setLimitEnabled(enabled: boolean): void {
		this.limitEnabled = enabled
	}

	/**
	 * Reset today's count (for parent override)
	 */
	resetTodayCount(): void {
		this.dailyCount = { date: getTodayString(), count: 0 }
	}
}

// Singleton instance
export const adventureLimitService = new AdventureLimitService()
