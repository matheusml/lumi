import Foundation
import SwiftData

@Observable
final class AdventureViewModel {
    private var modelContext: ModelContext?
    private var problemService = ProblemService()
    private var difficultyManager = DifficultyManager()
    private var adventureLimitService = AdventureLimitService()

    private(set) var problems: [Problem] = []
    private(set) var currentIndex: Int = 0
    private(set) var completedCount: Int = 0
    private(set) var correctCount: Int = 0

    let totalProblems = 5

    var currentProblem: Problem? {
        guard currentIndex < problems.count else { return nil }
        return problems[currentIndex]
    }

    var isComplete: Bool {
        completedCount >= totalProblems
    }

    var progress: Double {
        Double(completedCount) / Double(totalProblems)
    }

    func configure(with context: ModelContext) {
        self.modelContext = context
        problemService.configure(with: context)
        difficultyManager.configure(with: context)
        adventureLimitService.configure(with: context)
    }

    func startAdventure() {
        // Get average difficulty across all activity types
        let avgDifficulty = ProblemType.allCases
            .map { difficultyManager.getDifficulty(for: $0) }
            .reduce(0, +) / max(1, ProblemType.allCases.count)

        let difficulty = max(1, avgDifficulty)
        problems = problemService.getAdventureProblems(difficulty: difficulty)
        currentIndex = 0
        completedCount = 0
        correctCount = 0
    }

    func recordAnswer(correct: Bool) {
        guard let problem = currentProblem else { return }

        // Update difficulty
        difficultyManager.recordAnswer(correct: correct, for: problem.type)

        // Record attempt in progress
        difficultyManager.recordProblemAttempt(correct: correct, for: problem.type)

        if correct {
            correctCount += 1
        }
        completedCount += 1
    }

    func nextProblem() {
        if currentIndex < problems.count - 1 {
            currentIndex += 1
        }
    }

    func completeAdventure() {
        // Increment daily count
        adventureLimitService.incrementCount()

        // Save session
        guard let context = modelContext else { return }

        let session = Session(
            subject: Subject.math.rawValue,
            problemsCompleted: completedCount,
            problemsCorrect: correctCount
        )
        session.endedAt = Date()

        context.insert(session)

        do {
            try context.save()
        } catch {
            print("Error saving session: \(error)")
        }
    }
}
