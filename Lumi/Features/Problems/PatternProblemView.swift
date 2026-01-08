import SwiftUI

struct PatternProblemView: View {
    let problem: Problem
    let onAnswer: (Bool) -> Void

    @State private var selectedAnswer: AnswerValue?
    @State private var hasAnswered = false

    private var patternElements: [String] {
        problem.visual.elements.map { $0.object }
    }

    private var correctAnswer: String {
        problem.correctAnswer.stringValue ?? "circle_red"
    }

    var body: some View {
        GeometryReader { geometry in
            let availableWidth = geometry.size.width - (LumiSpacing.screenHorizontal * 2) - (LumiSpacing.lg * 2)
            let elementCount = CGFloat(patternElements.count)
            let totalSpacing = LumiSpacing.md * (elementCount - 1)
            let elementSize = min(60, (availableWidth - totalSpacing) / elementCount)

            VStack(spacing: LumiSpacing.xl) {
                // Prompt
                Text(problem.prompt.localized())
                    .font(LumiTypography.prompt)
                    .foregroundStyle(LumiColors.textPrimary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, LumiSpacing.screenHorizontal)

                // Pattern display
                HStack(spacing: LumiSpacing.md) {
                    ForEach(Array(patternElements.enumerated()), id: \.offset) { index, element in
                        patternElement(element, isUnknown: element == "unknown", size: elementSize)
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
                VStack(spacing: LumiSpacing.md) {
                    Text("O que vem no lugar de ❓?")
                        .font(LumiTypography.bodyLarge)
                        .foregroundStyle(LumiColors.textSecondary)

                    HStack(spacing: LumiSpacing.md) {
                        ForEach(problem.answerChoices ?? [], id: \.self) { choice in
                            if let object = choice.stringValue {
                                patternChoiceButton(object: object, choice: choice)
                            }
                        }
                    }
                }

                Spacer()
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    @ViewBuilder
    private func patternElement(_ object: String, isUnknown: Bool, size: CGFloat) -> some View {
        let fontSize = size * 0.83 // Proportional font size
        if isUnknown {
            Text("❓")
                .font(.system(size: fontSize))
                .frame(width: size, height: size)
                .background(
                    Circle()
                        .stroke(LumiColors.textTertiary, style: StrokeStyle(lineWidth: 2, dash: [5]))
                )
        } else {
            Text(ObjectEmoji.emoji(for: object))
                .font(.system(size: fontSize))
                .frame(width: size, height: size)
        }
    }

    @ViewBuilder
    private func patternChoiceButton(object: String, choice: AnswerValue) -> some View {
        Button(action: {
            selectAnswer(choice)
        }) {
            Text(ObjectEmoji.emoji(for: object))
                .font(.system(size: 45))
                .frame(width: 70, height: 70)
                .background(
                    Circle()
                        .fill(choiceBackground(for: choice))
                )
                .overlay(
                    Circle()
                        .stroke(choiceBorder(for: choice), lineWidth: 3)
                )
        }
        .buttonStyle(ScaleButtonStyle())
        .disabled(hasAnswered)
    }

    private func choiceBackground(for choice: AnswerValue) -> Color {
        guard selectedAnswer != nil else { return LumiColors.cardBackground }

        if choice == selectedAnswer {
            return choice == problem.correctAnswer ? LumiColors.correct.opacity(0.3) : LumiColors.tryAgain.opacity(0.3)
        }

        if hasAnswered && choice == problem.correctAnswer {
            return LumiColors.correct.opacity(0.3)
        }

        return LumiColors.cardBackground
    }

    private func choiceBorder(for choice: AnswerValue) -> Color {
        guard selectedAnswer != nil else { return .clear }

        if choice == selectedAnswer {
            return choice == problem.correctAnswer ? LumiColors.correct : LumiColors.tryAgain
        }

        if hasAnswered && choice == problem.correctAnswer {
            return LumiColors.correct
        }

        return .clear
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
        id: "pat_test",
        type: "patterns",
        difficulty: 1,
        visual: VisualConfiguration(
            type: "pattern",
            elements: [
                VisualElement(object: "circle_red", count: nil, position: nil),
                VisualElement(object: "circle_blue", count: nil, position: nil),
                VisualElement(object: "circle_red", count: nil, position: nil),
                VisualElement(object: "circle_blue", count: nil, position: nil),
                VisualElement(object: "unknown", count: nil, position: nil)
            ]
        ),
        prompt: LocalizedString(ptBR: "O que vem depois?", en: "What comes next?"),
        correctAnswer: .object("circle_red"),
        answerChoices: [.object("circle_red"), .object("circle_blue"), .object("circle_green")],
        hints: nil
    )

    PatternProblemView(problem: sampleProblem) { correct in
        print("Correct: \(correct)")
    }
    .background(LumiColors.background)
}
