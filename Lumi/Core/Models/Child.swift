import Foundation
import SwiftData

@Model
final class Child {
    var id: UUID
    var name: String
    var createdAt: Date

    // Settings
    var dailyAdventureLimit: Int
    var preferredLanguage: String
    var autoVoiceOverEnabled: Bool

    // Progress tracking per activity type
    @Relationship(deleteRule: .cascade)
    var activityProgress: [ActivityProgress]

    // Session history
    @Relationship(deleteRule: .cascade)
    var sessions: [Session]

    // Problem history for deduplication
    @Relationship(deleteRule: .cascade)
    var seenProblems: [SeenProblem]

    init(
        id: UUID = UUID(),
        name: String = "",
        createdAt: Date = Date(),
        dailyAdventureLimit: Int = 3,
        preferredLanguage: String = "pt-BR",
        autoVoiceOverEnabled: Bool = false
    ) {
        self.id = id
        self.name = name
        self.createdAt = createdAt
        self.dailyAdventureLimit = dailyAdventureLimit
        self.preferredLanguage = preferredLanguage
        self.autoVoiceOverEnabled = autoVoiceOverEnabled
        self.activityProgress = []
        self.sessions = []
        self.seenProblems = []
    }
}

@Model
final class ActivityProgress {
    var activityType: String
    var currentDifficulty: Int
    var problemsAttempted: Int
    var problemsCorrect: Int
    var lastPlayedAt: Date?

    // For adaptive difficulty
    var consecutiveCorrect: Int
    var consecutiveIncorrect: Int

    @Relationship(inverse: \Child.activityProgress)
    var child: Child?

    init(
        activityType: String,
        currentDifficulty: Int = 1,
        problemsAttempted: Int = 0,
        problemsCorrect: Int = 0,
        lastPlayedAt: Date? = nil
    ) {
        self.activityType = activityType
        self.currentDifficulty = currentDifficulty
        self.problemsAttempted = problemsAttempted
        self.problemsCorrect = problemsCorrect
        self.lastPlayedAt = lastPlayedAt
        self.consecutiveCorrect = 0
        self.consecutiveIncorrect = 0
    }

    var accuracy: Double {
        guard problemsAttempted > 0 else { return 0 }
        return Double(problemsCorrect) / Double(problemsAttempted)
    }

    var accuracyPercentage: Int {
        Int(accuracy * 100)
    }
}
