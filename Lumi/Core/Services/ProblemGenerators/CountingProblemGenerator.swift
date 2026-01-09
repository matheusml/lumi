import Foundation

/// Generates counting problems dynamically
/// Signature format: counting:d{difficulty}:{count}
struct CountingProblemGenerator: ProblemGenerator {
    let problemType: ProblemType = .counting

    /// Range of counts for each difficulty level
    private func countRange(for difficulty: Int) -> ClosedRange<Int> {
        switch difficulty {
        case 1: return 1...5
        case 2: return 1...10
        case 3: return 1...15
        case 4: return 1...20
        default: return 1...5
        }
    }

    func generate(difficulty: Int, excluding: Set<String>) -> (problem: Problem, signature: String)? {
        let range = countRange(for: difficulty)
        let possibleCounts = Array(range).shuffled()

        for count in possibleCounts {
            let signature = makeSignature(difficulty: difficulty, count: count)
            if !excluding.contains(signature) {
                let problem = createProblem(count: count, difficulty: difficulty)
                return (problem, signature)
            }
        }

        // All counts seen, return nil
        return nil
    }

    func allPossibleSignatures(difficulty: Int) -> [String] {
        let range = countRange(for: difficulty)
        return range.map { makeSignature(difficulty: difficulty, count: $0) }
    }

    private func makeSignature(difficulty: Int, count: Int) -> String {
        "counting:d\(difficulty):\(count)"
    }

    private func createProblem(count: Int, difficulty: Int) -> Problem {
        let object = VisualObject.allCases.randomElement() ?? .star

        return Problem(
            id: UUID().uuidString,
            type: problemType.rawValue,
            difficulty: difficulty,
            visual: VisualConfiguration(
                type: VisualType.objects.rawValue,
                elements: [VisualElement(object: object.rawValue, count: count, position: nil)]
            ),
            prompt: LocalizedString(
                ptBR: "\(object.quantifierPtBR) \(object.namePtBR) você vê?",
                en: "\(object.quantifierEn) \(object.nameEn) do you see?"
            ),
            correctAnswer: .number(count),
            answerChoices: generateChoices(correct: count),
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

        // Fill remaining if needed
        var extra = 0
        while choices.count < 4 {
            extra += 1
            choices.insert(correct + extra + 2)
        }

        return Array(choices).sorted().map { .number($0) }
    }
}
