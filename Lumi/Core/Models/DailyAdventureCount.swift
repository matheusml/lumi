import Foundation
import SwiftData

@Model
final class DailyAdventureCount {
    var date: Date
    var count: Int

    init(date: Date = Calendar.current.startOfDay(for: Date()), count: Int = 0) {
        self.date = date
        self.count = count
    }

    /// Check if this record is for today
    var isToday: Bool {
        Calendar.current.isDateInToday(date)
    }
}
