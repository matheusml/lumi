import Foundation

/// Generates comparison problems dynamically
/// Signature format: comparison:d{difficulty}:{left}v{right} (ordered so left < right for consistency)
struct ComparisonProblemGenerator: ProblemGenerator {
    let problemType: ProblemType = .comparison

    /// Range of values and minimum difference for each difficulty level
    private func params(for difficulty: Int) -> (range: ClosedRange<Int>, minDiff: Int) {
        switch difficulty {
        case 1: return (1...10, 4)   // Large obvious differences
        case 2: return (1...15, 3)   // Medium differences
        case 3: return (1...20, 2)   // Smaller differences
        case 4: return (1...20, 1)   // Can be very close
        default: return (1...10, 4)
        }
    }

    func generate(difficulty: Int, excluding: Set<String>) -> (problem: Problem, signature: String)? {
        let (range, minDiff) = params(for: difficulty)
        var pairs: [(Int, Int)] = []

        // Generate all valid pairs with at least minDiff difference
        for left in range {
            for right in range where abs(left - right) >= minDiff && left != right {
                pairs.append((left, right))
            }
        }

        pairs.shuffle()

        for (left, right) in pairs {
            // Signature uses consistent ordering (smaller first)
            let signature = makeSignature(difficulty: difficulty, left: min(left, right), right: max(left, right))
            if !excluding.contains(signature) {
                let problem = createProblem(left: left, right: right, difficulty: difficulty)
                return (problem, signature)
            }
        }

        return nil
    }

    func allPossibleSignatures(difficulty: Int) -> [String] {
        let (range, minDiff) = params(for: difficulty)
        var signatures = Set<String>()

        for left in range {
            for right in range where abs(left - right) >= minDiff && left != right {
                // Use consistent ordering in signature
                let sig = makeSignature(difficulty: difficulty, left: min(left, right), right: max(left, right))
                signatures.insert(sig)
            }
        }

        return Array(signatures)
    }

    private func makeSignature(difficulty: Int, left: Int, right: Int) -> String {
        "comparison:d\(difficulty):\(left)v\(right)"
    }

    private func createProblem(left: Int, right: Int, difficulty: Int) -> Problem {
        let object = [VisualObject.banana, .apple, .star, .flower].randomElement() ?? .banana
        let correctSide = left > right ? "left" : "right"

        return Problem(
            id: UUID().uuidString,
            type: problemType.rawValue,
            difficulty: difficulty,
            visual: VisualConfiguration(
                type: VisualType.comparison.rawValue,
                elements: [
                    VisualElement(object: object.rawValue, count: left, position: "left"),
                    VisualElement(object: object.rawValue, count: right, position: "right")
                ]
            ),
            prompt: LocalizedString(
                ptBR: "Qual lado tem mais?",
                en: "Which side has more?"
            ),
            correctAnswer: .object(correctSide),
            answerChoices: [.object("left"), .object("right")],
            hints: nil
        )
    }
}
