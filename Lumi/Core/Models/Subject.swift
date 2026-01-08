import Foundation

/// Available subjects in Lumi
enum Subject: String, Codable, CaseIterable {
    case math = "math"
    // Future subjects:
    // case grammar = "grammar"
    // case science = "science"

    var displayName: String {
        switch self {
        case .math: return "Matemática"
        }
    }

    var icon: String {
        switch self {
        case .math: return "🔢"
        }
    }
}

/// Types of math problems
enum ProblemType: String, Codable, CaseIterable {
    case counting = "counting"
    case addition = "addition"
    case subtraction = "subtraction"
    case comparison = "comparison"
    case patterns = "patterns"

    var displayName: String {
        switch self {
        case .counting: return "Contagem"
        case .addition: return "Adição"
        case .subtraction: return "Subtração"
        case .comparison: return "Comparação"
        case .patterns: return "Sequências"
        }
    }
}
