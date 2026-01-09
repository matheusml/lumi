import SwiftUI

struct ComparisonProblemView: View {
    let problem: Problem
    let onAnswer: (Bool) -> Void

    @State private var selectedSide: String?
    @State private var hasAnswered = false

    private var leftInfo: (emoji: String, count: Int) {
        guard let element = problem.visual.elements.first(where: { $0.position == "left" }) else {
            return ("🍌", 3)
        }
        return (ObjectEmoji.emoji(for: element.object), element.count ?? 3)
    }

    private var rightInfo: (emoji: String, count: Int) {
        guard let element = problem.visual.elements.first(where: { $0.position == "right" }) else {
            return ("🍌", 7)
        }
        return (ObjectEmoji.emoji(for: element.object), element.count ?? 7)
    }

    private var correctSide: String {
        problem.correctAnswer.stringValue ?? "right"
    }

    var body: some View {
        VStack(spacing: LumiSpacing.xl) {
            // Prompt with speaker button
            HStack(spacing: LumiSpacing.md) {
                Text(problem.prompt.localized())
                    .font(LumiTypography.prompt)
                    .foregroundStyle(LumiColors.textPrimary)
                    .multilineTextAlignment(.center)

                SpeakerButton {
                    SpeechService.shared.speak(problem.prompt.localized())
                }
            }
            .padding(.horizontal, LumiSpacing.screenHorizontal)

            Spacer()

            // Two sides to compare
            HStack(spacing: LumiSpacing.xl) {
                // Left side
                sideView(
                    emoji: leftInfo.emoji,
                    count: leftInfo.count,
                    side: "left"
                )

                // VS indicator
                Text("ou")
                    .font(LumiTypography.headingMedium)
                    .foregroundStyle(LumiColors.textTertiary)

                // Right side
                sideView(
                    emoji: rightInfo.emoji,
                    count: rightInfo.count,
                    side: "right"
                )
            }
            .padding(.horizontal, LumiSpacing.md)

            Spacer()
        }
    }

    @ViewBuilder
    private func sideView(emoji: String, count: Int, side: String) -> some View {
        Button(action: {
            selectSide(side)
        }) {
            VStack(spacing: LumiSpacing.sm) {
                LazyVGrid(columns: [
                    GridItem(.fixed(45)),
                    GridItem(.fixed(45)),
                    GridItem(.fixed(45))
                ], spacing: LumiSpacing.xs) {
                    ForEach(0..<count, id: \.self) { _ in
                        Text(emoji)
                            .font(.system(size: 32))
                    }
                }
            }
            .frame(minWidth: 140, minHeight: 140)
            .padding(LumiSpacing.md)
            .background(
                RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                    .fill(sideBackgroundColor(for: side))
            )
            .overlay(
                RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                    .stroke(sideBorderColor(for: side), lineWidth: 4)
            )
        }
        .buttonStyle(ScaleButtonStyle())
        .disabled(hasAnswered)
    }

    private func sideBackgroundColor(for side: String) -> Color {
        guard selectedSide != nil else { return LumiColors.cardBackground }

        if side == selectedSide {
            return side == correctSide ? LumiColors.correct.opacity(0.2) : LumiColors.tryAgain.opacity(0.2)
        }

        if hasAnswered && side == correctSide {
            return LumiColors.correct.opacity(0.2)
        }

        return LumiColors.cardBackground
    }

    private func sideBorderColor(for side: String) -> Color {
        guard selectedSide != nil else { return .clear }

        if side == selectedSide {
            return side == correctSide ? LumiColors.correct : LumiColors.tryAgain
        }

        if hasAnswered && side == correctSide {
            return LumiColors.correct
        }

        return .clear
    }

    private func selectSide(_ side: String) {
        guard !hasAnswered else { return }

        selectedSide = side
        hasAnswered = true
        let isCorrect = side == correctSide
        onAnswer(isCorrect)
    }
}

#Preview {
    let sampleProblem = Problem(
        id: "comp_test",
        type: "comparison",
        difficulty: 1,
        visual: VisualConfiguration(
            type: "comparison",
            elements: [
                VisualElement(object: "banana", count: 3, position: "left"),
                VisualElement(object: "banana", count: 7, position: "right")
            ]
        ),
        prompt: LocalizedString(ptBR: "Qual lado tem mais bananas?", en: "Which side has more?"),
        correctAnswer: .object("right"),
        answerChoices: [.object("left"), .object("right")],
        hints: nil
    )

    ComparisonProblemView(problem: sampleProblem) { correct in
        print("Correct: \(correct)")
    }
    .background(LumiColors.background)
}
