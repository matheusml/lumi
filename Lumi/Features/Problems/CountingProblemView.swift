import SwiftUI

struct CountingProblemView: View {
    let problem: Problem
    let onAnswer: (Bool) -> Void

    @State private var selectedAnswer: AnswerValue?
    @State private var hasAnswered = false

    private var objectInfo: (emoji: String, count: Int) {
        guard let element = problem.visual.elements.first else {
            return ("⭐", 3)
        }
        let emoji = ObjectEmoji.emoji(for: element.object)
        let count = element.count ?? 3
        return (emoji, count)
    }

    var body: some View {
        VStack(spacing: LumiSpacing.xl) {
            // Prompt
            Text(problem.prompt.localized())
                .font(LumiTypography.prompt)
                .foregroundStyle(LumiColors.textPrimary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, LumiSpacing.screenHorizontal)

            // Objects to count
            LazyVGrid(columns: gridColumns, spacing: LumiSpacing.md) {
                ForEach(0..<objectInfo.count, id: \.self) { _ in
                    Text(objectInfo.emoji)
                        .font(.system(size: 50))
                }
            }
            .padding(LumiSpacing.lg)
            .background(
                RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                    .fill(LumiColors.cardBackground)
            )
            .padding(.horizontal, LumiSpacing.screenHorizontal)

            Spacer()

            // Answer choices
            HStack(spacing: LumiSpacing.md) {
                ForEach(problem.answerChoices ?? [], id: \.self) { choice in
                    if let number = choice.intValue {
                        NumberChoice(
                            number: number,
                            state: choiceState(for: choice)
                        ) {
                            selectAnswer(choice)
                        }
                    }
                }
            }

            Spacer()
        }
    }

    private var gridColumns: [GridItem] {
        let count = objectInfo.count
        let columns = min(5, max(3, Int(sqrt(Double(count))) + 1))
        return Array(repeating: GridItem(.flexible()), count: columns)
    }

    private func choiceState(for choice: AnswerValue) -> NumberChoice.ChoiceState {
        guard selectedAnswer != nil else { return .normal }

        if choice == selectedAnswer {
            return choice == problem.correctAnswer ? .correct : .incorrect
        }

        if hasAnswered && choice == problem.correctAnswer {
            return .correct
        }

        return .normal
    }

    private func selectAnswer(_ choice: AnswerValue) {
        guard !hasAnswered else { return }

        selectedAnswer = choice
        hasAnswered = true
        let isCorrect = choice == problem.correctAnswer
        onAnswer(isCorrect)
    }
}

#Preview {
    let sampleProblem = Problem(
        id: "count_test",
        type: "counting",
        difficulty: 1,
        visual: VisualConfiguration(
            type: "objects",
            elements: [VisualElement(object: "apple", count: 5, position: nil)]
        ),
        prompt: LocalizedString(ptBR: "Quantas maçãs você vê?", en: "How many apples?"),
        correctAnswer: .number(5),
        answerChoices: [.number(3), .number(4), .number(5), .number(6)],
        hints: nil
    )

    CountingProblemView(problem: sampleProblem) { correct in
        print("Correct: \(correct)")
    }
    .background(LumiColors.background)
}
