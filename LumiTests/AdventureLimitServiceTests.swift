import XCTest
import SwiftData
@testable import Lumi

@MainActor
final class AdventureLimitServiceTests: XCTestCase {
    var service: AdventureLimitService!
    var modelContainer: ModelContainer!
    var modelContext: ModelContext!

    override func setUp() {
        super.setUp()
        let schema = Schema([DailyAdventureCount.self, ActivityProgress.self, Child.self, Session.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        modelContainer = try! ModelContainer(for: schema, configurations: config)
        modelContext = ModelContext(modelContainer)

        service = AdventureLimitService()
        service.configure(with: modelContext, limit: 3)
    }

    override func tearDown() {
        service = nil
        modelContext = nil
        modelContainer = nil
        super.tearDown()
    }

    // MARK: - Initial State Tests

    func testInitialCountIsZero() {
        XCTAssertEqual(service.todayCount, 0)
    }

    func testDefaultDailyLimitIsThree() {
        XCTAssertEqual(service.dailyLimit, 3)
    }

    func testCanStartAdventureInitially() {
        XCTAssertTrue(service.canStartAdventure)
    }

    func testAdventuresRemainingInitially() {
        XCTAssertEqual(service.adventuresRemaining, 3)
    }

    // MARK: - Increment Tests

    func testIncrementCount() {
        service.incrementCount()
        XCTAssertEqual(service.todayCount, 1)
        XCTAssertEqual(service.adventuresRemaining, 2)
    }

    func testMultipleIncrements() {
        service.incrementCount()
        service.incrementCount()
        XCTAssertEqual(service.todayCount, 2)
        XCTAssertEqual(service.adventuresRemaining, 1)
    }

    // MARK: - Limit Enforcement Tests

    func testCannotStartAdventureWhenLimitReached() {
        service.incrementCount()
        service.incrementCount()
        service.incrementCount()

        XCTAssertFalse(service.canStartAdventure)
        XCTAssertEqual(service.adventuresRemaining, 0)
    }

    func testAdventuresRemainingNeverNegative() {
        service.incrementCount()
        service.incrementCount()
        service.incrementCount()
        service.incrementCount() // Over the limit

        XCTAssertGreaterThanOrEqual(service.adventuresRemaining, 0)
    }

    // MARK: - Update Limit Tests

    func testUpdateLimit() {
        service.updateLimit(5)
        XCTAssertEqual(service.dailyLimit, 5)
        XCTAssertEqual(service.adventuresRemaining, 5)
    }

    func testUpdateLimitMinimumBound() {
        service.updateLimit(0)
        XCTAssertEqual(service.dailyLimit, 1, "Minimum limit should be 1")
    }

    func testUpdateLimitMaximumBound() {
        service.updateLimit(100)
        XCTAssertEqual(service.dailyLimit, 10, "Maximum limit should be 10")
    }

    func testUpdateLimitAffectsCanStartAdventure() {
        // Use all 3 adventures
        service.incrementCount()
        service.incrementCount()
        service.incrementCount()
        XCTAssertFalse(service.canStartAdventure)

        // Increase limit
        service.updateLimit(5)
        XCTAssertTrue(service.canStartAdventure)
        XCTAssertEqual(service.adventuresRemaining, 2)
    }

    // MARK: - Reset Tests

    func testResetTodayCount() {
        service.incrementCount()
        service.incrementCount()
        XCTAssertEqual(service.todayCount, 2)

        service.resetTodayCount()
        XCTAssertEqual(service.todayCount, 0)
        XCTAssertTrue(service.canStartAdventure)
    }

    // MARK: - Custom Limit Configuration Tests

    func testConfigureWithCustomLimit() {
        // Reconfigure the existing service with a different limit
        service.configure(with: modelContext, limit: 7)

        XCTAssertEqual(service.dailyLimit, 7)
        XCTAssertEqual(service.adventuresRemaining, 7)
    }
}
