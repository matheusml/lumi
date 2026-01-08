import Foundation
import SwiftData

/// Manages adaptive difficulty based on performance
@Observable
final class DifficultyManager {
    private var modelContext: ModelContext?

    // Track consecutive answers per activity type (in-memory for current session)
    private var consecutiveCorrect: [String: Int] = [:]
    private var consecutiveIncorrect: [String: Int] = [:]

    // Current difficulty per activity type
    private var currentDifficulty: [String: Int] = [:]

    static let minDifficulty = 1
    static let maxDifficulty = 4
    static let correctToLevelUp = 3
    static let incorrectToLevelDown = 2

    func configure(with context: ModelContext) {
        self.modelContext = context
        loadProgress()
    }

    private func loadProgress() {
        guard let context = modelContext else { return }

        let descriptor = FetchDescriptor<ActivityProgress>()

        do {
            let results = try context.fetch(descriptor)
            for progress in results {
                currentDifficulty[progress.activityType] = progress.currentDifficulty
                consecutiveCorrect[progress.activityType] = progress.consecutiveCorrect
                consecutiveIncorrect[progress.activityType] = progress.consecutiveIncorrect
            }
        } catch {
            print("Error loading progress: \(error)")
        }
    }

    func getDifficulty(for activityType: String) -> Int {
        return currentDifficulty[activityType] ?? Self.minDifficulty
    }

    func getDifficulty(for activityType: ProblemType) -> Int {
        return getDifficulty(for: activityType.rawValue)
    }

    /// Records an answer and returns the new difficulty level
    @discardableResult
    func recordAnswer(correct: Bool, for activityType: String) -> Int {
        let currentLevel = currentDifficulty[activityType] ?? Self.minDifficulty

        if correct {
            consecutiveCorrect[activityType, default: 0] += 1
            consecutiveIncorrect[activityType] = 0

            // Level up after 3 correct in a row
            if consecutiveCorrect[activityType, default: 0] >= Self.correctToLevelUp {
                let newLevel = min(currentLevel + 1, Self.maxDifficulty)
                currentDifficulty[activityType] = newLevel
                consecutiveCorrect[activityType] = 0
                saveProgress(activityType: activityType)
                return newLevel
            }
        } else {
            consecutiveIncorrect[activityType, default: 0] += 1
            consecutiveCorrect[activityType] = 0

            // Level down after 2 incorrect in a row
            if consecutiveIncorrect[activityType, default: 0] >= Self.incorrectToLevelDown {
                let newLevel = max(currentLevel - 1, Self.minDifficulty)
                currentDifficulty[activityType] = newLevel
                consecutiveIncorrect[activityType] = 0
                saveProgress(activityType: activityType)
                return newLevel
            }
        }

        saveProgress(activityType: activityType)
        return currentLevel
    }

    @discardableResult
    func recordAnswer(correct: Bool, for activityType: ProblemType) -> Int {
        return recordAnswer(correct: correct, for: activityType.rawValue)
    }

    private func saveProgress(activityType: String) {
        guard let context = modelContext else { return }

        let descriptor = FetchDescriptor<ActivityProgress>(
            predicate: #Predicate { $0.activityType == activityType }
        )

        do {
            let results = try context.fetch(descriptor)
            let progress: ActivityProgress

            if let existing = results.first {
                progress = existing
            } else {
                progress = ActivityProgress(activityType: activityType)
                context.insert(progress)
            }

            progress.currentDifficulty = currentDifficulty[activityType] ?? Self.minDifficulty
            progress.consecutiveCorrect = consecutiveCorrect[activityType] ?? 0
            progress.consecutiveIncorrect = consecutiveIncorrect[activityType] ?? 0
            progress.lastPlayedAt = Date()

            try context.save()
        } catch {
            print("Error saving progress: \(error)")
        }
    }

    func recordProblemAttempt(correct: Bool, for activityType: String) {
        guard let context = modelContext else { return }

        let descriptor = FetchDescriptor<ActivityProgress>(
            predicate: #Predicate { $0.activityType == activityType }
        )

        do {
            let results = try context.fetch(descriptor)
            let progress: ActivityProgress

            if let existing = results.first {
                progress = existing
            } else {
                progress = ActivityProgress(activityType: activityType)
                context.insert(progress)
            }

            progress.problemsAttempted += 1
            if correct {
                progress.problemsCorrect += 1
            }

            try context.save()
        } catch {
            print("Error recording problem attempt: \(error)")
        }
    }
}
