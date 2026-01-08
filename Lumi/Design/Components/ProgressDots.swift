import SwiftUI

/// Shows adventure progress as 5 dots
struct ProgressDots: View {
    let total: Int
    let completed: Int
    let current: Int

    init(total: Int = 5, completed: Int, current: Int) {
        self.total = total
        self.completed = completed
        self.current = current
    }

    var body: some View {
        HStack(spacing: LumiSpacing.sm) {
            ForEach(0..<total, id: \.self) { index in
                Circle()
                    .fill(dotColor(for: index))
                    .frame(width: 12, height: 12)
                    .scaleEffect(index == current ? 1.2 : 1.0)
                    .animation(.easeInOut(duration: 0.3), value: current)
            }
        }
    }

    private func dotColor(for index: Int) -> Color {
        if index < completed {
            return LumiColors.success
        } else if index == current {
            return LumiColors.primary
        } else {
            return LumiColors.textTertiary.opacity(0.3)
        }
    }
}

#Preview {
    VStack(spacing: LumiSpacing.lg) {
        ProgressDots(completed: 0, current: 0)
        ProgressDots(completed: 2, current: 2)
        ProgressDots(completed: 4, current: 4)
        ProgressDots(completed: 5, current: 5)
    }
    .padding()
    .background(LumiColors.background)
}
