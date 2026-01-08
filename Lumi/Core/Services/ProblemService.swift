import Foundation

/// Loads and serves problems for adventures
@Observable
final class ProblemService {
    private var allProblems: [Problem] = []
    private var problemsByType: [String: [Problem]] = [:]

    init() {
        loadProblems()
    }

    private func loadProblems() {
        // Try to load from bundle
        guard let url = Bundle.main.url(forResource: "problems_pt-BR", withExtension: "json") else {
            print("Could not find problems_pt-BR.json, using generated problems")
            generateDefaultProblems()
            return
        }

        do {
            let data = try Data(contentsOf: url)
            let bank = try JSONDecoder().decode(ProblemBank.self, from: data)
            allProblems = bank.problems
            organizeProblemsByType()
        } catch {
            print("Error loading problems: \(error)")
            generateDefaultProblems()
        }
    }

    private func organizeProblemsByType() {
        problemsByType = Dictionary(grouping: allProblems, by: { $0.type })
    }

    private func generateDefaultProblems() {
        var problems: [Problem] = []

        // Generate counting problems
        for difficulty in 1...4 {
            let maxCount = difficulty * 5
            for i in 0..<5 {
                let count = min(i + 1 + (difficulty - 1) * 3, maxCount)
                let objects = ["apple", "star", "bird", "banana", "flower"].randomElement() ?? "star"
                problems.append(createCountingProblem(count: count, object: objects, difficulty: difficulty, index: i))
            }
        }

        // Generate addition problems
        for difficulty in 1...4 {
            let maxSum = difficulty * 5
            for i in 0..<5 {
                let a = Int.random(in: 1...(maxSum / 2))
                let b = Int.random(in: 1...(maxSum - a))
                problems.append(createAdditionProblem(a: a, b: b, difficulty: difficulty, index: i))
            }
        }

        // Generate subtraction problems
        for difficulty in 1...4 {
            let maxNum = difficulty * 5
            for i in 0..<5 {
                let a = Int.random(in: 2...maxNum)
                let b = Int.random(in: 1..<a)
                problems.append(createSubtractionProblem(a: a, b: b, difficulty: difficulty, index: i))
            }
        }

        // Generate comparison problems
        for difficulty in 1...4 {
            for i in 0..<5 {
                let diff = max(1, 6 - difficulty)
                let a = Int.random(in: 1...10)
                let b = a + Int.random(in: diff...(diff + 3)) * (Bool.random() ? 1 : -1)
                let bClamped = max(1, min(20, b))
                problems.append(createComparisonProblem(left: a, right: bClamped, difficulty: difficulty, index: i))
            }
        }

        // Generate pattern problems
        for difficulty in 1...4 {
            for i in 0..<3 {
                problems.append(createPatternProblem(difficulty: difficulty, index: i))
            }
        }

        allProblems = problems
        organizeProblemsByType()
    }

    private func createCountingProblem(count: Int, object: String, difficulty: Int, index: Int) -> Problem {
        let objectNames: [String: String] = [
            "apple": "maçãs", "star": "estrelas", "bird": "pássaros",
            "banana": "bananas", "flower": "flores"
        ]
        let name = objectNames[object] ?? "objetos"

        return Problem(
            id: "count_d\(difficulty)_\(index)",
            type: "counting",
            difficulty: difficulty,
            visual: VisualConfiguration(
                type: "objects",
                elements: [VisualElement(object: object, count: count, position: nil)]
            ),
            prompt: LocalizedString(ptBR: "Quantas \(name) você vê?", en: "How many \(object)s do you see?"),
            correctAnswer: .number(count),
            answerChoices: generateNumberChoices(correct: count, range: max(1, count - 2)...(count + 2)),
            hints: nil
        )
    }

    private func createAdditionProblem(a: Int, b: Int, difficulty: Int, index: Int) -> Problem {
        let object = ["star", "apple", "flower"].randomElement() ?? "star"
        return Problem(
            id: "add_d\(difficulty)_\(index)",
            type: "addition",
            difficulty: difficulty,
            visual: VisualConfiguration(
                type: "equation",
                elements: [
                    VisualElement(object: object, count: a, position: "left"),
                    VisualElement(object: object, count: b, position: "right")
                ]
            ),
            prompt: LocalizedString(ptBR: "\(a) + \(b) = ?", en: "\(a) + \(b) = ?"),
            correctAnswer: .number(a + b),
            answerChoices: generateNumberChoices(correct: a + b, range: max(1, a + b - 2)...(a + b + 2)),
            hints: nil
        )
    }

