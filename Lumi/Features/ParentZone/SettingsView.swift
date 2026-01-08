import SwiftUI
import SwiftData

struct SettingsView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @Bindable var adventureLimitService: AdventureLimitService

    @State private var dailyLimit: Int = 3
    @State private var showResetConfirmation = false

    var body: some View {
        NavigationStack {
            List {
                // Daily limit section
                Section {
                    VStack(alignment: .leading, spacing: LumiSpacing.sm) {
                        Text("Limite diário de aventuras")
                            .font(LumiTypography.bodyMedium)
                            .foregroundStyle(LumiColors.textPrimary)

                        Stepper(
                            "\(dailyLimit) aventuras por dia",
                            value: $dailyLimit,
                            in: 1...10
                        )
                        .onChange(of: dailyLimit) { _, newValue in
                            adventureLimitService.updateLimit(newValue)
                        }

                        Text("Define quantas aventuras a criança pode completar por dia")
                            .font(LumiTypography.bodySmall)
                            .foregroundStyle(LumiColors.textSecondary)
                    }
                } header: {
                    Text("Limites")
                }

                // Reset section
                Section {
                    Button(action: { showResetConfirmation = true }) {
                        HStack {
                            Text("Reiniciar contagem de hoje")
                                .foregroundStyle(LumiColors.primary)
                            Spacer()
                            Image(systemName: "arrow.counterclockwise")
                                .foregroundStyle(LumiColors.primary)
                        }
                    }

                    VStack(alignment: .leading, spacing: LumiSpacing.xs) {
                        Text("Aventuras hoje: \(adventureLimitService.todayCount)")
                            .font(LumiTypography.bodyMedium)
                            .foregroundStyle(LumiColors.textPrimary)

                        Text("Restantes: \(adventureLimitService.adventuresRemaining)")
                            .font(LumiTypography.bodySmall)
                            .foregroundStyle(LumiColors.textSecondary)
                    }
                } header: {
                    Text("Hoje")
                }

                // About section
                Section {
                    VStack(alignment: .leading, spacing: LumiSpacing.sm) {
                        Text("Lumi")
                            .font(LumiTypography.headingSmall)
                            .foregroundStyle(LumiColors.textPrimary)

                        Text("Aprendizado matemático para crianças de 4-7 anos")
                            .font(LumiTypography.bodySmall)
                            .foregroundStyle(LumiColors.textSecondary)

                        Text("Sem anúncios • Sem compras • Sem vícios")
                            .font(LumiTypography.bodySmall)
                            .foregroundStyle(LumiColors.success)
                    }
                } header: {
                    Text("Sobre")
                }
            }
            .navigationTitle("Configurações")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Feito") {
                        dismiss()
                    }
                }
            }
            .alert("Reiniciar contagem?", isPresented: $showResetConfirmation) {
                Button("Cancelar", role: .cancel) {}
                Button("Reiniciar", role: .destructive) {
                    adventureLimitService.resetTodayCount()
                }
            } message: {
                Text("Isso permitirá que a criança faça mais aventuras hoje.")
            }
            .onAppear {
                dailyLimit = adventureLimitService.dailyLimit
            }
        }
    }
}

#Preview {
    let service = AdventureLimitService()
    SettingsView(adventureLimitService: service)
        .modelContainer(for: [Child.self, Session.self, DailyAdventureCount.self])
}
