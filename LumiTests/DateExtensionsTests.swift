import XCTest
@testable import Lumi

final class DateExtensionsTests: XCTestCase {

    // MARK: - startOfDay Tests

    func testStartOfDay() {
        let calendar = Calendar.current
        let date = Date()
        let startOfDay = date.startOfDay

        let components = calendar.dateComponents([.hour, .minute, .second], from: startOfDay)

        XCTAssertEqual(components.hour, 0)
        XCTAssertEqual(components.minute, 0)
        XCTAssertEqual(components.second, 0)
    }

    func testStartOfDayPreservesDate() {
        let calendar = Calendar.current
        let date = Date()
        let startOfDay = date.startOfDay

        XCTAssertTrue(calendar.isDate(date, inSameDayAs: startOfDay))
    }

    // MARK: - isToday Tests

    func testIsTodayForCurrentDate() {
        let today = Date()
        XCTAssertTrue(today.isToday)
    }

    func testIsTodayForYesterday() {
        let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: Date())!
        XCTAssertFalse(yesterday.isToday)
    }

    func testIsTodayForTomorrow() {
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date())!
        XCTAssertFalse(tomorrow.isToday)
    }

    // MARK: - isYesterday Tests

    func testIsYesterdayForYesterday() {
        let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: Date())!
        XCTAssertTrue(yesterday.isYesterday)
    }

    func testIsYesterdayForToday() {
        let today = Date()
        XCTAssertFalse(today.isYesterday)
    }

    func testIsYesterdayForTwoDaysAgo() {
        let twoDaysAgo = Calendar.current.date(byAdding: .day, value: -2, to: Date())!
        XCTAssertFalse(twoDaysAgo.isYesterday)
    }

    // MARK: - formatted Tests

    func testFormattedShortStyle() {
        let date = Date()
        let formatted = date.formatted(style: .short)

        // Should return a non-empty string
        XCTAssertFalse(formatted.isEmpty)
    }

    func testFormattedMediumStyle() {
        let date = Date()
        let formatted = date.formatted(style: .medium)

        XCTAssertFalse(formatted.isEmpty)
    }

    func testFormattedLongStyle() {
        let date = Date()
        let formatted = date.formatted(style: .long)

        XCTAssertFalse(formatted.isEmpty)
        // Long style should be longer than short
        XCTAssertGreaterThan(formatted.count, date.formatted(style: .short).count)
    }

    // MARK: - Calendar.isSameDay Tests

    func testIsSameDayForSameDate() {
        let date = Date()
        XCTAssertTrue(Calendar.current.isSameDay(date, date))
    }

    func testIsSameDayForDifferentTimeSameDay() {
        let calendar = Calendar.current
        let date1 = calendar.date(bySettingHour: 9, minute: 0, second: 0, of: Date())!
        let date2 = calendar.date(bySettingHour: 21, minute: 30, second: 0, of: Date())!

        XCTAssertTrue(calendar.isSameDay(date1, date2))
    }

    func testIsSameDayForDifferentDays() {
        let today = Date()
        let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: today)!

        XCTAssertFalse(Calendar.current.isSameDay(today, yesterday))
    }

    func testIsSameDayForStartOfDay() {
        let date = Date()
        let startOfDay = date.startOfDay

        XCTAssertTrue(Calendar.current.isSameDay(date, startOfDay))
    }
}