    private func createSubtractionProblem(a: Int, b: Int, difficulty: Int, index: Int) -> Problem {
        let object = ["bird", "butterfly", "fish"].randomElement() ?? "bird"
        return Problem(
            id: "sub_d\(difficulty)_\(index)",
            type: "subtraction",
            difficulty: difficulty,
            visual: VisualConfiguration(
                type: "equation",
                elements: [
                    VisualElement(object: object, count: a, position: "left"),
                    VisualElement(object: object, count: b, position: "right")
                ]
            ),
            prompt: LocalizedString(ptBR: "\(a) - \(b) = ?", en: "\(a) - \(b) = ?"),
            correctAnswer: .number(a - b),
            answerChoices: generateNumberChoices(correct: a - b, range: max(0, a - b - 2)...(a - b + 2)),
            hints: nil
        )
    }

    private func createComparisonProblem(left: Int, right: Int, difficulty: Int, index: Int) -> Problem {
        let object = ["banana", "apple", "star"].randomElement() ?? "banana"
        let correctSide = left > right ? "left" : "right"

        return Problem(
            id: "comp_d\(difficulty)_\(index)",
            type: "comparison",
            difficulty: difficulty,
            visual: VisualConfiguration(
                type: "comparison",
                elements: [
                    VisualElement(object: object, count: left, position: "left"),
                    VisualElement(object: object, count: right, position: "right")
                ]
            ),
            prompt: LocalizedString(ptBR: "Qual lado tem mais?", en: "Which side has more?"),
            correctAnswer: .object(correctSide),
            answerChoices: [.object("left"), .object("right")],
            hints: nil
        )
    }

    private func createPatternProblem(difficulty: Int, index: Int) -> Problem {
        let patterns: [[String]] = [
            ["circle_red", "circle_blue", "circle_red", "circle_blue", "circle_red"],
            ["circle_green", "circle_yellow", "circle_green", "circle_yellow", "circle_green"],
            ["circle_red", "circle_red", "circle_blue", "circle_red", "circle_red", "circle_blue", "circle_red"],
            ["circle_blue", "circle_green", "circle_blue", "circle_green", "circle_blue"]
        ]

        let pattern = patterns[index % patterns.count]
        let answer = pattern.last ?? "circle_red"
        var displayPattern = Array(pattern.dropLast())
        displayPattern.append("unknown")

        return Problem(
            id: "pat_d\(difficulty)_\(index)",
            type: "patterns",
            difficulty: difficulty,
            visual: VisualConfiguration(
                type: "pattern",
                elements: displayPattern.map { VisualElement(object: $0, count: nil, position: nil) }
            ),
            prompt: LocalizedString(ptBR: "O que vem depois?", en: "What comes next?"),
            correctAnswer: .object(answer),
            answerChoices: [
                .object("circle_red"),
                .object("circle_blue"),
                .object("circle_green"),
                .object("circle_yellow")
            ],
            hints: nil
        )
    }

    private func generateNumberChoices(correct: Int, range: ClosedRange<Int>) -> [AnswerValue] {
        var choices = Set<Int>([correct])
        for n in range where n >= 0 {
            choices.insert(n)
            if choices.count >= 4 { break }
        }
        while choices.count < 4 {
            choices.insert(correct + choices.count)
        }
        return Array(choices).sorted().map { .number($0) }
    }

    // MARK: - Public API

    func getProblems(type: ProblemType, difficulty: Int, count: Int) -> [Problem] {
        let available = problemsByType[type.rawValue]?.filter { $0.difficulty == difficulty } ?? []
        if available.isEmpty {
            // Fall back to any difficulty for this type
            let anyDifficulty = problemsByType[type.rawValue] ?? []
            return Array(anyDifficulty.shuffled().prefix(count))
        }
        return Array(available.shuffled().prefix(count))
    }

    func getRandomProblems(count: Int, difficulty: Int) -> [Problem] {
        let types = ProblemType.allCases
        var selected: [Problem] = []

        for _ in 0..<count {
            let type = types.randomElement() ?? .counting
            if let problem = getProblems(type: type, difficulty: difficulty, count: 1).first {
                selected.append(problem)
            }
        }

        return selected
    }

    func getAdventureProblems(difficulty: Int = 1) -> [Problem] {
        // Get 5 problems for an adventure, mixing types
        return getRandomProblems(count: 5, difficulty: difficulty)
    }
}
