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
        service.configure(with: modelContext)
    }

    override func tearDown() {
        service = nil
        modelContext = nil
        modelContainer = nil
        super.tearDown()
    }

    // MARK: - Initial State Tests (Unlimited by Default)

    func testInitialCountIsZero() {
        XCTAssertEqual(service.todayCount, 0)
    }

    func testDefaultDailyLimitIsUnlimited() {
        XCTAssertNil(service.dailyLimit, "Default should be unlimited (nil)")
        XCTAssertFalse(service.isLimitEnabled)
    }

    func testCanStartAdventureInitially() {
        XCTAssertTrue(service.canStartAdventure)
    }

    func testAdventuresRemainingIsNilWhenUnlimited() {
        XCTAssertNil(service.adventuresRemaining, "Should be nil when unlimited")
    }

    // MARK: - Increment Tests

    func testIncrementCount() {
        service.incrementCount()
        XCTAssertEqual(service.todayCount, 1)
    }

    func testMultipleIncrements() {
        service.incrementCount()
        service.incrementCount()
        XCTAssertEqual(service.todayCount, 2)
    }

    func testCanAlwaysStartWhenUnlimited() {
        // Increment many times - should still be able to start
        for _ in 0..<10 {
            service.incrementCount()
        }
        XCTAssertTrue(service.canStartAdventure, "Should always be able to start when unlimited")
    }

    // MARK: - Limit Enforcement Tests (when limit is enabled)

    func testCannotStartAdventureWhenLimitReached() {
        service.enableLimit(3)
        service.incrementCount()
        service.incrementCount()
        service.incrementCount()

        XCTAssertFalse(service.canStartAdventure)
        XCTAssertEqual(service.adventuresRemaining, 0)
    }

    func testAdventuresRemainingNeverNegative() {
        service.enableLimit(3)
        service.incrementCount()
        service.incrementCount()
        service.incrementCount()
        service.incrementCount() // Over the limit

        XCTAssertGreaterThanOrEqual(service.adventuresRemaining ?? 0, 0)
    }

    // MARK: - Enable/Disable Limit Tests

    func testEnableLimit() {
        XCTAssertFalse(service.isLimitEnabled)
        service.enableLimit(5)
        XCTAssertTrue(service.isLimitEnabled)
        XCTAssertEqual(service.dailyLimit, 5)
        XCTAssertEqual(service.adventuresRemaining, 5)
    }

    func testDisableLimit() {
        service.enableLimit(5)
        XCTAssertTrue(service.isLimitEnabled)

        service.disableLimit()
        XCTAssertFalse(service.isLimitEnabled)
        XCTAssertNil(service.dailyLimit)
        XCTAssertNil(service.adventuresRemaining)
    }

    func testUpdateLimitMinimumBound() {
        service.updateLimit(0)
        XCTAssertEqual(service.dailyLimit, 1, "Minimum limit should be 1")
    }

    func testUpdateLimitMaximumBound() {
        service.updateLimit(100)
        XCTAssertEqual(service.dailyLimit, 10, "Maximum limit should be 10")
    }

    func testUpdateLimitToNilDisablesLimit() {
        service.enableLimit(5)
        service.updateLimit(nil)
        XCTAssertNil(service.dailyLimit)
        XCTAssertFalse(service.isLimitEnabled)
    }

    func testUpdateLimitAffectsCanStartAdventure() {
        // Enable limit and use all 3 adventures
        service.enableLimit(3)
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
        service.enableLimit(3)
        service.incrementCount()
        service.incrementCount()
        XCTAssertEqual(service.todayCount, 2)

        service.resetTodayCount()
        XCTAssertEqual(service.todayCount, 0)
        XCTAssertTrue(service.canStartAdventure)
    }

    // MARK: - Custom Limit Configuration Tests

    func testConfigureWithCustomLimit() {
        // Reconfigure the existing service with a specific limit
        service.configure(with: modelContext, limit: 7)

        XCTAssertEqual(service.dailyLimit, 7)
        XCTAssertEqual(service.adventuresRemaining, 7)
        XCTAssertTrue(service.isLimitEnabled)
    }

    func testConfigureWithoutLimitIsUnlimited() {
        // First configure with a limit
        service.configure(with: modelContext, limit: 5)
        XCTAssertTrue(service.isLimitEnabled)

        // Then configure without a limit
        service.configure(with: modelContext)
        XCTAssertFalse(service.isLimitEnabled)
        XCTAssertNil(service.dailyLimit)
    }
}
