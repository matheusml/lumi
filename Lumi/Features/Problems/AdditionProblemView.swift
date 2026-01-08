import SwiftUI

struct AdditionProblemView: View {
    let problem: Problem
    let onAnswer: (Bool) -> Void

    @State private var selectedAnswer: AnswerValue?
    @State private var hasAnswered = false

    private var leftGroup: (emoji: String, count: Int) {
        guard let element = problem.visual.elements.first(where: { $0.position == "left" }) else {
            return ("⭐", 2)
        }
        return (ObjectEmoji.emoji(for: element.object), element.count ?? 2)
    }

    private var rightGroup: (emoji: String, count: Int) {
        guard let element = problem.visual.elements.first(where: { $0.position == "right" }) else {
            return ("⭐", 1)
        }
        return (ObjectEmoji.emoji(for: element.object), element.count ?? 1)
    }

    var body: some View {
        VStack(spacing: LumiSpacing.xl) {
            // Visual representation
            HStack(spacing: LumiSpacing.md) {
                // Left group
                objectGroup(emoji: leftGroup.emoji, count: leftGroup.count)
                    .frame(maxWidth: .infinity)

                // Plus sign
                Text("+")
                    .font(LumiTypography.numberLarge)
                    .foregroundStyle(LumiColors.textPrimary)
                    .layoutPriority(1)

                // Right group
                objectGroup(emoji: rightGroup.emoji, count: rightGroup.count)
                    .frame(maxWidth: .infinity)
            }
            .padding(LumiSpacing.lg)
            .background(
                RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                    .fill(LumiColors.cardBackground)
            )
            .padding(.horizontal, LumiSpacing.screenHorizontal)

            // Equation
            Text(problem.prompt.localized())
                .font(LumiTypography.numberLarge)
                .foregroundStyle(LumiColors.textPrimary)

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

    @ViewBuilder
    private func objectGroup(emoji: String, count: Int) -> some View {
        LazyVGrid(columns: [
            GridItem(.flexible()),
            GridItem(.flexible()),
            GridItem(.flexible())
        ], spacing: LumiSpacing.xs) {
            ForEach(0..<count, id: \.self) { _ in
                Text(emoji)
                    .font(.system(size: 32))
            }
        }
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
        id: "add_test",
        type: "addition",
        difficulty: 1,
        visual: VisualConfiguration(
            type: "equation",
            elements: [
                VisualElement(object: "star", count: 3, position: "left"),
                VisualElement(object: "star", count: 2, position: "right")
            ]
        ),
        prompt: LocalizedString(ptBR: "3 + 2 = ?", en: "3 + 2 = ?"),
        correctAnswer: .number(5),
        answerChoices: [.number(4), .number(5), .number(6), .number(7)],
        hints: nil
    )

    AdditionProblemView(problem: sampleProblem) { correct in
        print("Correct: \(correct)")
    }
    .background(LumiColors.background)
}
