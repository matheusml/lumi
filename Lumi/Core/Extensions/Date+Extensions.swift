import Foundation

extension Date {
    /// Returns the start of the day for this date
    var startOfDay: Date {
        Calendar.current.startOfDay(for: self)
    }

    /// Check if this date is today
    var isToday: Bool {
        Calendar.current.isDateInToday(self)
    }

    /// Check if this date is yesterday
    var isYesterday: Bool {
        Calendar.current.isDateInYesterday(self)
    }

    /// Format date for display
    func formatted(style: DateFormatter.Style) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = style
        formatter.locale = Locale(identifier: "pt-BR")
        return formatter.string(from: self)
    }
}

extension Calendar {
    /// Check if two dates are on the same day
    func isSameDay(_ date1: Date, _ date2: Date) -> Bool {
        isDate(date1, inSameDayAs: date2)
    }
}
