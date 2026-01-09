import Foundation
import SwiftData

/// Generates and serves problems for adventures using dynamic generation
@Observable
final class ProblemService {
    private var modelContext: ModelContext?

    // Problem generators
    private let generators: [ProblemType: any ProblemGenerator] = [
        .counting: CountingProblemGenerator(),
        .addition: AdditionProblemGenerator(),
        .subtraction: SubtractionProblemGenerator(),
        .comparison: ComparisonProblemGenerator(),
        .patterns: PatternProblemGenerator()
    ]

    // Configuration
    private let evictionThreshold = 0.8
    private let evictionAmount = 0.5

    init() {}

    func configure(with context: ModelContext) {
        self.modelContext = context
    }

    // MARK: - Public API

    /// Get problems for an adventure (5 problems, mixed types)
    func getAdventureProblems(difficulty: Int = 1) -> [Problem] {
        getRandomProblems(count: 5, difficulty: difficulty)
    }

    /// Get problems of a specific type
    func getProblems(type: ProblemType, difficulty: Int, count: Int) -> [Problem] {
        let seenSignatures = loadSeenSignatures(for: type, difficulty: difficulty)
        var adventureSignatures: Set<String> = []
        var problems: [Problem] = []

        guard let generator = generators[type] else { return [] }

        for _ in 0..<count {
            let excluding = seenSignatures.union(adventureSignatures)
            if let (problem, signature) = generator.generate(difficulty: difficulty, excluding: excluding) {
                problems.append(problem)
                adventureSignatures.insert(signature)
            }
        }

        // Mark as seen
        if !adventureSignatures.isEmpty {
            markAsSeen(signatures: adventureSignatures, type: type, difficulty: difficulty)
        }

        return problems
    }

    /// Get random problems mixing different types
    func getRandomProblems(count: Int, difficulty: Int) -> [Problem] {
        let types = ProblemType.allCases
        let seenSignatures = loadAllSeenSignatures(difficulty: difficulty)
        var adventureSignatures: Set<String> = []
        var problems: [Problem] = []

        for _ in 0..<count {
            let type = types.randomElement() ?? .counting
            guard let generator = generators[type] else { continue }

            let excluding = seenSignatures.union(adventureSignatures)
            if let (problem, signature) = generator.generate(difficulty: difficulty, excluding: excluding) {
                problems.append(problem)
                adventureSignatures.insert(signature)
            }
        }

        // Mark as seen
        if !adventureSignatures.isEmpty {
            markAsSeenBatch(signatures: adventureSignatures, difficulty: difficulty)
        }

        return problems
    }

    // MARK: - History Management

    private func loadSeenSignatures(for type: ProblemType, difficulty: Int) -> Set<String> {
        guard let context = modelContext else { return [] }

        let typeRaw = type.rawValue
        let descriptor = FetchDescriptor<SeenProblem>(
            predicate: #Predicate { $0.problemType == typeRaw && $0.difficulty == difficulty }
        )

        do {
            let results = try context.fetch(descriptor)
            return Set(results.map { $0.signature })
        } catch {
            print("Error loading seen signatures: \(error)")
            return []
        }
    }

    private func loadAllSeenSignatures(difficulty: Int) -> Set<String> {
        guard let context = modelContext else { return [] }

        let descriptor = FetchDescriptor<SeenProblem>(
            predicate: #Predicate { $0.difficulty == difficulty }
        )

        do {
            let results = try context.fetch(descriptor)
            return Set(results.map { $0.signature })
        } catch {
            print("Error loading seen signatures: \(error)")
            return []
        }
    }

    private func markAsSeen(signatures: Set<String>, type: ProblemType, difficulty: Int) {
        guard let context = modelContext else { return }

        for signature in signatures {
            let seen = SeenProblem(
                signature: signature,
                problemType: type.rawValue,
                difficulty: difficulty
            )
            context.insert(seen)
        }

        evictIfNeeded(type: type, difficulty: difficulty)

        do {
            try context.save()
        } catch {
            print("Error saving seen problems: \(error)")
        }
    }

    private func markAsSeenBatch(signatures: Set<String>, difficulty: Int) {
        guard let context = modelContext else { return }

        for signature in signatures {
            let type = extractType(from: signature)
            let seen = SeenProblem(
                signature: signature,
                problemType: type,
                difficulty: difficulty
            )
            context.insert(seen)
        }

        // Evict for all types
        for type in ProblemType.allCases {
            evictIfNeeded(type: type, difficulty: difficulty)
        }

        do {
            try context.save()
        } catch {
            print("Error saving seen problems: \(error)")
        }
    }

    private func extractType(from signature: String) -> String {
        // Signature format: "type:d{difficulty}:..."
        let parts = signature.split(separator: ":")
        return parts.first.map(String.init) ?? "counting"
    }

    private func evictIfNeeded(type: ProblemType, difficulty: Int) {
        guard let context = modelContext,
              let generator = generators[type] else { return }

        let totalPossible = generator.allPossibleSignatures(difficulty: difficulty).count
        guard totalPossible > 0 else { return }

        let typeRaw = type.rawValue
        let descriptor = FetchDescriptor<SeenProblem>(
            predicate: #Predicate { $0.problemType == typeRaw && $0.difficulty == difficulty },
            sortBy: [SortDescriptor(\.seenAt)]
        )

        do {
            let seen = try context.fetch(descriptor)
            let saturation = Double(seen.count) / Double(totalPossible)

            if saturation > evictionThreshold {
                // Remove oldest entries (evictionAmount %)
                let toRemove = Int(Double(seen.count) * evictionAmount)
                for i in 0..<toRemove {
                    context.delete(seen[i])
                }
            }
        } catch {
            print("Error checking eviction: \(error)")
        }
    }
}
