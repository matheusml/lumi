import SwiftUI
import SwiftData

struct SettingsView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @Bindable var adventureLimitService: AdventureLimitService

    @State private var isLimitEnabled: Bool = false
    @State private var dailyLimit: Int = 3
    @State private var showResetConfirmation = false

    var body: some View {
        NavigationStack {
            List {
                // Daily limit section
                Section {
                    Toggle(isOn: $isLimitEnabled) {
                        Text("Limitar aventuras diárias")
                            .font(LumiTypography.bodyMedium)
                            .foregroundStyle(LumiColors.textPrimary)
                    }
                    .onChange(of: isLimitEnabled) { _, enabled in
                        if enabled {
                            adventureLimitService.enableLimit(dailyLimit)
                        } else {
                            adventureLimitService.disableLimit()
                        }
                    }

                    if isLimitEnabled {
                        VStack(alignment: .leading, spacing: LumiSpacing.sm) {
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
                    }
                } header: {
                    Text("Limites")
                } footer: {
                    if !isLimitEnabled {
                        Text("Sem limite, a criança pode jogar quantas aventuras quiser")
                    }
                }

                // Reset section (only show when limit is enabled)
                if isLimitEnabled {
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

                            if let remaining = adventureLimitService.adventuresRemaining {
                                Text("Restantes: \(remaining)")
                                    .font(LumiTypography.bodySmall)
                                    .foregroundStyle(LumiColors.textSecondary)
                            }
                        }
                    } header: {
                        Text("Hoje")
                    }
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
                isLimitEnabled = adventureLimitService.isLimitEnabled
                dailyLimit = adventureLimitService.dailyLimit ?? 3
            }
        }
    }
}

#Preview {
    let service = AdventureLimitService()
    SettingsView(adventureLimitService: service)
        .modelContainer(for: [Child.self, Session.self, DailyAdventureCount.self])
}
