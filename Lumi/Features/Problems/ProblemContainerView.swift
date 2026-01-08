import SwiftUI

struct ProblemContainerView: View {
    let problem: Problem
    let onAnswer: (Bool) -> Void
    let onNext: () -> Void

    @State private var showFeedback = false
    @State private var isCorrect = false

    var body: some View {
        ZStack {
            // Problem view
            problemView
                .opacity(showFeedback ? 0.3 : 1.0)

            // Feedback overlay
            if showFeedback {
                feedbackView
                    .transition(.scale.combined(with: .opacity))
            }
        }
        .animation(.easeInOut(duration: 0.3), value: showFeedback)
    }

    @ViewBuilder
    private var problemView: some View {
        switch problem.problemType {
        case .counting:
            CountingProblemView(problem: problem, onAnswer: handleAnswer)
        case .addition:
            AdditionProblemView(problem: problem, onAnswer: handleAnswer)
        case .subtraction:
            SubtractionProblemView(problem: problem, onAnswer: handleAnswer)
        case .comparison:
            ComparisonProblemView(problem: problem, onAnswer: handleAnswer)
        case .patterns:
            PatternProblemView(problem: problem, onAnswer: handleAnswer)
        case .none:
            // Fallback
            Text("Problema desconhecido")
                .font(LumiTypography.bodyLarge)
                .foregroundStyle(LumiColors.textSecondary)
        }
    }

    @ViewBuilder
    private var feedbackView: some View {
        VStack(spacing: LumiSpacing.lg) {
            if isCorrect {
                CorrectAnswerView {
                    showFeedback = false
                    onNext()
                }
            } else {
                TryAgainView {
                    showFeedback = false
                }
            }
        }
    }

    private func handleAnswer(correct: Bool) {
        isCorrect = correct
        onAnswer(correct)
        showFeedback = true
    }
}

#Preview {
    let sampleProblem = Problem(
        id: "test",
        type: "counting",
        difficulty: 1,
        visual: VisualConfiguration(
            type: "objects",
            elements: [VisualElement(object: "apple", count: 3, position: nil)]
        ),
        prompt: LocalizedString(ptBR: "Quantas maçãs você vê?", en: "How many apples?"),
        correctAnswer: .number(3),
        answerChoices: [.number(2), .number(3), .number(4), .number(5)],
        hints: nil
    )

    ProblemContainerView(
        problem: sampleProblem,
        onAnswer: { _ in },
        onNext: {}
    )
}
