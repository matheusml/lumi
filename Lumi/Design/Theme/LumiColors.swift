import SwiftUI

/// Lumi's color palette - soft, friendly colors for children
enum LumiColors {
    // MARK: - Primary Colors

    /// Warm coral - primary action color
    static let primary = Color(red: 0.96, green: 0.62, blue: 0.55)

    /// Soft sky blue - secondary accent
    static let secondary = Color(red: 0.55, green: 0.78, blue: 0.94)

    /// Gentle mint - success/correct
    static let success = Color(red: 0.60, green: 0.85, blue: 0.75)

    /// Soft lavender - gentle highlight
    static let accent = Color(red: 0.78, green: 0.70, blue: 0.92)

    // MARK: - Background Colors

    /// Warm cream background
    static let background = Color(red: 0.99, green: 0.97, blue: 0.94)

    /// Slightly darker cream for cards
    static let cardBackground = Color(red: 0.98, green: 0.95, blue: 0.90)

    /// Clean white for content areas
    static let contentBackground = Color.white

    // MARK: - Text Colors

    /// Soft dark brown - primary text
    static let textPrimary = Color(red: 0.30, green: 0.25, blue: 0.22)

    /// Medium brown - secondary text
    static let textSecondary = Color(red: 0.55, green: 0.50, blue: 0.45)

    /// Light brown - placeholder text
    static let textTertiary = Color(red: 0.70, green: 0.65, blue: 0.60)

    // MARK: - Feedback Colors

    /// Gentle green for correct answers
    static let correct = Color(red: 0.55, green: 0.82, blue: 0.65)

    /// Soft orange for try again (not harsh red)
    static let tryAgain = Color(red: 0.95, green: 0.75, blue: 0.55)

    // MARK: - Object Colors (for patterns)

    static let circleRed = Color(red: 0.92, green: 0.55, blue: 0.55)
    static let circleBlue = Color(red: 0.55, green: 0.70, blue: 0.92)
    static let circleGreen = Color(red: 0.60, green: 0.85, blue: 0.65)
    static let circleYellow = Color(red: 0.95, green: 0.85, blue: 0.50)
    static let circlePurple = Color(red: 0.78, green: 0.60, blue: 0.88)
}

// MARK: - Color Extensions

extension Color {
    /// Creates a slightly darker version for pressed states
    func pressed() -> Color {
        self.opacity(0.8)
    }

    /// Creates a lighter version for disabled states
    func disabled() -> Color {
        self.opacity(0.5)
    }
}
