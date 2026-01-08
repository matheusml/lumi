import Foundation
import SwiftData

@Model
final class Session {
    var id: UUID
    var startedAt: Date
    var endedAt: Date?
    var subject: String
    var problemsCompleted: Int
    var problemsCorrect: Int

    @Relationship(inverse: \Child.sessions)
    var child: Child?

    init(
        id: UUID = UUID(),
        startedAt: Date = Date(),
        endedAt: Date? = nil,
        subject: String = Subject.math.rawValue,
        problemsCompleted: Int = 0,
        problemsCorrect: Int = 0
    ) {
        self.id = id
        self.startedAt = startedAt
        self.endedAt = endedAt
        self.subject = subject
        self.problemsCompleted = problemsCompleted
        self.problemsCorrect = problemsCorrect
    }

    var isComplete: Bool {
        problemsCompleted >= 5
    }

    var accuracy: Double {
        guard problemsCompleted > 0 else { return 0 }
        return Double(problemsCorrect) / Double(problemsCompleted)
    }
}
