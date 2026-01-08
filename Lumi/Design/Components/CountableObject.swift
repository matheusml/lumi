import SwiftUI

/// A tappable object for counting exercises
struct CountableObject: View {
    let emoji: String
    let isCounted: Bool
    let onTap: () -> Void

    @State private var showTapEffect = false

    var body: some View {
        Button(action: {
            onTap()
            showTapEffect = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                showTapEffect = false
            }
        }) {
            Text(emoji)
                .font(.system(size: 50))
                .frame(width: LumiSpacing.largeTouchTarget, height: LumiSpacing.largeTouchTarget)
                .background(
                    Circle()
                        .fill(isCounted ? LumiColors.success.opacity(0.3) : LumiColors.cardBackground)
                )
                .overlay(
                    Circle()
                        .stroke(isCounted ? LumiColors.success : .clear, lineWidth: 3)
                )
                .scaleEffect(showTapEffect ? 1.2 : 1.0)
                .animation(.spring(response: 0.3, dampingFraction: 0.6), value: showTapEffect)
        }
        .buttonStyle(.plain)
    }
}

/// Maps object names to emoji
enum ObjectEmoji {
    static func emoji(for object: String) -> String {
        switch object.lowercased() {
        case "apple", "maçã": return "🍎"
        case "star", "estrela": return "⭐"
        case "bird", "pássaro": return "🐦"
        case "banana": return "🍌"
        case "flower", "flor": return "🌸"
        case "heart", "coração": return "❤️"
        case "fish", "peixe": return "🐟"
        case "butterfly", "borboleta": return "🦋"
        case "sun", "sol": return "☀️"
        case "moon", "lua": return "🌙"
        case "cat", "gato": return "🐱"
        case "dog", "cachorro": return "🐶"
        case "ball", "bola": return "⚽"
        case "book", "livro": return "📚"
        case "pencil", "lápis": return "✏️"
        case "circle_red": return "🔴"
        case "circle_blue": return "🔵"
        case "circle_green": return "🟢"
        case "circle_yellow": return "🟡"
        case "circle_purple": return "🟣"
        case "square_red": return "🟥"
        case "square_blue": return "🟦"
        case "square_green": return "🟩"
        case "square_yellow": return "🟨"
        case "unknown", "?": return "❓"
        default: return "⭐"
        }
    }
}

#Preview {
    HStack(spacing: LumiSpacing.md) {
        CountableObject(emoji: "🍎", isCounted: false) {}
        CountableObject(emoji: "🍎", isCounted: true) {}
        CountableObject(emoji: "⭐", isCounted: false) {}
    }
    .padding()
    .background(LumiColors.background)
}
