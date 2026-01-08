---
name: adding-features
description: Step-by-step guides for adding new features to Lumi. Use when adding a new problem type, creating a new screen, adding UI components, adding visual objects, or implementing new functionality.
---

# Adding New Features to Lumi

## Adding a New Problem Type

### 1. Update ProblemType Enum
In `Lumi/Core/Models/Subject.swift`:
```swift
enum ProblemType: String, CaseIterable, Codable {
    case counting
    case addition
    case subtraction
    case comparison
    case patterns
    case newType  // Add new case
}
```

### 2. Create Problem View
Create `Lumi/Features/Problems/NewTypeProblemView.swift`:
```swift
import SwiftUI

struct NewTypeProblemView: View {
    let problem: Problem
    let onAnswer: (Bool) -> Void

    @State private var selectedAnswer: AnswerValue?
    @State private var showResult = false

    var body: some View {
        VStack(spacing: LumiSpacing.xl) {
            // Visual based on problem.visual

            Text(problem.prompt.localized())
                .font(LumiTypography.headingMedium)
                .foregroundStyle(LumiColors.textPrimary)

            HStack(spacing: LumiSpacing.md) {
                ForEach(problem.answerChoices ?? [], id: \.self) { choice in
                    ChoiceButton(
                        content: choice.displayValue,
                        isSelected: selectedAnswer == choice,
                        isCorrect: showResult ? (choice == problem.correctAnswer) : nil
                    ) {
                        selectAnswer(choice)
                    }
                }
            }
        }
    }

    private func selectAnswer(_ choice: AnswerValue) {
        selectedAnswer = choice
        showResult = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            onAnswer(choice == problem.correctAnswer)
        }
    }
}
```

### 3. Update ProblemContainerView
In `Lumi/Features/Problems/ProblemContainerView.swift`:
```swift
switch problem.problemType {
case .newType:
    NewTypeProblemView(problem: problem, onAnswer: onAnswer)
// ...
}
```

### 4. Add Problems to JSON
In `Lumi/Resources/Content/Math/problems_pt-BR.json`:
```json
{
  "id": "new_d1_001",
  "type": "newType",
  "difficulty": 1,
  "visual": { ... },
  "prompt": { "ptBR": "...", "en": "..." },
  "correctAnswer": { ... },
  "answerChoices": [ ... ]
}
```

---

## Adding a New UI Component

Create in `Lumi/Design/Components/NewComponent.swift`:
```swift
import SwiftUI

struct NewComponent: View {
    let title: String
    var style: Style = .default

    var body: some View {
        // Use LumiColors, LumiTypography, LumiSpacing
        // Ensure minimum 44pt touch targets
    }
}

#Preview {
    NewComponent(title: "Example")
        .padding()
        .background(LumiColors.background)
}
```

### Checklist
- [ ] Uses `LumiColors` for all colors
- [ ] Uses `LumiTypography` for fonts
- [ ] Uses `LumiSpacing` for spacing
- [ ] Touch target ≥ 44pt (prefer 60pt)
- [ ] Includes `#Preview`
- [ ] Animations are gentle (0.15-0.3s)

---

## Adding a New Screen

```swift
import SwiftUI
import SwiftData

struct NewScreenView: View {
    @Binding var navigationPath: NavigationPath
    @Environment(\.modelContext) private var modelContext

    var body: some View {
        ZStack {
            LumiColors.background.ignoresSafeArea()
            VStack(spacing: LumiSpacing.xl) {
                // Content
            }
            .padding(.horizontal, LumiSpacing.screenHorizontal)
        }
    }
}
```

Then add destination case in `ContentView.swift`.

---

## Adding Visual Objects

1. Add image to `Lumi/Assets.xcassets/Objects/{name}.imageset/`
2. Reference in JSON: `{ "object": "newObjectName", "count": 3 }`
3. Update `CountableObject.swift` if special rendering needed

---

## Anti-Addiction Checklist

Before submitting any feature:
- [ ] No scores/points visible to children
- [ ] No streaks or "come back" mechanics
- [ ] No timers creating pressure
- [ ] No flashy/hyperactive animations
- [ ] No variable reward schedules
- [ ] Respects daily adventure limits
- [ ] Uses gentle, calm feedback
