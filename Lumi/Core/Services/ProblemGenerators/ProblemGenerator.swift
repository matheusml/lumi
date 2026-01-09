import Foundation

/// Protocol for dynamic problem generation
protocol ProblemGenerator {
    /// The type of problems this generator creates
    var problemType: ProblemType { get }

    /// Generate a problem for the given difficulty, excluding problems with signatures in the set
    /// - Parameters:
    ///   - difficulty: The difficulty level (1-4)
    ///   - excluding: Set of signatures to avoid
    /// - Returns: A tuple of (Problem, signature) or nil if no unique problem can be generated
    func generate(difficulty: Int, excluding: Set<String>) -> (problem: Problem, signature: String)?

    /// Returns all possible signatures for a given difficulty level
    /// Used to calculate saturation for history eviction
    func allPossibleSignatures(difficulty: Int) -> [String]
}

/// Available visual objects for problems
enum VisualObject: String, CaseIterable {
    case apple
    case star
    case bird
    case banana
    case flower
    case heart
    case butterfly
    case fish

    var namePtBR: String {
        switch self {
        case .apple: return "maçãs"
        case .star: return "estrelas"
        case .bird: return "pássaros"
        case .banana: return "bananas"
        case .flower: return "flores"
        case .heart: return "corações"
        case .butterfly: return "borboletas"
        case .fish: return "peixes"
        }
    }

    var nameEn: String {
        switch self {
        case .apple: return "apples"
        case .star: return "stars"
        case .bird: return "birds"
        case .banana: return "bananas"
        case .flower: return "flowers"
        case .heart: return "hearts"
        case .butterfly: return "butterflies"
        case .fish: return "fish"
        }
    }

    var singularPtBR: String {
        switch self {
        case .apple: return "maçã"
        case .star: return "estrela"
        case .bird: return "pássaro"
        case .banana: return "banana"
        case .flower: return "flor"
        case .heart: return "coração"
        case .butterfly: return "borboleta"
        case .fish: return "peixe"
        }
    }
}

/// Pattern colors for pattern problems
enum PatternColor: String, CaseIterable {
    case red = "circle_red"
    case blue = "circle_blue"
    case green = "circle_green"
    case yellow = "circle_yellow"
}
