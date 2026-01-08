import XCTest
@testable import Lumi

@MainActor
final class ProblemServiceTests: XCTestCase {
    var service: ProblemService!

    override func setUp() {
        super.setUp()
        service = ProblemService()
    }

    override func tearDown() {
        service = nil
        super.tearDown()
    }

    // MARK: - Problem Loading Tests

    func testServiceInitializesWithProblems() {
        // Service should have problems after initialization
        let problems = service.getAdventureProblems(difficulty: 1)
        XCTAssertFalse(problems.isEmpty, "Service should have problems available")
    }

    // MARK: - Get Problems Tests

    func testGetProblemsForType() {
        let countingProblems = service.getProblems(type: .counting, difficulty: 1, count: 3)

        XCTAssertLessThanOrEqual(countingProblems.count, 3)
        for problem in countingProblems {
            XCTAssertEqual(problem.type, "counting")
        }
    }

    func testGetProblemsRespectsCount() {
        let problems = service.getProblems(type: .addition, difficulty: 1, count: 2)
        XCTAssertLessThanOrEqual(problems.count, 2)
    }

    func testGetProblemsForDifferentDifficulties() {
        let easyProblems = service.getProblems(type: .counting, difficulty: 1, count: 5)
        let hardProblems = service.getProblems(type: .counting, difficulty: 4, count: 5)

        // Both should return problems (either matching difficulty or fallback)
        XCTAssertFalse(easyProblems.isEmpty || hardProblems.isEmpty, "Should return problems for all difficulties")
    }

    // MARK: - Random Problems Tests

    func testGetRandomProblems() {
        let problems = service.getRandomProblems(count: 5, difficulty: 1)
        XCTAssertEqual(problems.count, 5)
    }

    func testRandomProblemsContainVariousTypes() {
        // Get many problems to increase chance of variety
        let problems = service.getRandomProblems(count: 20, difficulty: 1)
        let types = Set(problems.map { $0.type })

        // Should have at least 2 different types
        XCTAssertGreaterThan(types.count, 1, "Random problems should include various types")
    }

    // MARK: - Adventure Problems Tests

    func testGetAdventureProblemsReturns5Problems() {
        let problems = service.getAdventureProblems(difficulty: 1)
        XCTAssertEqual(problems.count, 5)
    }

    func testAdventureProblemsHaveRequiredFields() {
        let problems = service.getAdventureProblems(difficulty: 1)

        for problem in problems {
            XCTAssertFalse(problem.id.isEmpty, "Problem should have an ID")
            XCTAssertFalse(problem.type.isEmpty, "Problem should have a type")
            XCTAssertGreaterThan(problem.difficulty, 0, "Difficulty should be positive")
            XCTAssertFalse(problem.prompt.ptBR.isEmpty, "Problem should have a prompt")
        }
    }

    // MARK: - Problem Type Tests

    func testAllProblemTypesAvailable() {
        for problemType in ProblemType.allCases {
            let problems = service.getProblems(type: problemType, difficulty: 1, count: 1)
            XCTAssertFalse(problems.isEmpty, "\(problemType.rawValue) problems should be available")
        }
    }

    // MARK: - Problem Content Tests

    func testCountingProblemHasCorrectStructure() {
        let problems = service.getProblems(type: .counting, difficulty: 1, count: 1)
        guard let problem = problems.first else {
            XCTFail("Should have at least one counting problem")
            return
        }

        XCTAssertEqual(problem.type, "counting")
        XCTAssertNotNil(problem.correctAnswer.intValue, "Counting problem should have numeric answer")
    }

    func testAdditionProblemHasCorrectStructure() {
        let problems = service.getProblems(type: .addition, difficulty: 1, count: 1)
        guard let problem = problems.first else {
            XCTFail("Should have at least one addition problem")
            return
        }

        XCTAssertEqual(problem.type, "addition")
        XCTAssertNotNil(problem.correctAnswer.intValue, "Addition problem should have numeric answer")
    }

    func testSubtractionProblemHasCorrectStructure() {
        let problems = service.getProblems(type: .subtraction, difficulty: 1, count: 1)
        guard let problem = problems.first else {
            XCTFail("Should have at least one subtraction problem")
            return
        }

        XCTAssertEqual(problem.type, "subtraction")
        XCTAssertNotNil(problem.correctAnswer.intValue, "Subtraction problem should have numeric answer")
    }

    func testComparisonProblemHasCorrectStructure() {
        let problems = service.getProblems(type: .comparison, difficulty: 1, count: 1)
        guard let problem = problems.first else {
            XCTFail("Should have at least one comparison problem")
            return
        }

        XCTAssertEqual(problem.type, "comparison")
        XCTAssertNotNil(problem.correctAnswer.stringValue, "Comparison problem should have string answer")
        XCTAssertTrue(
            problem.correctAnswer.stringValue == "left" || problem.correctAnswer.stringValue == "right",
            "Comparison answer should be 'left' or 'right'"
        )
    }

    func testPatternProblemHasCorrectStructure() {
        let problems = service.getProblems(type: .patterns, difficulty: 1, count: 1)
        guard let problem = problems.first else {
            XCTFail("Should have at least one pattern problem")
            return
        }

        XCTAssertEqual(problem.type, "patterns")
    }
}
