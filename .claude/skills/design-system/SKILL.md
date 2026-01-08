---
name: design-system
description: Lumi design system reference for colors, typography, spacing, and components. Use when styling UI, creating components, working with LumiColors, LumiTypography, LumiSpacing, or asking about the design tokens.
---

# Lumi Design System Reference

## Color Palette

### Primary Colors
| Token | RGB | Usage |
|-------|-----|-------|
| `LumiColors.primary` | (0.96, 0.62, 0.55) | Warm coral - primary actions |
| `LumiColors.secondary` | (0.55, 0.78, 0.94) | Soft sky blue - secondary accent |
| `LumiColors.success` | (0.60, 0.85, 0.75) | Gentle mint - success states |
| `LumiColors.accent` | (0.78, 0.70, 0.92) | Soft lavender - highlights |

### Background Colors
| Token | Usage |
|-------|-------|
| `LumiColors.background` | Warm cream - main background |
| `LumiColors.cardBackground` | Slightly darker cream - cards |
| `LumiColors.contentBackground` | White - content areas |

### Text Colors
| Token | Usage |
|-------|-------|
| `LumiColors.textPrimary` | Soft dark brown - primary text |
| `LumiColors.textSecondary` | Medium brown - secondary text |
| `LumiColors.textTertiary` | Light brown - placeholder |

### Feedback Colors
| Token | Usage |
|-------|-------|
| `LumiColors.correct` | Gentle green - correct answers |
| `LumiColors.tryAgain` | Soft orange - try again (NOT red) |

### Pattern Colors
For pattern problems:
- `LumiColors.circleRed`
- `LumiColors.circleBlue`
- `LumiColors.circleGreen`
- `LumiColors.circleYellow`
- `LumiColors.circlePurple`

## Typography

| Token | Usage |
|-------|-------|
| `.displayLarge` | Main greetings, celebration text |
| `.displayMedium` | Large headings |
| `.headingLarge` | Section headers |
| `.headingMedium` | Subsection headers |
| `.bodyLarge` | Important body text |
| `.bodyMedium` | Regular body text |
| `.buttonLarge` | Primary button text |
| `.buttonMedium` | Secondary button text |
| `.numberLarge` | Large numbers (answers) |
| `.numberMedium` | Medium numbers |

Usage:
```swift
Text("Olá!")
    .font(LumiTypography.displayLarge)
    .foregroundStyle(LumiColors.textPrimary)
```

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `.xs` | 4pt | Tight spacing |
| `.sm` | 8pt | Small gaps |
| `.md` | 16pt | Standard spacing |
| `.lg` | 24pt | Large gaps |
| `.xl` | 32pt | Section spacing |
| `.xxl` | 48pt | Major sections |

### Special Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `.screenHorizontal` | 24pt | Screen edge padding |
| `.minTouchTarget` | 44pt | Minimum tap area |
| `.largeTouchTarget` | 60pt | Preferred tap area for kids |
| `.radiusMedium` | 12pt | Standard corner radius |
| `.radiusLarge` | 20pt | Large corner radius |

## Components

### LumiButton
```swift
LumiButton("Começar Aventura", style: .primary) { }
LumiButton("Mais uma aventura", style: .secondary) { }
LumiButton("Tchau por agora!", style: .ghost) { }
```

### ChoiceButton
```swift
ChoiceButton(
    content: "5",
    isSelected: selectedAnswer == 5,
    isCorrect: showResult ? (answer == 5) : nil
) {
    selectedAnswer = 5
}
```

### CountableObject
```swift
CountableObject(
    objectType: "apple",
    isTapped: tappedIndices.contains(index),
    index: index
) {
    tappedIndices.insert(index)
}
```

### ProgressDots
```swift
ProgressDots(total: 5, completed: completedCount, current: currentIndex)
```

## Animations

```swift
.scaleEffect(isPressed ? 0.96 : 1.0)
.animation(.easeInOut(duration: 0.15), value: isPressed)
```

## Layout Guidelines

### Screen Structure
```swift
var body: some View {
    ZStack {
        LumiColors.background.ignoresSafeArea()
        VStack(spacing: LumiSpacing.xl) {
            // Content
        }
        .padding(.horizontal, LumiSpacing.screenHorizontal)
    }
}
```

### Touch Targets
Always minimum 44pt, prefer 60pt:
```swift
.frame(minWidth: LumiSpacing.largeTouchTarget, minHeight: LumiSpacing.largeTouchTarget)
```

### Adaptive Layout
```swift
@Environment(\.horizontalSizeClass) var sizeClass
let columns = sizeClass == .compact ? 3 : 5
```
