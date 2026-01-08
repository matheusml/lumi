import SwiftUI

/// Lumi's spacing system - generous whitespace for calm visuals
enum LumiSpacing {
    // MARK: - Base Units

    /// Extra small: 4pt
    static let xs: CGFloat = 4

    /// Small: 8pt
    static let sm: CGFloat = 8

    /// Medium: 16pt
    static let md: CGFloat = 16

    /// Large: 24pt
    static let lg: CGFloat = 24

    /// Extra large: 32pt
    static let xl: CGFloat = 32

    /// 2X large: 48pt
    static let xxl: CGFloat = 48

    /// 3X large: 64pt
    static let xxxl: CGFloat = 64

    // MARK: - Component Spacing

    /// Padding inside buttons
    static let buttonPadding: CGFloat = 20

    /// Padding inside cards
    static let cardPadding: CGFloat = 24

    /// Space between stacked items
    static let stackSpacing: CGFloat = 16

    /// Space between grid items
    static let gridSpacing: CGFloat = 20

    // MARK: - Touch Targets

    /// Minimum touch target (Apple HIG: 44pt)
    static let minTouchTarget: CGFloat = 44

    /// Preferred touch target for young children
    static let preferredTouchTarget: CGFloat = 60

    /// Large touch target for primary actions
    static let largeTouchTarget: CGFloat = 80

    // MARK: - Screen Margins

    /// Horizontal screen margins
    static let screenHorizontal: CGFloat = 24

    /// Vertical screen margins
    static let screenVertical: CGFloat = 32

    // MARK: - Corner Radius

    /// Small radius: 8pt
    static let radiusSmall: CGFloat = 8

    /// Medium radius: 16pt
    static let radiusMedium: CGFloat = 16

    /// Large radius: 24pt
    static let radiusLarge: CGFloat = 24

    /// Full radius for circles/pills
    static let radiusFull: CGFloat = 100
}

// MARK: - Padding Extensions

extension View {
    /// Apply standard screen padding
    func lumiScreenPadding() -> some View {
        self.padding(.horizontal, LumiSpacing.screenHorizontal)
            .padding(.vertical, LumiSpacing.screenVertical)
    }

    /// Apply card padding
    func lumiCardPadding() -> some View {
        self.padding(LumiSpacing.cardPadding)
    }
}
