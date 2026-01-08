import Foundation
import SwiftData

/// Manages daily adventure limits
@Observable
final class AdventureLimitService {
    private var modelContext: ModelContext?
    private(set) var todayCount: Int = 0
    private(set) var dailyLimit: Int = 3

    var canStartAdventure: Bool {
        todayCount < dailyLimit
    }

    var adventuresRemaining: Int {
        max(0, dailyLimit - todayCount)
    }

    func configure(with context: ModelContext, limit: Int = 3) {
        self.modelContext = context
        self.dailyLimit = limit
        loadTodayCount()
    }

    func updateLimit(_ newLimit: Int) {
        dailyLimit = max(1, min(10, newLimit))
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
