import SwiftUI

/// A circular button with a speaker icon that triggers text-to-speech
struct SpeakerButton: View {
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: "speaker.wave.2.fill")
                .font(.system(size: 24, weight: .medium))
                .foregroundStyle(LumiColors.primary)
                .frame(width: 52, height: 52)
                .background(
                    Circle()
                        .fill(LumiColors.cardBackground)
                )
        }
        .buttonStyle(ScaleButtonStyle())
        .accessibilityLabel("Ouvir problema")
    }
}

#Preview {
    ZStack {
        LumiColors.background.ignoresSafeArea()

        VStack(spacing: LumiSpacing.lg) {
            HStack {
                Text("Quantas maçãs você vê?")
                    .font(LumiTypography.headingMedium)
                    .foregroundStyle(LumiColors.textPrimary)

                SpeakerButton {
                    print("Speaker tapped")
                }
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: LumiSpacing.radiusMedium)
                    .fill(LumiColors.contentBackground)
            )
        }
        .padding()
    }
}
