import XCTest
import SwiftData
@testable import Lumi

final class SwiftDataModelTests: XCTestCase {
    var modelContainer: ModelContainer!
    var modelContext: ModelContext!

    override func setUpWithError() throws {
        let schema = Schema([Child.self, Session.self, ActivityProgress.self, DailyAdventureCount.self, SeenProblem.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        modelContainer = try ModelContainer(for: schema, configurations: config)
        modelContext = ModelContext(modelContainer)
    }

    override func tearDownWithError() throws {
        modelContext = nil
        modelContainer = nil
    }

    // MARK: - Child Tests

    func testChildCreation() throws {
        let child = Child(name: "Test Child")
        modelContext.insert(child)
        try modelContext.save()

        let descriptor = FetchDescriptor<Child>()
        let children = try modelContext.fetch(descriptor)

        XCTAssertEqual(children.count, 1)
        XCTAssertEqual(children.first?.name, "Test Child")
    }

    func testChildDefaultValues() {
        let child = Child()

        XCTAssertEqual(child.dailyAdventureLimit, 3)
        XCTAssertEqual(child.preferredLanguage, "pt-BR")
        XCTAssertFalse(child.autoVoiceOverEnabled)
        XCTAssertTrue(child.activityProgress.isEmpty)
        XCTAssertTrue(child.sessions.isEmpty)
    }

    func testChildCustomValues() {
        let child = Child(
            name: "Custom Child",
            dailyAdventureLimit: 5,
            preferredLanguage: "en",
            autoVoiceOverEnabled: true
        )

        XCTAssertEqual(child.name, "Custom Child")
        XCTAssertEqual(child.dailyAdventureLimit, 5)
        XCTAssertEqual(child.preferredLanguage, "en")
        XCTAssertTrue(child.autoVoiceOverEnabled)
    }

    // MARK: - Session Tests

    func testSessionCreation() throws {
        let session = Session(subject: Subject.math.rawValue)
        modelContext.insert(session)
        try modelContext.save()

        let descriptor = FetchDescriptor<Session>()
        let sessions = try modelContext.fetch(descriptor)

        XCTAssertEqual(sessions.count, 1)
        XCTAssertEqual(sessions.first?.subject, "math")
    }

    func testSessionDefaultValues() {
        let session = Session()

        XCTAssertEqual(session.problemsCompleted, 0)
        XCTAssertEqual(session.problemsCorrect, 0)
        XCTAssertNil(session.endedAt)
        XCTAssertFalse(session.isComplete)
    }

    func testSessionIsComplete() {
        let session = Session(problemsCompleted: 5)
        XCTAssertTrue(session.isComplete)

        let incompleteSession = Session(problemsCompleted: 4)
        XCTAssertFalse(incompleteSession.isComplete)
    }

    func testSessionAccuracy() {
        let session = Session(problemsCompleted: 10, problemsCorrect: 7)
        XCTAssertEqual(session.accuracy, 0.7, accuracy: 0.001)
    }

    func testSessionAccuracyZeroProblems() {
        let session = Session(problemsCompleted: 0, problemsCorrect: 0)
        XCTAssertEqual(session.accuracy, 0)
    }

    // MARK: - ActivityProgress Tests

    func testActivityProgressCreation() throws {
        let progress = ActivityProgress(activityType: "counting")
        modelContext.insert(progress)
        try modelContext.save()

        let descriptor = FetchDescriptor<ActivityProgress>()
        let results = try modelContext.fetch(descriptor)

        XCTAssertEqual(results.count, 1)
        XCTAssertEqual(results.first?.activityType, "counting")
    }

    func testActivityProgressDefaultValues() {
        let progress = ActivityProgress(activityType: "addition")

        XCTAssertEqual(progress.currentDifficulty, 1)
        XCTAssertEqual(progress.problemsAttempted, 0)
        XCTAssertEqual(progress.problemsCorrect, 0)
        XCTAssertEqual(progress.consecutiveCorrect, 0)
        XCTAssertEqual(progress.consecutiveIncorrect, 0)
    }

    func testActivityProgressAccuracy() {
        let progress = ActivityProgress(
            activityType: "counting",
            problemsAttempted: 20,
            problemsCorrect: 15
        )

        XCTAssertEqual(progress.accuracy, 0.75, accuracy: 0.001)
        XCTAssertEqual(progress.accuracyPercentage, 75)
    }

    func testActivityProgressAccuracyZeroAttempts() {
        let progress = ActivityProgress(activityType: "counting")

        XCTAssertEqual(progress.accuracy, 0)
        XCTAssertEqual(progress.accuracyPercentage, 0)
    }

    // MARK: - DailyAdventureCount Tests

    func testDailyAdventureCountCreation() throws {
        let today = Calendar.current.startOfDay(for: Date())
        let count = DailyAdventureCount(date: today, count: 2)
        modelContext.insert(count)
        try modelContext.save()

        let descriptor = FetchDescriptor<DailyAdventureCount>()
        let results = try modelContext.fetch(descriptor)

        XCTAssertEqual(results.count, 1)
        XCTAssertEqual(results.first?.count, 2)
    }

    func testDailyAdventureCountIsToday() {
        let today = Calendar.current.startOfDay(for: Date())
        let todayCount = DailyAdventureCount(date: today, count: 1)

        XCTAssertTrue(todayCount.isToday)
    }

    func testDailyAdventureCountIsNotToday() {
        let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: Date())!
        let yesterdayStart = Calendar.current.startOfDay(for: yesterday)
        let yesterdayCount = DailyAdventureCount(date: yesterdayStart, count: 3)

        XCTAssertFalse(yesterdayCount.isToday)
    }

    func testDailyAdventureCountDefaultValues() {
        let count = DailyAdventureCount()

        XCTAssertEqual(count.count, 0)
        XCTAssertTrue(count.isToday)
    }

    // MARK: - Relationship Tests

    func testChildSessionRelationship() throws {
        let child = Child(name: "Test")
        let session = Session()

        modelContext.insert(child)
        modelContext.insert(session)

        child.sessions.append(session)
        try modelContext.save()

        let descriptor = FetchDescriptor<Child>()
        let children = try modelContext.fetch(descriptor)

        XCTAssertEqual(children.first?.sessions.count, 1)
    }

    func testChildActivityProgressRelationship() throws {
        let child = Child(name: "Test")
        let progress = ActivityProgress(activityType: "counting")

        modelContext.insert(child)
        modelContext.insert(progress)

        child.activityProgress.append(progress)
        try modelContext.save()

        let descriptor = FetchDescriptor<Child>()
        let children = try modelContext.fetch(descriptor)

        XCTAssertEqual(children.first?.activityProgress.count, 1)
        XCTAssertEqual(children.first?.activityProgress.first?.activityType, "counting")
    }

    // MARK: - SeenProblem Tests

    func testSeenProblemCreation() throws {
        let seen = SeenProblem(
            signature: "counting:d1:5",
            problemType: "counting",
            difficulty: 1
        )
        modelContext.insert(seen)
        try modelContext.save()

        let descriptor = FetchDescriptor<SeenProblem>()
        let results = try modelContext.fetch(descriptor)

        XCTAssertEqual(results.count, 1)
        XCTAssertEqual(results.first?.signature, "counting:d1:5")
        XCTAssertEqual(results.first?.problemType, "counting")
        XCTAssertEqual(results.first?.difficulty, 1)
    }

    func testSeenProblemHasSeenAtDate() {
        let before = Date()
        let seen = SeenProblem(
            signature: "addition:d2:3+4",
            problemType: "addition",
            difficulty: 2
        )
        let after = Date()

        XCTAssertGreaterThanOrEqual(seen.seenAt, before)
        XCTAssertLessThanOrEqual(seen.seenAt, after)
    }

    func testChildSeenProblemsRelationship() throws {
        let child = Child(name: "Test")
        let seen = SeenProblem(
            signature: "counting:d1:3",
            problemType: "counting",
            difficulty: 1
        )

        modelContext.insert(child)
        modelContext.insert(seen)

        child.seenProblems.append(seen)
        try modelContext.save()

        let descriptor = FetchDescriptor<Child>()
        let children = try modelContext.fetch(descriptor)

        XCTAssertEqual(children.first?.seenProblems.count, 1)
        XCTAssertEqual(children.first?.seenProblems.first?.signature, "counting:d1:3")
    }

    func testChildSeenProblemsCascadeDelete() throws {
        let child = Child(name: "Test")
        let seen = SeenProblem(
            signature: "counting:d1:3",
            problemType: "counting",
            difficulty: 1
        )

        modelContext.insert(child)
        modelContext.insert(seen)
        child.seenProblems.append(seen)
        try modelContext.save()

        // Delete child
        modelContext.delete(child)
        try modelContext.save()

        // SeenProblem should be deleted too (cascade)
        let descriptor = FetchDescriptor<SeenProblem>()
        let results = try modelContext.fetch(descriptor)
        XCTAssertEqual(results.count, 0)
    }
}
