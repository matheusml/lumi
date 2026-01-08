import SwiftUI

/// An answer choice button for number-based answers
struct NumberChoice: View {
    let number: Int
    let state: ChoiceState
    let action: () -> Void

    enum ChoiceState {
        case normal
        case selected
        case correct
        case incorrect
    }

    var backgroundColor: Color {
        switch state {
        case .normal: return LumiColors.cardBackground
        case .selected: return LumiColors.secondary
        case .correct: return LumiColors.correct
        case .incorrect: return LumiColors.tryAgain
        }
    }

    var foregroundColor: Color {
        switch state {
        case .normal: return LumiColors.textPrimary
        case .selected, .correct, .incorrect: return .white
        }
    }

    var body: some View {
        Button(action: action) {
            Text("\(number)")
                .font(LumiTypography.numberMedium)
                .foregroundStyle(foregroundColor)
                .frame(width: 80, height: 80)
                .background(
                    RoundedRectangle(cornerRadius: LumiSpacing.radiusMedium)
                        .fill(backgroundColor)
                )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

/// A side choice button for comparison problems (left/right)
struct SideChoice: View {
    let side: String
    let emoji: String
    let count: Int
    let state: NumberChoice.ChoiceState
    let action: () -> Void

    var backgroundColor: Color {
        switch state {
        case .normal: return LumiColors.cardBackground
        case .selected: return LumiColors.secondary.opacity(0.3)
        case .correct: return LumiColors.correct.opacity(0.3)
        case .incorrect: return LumiColors.tryAgain.opacity(0.3)
        }
    }

    var borderColor: Color {
        switch state {
        case .normal: return .clear
        case .selected: return LumiColors.secondary
        case .correct: return LumiColors.correct
        case .incorrect: return LumiColors.tryAgain
        }
    }

    var body: some View {
        Button(action: action) {
            VStack(spacing: LumiSpacing.sm) {
                // Display objects in a grid-like pattern
                LazyVGrid(columns: [
                    GridItem(.fixed(50)),
                    GridItem(.fixed(50)),
                    GridItem(.fixed(50))
                ], spacing: LumiSpacing.xs) {
                    ForEach(0..<count, id: \.self) { _ in
                        Text(emoji)
                            .font(.system(size: 36))
                    }
                }
            }
            .frame(minWidth: 150, minHeight: 150)
            .padding(LumiSpacing.md)
            .background(
                RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                    .fill(backgroundColor)
            )
            .overlay(
                RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                    .stroke(borderColor, lineWidth: 4)
            )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

#Preview("Number Choices") {
    HStack(spacing: LumiSpacing.md) {
        NumberChoice(number: 3, state: .normal) {}
        NumberChoice(number: 4, state: .selected) {}
        NumberChoice(number: 5, state: .correct) {}
        NumberChoice(number: 6, state: .incorrect) {}
    }
    .padding()
    .background(LumiColors.background)
}

#Preview("Side Choices") {
    HStack(spacing: LumiSpacing.lg) {
        SideChoice(side: "left", emoji: "🍎", count: 3, state: .normal) {}
        SideChoice(side: "right", emoji: "🍎", count: 7, state: .selected) {}
    }
    .padding()
    .background(LumiColors.background)
}
