import XCTest
import SwiftData
@testable import Lumi

@MainActor
final class DifficultyManagerTests: XCTestCase {
    var manager: DifficultyManager!
    var modelContainer: ModelContainer!
    var modelContext: ModelContext!

    override func setUp() {
        super.setUp()
        let schema = Schema([ActivityProgress.self, Child.self, Session.self, DailyAdventureCount.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        modelContainer = try! ModelContainer(for: schema, configurations: config)
        modelContext = ModelContext(modelContainer)

        manager = DifficultyManager()
        manager.configure(with: modelContext)
    }

    override func tearDown() {
        manager = nil
        modelContext = nil
        modelContainer = nil
        super.tearDown()
    }

    // MARK: - Initial State Tests

    func testInitialDifficultyIsMinimum() {
        let difficulty = manager.getDifficulty(for: "counting")
        XCTAssertEqual(difficulty, DifficultyManager.minDifficulty)
    }

    func testDifficultyForUnknownActivityTypeReturnsMinimum() {
        let difficulty = manager.getDifficulty(for: "unknown_activity")
        XCTAssertEqual(difficulty, DifficultyManager.minDifficulty)
    }

    // MARK: - Level Up Tests

    func testLevelUpAfterThreeCorrectAnswers() {
        let activityType = "counting"

        // First two correct answers shouldn't level up
        var level = manager.recordAnswer(correct: true, for: activityType)
        XCTAssertEqual(level, 1)

        level = manager.recordAnswer(correct: true, for: activityType)
        XCTAssertEqual(level, 1)

        // Third correct answer should level up
        level = manager.recordAnswer(correct: true, for: activityType)
        XCTAssertEqual(level, 2)
    }

    func testLevelUpResetsStreak() {
        let activityType = "addition"

        // Level up to 2
        manager.recordAnswer(correct: true, for: activityType)
        manager.recordAnswer(correct: true, for: activityType)
        manager.recordAnswer(correct: true, for: activityType)

        // Next two correct answers shouldn't level up (streak reset)
        var level = manager.recordAnswer(correct: true, for: activityType)
        XCTAssertEqual(level, 2)

        level = manager.recordAnswer(correct: true, for: activityType)
        XCTAssertEqual(level, 2)

        // Third correct answer should level up to 3
        level = manager.recordAnswer(correct: true, for: activityType)
        XCTAssertEqual(level, 3)
    }

    func testMaxDifficultyBound() {
        let activityType = "subtraction"

        // Level up multiple times to reach max
        for _ in 0..<20 {
            manager.recordAnswer(correct: true, for: activityType)
        }

        let difficulty = manager.getDifficulty(for: activityType)
        XCTAssertEqual(difficulty, DifficultyManager.maxDifficulty)
        XCTAssertLessThanOrEqual(difficulty, 4)
    }

    // MARK: - Level Down Tests

    func testLevelDownAfterTwoIncorrectAnswers() {
        let activityType = "comparison"

        // First, level up to 2
        manager.recordAnswer(correct: true, for: activityType)
        manager.recordAnswer(correct: true, for: activityType)
        manager.recordAnswer(correct: true, for: activityType)
        XCTAssertEqual(manager.getDifficulty(for: activityType), 2)

        // One incorrect shouldn't level down
        var level = manager.recordAnswer(correct: false, for: activityType)
        XCTAssertEqual(level, 2)

        // Second incorrect should level down
        level = manager.recordAnswer(correct: false, for: activityType)
        XCTAssertEqual(level, 1)
    }

    func testMinDifficultyBound() {
        let activityType = "patterns"

        // Try to level down from minimum
        manager.recordAnswer(correct: false, for: activityType)
        manager.recordAnswer(correct: false, for: activityType)

        let difficulty = manager.getDifficulty(for: activityType)
        XCTAssertEqual(difficulty, DifficultyManager.minDifficulty)
        XCTAssertGreaterThanOrEqual(difficulty, 1)
    }

    // MARK: - Streak Reset Tests

    func testCorrectAnswerResetsIncorrectStreak() {
        let activityType = "counting"

        // Level up first
        manager.recordAnswer(correct: true, for: activityType)
        manager.recordAnswer(correct: true, for: activityType)
        manager.recordAnswer(correct: true, for: activityType)
        XCTAssertEqual(manager.getDifficulty(for: activityType), 2)

        // One incorrect
        manager.recordAnswer(correct: false, for: activityType)

        // Correct answer should reset incorrect streak
        manager.recordAnswer(correct: true, for: activityType)

        // One more incorrect shouldn't level down (streak was reset)
        let level = manager.recordAnswer(correct: false, for: activityType)
        XCTAssertEqual(level, 2)
    }

    func testIncorrectAnswerResetsCorrectStreak() {
        let activityType = "addition"

        // Two correct answers
        manager.recordAnswer(correct: true, for: activityType)
        manager.recordAnswer(correct: true, for: activityType)

        // Incorrect should reset correct streak
        manager.recordAnswer(correct: false, for: activityType)

        // Two more correct shouldn't level up
        manager.recordAnswer(correct: true, for: activityType)
        let level = manager.recordAnswer(correct: true, for: activityType)
        XCTAssertEqual(level, 1)
    }

    // MARK: - Problem Type API Tests

    func testGetDifficultyWithProblemType() {
        let difficulty = manager.getDifficulty(for: ProblemType.counting)
        XCTAssertEqual(difficulty, DifficultyManager.minDifficulty)
    }

    func testRecordAnswerWithProblemType() {
        manager.recordAnswer(correct: true, for: ProblemType.addition)
        manager.recordAnswer(correct: true, for: ProblemType.addition)
        let level = manager.recordAnswer(correct: true, for: ProblemType.addition)
        XCTAssertEqual(level, 2)
    }

    // MARK: - Independent Activity Types Tests

    func testDifferentActivityTypesAreIndependent() {
        // Level up counting
        manager.recordAnswer(correct: true, for: "counting")
        manager.recordAnswer(correct: true, for: "counting")
        manager.recordAnswer(correct: true, for: "counting")

        // Addition should still be at level 1
        XCTAssertEqual(manager.getDifficulty(for: "counting"), 2)
        XCTAssertEqual(manager.getDifficulty(for: "addition"), 1)
    }
}
