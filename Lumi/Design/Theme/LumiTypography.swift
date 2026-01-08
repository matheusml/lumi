import SwiftUI

/// Lumi's typography system - approachable, readable fonts for children
enum LumiTypography {
    // MARK: - Display Styles (for big moments)

    /// Large celebration text
    static let displayLarge = Font.system(size: 48, weight: .bold, design: .rounded)

    /// Medium display for titles
    static let displayMedium = Font.system(size: 36, weight: .bold, design: .rounded)

    // MARK: - Heading Styles

    /// Primary headings
    static let headingLarge = Font.system(size: 28, weight: .semibold, design: .rounded)

    /// Secondary headings
    static let headingMedium = Font.system(size: 22, weight: .semibold, design: .rounded)

    /// Small headings
    static let headingSmall = Font.system(size: 18, weight: .semibold, design: .rounded)

    // MARK: - Body Styles

    /// Primary body text
    static let bodyLarge = Font.system(size: 20, weight: .regular, design: .rounded)

    /// Standard body text
    static let bodyMedium = Font.system(size: 17, weight: .regular, design: .rounded)

    /// Small body text
    static let bodySmall = Font.system(size: 14, weight: .regular, design: .rounded)

    // MARK: - Button Styles

    /// Large button text
    static let buttonLarge = Font.system(size: 22, weight: .semibold, design: .rounded)

    /// Standard button text
    static let buttonMedium = Font.system(size: 18, weight: .semibold, design: .rounded)

    // MARK: - Number Styles (for math problems)

    /// Large numbers for equations
    static let numberLarge = Font.system(size: 56, weight: .bold, design: .rounded)

    /// Medium numbers for choices
    static let numberMedium = Font.system(size: 36, weight: .bold, design: .rounded)

    /// Small numbers
    static let numberSmall = Font.system(size: 28, weight: .semibold, design: .rounded)

    // MARK: - Prompt Style

    /// Question prompts
    static let prompt = Font.system(size: 24, weight: .medium, design: .rounded)
}

// MARK: - Text Style Modifiers

extension View {
    func lumiTextStyle(_ style: Font, color: Color = LumiColors.textPrimary) -> some View {
        self
            .font(style)
            .foregroundStyle(color)
    }
}
