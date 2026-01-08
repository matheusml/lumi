import Foundation

// MARK: - Problem Bank (loaded from JSON)

struct ProblemBank: Codable {
    let subject: String
    let problems: [Problem]
}

// MARK: - Problem

struct Problem: Codable, Identifiable {
    let id: String
    let type: String
    let difficulty: Int
    let visual: VisualConfiguration
    let prompt: LocalizedString
    let correctAnswer: AnswerValue
    let answerChoices: [AnswerValue]?
    let hints: [LocalizedString]?

    var problemType: ProblemType? {
        ProblemType(rawValue: type)
    }
}

// MARK: - Localized String

struct LocalizedString: Codable {
    let ptBR: String
    let en: String?

    enum CodingKeys: String, CodingKey {
        case ptBR = "ptBR"
        case en
    }

    func localized(for locale: String = "pt-BR") -> String {
        switch locale {
        case "en": return en ?? ptBR
        default: return ptBR
        }
    }
}

// MARK: - Visual Configuration

struct VisualConfiguration: Codable {
    let type: String
    let elements: [VisualElement]

    var visualType: VisualType? {
        VisualType(rawValue: type)
    }
}

enum VisualType: String, Codable {
    case objects
    case equation
    case pattern
    case comparison
}

struct VisualElement: Codable {
    let object: String
    let count: Int?
    let position: String?
}

// MARK: - Answer Value

enum AnswerValue: Codable, Equatable, Hashable {
    case number(Int)
    case object(String)
    case pattern([String])

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()

        // Try to decode as a dictionary first
        if let dict = try? container.decode([String: AnyCodableValue].self) {
            if let number = dict["number"]?.intValue {
                self = .number(number)
                return
            }
            if let object = dict["object"]?.stringValue {
                self = .object(object)
                return
            }
            if let pattern = dict["pattern"]?.arrayValue {
                self = .pattern(pattern.compactMap { $0.stringValue })
                return
            }
        }

        // Try as plain int
        if let intValue = try? container.decode(Int.self) {
            self = .number(intValue)
            return
        }

        // Try as plain string
        if let stringValue = try? container.decode(String.self) {
            self = .object(stringValue)
            return
        }

        throw DecodingError.typeMismatch(
            AnswerValue.self,
            DecodingError.Context(
                codingPath: decoder.codingPath,
                debugDescription: "Unable to decode AnswerValue"
            )
        )
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .number(let value):
            try container.encode(["number": value])
        case .object(let value):
            try container.encode(["object": value])
        case .pattern(let values):
            try container.encode(["pattern": values])
        }
    }

    var displayValue: String {
        switch self {
        case .number(let n): return "\(n)"
        case .object(let s): return s
        case .pattern(let arr): return arr.joined(separator: ", ")
        }
    }

    var intValue: Int? {
        if case .number(let n) = self { return n }
        return nil
    }

    var stringValue: String? {
        if case .object(let s) = self { return s }
        return nil
    }
}

// MARK: - Helper for flexible JSON decoding

struct AnyCodableValue: Codable {
    let value: Any

    var intValue: Int? { value as? Int }
    var stringValue: String? { value as? String }
    var arrayValue: [AnyCodableValue]? { value as? [AnyCodableValue] }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let int = try? container.decode(Int.self) {
            value = int
        } else if let string = try? container.decode(String.self) {
            value = string
        } else if let array = try? container.decode([AnyCodableValue].self) {
            value = array
        } else {
            value = ""
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        if let int = value as? Int {
            try container.encode(int)
        } else if let string = value as? String {
            try container.encode(string)
        } else if let array = value as? [AnyCodableValue] {
            try container.encode(array)
        }
    }
}
