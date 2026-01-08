import SwiftUI

/// A child-friendly button with large touch targets and gentle animations
struct LumiButton: View {
    let title: String
    let style: ButtonStyle
    let action: () -> Void

    @State private var isPressed = false

    enum ButtonStyle {
        case primary
        case secondary
        case ghost

        var backgroundColor: Color {
            switch self {
            case .primary: return LumiColors.primary
            case .secondary: return LumiColors.secondary
            case .ghost: return .clear
            }
        }

        var foregroundColor: Color {
            switch self {
            case .primary, .secondary: return .white
            case .ghost: return LumiColors.primary
            }
        }
    }

    init(_ title: String, style: ButtonStyle = .primary, action: @escaping () -> Void) {
        self.title = title
        self.style = style
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(LumiTypography.buttonLarge)
                .foregroundStyle(style.foregroundColor)
                .frame(maxWidth: .infinity)
                .frame(height: LumiSpacing.largeTouchTarget)
                .background(
                    RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                        .fill(style.backgroundColor)
                        .opacity(isPressed ? 0.8 : 1.0)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                        .stroke(style == .ghost ? LumiColors.primary : .clear, lineWidth: 2)
                )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

/// A button style that scales slightly when pressed
struct ScaleButtonStyle: SwiftUI.ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.96 : 1.0)
            .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)
    }
}

/// A circular button for answer choices
struct ChoiceButton: View {
    let content: String
    let isSelected: Bool
    let isCorrect: Bool?
    let action: () -> Void

    var backgroundColor: Color {
        if let isCorrect {
            return isCorrect ? LumiColors.correct : LumiColors.tryAgain
        }
        return isSelected ? LumiColors.secondary : LumiColors.cardBackground
    }

    var body: some View {
        Button(action: action) {
            Text(content)
                .font(LumiTypography.numberMedium)
                .foregroundStyle(isSelected ? .white : LumiColors.textPrimary)
                .frame(width: LumiSpacing.largeTouchTarget + 20, height: LumiSpacing.largeTouchTarget + 20)
                .background(
                    Circle()
                        .fill(backgroundColor)
                )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

#Preview("LumiButton Styles") {
    VStack(spacing: LumiSpacing.lg) {
        LumiButton("Começar Aventura", style: .primary) {}
        LumiButton("Mais uma aventura", style: .secondary) {}
        LumiButton("Tchau por agora!", style: .ghost) {}
    }
    .padding()
    .background(LumiColors.background)
}

#Preview("Choice Buttons") {
    HStack(spacing: LumiSpacing.md) {
        ChoiceButton(content: "3", isSelected: false, isCorrect: nil) {}
        ChoiceButton(content: "4", isSelected: true, isCorrect: nil) {}
        ChoiceButton(content: "5", isSelected: false, isCorrect: true) {}
        ChoiceButton(content: "6", isSelected: false, isCorrect: false) {}
    }
    .padding()
    .background(LumiColors.background)
}
