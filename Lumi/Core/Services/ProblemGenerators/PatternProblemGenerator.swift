import Foundation

/// Generates pattern problems dynamically
/// Signature format: patterns:d{difficulty}:{patternHash}
/// where patternHash encodes the abstract pattern structure (e.g., "01_01" for ABAB)
struct PatternProblemGenerator: ProblemGenerator {
    let problemType: ProblemType = .patterns

    /// Pattern templates for each difficulty level
    /// Numbers represent abstract color indices (0=A, 1=B, 2=C, etc.)
    private func templates(for difficulty: Int) -> [[Int]] {
        switch difficulty {
        case 1:
            return [
                [0, 1, 0, 1, 0],           // ABABA -> next is B
                [0, 0, 1, 0, 0, 1, 0],     // AABABAA -> next is B (AAB pattern)
                [0, 1, 1, 0, 1, 1, 0],     // ABBABBA -> next is B (ABB pattern)
            ]
        case 2:
            return [
                [0, 1, 2, 0, 1, 2, 0],     // ABCABCA -> next is B
                [0, 1, 0, 1, 0, 1, 0],     // ABABABA -> next is B
                [0, 0, 1, 1, 0, 0, 1],     // AABBAA -> next is B (AABB pattern)
            ]
        case 3:
            return [
                [0, 1, 1, 0, 1, 1, 0],     // ABBABBA -> next is B
                [0, 1, 2, 1, 0, 1, 2],     // ABCBAB -> next is C (ABC pattern)
                [0, 0, 0, 1, 0, 0, 0],     // AAABAAA -> next is B (AAAB pattern)
            ]
        case 4:
            return [
                [0, 1, 2, 3, 0, 1, 2, 3, 0],   // ABCDABCDA -> next is B
                [0, 1, 0, 2, 0, 1, 0, 2, 0],   // ABACABACA -> next is B
                [0, 1, 2, 2, 1, 0, 0, 1, 2],   // Complex pattern
            ]
        default:
            return [[0, 1, 0, 1, 0]]
        }
    }

    func generate(difficulty: Int, excluding: Set<String>) -> (problem: Problem, signature: String)? {
        let availableTemplates = templates(for: difficulty)
        let colors = PatternColor.allCases

        for template in availableTemplates.shuffled() {
            let patternHash = template.map { String($0) }.joined(separator: "_")
            let signature = makeSignature(difficulty: difficulty, patternHash: patternHash)

            if !excluding.contains(signature) {
                // Map abstract indices to random colors
                let maxIndex = template.max() ?? 0
                let colorMapping = assignColors(count: maxIndex + 1, from: colors)

                let problem = createProblem(
                    template: template,
                    colorMapping: colorMapping,
                    difficulty: difficulty
                )
                return (problem, signature)
            }
        }

        return nil
    }

    func allPossibleSignatures(difficulty: Int) -> [String] {
        let availableTemplates = templates(for: difficulty)
        return availableTemplates.map { template in
            let patternHash = template.map { String($0) }.joined(separator: "_")
            return makeSignature(difficulty: difficulty, patternHash: patternHash)
        }
    }

    private func makeSignature(difficulty: Int, patternHash: String) -> String {
        "patterns:d\(difficulty):\(patternHash)"
    }

    private func assignColors(count: Int, from colors: [PatternColor]) -> [PatternColor] {
        let shuffled = colors.shuffled()
        return Array(shuffled.prefix(count))
    }

    private func createProblem(template: [Int], colorMapping: [PatternColor], difficulty: Int) -> Problem {
        // The answer is what would continue the pattern
        let answer = colorMapping[template.last!]

        // Display pattern: all but last, plus "unknown"
        let displayIndices = Array(template.dropLast())
        var elements = displayIndices.map { index in
            VisualElement(object: colorMapping[index].rawValue, count: nil, position: nil)
        }
        elements.append(VisualElement(object: "unknown", count: nil, position: nil))

        // Create answer choices (all available colors, shuffled)
        let choices: [AnswerValue] = PatternColor.allCases.shuffled().map { .object($0.rawValue) }

        return Problem(
            id: UUID().uuidString,
            type: problemType.rawValue,
            difficulty: difficulty,
            visual: VisualConfiguration(
                type: VisualType.pattern.rawValue,
                elements: elements
            ),
            prompt: LocalizedString(
                ptBR: "O que vem depois?",
                en: "What comes next?"
            ),
            correctAnswer: .object(answer.rawValue),
            answerChoices: choices,
            hints: nil
        )
    }
}
