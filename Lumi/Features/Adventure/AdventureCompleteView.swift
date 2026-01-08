import SwiftUI
import SwiftData

struct AdventureCompleteView: View {
    let problemsCorrect: Int
    let totalProblems: Int
    @Binding var navigationPath: NavigationPath

    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @State private var adventureLimitService = AdventureLimitService()
    @State private var showCelebration = false

    var canStartAnother: Bool {
        adventureLimitService.canStartAdventure
    }

    var body: some View {
        ZStack {
            LumiColors.background
                .ignoresSafeArea()

            VStack(spacing: LumiSpacing.xxl) {
                Spacer()

                // Celebration
                VStack(spacing: LumiSpacing.lg) {
                    Text("🎉")
                        .font(.system(size: 100))
                        .scaleEffect(showCelebration ? 1.0 : 0.5)
                        .opacity(showCelebration ? 1.0 : 0)

                    Text("Aventura Completa!")
                        .font(LumiTypography.displayMedium)
                        .foregroundStyle(LumiColors.textPrimary)
                        .opacity(showCelebration ? 1.0 : 0)

                    Text("Muito bem!")
                        .font(LumiTypography.headingLarge)
                        .foregroundStyle(LumiColors.success)
                        .opacity(showCelebration ? 1.0 : 0)
                }

                // Stats (kept simple - no scores or comparison)
                VStack(spacing: LumiSpacing.sm) {
                    Text("Você completou \(totalProblems) problemas!")
                        .font(LumiTypography.bodyLarge)
                        .foregroundStyle(LumiColors.textSecondary)
                }
                .opacity(showCelebration ? 1.0 : 0)

                Spacer()

                // Actions
                VStack(spacing: LumiSpacing.md) {
                    if canStartAnother {
                        LumiButton("Mais uma aventura", style: .primary) {
                            // Save current adventure and start new one
                            saveAndStartNew()
                        }

                        LumiButton("Tchau por agora!", style: .ghost) {
                            saveAndGoHome()
                        }
                    } else {
                        // Daily limit reached
                        VStack(spacing: LumiSpacing.md) {
                            Text("🌙")
                                .font(.system(size: 60))

                            Text("Você completou todas as aventuras de hoje!")
                                .font(LumiTypography.headingSmall)
                                .foregroundStyle(LumiColors.textPrimary)
                                .multilineTextAlignment(.center)

                            Text("Hora de brincar de outras coisas. Até amanhã!")
                                .font(LumiTypography.bodyMedium)
                                .foregroundStyle(LumiColors.textSecondary)
                                .multilineTextAlignment(.center)
                        }
                        .padding(.bottom, LumiSpacing.lg)

                        LumiButton("Tchau por agora!", style: .primary) {
                            saveAndGoHome()
                        }
                    }
                }
                .padding(.horizontal, LumiSpacing.screenHorizontal)
                .opacity(showCelebration ? 1.0 : 0)

                Spacer()
            }
        }
        .onAppear {
            adventureLimitService.configure(with: modelContext)
            // Increment adventure count
            adventureLimitService.incrementCount()

            // Animate celebration
            withAnimation(.spring(response: 0.6, dampingFraction: 0.7).delay(0.2)) {
                showCelebration = true
            }
        }
    }

    private func saveAndStartNew() {
        dismiss()
        // Navigation will show a new adventure
    }

    private func saveAndGoHome() {
        dismiss()
        // Clear navigation back to home
        navigationPath = NavigationPath()
    }
}

#Preview("Can Continue") {
    AdventureCompleteView(
        problemsCorrect: 4,
        totalProblems: 5,
        navigationPath: .constant(NavigationPath())
    )
    .modelContainer(for: [Child.self, Session.self, DailyAdventureCount.self])
}

#Preview("Limit Reached") {
    AdventureCompleteView(
        problemsCorrect: 5,
        totalProblems: 5,
        navigationPath: .constant(NavigationPath())
    )
    .modelContainer(for: [Child.self, Session.self, DailyAdventureCount.self])
}
