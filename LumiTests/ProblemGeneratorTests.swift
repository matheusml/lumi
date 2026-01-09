import XCTest
@testable import Lumi

final class ProblemGeneratorTests: XCTestCase {

    // MARK: - Counting Generator Tests

    func testCountingGeneratorCreatesValidProblems() {
        let generator = CountingProblemGenerator()

        for difficulty in 1...4 {
            guard let (problem, _) = generator.generate(difficulty: difficulty, excluding: []) else {
                XCTFail("Generator should produce a problem for difficulty \(difficulty)")
                continue
            }

            XCTAssertEqual(problem.type, "counting")
            XCTAssertEqual(problem.difficulty, difficulty)
            XCTAssertNotNil(problem.correctAnswer.intValue)
        }
    }

    func testCountingGeneratorRespectsExclusions() {
        let generator = CountingProblemGenerator()
        let allSignatures = Set(generator.allPossibleSignatures(difficulty: 1))

        // If we exclude all, we should get nil
        let result = generator.generate(difficulty: 1, excluding: allSignatures)
        XCTAssertNil(result, "Should return nil when all signatures are excluded")
    }

    func testCountingGeneratorSignatureFormat() {
        let generator = CountingProblemGenerator()
        guard let (_, signature) = generator.generate(difficulty: 1, excluding: []) else {
            XCTFail("Should generate a problem")
            return
        }

        XCTAssertTrue(signature.hasPrefix("counting:d1:"), "Signature should have correct format")
    }

    // MARK: - Addition Generator Tests

    func testAdditionGeneratorCreatesValidProblems() {
        let generator = AdditionProblemGenerator()

        for difficulty in 1...4 {
            guard let (problem, _) = generator.generate(difficulty: difficulty, excluding: []) else {
                XCTFail("Generator should produce a problem for difficulty \(difficulty)")
                continue
            }

            XCTAssertEqual(problem.type, "addition")
            XCTAssertEqual(problem.difficulty, difficulty)
            XCTAssertNotNil(problem.correctAnswer.intValue)

            // Verify visual has left and right elements
            XCTAssertEqual(problem.visual.elements.count, 2)
        }
    }

    func testAdditionAnswerIsCorrect() {
        let generator = AdditionProblemGenerator()
        guard let (problem, signature) = generator.generate(difficulty: 1, excluding: []) else {
            XCTFail("Should generate a problem")
            return
        }

        // Parse signature to get a and b
        // Format: addition:d1:a+b
        let parts = signature.split(separator: ":")
        let equation = String(parts.last!)
        let operands = equation.split(separator: "+")
        let a = Int(operands[0])!
        let b = Int(operands[1])!

        XCTAssertEqual(problem.correctAnswer.intValue, a + b)
    }

    // MARK: - Subtraction Generator Tests

    func testSubtractionGeneratorCreatesValidProblems() {
        let generator = SubtractionProblemGenerator()

        for difficulty in 1...4 {
            guard let (problem, _) = generator.generate(difficulty: difficulty, excluding: []) else {
                XCTFail("Generator should produce a problem for difficulty \(difficulty)")
                continue
            }

            XCTAssertEqual(problem.type, "subtraction")
            XCTAssertEqual(problem.difficulty, difficulty)

            // Result should be non-negative
            let result = problem.correctAnswer.intValue!
            XCTAssertGreaterThanOrEqual(result, 0)
        }
    }

    func testSubtractionAnswerIsCorrect() {
        let generator = SubtractionProblemGenerator()
        guard let (problem, signature) = generator.generate(difficulty: 1, excluding: []) else {
            XCTFail("Should generate a problem")
            return
        }

        // Parse signature: subtraction:d1:a-b
        let parts = signature.split(separator: ":")
        let equation = String(parts.last!)
        let operands = equation.split(separator: "-")
        let a = Int(operands[0])!
        let b = Int(operands[1])!

        XCTAssertEqual(problem.correctAnswer.intValue, a - b)
    }

    // MARK: - Comparison Generator Tests

    func testComparisonGeneratorCreatesValidProblems() {
        let generator = ComparisonProblemGenerator()

        for difficulty in 1...4 {
            guard let (problem, _) = generator.generate(difficulty: difficulty, excluding: []) else {
                XCTFail("Generator should produce a problem for difficulty \(difficulty)")
                continue
            }

            XCTAssertEqual(problem.type, "comparison")
            XCTAssertEqual(problem.difficulty, difficulty)

            // Answer should be left or right
            let answer = problem.correctAnswer.stringValue
            XCTAssertTrue(answer == "left" || answer == "right")
        }
    }

    func testComparisonHasTwoSides() {
        let generator = ComparisonProblemGenerator()
        guard let (problem, _) = generator.generate(difficulty: 1, excluding: []) else {
            XCTFail("Should generate a problem")
            return
        }

        XCTAssertEqual(problem.visual.elements.count, 2)

        let leftElement = problem.visual.elements.first { $0.position == "left" }
        let rightElement = problem.visual.elements.first { $0.position == "right" }

        XCTAssertNotNil(leftElement)
        XCTAssertNotNil(rightElement)
    }

    // MARK: - Pattern Generator Tests

    func testPatternGeneratorCreatesValidProblems() {
        let generator = PatternProblemGenerator()

        for difficulty in 1...4 {
            guard let (problem, _) = generator.generate(difficulty: difficulty, excluding: []) else {
                XCTFail("Generator should produce a problem for difficulty \(difficulty)")
                continue
            }

            XCTAssertEqual(problem.type, "patterns")
            XCTAssertEqual(problem.difficulty, difficulty)

            // Should have "unknown" as last element
            let lastElement = problem.visual.elements.last
            XCTAssertEqual(lastElement?.object, "unknown")
        }
    }

    func testPatternAnswerIsValidColor() {
        let generator = PatternProblemGenerator()
        guard let (problem, _) = generator.generate(difficulty: 1, excluding: []) else {
            XCTFail("Should generate a problem")
            return
        }

        let answer = problem.correctAnswer.stringValue!
        let validColors = ["circle_red", "circle_blue", "circle_green", "circle_yellow"]
        XCTAssertTrue(validColors.contains(answer), "Answer should be a valid color")
    }

    // MARK: - General Generator Tests

    func testAllGeneratorsProduceUniqueIds() {
        let generators: [any ProblemGenerator] = [
            CountingProblemGenerator(),
            AdditionProblemGenerator(),
            SubtractionProblemGenerator(),
            ComparisonProblemGenerator(),
            PatternProblemGenerator()
        ]

        var ids = Set<String>()

        for generator in generators {
            for _ in 0..<10 {
                if let (problem, _) = generator.generate(difficulty: 1, excluding: []) {
                    XCTAssertFalse(ids.contains(problem.id), "IDs should be unique")
                    ids.insert(problem.id)
                }
            }
        }
    }

    func testAllGeneratorsHaveCorrectProblemType() {
        let expectedTypes: [(any ProblemGenerator, ProblemType)] = [
            (CountingProblemGenerator(), .counting),
            (AdditionProblemGenerator(), .addition),
            (SubtractionProblemGenerator(), .subtraction),
            (ComparisonProblemGenerator(), .comparison),
            (PatternProblemGenerator(), .patterns)
        ]

        for (generator, expectedType) in expectedTypes {
            XCTAssertEqual(generator.problemType, expectedType)
        }
    }
}
