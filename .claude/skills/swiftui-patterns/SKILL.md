---
name: swiftui-patterns
description: SwiftUI code patterns and templates for Lumi. Use when creating views, view models, services, components, or asking about SwiftUI architecture patterns in this project.
---

# SwiftUI Patterns for Lumi

## ViewModel Pattern

```swift
import Foundation
import SwiftData

@Observable
final class FeatureViewModel {
    private var modelContext: ModelContext?

    private(set) var items: [Item] = []
    private(set) var isLoading = false

    func configure(with context: ModelContext) {
        self.modelContext = context
    }

    func loadData() {
        guard let context = modelContext else { return }
        // Fetch from SwiftData
    }
}
```

## View Structure

```swift
import SwiftUI
import SwiftData

struct FeatureView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var viewModel = FeatureViewModel()

    var body: some View {
        ZStack {
            LumiColors.background.ignoresSafeArea()

            VStack(spacing: LumiSpacing.lg) {
                // Content
            }
            .padding(.horizontal, LumiSpacing.screenHorizontal)
        }
        .onAppear {
            viewModel.configure(with: modelContext)
        }
    }
}

#Preview {
    FeatureView()
        .modelContainer(for: [Child.self, Session.self, DailyAdventureCount.self])
}
```

## Problem View Template

```swift
import SwiftUI

struct NewProblemView: View {
    let problem: Problem
    let onAnswer: (Bool) -> Void

    @State private var selectedAnswer: AnswerValue?
    @State private var showResult = false

    var body: some View {
        VStack(spacing: LumiSpacing.xl) {
            problemVisual

            Text(problem.prompt.localized())
                .font(LumiTypography.headingMedium)
                .foregroundStyle(LumiColors.textPrimary)
                .multilineTextAlignment(.center)

            answerChoices
        }
        .padding(.horizontal, LumiSpacing.screenHorizontal)
    }

    private var problemVisual: some View {
        // Render based on problem.visual
    }

    private var answerChoices: some View {
        HStack(spacing: LumiSpacing.md) {
            ForEach(problem.answerChoices ?? [], id: \.self) { choice in
                ChoiceButton(
                    content: choice.displayValue,
                    isSelected: selectedAnswer == choice,
                    isCorrect: showResult ? (choice == problem.correctAnswer) : nil
                ) {
                    handleSelection(choice)
                }
            }
        }
    }

    private func handleSelection(_ choice: AnswerValue) {
        selectedAnswer = choice
        showResult = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            onAnswer(choice == problem.correctAnswer)
        }
    }
}
```

## Service Pattern

```swift
import Foundation
import SwiftData

@Observable
final class FeatureService {
    private var modelContext: ModelContext?

    func configure(with context: ModelContext) {
        self.modelContext = context
    }

    func performAction() {
        guard let context = modelContext else { return }
        do {
            try context.save()
        } catch {
            print("Error saving: \(error)")
        }
    }
}
```

## Navigation Pattern

```swift
enum AppDestination: Hashable {
    case adventure
    case parentZone
    case settings
}

struct ContentView: View {
    @State private var navigationPath = NavigationPath()

    var body: some View {
        NavigationStack(path: $navigationPath) {
            HomeView(navigationPath: $navigationPath)
                .navigationDestination(for: AppDestination.self) { destination in
                    switch destination {
                    case .adventure:
                        AdventureView(navigationPath: $navigationPath)
                    case .parentZone:
                        ParentDashboardView()
                    case .settings:
                        SettingsView()
                    }
                }
        }
    }
}
```

## Component Pattern

```swift
struct LumiComponent: View {
    let title: String
    let action: () -> Void
    var style: Style = .primary
    var isEnabled: Bool = true

    enum Style {
        case primary, secondary
        var backgroundColor: Color {
            switch self {
            case .primary: return LumiColors.primary
            case .secondary: return LumiColors.secondary
            }
        }
    }

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(LumiTypography.buttonLarge)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .frame(height: LumiSpacing.largeTouchTarget)
                .background(
                    RoundedRectangle(cornerRadius: LumiSpacing.radiusLarge)
                        .fill(style.backgroundColor)
                )
        }
        .disabled(!isEnabled)
        .opacity(isEnabled ? 1.0 : 0.5)
    }
}

#Preview("Component States") {
    VStack(spacing: LumiSpacing.md) {
        LumiComponent(title: "Primary", action: {})
        LumiComponent(title: "Secondary", style: .secondary, action: {})
        LumiComponent(title: "Disabled", isEnabled: false, action: {})
    }
    .padding()
    .background(LumiColors.background)
}
```

## Adaptive Layout

```swift
struct AdaptiveGrid: View {
    @Environment(\.horizontalSizeClass) var sizeClass

    var columns: Int {
        sizeClass == .compact ? 3 : 5
    }

    var body: some View {
        LazyVGrid(
            columns: Array(repeating: GridItem(.flexible()), count: columns),
            spacing: LumiSpacing.md
        ) {
            // Grid items
        }
    }
}
```
