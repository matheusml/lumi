import Foundation
import SwiftData

/// Manages daily adventure limits
@Observable
final class AdventureLimitService {
    private var modelContext: ModelContext?
    private(set) var todayCount: Int = 0
    private(set) var dailyLimit: Int? = nil

    /// Whether a daily limit is enabled
    var isLimitEnabled: Bool {
        dailyLimit != nil
    }

    var canStartAdventure: Bool {
        guard let limit = dailyLimit else { return true }
        return todayCount < limit
    }

    var adventuresRemaining: Int? {
        guard let limit = dailyLimit else { return nil }
        return max(0, limit - todayCount)
    }

    func configure(with context: ModelContext, limit: Int? = nil) {
        self.modelContext = context
        self.dailyLimit = limit
        loadTodayCount()
    }

    func updateLimit(_ newLimit: Int?) {
        if let limit = newLimit {
            dailyLimit = max(1, min(10, limit))
        } else {
            dailyLimit = nil
        }
    }

    func enableLimit(_ limit: Int = 3) {
        dailyLimit = max(1, min(10, limit))
    }

    func disableLimit() {
        dailyLimit = nil
    }

    private func loadTodayCount() {
        guard let context = modelContext else { return }

        let today = Calendar.current.startOfDay(for: Date())
        let descriptor = FetchDescriptor<DailyAdventureCount>(
            predicate: #Predicate { $0.date == today }
        )

        do {
            let results = try context.fetch(descriptor)
            if let todayRecord = results.first {
                todayCount = todayRecord.count
            } else {
                todayCount = 0
            }
        } catch {
            print("Error loading today's adventure count: \(error)")
            todayCount = 0
        }
    }

    func incrementCount() {
        guard let context = modelContext else { return }

        let today = Calendar.current.startOfDay(for: Date())
        let descriptor = FetchDescriptor<DailyAdventureCount>(
            predicate: #Predicate { $0.date == today }
        )

        do {
            let results = try context.fetch(descriptor)
            if let todayRecord = results.first {
                todayRecord.count += 1
                todayCount = todayRecord.count
            } else {
                let newRecord = DailyAdventureCount(date: today, count: 1)
                context.insert(newRecord)
                todayCount = 1
            }
            try context.save()
        } catch {
            print("Error incrementing adventure count: \(error)")
        }
    }

    func resetTodayCount() {
        guard let context = modelContext else { return }

        let today = Calendar.current.startOfDay(for: Date())
        let descriptor = FetchDescriptor<DailyAdventureCount>(
            predicate: #Predicate { $0.date == today }
        )

        do {
            let results = try context.fetch(descriptor)
            if let todayRecord = results.first {
                todayRecord.count = 0
            }
            todayCount = 0
            try context.save()
        } catch {
            print("Error resetting adventure count: \(error)")
        }
    }
}
