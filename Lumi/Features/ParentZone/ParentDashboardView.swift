import SwiftUI
import SwiftData

struct ParentDashboardView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @Query private var activityProgress: [ActivityProgress]
    @Query(sort: \Session.startedAt, order: .reverse) private var sessions: [Session]

    @State private var adventureLimitService = AdventureLimitService()
    @State private var showSettings = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: LumiSpacing.xl) {
                    // Today's summary
                    todaySummaryCard

                    // Activity progress
                    activityProgressCard

                    // Recent sessions
                    recentSessionsCard
                }
                .padding(LumiSpacing.screenHorizontal)
            }
            .background(LumiColors.background)
            .navigationTitle("Área dos Pais")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Fechar") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: { showSettings = true }) {
                        Image(systemName: "gearshape.fill")
                    }
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsView(adventureLimitService: adventureLimitService)
            }
        }
        .onAppear {
            adventureLimitService.configure(with: modelContext)
        }
    }

    private var todaySummaryCard: some View {
        VStack(alignment: .leading, spacing: LumiSpacing.md) {
            Text("Hoje")
                .font(LumiTypography.headingMedium)
                .foregroundStyle(LumiColors.textPrimary)

            HStack(spacing: LumiSpacing.xl) {
                statItem(
                    title: "Aventuras",
                    value: "\(adventureLimitService.todayCount)",
                    subtitle: "de \(adventureLimitService.dailyLimit)"
                )

                statItem(
                    title: "Problemas",
                    value: "\(todayProblemsCompleted)",
                    subtitle: "resolvidos"
                )

                statItem(
                    title: "Precisão",
                    value: "\(todayAccuracy)%",
                    subtitle: "acertos"
                )
            }
        }
        .padding(LumiSpacing.cardPadding)
        .background(
            RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                .fill(LumiColors.contentBackground)
        )
    }

    private var activityProgressCard: some View {
        VStack(alignment: .leading, spacing: LumiSpacing.md) {
            Text("Progresso por Atividade")
                .font(LumiTypography.headingMedium)
                .foregroundStyle(LumiColors.textPrimary)

            VStack(spacing: LumiSpacing.sm) {
                ForEach(ProblemType.allCases, id: \.rawValue) { type in
                    activityRow(for: type)
                }
            }
        }
        .padding(LumiSpacing.cardPadding)
        .background(
            RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                .fill(LumiColors.contentBackground)
        )
    }

    @ViewBuilder
    private func activityRow(for type: ProblemType) -> some View {
        let progress = activityProgress.first { $0.activityType == type.rawValue }

        HStack {
            Text(type.displayName)
                .font(LumiTypography.bodyMedium)
                .foregroundStyle(LumiColors.textPrimary)

            Spacer()

            if let progress = progress {
                HStack(spacing: LumiSpacing.md) {
                    // Difficulty level
                    Text("Nível \(progress.currentDifficulty)")
                        .font(LumiTypography.bodySmall)
                        .foregroundStyle(LumiColors.textSecondary)

                    // Accuracy
                    Text("\(progress.accuracyPercentage)%")
                        .font(LumiTypography.bodyMedium)
                        .foregroundStyle(accuracyColor(progress.accuracyPercentage))
                }
            } else {
                Text("Não iniciado")
                    .font(LumiTypography.bodySmall)
                    .foregroundStyle(LumiColors.textTertiary)
            }
        }
        .padding(.vertical, LumiSpacing.xs)
    }

    private var recentSessionsCard: some View {
        VStack(alignment: .leading, spacing: LumiSpacing.md) {
            Text("Aventuras Recentes")
                .font(LumiTypography.headingMedium)
                .foregroundStyle(LumiColors.textPrimary)

            if sessions.isEmpty {
                Text("Nenhuma aventura ainda")
                    .font(LumiTypography.bodyMedium)
                    .foregroundStyle(LumiColors.textSecondary)
                    .padding(.vertical, LumiSpacing.md)
            } else {
                VStack(spacing: LumiSpacing.sm) {
                    ForEach(sessions.prefix(5)) { session in
                        sessionRow(session)
                    }
                }
            }
        }
        .padding(LumiSpacing.cardPadding)
        .background(
            RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                .fill(LumiColors.contentBackground)
        )
    }

    @ViewBuilder
    private func sessionRow(_ session: Session) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(session.startedAt.formatted(style: .medium))
                    .font(LumiTypography.bodyMedium)
                    .foregroundStyle(LumiColors.textPrimary)

                Text("\(session.problemsCompleted) problemas")
                    .font(LumiTypography.bodySmall)
                    .foregroundStyle(LumiColors.textSecondary)
            }

            Spacer()

            Text("\(Int(session.accuracy * 100))%")
                .font(LumiTypography.bodyMedium)
                .foregroundStyle(accuracyColor(Int(session.accuracy * 100)))
        }
        .padding(.vertical, LumiSpacing.xs)
    }

    @ViewBuilder
    private func statItem(title: String, value: String, subtitle: String) -> some View {
        VStack(spacing: LumiSpacing.xs) {
            Text(value)
                .font(LumiTypography.numberMedium)
                .foregroundStyle(LumiColors.primary)

            Text(title)
                .font(LumiTypography.bodySmall)
                .foregroundStyle(LumiColors.textPrimary)

            Text(subtitle)
                .font(LumiTypography.bodySmall)
                .foregroundStyle(LumiColors.textTertiary)
        }
        .frame(maxWidth: .infinity)
    }

    private func accuracyColor(_ percentage: Int) -> Color {
        switch percentage {
        case 80...100: return LumiColors.success
        case 60..<80: return LumiColors.secondary
        default: return LumiColors.tryAgain
        }
    }

    private var todayProblemsCompleted: Int {
        sessions
            .filter { Calendar.current.isDateInToday($0.startedAt) }
            .reduce(0) { $0 + $1.problemsCompleted }
    }

    private var todayAccuracy: Int {
        let todaySessions = sessions.filter { Calendar.current.isDateInToday($0.startedAt) }
        let totalCompleted = todaySessions.reduce(0) { $0 + $1.problemsCompleted }
        let totalCorrect = todaySessions.reduce(0) { $0 + $1.problemsCorrect }
        guard totalCompleted > 0 else { return 0 }
        return Int((Double(totalCorrect) / Double(totalCompleted)) * 100)
    }
}

#Preview {
    ParentDashboardView()
        .modelContainer(for: [Child.self, Session.self, DailyAdventureCount.self, ActivityProgress.self])
}
