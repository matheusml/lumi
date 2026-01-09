import SwiftUI

struct ProblemContainerView: View {
    let problem: Problem
    let onAnswer: (Bool) -> Void
    let onNext: () -> Void

    @State private var showFeedback = false
    @State private var isCorrect = false
    @State private var attemptId = 0
    @State private var hasRecordedAnswer = false
    @State private var hasProcessedAnswer = false  // Prevent duplicate processing

    var body: some View {
        ZStack {
            // Problem view
            problemView
                .id(attemptId)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .opacity(showFeedback ? 0.3 : 1.0)

            // Feedback overlay
            if showFeedback {
                feedbackView
                    .transition(.scale.combined(with: .opacity))
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .animation(.easeInOut(duration: 0.3), value: showFeedback)
        .onAppear {
            SpeechService.shared.speak(problem.prompt.localized())
        }
    }

    @ViewBuilder
    private var problemView: some View {
        switch problem.problemType {
        case .counting:
            CountingProblemView(problem: problem, onAnswer: { correct in
                handleAnswer(correct: correct)
            })
        case .addition:
            AdditionProblemView(problem: problem, onAnswer: { correct in
                handleAnswer(correct: correct)
            })
        case .subtraction:
            SubtractionProblemView(problem: problem, onAnswer: { correct in
                handleAnswer(correct: correct)
            })
        case .comparison:
            ComparisonProblemView(problem: problem, onAnswer: { correct in
                handleAnswer(correct: correct)
            })
        case .patterns:
            PatternProblemView(problem: problem, onAnswer: { correct in
                handleAnswer(correct: correct)
            })
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
            Text(isCorrect ? "✨" : "🤔")
                .font(.system(size: 80))

            Text(isCorrect ? "Muito bem!" : "Tente de novo!")
                .font(LumiTypography.displayMedium)
                .foregroundStyle(isCorrect ? LumiColors.success : LumiColors.textPrimary)
        }
        .padding(LumiSpacing.xl)
        .background(
            RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                .fill(LumiColors.contentBackground)
                .shadow(color: .black.opacity(0.1), radius: 20, y: 10)
        )
    }

    private func handleAnswer(correct: Bool) {
        // Prevent duplicate processing
        guard !hasProcessedAnswer else { return }

        hasProcessedAnswer = true
        isCorrect = correct
        showFeedback = true

        // Play spoken feedback
        if correct {
            SpeechService.shared.speakSuccess()
        } else {
            SpeechService.shared.speakTryAgain()
        }

        // Auto-advance after delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.showFeedback = false

            if correct {
                if !self.hasRecordedAnswer {
                    self.hasRecordedAnswer = true
                    self.onAnswer(true)
                }
                self.onNext()
            } else {
                // Reset for retry
                self.hasProcessedAnswer = false
                self.attemptId += 1
            }
        }
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
