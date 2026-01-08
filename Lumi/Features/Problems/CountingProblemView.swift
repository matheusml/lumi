import SwiftUI

struct CountingProblemView: View {
    let problem: Problem
    let onAnswer: (Bool) -> Void

    @State private var countedObjects: Set<Int> = []
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

    private var allCounted: Bool {
        countedObjects.count >= objectInfo.count
    }

    var body: some View {
        VStack(spacing: LumiSpacing.xl) {
            // Prompt
            Text(problem.prompt.localized())
                .font(LumiTypography.prompt)
                .foregroundStyle(LumiColors.textPrimary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, LumiSpacing.screenHorizontal)

            // Countable objects
            LazyVGrid(columns: gridColumns, spacing: LumiSpacing.md) {
                ForEach(0..<objectInfo.count, id: \.self) { index in
                    CountableObject(
                        emoji: objectInfo.emoji,
                        isCounted: countedObjects.contains(index)
                    ) {
                        if !countedObjects.contains(index) {
                            countedObjects.insert(index)
                        }
                    }
                }
            }
            .padding(LumiSpacing.lg)
            .background(
                RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                    .fill(LumiColors.cardBackground)
            )
            .padding(.horizontal, LumiSpacing.screenHorizontal)

            // Count indicator
            if !countedObjects.isEmpty {
                Text("Contados: \(countedObjects.count)")
                    .font(LumiTypography.bodyMedium)
                    .foregroundStyle(LumiColors.textSecondary)
            }

            Spacer()

            // Answer choices (show after counting all)
            if allCounted {
                VStack(spacing: LumiSpacing.md) {
                    Text("Qual é o total?")
                        .font(LumiTypography.bodyLarge)
                        .foregroundStyle(LumiColors.textSecondary)

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
                }
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }

            Spacer()
        }
        .animation(.easeInOut(duration: 0.3), value: allCounted)
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
