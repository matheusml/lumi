import SwiftUI

struct TryAgainView: View {
    let onTryAgain: () -> Void

    @State private var showAnimation = false

    var body: some View {
        VStack(spacing: LumiSpacing.xl) {
            // Encouraging emoji
            Text("🤔")
                .font(.system(size: 80))
                .scaleEffect(showAnimation ? 1.0 : 0.5)

            // Message
            VStack(spacing: LumiSpacing.sm) {
                Text("Tente de novo!")
                    .font(LumiTypography.headingLarge)
                    .foregroundStyle(LumiColors.textPrimary)

                Text("Você consegue!")
                    .font(LumiTypography.bodyLarge)
                    .foregroundStyle(LumiColors.textSecondary)
            }
            .scaleEffect(showAnimation ? 1.0 : 0.8)

            // Try again button
            LumiButton("Tentar", style: .secondary) {
                onTryAgain()
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

        TryAgainView {}
    }
}
