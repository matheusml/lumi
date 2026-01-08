import SwiftUI
import SwiftData

struct HomeView: View {
    @Binding var navigationPath: NavigationPath
    @Environment(\.modelContext) private var modelContext

    @State private var adventureLimitService = AdventureLimitService()
    @State private var showParentGate = false

    var body: some View {
        ZStack {
            LumiColors.background
                .ignoresSafeArea()

            VStack(spacing: LumiSpacing.xxl) {
                Spacer()

                // Greeting
                VStack(spacing: LumiSpacing.md) {
                    Text("☀️")
                        .font(.system(size: 80))

                    Text("Olá!")
                        .font(LumiTypography.displayLarge)
                        .foregroundStyle(LumiColors.textPrimary)
                }

                Spacer()

                // Main action
                VStack(spacing: LumiSpacing.lg) {
                    if adventureLimitService.canStartAdventure {
                        LumiButton("Começar Aventura") {
                            navigationPath.append(AppDestination.adventure)
                        }

                        // Show remaining adventures
                        Text("Aventuras hoje: \(adventureLimitService.todayCount) de \(adventureLimitService.dailyLimit)")
                            .font(LumiTypography.bodyMedium)
                            .foregroundStyle(LumiColors.textSecondary)
                    } else {
                        // Daily limit reached
                        VStack(spacing: LumiSpacing.md) {
                            Text("🌙")
                                .font(.system(size: 60))

                            Text("Você completou todas as aventuras de hoje!")
                                .font(LumiTypography.headingMedium)
                                .foregroundStyle(LumiColors.textPrimary)
                                .multilineTextAlignment(.center)

                            Text("Hora de brincar de outras coisas. Até amanhã!")
                                .font(LumiTypography.bodyLarge)
                                .foregroundStyle(LumiColors.textSecondary)
                                .multilineTextAlignment(.center)
                        }
                        .padding(LumiSpacing.xl)
                    }
                }
                .padding(.horizontal, LumiSpacing.screenHorizontal)

                Spacer()

                // Parent zone button
                Button(action: {
                    showParentGate = true
                }) {
                    HStack(spacing: LumiSpacing.sm) {
                        Image(systemName: "lock.fill")
                        Text("Área dos Pais")
                    }
                    .font(LumiTypography.bodyMedium)
                    .foregroundStyle(LumiColors.textSecondary)
                    .padding(LumiSpacing.md)
                }
                .padding(.bottom, LumiSpacing.lg)
            }
        }
        .navigationBarHidden(true)
        .sheet(isPresented: $showParentGate) {
            ParentGateView(isPresented: $showParentGate) {
                navigationPath.append(AppDestination.parentZone)
            }
        }
        .onAppear {
            adventureLimitService.configure(with: modelContext, limit: 3)
        }
    }
}

#Preview {
    NavigationStack {
        HomeView(navigationPath: .constant(NavigationPath()))
    }
    .modelContainer(for: [Child.self, Session.self, DailyAdventureCount.self])
}
