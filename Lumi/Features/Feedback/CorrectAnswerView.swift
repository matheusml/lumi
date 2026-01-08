import SwiftUI

struct CorrectAnswerView: View {
    let onContinue: () -> Void

    @State private var showAnimation = false

    var body: some View {
        VStack(spacing: LumiSpacing.xl) {
            // Celebration emoji
            Text("✨")
                .font(.system(size: 80))
                .scaleEffect(showAnimation ? 1.0 : 0.5)
                .rotationEffect(.degrees(showAnimation ? 0 : -20))

            // Message
            Text("Isso mesmo!")
                .font(LumiTypography.displayMedium)
                .foregroundStyle(LumiColors.success)
                .scaleEffect(showAnimation ? 1.0 : 0.8)

            // Continue button
            LumiButton("Continuar", style: .primary) {
                onContinue()
            }
            .frame(maxWidth: 200)
            .opacity(showAnimation ? 1.0 : 0)
        }
        .padding(LumiSpacing.xl)
        .background(
            RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                .fill(LumiColors.contentBackground)
                .shadow(color: .black.opacity(0.1), radius: 20, y: 10)
        )
        .padding(LumiSpacing.screenHorizontal)
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                showAnimation = true
            }
        }
    }
}

#Preview {
    ZStack {
        LumiColors.background
            .ignoresSafeArea()

        CorrectAnswerView {}
    }
}
