import Foundation
import SwiftData

@Model
final class SeenProblem {
    var signature: String
    var seenAt: Date
    var problemType: String
    var difficulty: Int

    @Relationship(inverse: \Child.seenProblems)
    var child: Child?

    init(
        signature: String,
        seenAt: Date = Date(),
        problemType: String,
        difficulty: Int
    ) {
        self.signature = signature
        self.seenAt = seenAt
        self.problemType = problemType
        self.difficulty = difficulty
    }
}
