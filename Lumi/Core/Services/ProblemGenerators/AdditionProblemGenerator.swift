import Foundation

/// Generates addition problems dynamically
/// Signature format: addition:d{difficulty}:{a}+{b}
struct AdditionProblemGenerator: ProblemGenerator {
    let problemType: ProblemType = .addition

    /// Maximum sum for each difficulty level
    private func maxSum(for difficulty: Int) -> Int {
        switch difficulty {
        case 1: return 5
        case 2: return 10
        case 3: return 15
        case 4: return 20
        default: return 5
        }
    }

    func generate(difficulty: Int, excluding: Set<String>) -> (problem: Problem, signature: String)? {
        let max = maxSum(for: difficulty)
        var pairs: [(Int, Int)] = []

        // Generate all valid (a, b) pairs where a + b <= max and both >= 1
        for a in 1...(max - 1) {
            for b in 1...(max - a) {
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
        let max = maxSum(for: difficulty)
        var signatures: [String] = []

        for a in 1...(max - 1) {
            for b in 1...(max - a) {
                signatures.append(makeSignature(difficulty: difficulty, a: a, b: b))
            }
        }

        return signatures
    }

    private func makeSignature(difficulty: Int, a: Int, b: Int) -> String {
        "addition:d\(difficulty):\(a)+\(b)"
    }

    private func createProblem(a: Int, b: Int, difficulty: Int) -> Problem {
        let object = VisualObject.allCases.randomElement() ?? .star
        let sum = a + b

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
                ptBR: "\(a) + \(b) = ?",
                en: "\(a) + \(b) = ?"
            ),
            correctAnswer: .number(sum),
            answerChoices: generateChoices(correct: sum),
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
            choices.insert(correct + extra + 2)
        }

        return Array(choices).sorted().map { .number($0) }
    }
}
