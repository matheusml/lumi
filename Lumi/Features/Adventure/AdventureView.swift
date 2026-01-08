import SwiftUI
import SwiftData

struct AdventureView: View {
    @Binding var navigationPath: NavigationPath
    @Environment(\.modelContext) private var modelContext

    @State private var viewModel = AdventureViewModel()
    @State private var showCompletion = false

    var body: some View {
        ZStack {
            LumiColors.background
                .ignoresSafeArea()

            VStack(spacing: LumiSpacing.lg) {
                // Progress bar
                HStack {
                    Button(action: {
                        navigationPath.removeLast()
                    }) {
                        Image(systemName: "xmark")
                            .font(.title2)
                            .foregroundStyle(LumiColors.textSecondary)
                            .frame(width: 44, height: 44)
                    }

                    Spacer()

                    ProgressDots(
                        completed: viewModel.completedCount,
                        current: viewModel.currentIndex
                    )

                    Spacer()

                    // Spacer for symmetry
                    Color.clear
                        .frame(width: 44, height: 44)
                }
                .padding(.horizontal, LumiSpacing.screenHorizontal)
                .padding(.top, LumiSpacing.md)

                // Problem content
                if let problem = viewModel.currentProblem {
                    ProblemContainerView(
                        problem: problem,
                        onAnswer: { correct in
                            viewModel.recordAnswer(correct: correct)
                        },
                        onNext: {
                            if viewModel.isComplete {
                                showCompletion = true
                            } else {
                                viewModel.nextProblem()
                            }
                        }
                    )
                    .id(problem.id)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    // Loading or error state
                    VStack {
                        Spacer()
                        ProgressView()
                        Text("Carregando...")
                            .font(LumiTypography.bodyMedium)
                            .foregroundStyle(LumiColors.textSecondary)
                        Spacer()
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
        }
        .navigationBarHidden(true)
        .fullScreenCover(isPresented: $showCompletion) {
            AdventureCompleteView(
                problemsCorrect: viewModel.correctCount,
                totalProblems: viewModel.totalProblems,
                navigationPath: $navigationPath
            )
        }
        .onAppear {
            viewModel.configure(with: modelContext)
            viewModel.startAdventure()
        }
    }
}

#Preview {
    AdventureView(navigationPath: .constant(NavigationPath()))
        .modelContainer(for: [Child.self, Session.self, DailyAdventureCount.self])
}
