import Foundation

/// Generates subtraction problems dynamically
/// Signature format: subtraction:d{difficulty}:{a}-{b}
struct SubtractionProblemGenerator: ProblemGenerator {
    let problemType: ProblemType = .subtraction

    /// Maximum minuend for each difficulty level
    private func maxMinuend(for difficulty: Int) -> Int {
        switch difficulty {
        case 1: return 5
        case 2: return 10
        case 3: return 15
        case 4: return 20
        default: return 5
        }
    }

    func generate(difficulty: Int, excluding: Set<String>) -> (problem: Problem, signature: String)? {
        let max = maxMinuend(for: difficulty)
        var pairs: [(Int, Int)] = []

        // Generate all valid (a, b) pairs where a > b and both >= 1, a <= max
        for a in 2...max {
            for b in 1..<a {
                pairs.append((a, b))
            }
        }

        pairs.shuffle()

        for (a, b) in pairs {
            let signature = makeSignature(difficulty: difficulty, a: a, b: b)
            if !excluding.contains(signature) {
                let problem = createProblem(a: a, b: b, difficulty: difficulty)
                return (problem, signature)
            }
        }

        return nil
    }

    func allPossibleSignatures(difficulty: Int) -> [String] {
        let max = maxMinuend(for: difficulty)
        var signatures: [String] = []

        for a in 2...max {
            for b in 1..<a {
                signatures.append(makeSignature(difficulty: difficulty, a: a, b: b))
            }
        }

        return signatures
    }

    private func makeSignature(difficulty: Int, a: Int, b: Int) -> String {
        "subtraction:d\(difficulty):\(a)-\(b)"
    }

    private func createProblem(a: Int, b: Int, difficulty: Int) -> Problem {
        let object = [VisualObject.bird, .butterfly, .fish].randomElement() ?? .bird
        let result = a - b

        return Problem(
            id: UUID().uuidString,
            type: problemType.rawValue,
            difficulty: difficulty,
            visual: VisualConfiguration(
                type: VisualType.equation.rawValue,
                elements: [
                    VisualElement(object: object.rawValue, count: a, position: "left"),
                    VisualElement(object: object.rawValue, count: b, position: "right")
                ]
            ),
            prompt: LocalizedString(
                ptBR: "\(a) - \(b) = ?",
                en: "\(a) - \(b) = ?"
            ),
            correctAnswer: .number(result),
            answerChoices: generateChoices(correct: result),
            hints: nil
        )
    }

    private func generateChoices(correct: Int) -> [AnswerValue] {
        var choices = Set<Int>([correct])
        let nearby = [correct - 2, correct - 1, correct + 1, correct + 2].filter { $0 >= 0 }

        for n in nearby.shuffled() {
            choices.insert(n)
            if choices.count >= 4 { break }
        }

        var extra = 0
        while choices.count < 4 {
            extra += 1
            choices.insert(max(0, correct - extra - 2))
            if choices.count < 4 {
                choices.insert(correct + extra + 2)
            }
        }

        return Array(choices).sorted().map { .number($0) }
    }
}
