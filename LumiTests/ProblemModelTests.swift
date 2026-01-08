import XCTest
@testable import Lumi

final class ProblemModelTests: XCTestCase {

    // MARK: - AnswerValue Decoding Tests

    func testDecodeNumberAnswer() throws {
        let json = """
        {"number": 5}
        """
        let data = json.data(using: .utf8)!
        let answer = try JSONDecoder().decode(AnswerValue.self, from: data)

        XCTAssertEqual(answer, .number(5))
        XCTAssertEqual(answer.intValue, 5)
        XCTAssertNil(answer.stringValue)
    }

    func testDecodeObjectAnswer() throws {
        let json = """
        {"object": "left"}
        """
        let data = json.data(using: .utf8)!
        let answer = try JSONDecoder().decode(AnswerValue.self, from: data)

        XCTAssertEqual(answer, .object("left"))
        XCTAssertEqual(answer.stringValue, "left")
        XCTAssertNil(answer.intValue)
    }

    func testDecodePatternAnswer() throws {
        let json = """
        {"pattern": ["red", "blue", "red"]}
        """
        let data = json.data(using: .utf8)!
        let answer = try JSONDecoder().decode(AnswerValue.self, from: data)

        XCTAssertEqual(answer, .pattern(["red", "blue", "red"]))
    }

    func testDecodePlainIntAnswer() throws {
        let json = "42"
        let data = json.data(using: .utf8)!
        let answer = try JSONDecoder().decode(AnswerValue.self, from: data)

        XCTAssertEqual(answer, .number(42))
    }

    func testDecodePlainStringAnswer() throws {
        let json = "\"right\""
        let data = json.data(using: .utf8)!
        let answer = try JSONDecoder().decode(AnswerValue.self, from: data)

        XCTAssertEqual(answer, .object("right"))
    }

    // MARK: - AnswerValue Encoding Tests

    func testEncodeNumberAnswer() throws {
        let answer = AnswerValue.number(10)
        let data = try JSONEncoder().encode(answer)
        let decoded = try JSONDecoder().decode(AnswerValue.self, from: data)

        XCTAssertEqual(decoded, .number(10))
    }

    func testEncodeObjectAnswer() throws {
        let answer = AnswerValue.object("left")
        let data = try JSONEncoder().encode(answer)
        let decoded = try JSONDecoder().decode(AnswerValue.self, from: data)

        XCTAssertEqual(decoded, .object("left"))
    }

    func testEncodePatternAnswer() throws {
        let answer = AnswerValue.pattern(["a", "b", "c"])
        let data = try JSONEncoder().encode(answer)
        let decoded = try JSONDecoder().decode(AnswerValue.self, from: data)

        XCTAssertEqual(decoded, .pattern(["a", "b", "c"]))
    }

    // MARK: - AnswerValue Display Value Tests

    func testNumberDisplayValue() {
        let answer = AnswerValue.number(7)
        XCTAssertEqual(answer.displayValue, "7")
    }

    func testObjectDisplayValue() {
        let answer = AnswerValue.object("star")
        XCTAssertEqual(answer.displayValue, "star")
    }

    func testPatternDisplayValue() {
        let answer = AnswerValue.pattern(["red", "blue"])
        XCTAssertEqual(answer.displayValue, "red, blue")
    }

    // MARK: - AnswerValue Equality Tests

    func testAnswerValueEquality() {
        XCTAssertEqual(AnswerValue.number(5), AnswerValue.number(5))
        XCTAssertNotEqual(AnswerValue.number(5), AnswerValue.number(6))
        XCTAssertEqual(AnswerValue.object("a"), AnswerValue.object("a"))
        XCTAssertNotEqual(AnswerValue.object("a"), AnswerValue.object("b"))
        XCTAssertNotEqual(AnswerValue.number(5), AnswerValue.object("5"))
    }

    // MARK: - LocalizedString Tests

    func testLocalizedStringDefault() {
        let str = LocalizedString(ptBR: "Olá", en: "Hello")
        XCTAssertEqual(str.localized(), "Olá")
        XCTAssertEqual(str.localized(for: "pt-BR"), "Olá")
    }

    func testLocalizedStringEnglish() {
        let str = LocalizedString(ptBR: "Olá", en: "Hello")
        XCTAssertEqual(str.localized(for: "en"), "Hello")
    }

    func testLocalizedStringFallbackToPortuguese() {
        let str = LocalizedString(ptBR: "Olá", en: nil)
        XCTAssertEqual(str.localized(for: "en"), "Olá")
    }

    // MARK: - VisualConfiguration Tests

    func testVisualTypeFromString() {
        let config = VisualConfiguration(
            type: "objects",
            elements: [VisualElement(object: "star", count: 5, position: nil)]
        )
        XCTAssertEqual(config.visualType, .objects)
    }

    func testVisualTypeEquation() {
        let config = VisualConfiguration(type: "equation", elements: [])
        XCTAssertEqual(config.visualType, .equation)
    }

    func testVisualTypePattern() {
        let config = VisualConfiguration(type: "pattern", elements: [])
        XCTAssertEqual(config.visualType, .pattern)
    }

    func testVisualTypeComparison() {
        let config = VisualConfiguration(type: "comparison", elements: [])
        XCTAssertEqual(config.visualType, .comparison)
    }

    // MARK: - Problem Tests

    func testProblemTypeFromString() {
        let problem = Problem(
            id: "test1",
            type: "counting",
            difficulty: 1,
            visual: VisualConfiguration(type: "objects", elements: []),
            prompt: LocalizedString(ptBR: "Test", en: nil),
            correctAnswer: .number(5),
            answerChoices: nil,
            hints: nil
        )
        XCTAssertEqual(problem.problemType, .counting)
    }

    func testProblemDecoding() throws {
        let json = """
        {
            "id": "count_1",
            "type": "counting",
            "difficulty": 1,
            "visual": {
                "type": "objects",
                "elements": [{"object": "star", "count": 3}]
            },
            "prompt": {"ptBR": "Quantas estrelas?"},
            "correctAnswer": {"number": 3}
        }
        """
        let data = json.data(using: .utf8)!
        let problem = try JSONDecoder().decode(Problem.self, from: data)

        XCTAssertEqual(problem.id, "count_1")
        XCTAssertEqual(problem.type, "counting")
        XCTAssertEqual(problem.difficulty, 1)
        XCTAssertEqual(problem.correctAnswer, .number(3))
        XCTAssertEqual(problem.visual.elements.first?.object, "star")
        XCTAssertEqual(problem.visual.elements.first?.count, 3)
    }

    // MARK: - ProblemBank Tests

    func testProblemBankDecoding() throws {
        let json = """
        {
            "subject": "math",
            "problems": [
                {
                    "id": "test1",
                    "type": "addition",
                    "difficulty": 1,
                    "visual": {"type": "equation", "elements": []},
                    "prompt": {"ptBR": "1 + 1 = ?"},
                    "correctAnswer": {"number": 2}
                }
            ]
        }
        """
        let data = json.data(using: .utf8)!
        let bank = try JSONDecoder().decode(ProblemBank.self, from: data)

        XCTAssertEqual(bank.subject, "math")
        XCTAssertEqual(bank.problems.count, 1)
        XCTAssertEqual(bank.problems.first?.id, "test1")
    }
}
