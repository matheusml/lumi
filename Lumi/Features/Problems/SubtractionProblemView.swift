import SwiftUI

struct SubtractionProblemView: View {
    let problem: Problem
    let onAnswer: (Bool) -> Void

    @State private var selectedAnswer: AnswerValue?
    @State private var hasAnswered = false
    @State private var showSubtraction = false

    private var startCount: Int {
        problem.visual.elements.first(where: { $0.position == "left" })?.count ?? 5
    }

    private var subtractCount: Int {
        problem.visual.elements.first(where: { $0.position == "right" })?.count ?? 2
    }

    private var emoji: String {
        guard let element = problem.visual.elements.first else { return "🐦" }
        return ObjectEmoji.emoji(for: element.object)
    }

    var body: some View {
        VStack(spacing: LumiSpacing.xl) {
            // Visual representation
            VStack(spacing: LumiSpacing.md) {
                // Objects with some flying away
                HStack(spacing: LumiSpacing.sm) {
                    // Remaining objects
                    ForEach(0..<(startCount - subtractCount), id: \.self) { _ in
                        Text(emoji)
                            .font(.system(size: 40))
                    }

                    // Objects that "fly away"
                    ForEach(0..<subtractCount, id: \.self) { index in
                        Text(emoji)
                            .font(.system(size: 40))
                            .opacity(showSubtraction ? 0.3 : 1.0)
                            .offset(y: showSubtraction ? -50 : 0)
                            .animation(
                                .easeOut(duration: 0.5).delay(Double(index) * 0.1),
                                value: showSubtraction
                            )
                    }
                }
            }
            .padding(LumiSpacing.xl)
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
        .onAppear {
            // Animate subtraction after a short delay
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                showSubtraction = true
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
        id: "sub_test",
        type: "subtraction",
        difficulty: 1,
        visual: VisualConfiguration(
            type: "equation",
            elements: [
                VisualElement(object: "bird", count: 5, position: "left"),
                VisualElement(object: "bird", count: 2, position: "right")
            ]
        ),
        prompt: LocalizedString(ptBR: "5 - 2 = ?", en: "5 - 2 = ?"),
        correctAnswer: .number(3),
        answerChoices: [.number(2), .number(3), .number(4), .number(5)],
        hints: nil
    )

    SubtractionProblemView(problem: sampleProblem) { correct in
        print("Correct: \(correct)")
    }
    .background(LumiColors.background)
}
