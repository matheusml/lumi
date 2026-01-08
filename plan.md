# Lumi - Educational App for Children

## Project Overview

Lumi is a native iOS educational app for children ages 4-7. The MVP focuses on math skills. The app is designed to be ad-free, safe, and intentionally anti-addictive—it helps kids learn without using dark patterns or engagement hooks that create unhealthy usage.

Primary language: Portuguese (Brazil)
Platform: iOS (iPhone and iPad)
Tech stack: SwiftUI, Swift, SwiftData

## Design Philosophy

### Anti-Addiction Principles (CRITICAL - apply everywhere)

- NO stars, coins, gems, or virtual currencies
- NO streaks or "don't break your streak" mechanics
- NO leaderboards or social comparison
- NO timed challenges that create stress
- NO notifications asking kids to come back
- NO infinite scrolling or endless content
- NO variable reward schedules (slot machine psychology)

Instead:
- Discrete "adventures" with clear beginnings and endings (5 problems each)
- Daily limits on adventures (default: 3 per day, parent-configurable)
- Celebrate completion, not speed or scores
- Gentle, calm animations—not flashy dopamine hits
- When daily limit is reached, warmly encourage the child to go play elsewhere

### Visual Design Direction

- Soft, friendly color palette (avoid harsh primary colors)
- Rounded shapes, approachable typography
- Illustrations should be simple and warm, not hyperactive cartoon style
- Generous white space
- Large touch targets (minimum 44pt, preferably larger for young children)
- Support for both light and dark mode

## Core User Flows

### Flow 1: Child launches app
```
Launch → Home Screen → "Começar Aventura" button → 
Subject Selection (Math only for MVP) → Adventure begins →
Problem 1 → Problem 2 → Problem 3 → Problem 4 → Problem 5 →
"Aventura Completa!" celebration → 
Choice: "Mais uma aventura" OR "Tchau por agora!"
```

If daily adventure limit reached:
```
... → "Aventura Completa!" → 
"Você completou todas as aventuras de hoje! Hora de brincar de outras coisas. Até amanhã!" →
Only option: "Tchau por agora!" (returns to home with adventures locked until tomorrow)
```

### Flow 2: Parent accesses Parent Zone
```
Home Screen → Parent Zone button (requires gate) →
Parent Gate (hold 3 corners simultaneously for 2 seconds - too complex for young kids) →
Parent Dashboard
```

Parent Dashboard features:
- View child's progress (adventures completed, accuracy by activity type)
- Adjust daily adventure limit (1-10)
- Reset today's adventure count (if needed)
- Language setting

## Data Models

### Core Models (SwiftData)
```swift
@Model
class Child {
    var id: UUID
    var name: String
    var createdAt: Date
    var settings: ChildSettings
    var progress: [SubjectProgress]
    var sessions: [Session]
}

@Model
class ChildSettings {
    var dailyAdventureLimit: Int // default: 3
    var preferredLanguage: String // default: "pt-BR"
}

@Model
class SubjectProgress {
    var subject: Subject // enum: .math, .grammar (future), etc.
    var activityProgress: [ActivityProgress]
}

@Model
class ActivityProgress {
    var activityType: String // "counting", "addition", etc.
    var currentDifficulty: Int // 1-4
    var problemsAttempted: Int
    var problemsCorrect: Int
    var lastPlayedAt: Date?
}

@Model
class Session {
    var id: UUID
    var startedAt: Date
    var endedAt: Date?
    var subject: Subject
    var problemsCompleted: Int
    var problemsCorrect: Int
}

@Model 
class DailyAdventureCount {
    var date: Date // stored as start of day
    var count: Int
}
```

### Content Models (Codable, loaded from JSON)
```swift
struct ProblemBank: Codable {
    let subject: String
    let activityType: String
    let problems: [Problem]
}

struct Problem: Codable, Identifiable {
    let id: String
    let type: ProblemType // counting, addition, subtraction, comparison, patterns
    let difficulty: Int // 1-4
    let visual: VisualConfiguration
    let prompt: LocalizedString
    let correctAnswer: AnswerValue
    let answerChoices: [AnswerValue]? // for multiple choice
    let hints: [LocalizedString]?
}

struct LocalizedString: Codable {
    let ptBR: String
    let en: String?
    
    func localized(for locale: String = "pt-BR") -> String {
        switch locale {
        case "en": return en ?? ptBR
        default: return ptBR
        }
    }
}

struct VisualConfiguration: Codable {
    let type: VisualType // "objects", "equation", "pattern", "comparison"
    let elements: [VisualElement]
}

struct VisualElement: Codable {
    let object: String // "apple", "star", "bird", etc.
    let count: Int?
    let position: String? // "left", "right", "sequence"
}

enum AnswerValue: Codable {
    case number(Int)
    case object(String)
    case pattern([String])
}
```

## Math Activities (MVP)

### 1. Contagem (Counting)
- Display N objects on screen
- Child taps each object to count (objects highlight when tapped)
- Then selects the total from multiple choice
- Difficulty 1: 1-5 objects
- Difficulty 2: 1-10 objects
- Difficulty 3: 1-15 objects
- Difficulty 4: 1-20 objects

### 2. Adição (Addition)
- Display two groups of objects
- Show equation: "3 + 2 = ?"
- Child selects answer from choices
- Difficulty 1: sums ≤ 5
- Difficulty 2: sums ≤ 10
- Difficulty 3: sums ≤ 15
- Difficulty 4: sums ≤ 20

### 3. Subtração (Subtraction)
- Display objects, some "fly away" or disappear
- Show equation: "5 - 2 = ?"
- Child selects answer
- All difficulties: result is always ≥ 0
- Difficulty progression same as addition

### 4. Comparação (Comparison)
- Display two groups or two numbers
- "Qual é maior?" / "Qual é menor?"
- Child taps the correct side
- Difficulty 1: very obvious differences (2 vs 8)
- Difficulty 2-4: progressively closer values

### 5. Sequências (Patterns)
- Display a pattern with one missing element
- Child selects what comes next
- Difficulty 1: simple AB patterns (🔴🔵🔴🔵❓)
- Difficulty 2: ABC patterns
- Difficulty 3: number sequences (2, 4, 6, ❓)
- Difficulty 4: more complex patterns

## Adaptive Difficulty System
```swift
class DifficultyManager {
    // Rules:
    // - Start at difficulty 1 for new activity types
    // - Move UP after 3 correct answers in a row
    // - Move DOWN after 2 incorrect answers in a row
    // - Stay at current level otherwise
    // - Never go below 1 or above 4
    
    func recordAnswer(correct: Bool, for activityType: String) -> Int {
        // Returns new difficulty level
    }
}
```

## Project File Structure
```
Lumi/
├── LumiApp.swift
├── ContentView.swift
├── Features/
│   ├── Home/
│   │   ├── HomeView.swift
│   │   └── HomeViewModel.swift
│   ├── Adventure/
│   │   ├── AdventureView.swift           // Container for 5 problems
│   │   ├── AdventureViewModel.swift
│   │   ├── AdventureProgressBar.swift    // Shows 5 dots
│   │   └── AdventureCompleteView.swift   // Celebration screen
│   ├── Problems/
│   │   ├── ProblemContainerView.swift    // Routes to correct problem type
│   │   ├── CountingProblemView.swift
│   │   ├── AdditionProblemView.swift
│   │   ├── SubtractionProblemView.swift
│   │   ├── ComparisonProblemView.swift
│   │   └── PatternProblemView.swift
│   ├── Feedback/
│   │   ├── CorrectAnswerView.swift       // Gentle celebration
│   │   └── TryAgainView.swift            // Encouraging retry
│   └── ParentZone/
│       ├── ParentGateView.swift          // Hold 3 corners for 2s
│       ├── ParentDashboardView.swift
│       └── SettingsView.swift
├── Core/
│   ├── Models/
│   │   ├── Child.swift
│   │   ├── Session.swift
│   │   ├── Problem.swift
│   │   └── Progress.swift
│   ├── Services/
│   │   ├── ProblemService.swift          // Loads and serves problems
│   │   ├── ProgressService.swift         // Tracks progress
│   │   ├── DifficultyManager.swift
│   │   └── AdventureLimitService.swift   // Manages daily limits
│   └── Extensions/
│       └── Date+Extensions.swift
├── Design/
│   ├── Theme/
│   │   ├── LumiColors.swift
│   │   ├── LumiTypography.swift
│   │   └── LumiSpacing.swift
│   ├── Components/
│   │   ├── LumiButton.swift
│   │   ├── CountableObject.swift         // Animated tappable object
│   │   ├── NumberChoice.swift            // Answer option button
│   │   └── ProgressDots.swift
│   └── Animations/
│       └── LumiAnimations.swift
└── Resources/
    ├── Localizable.xcstrings
    ├── Content/
    │   └── Math/
    │       └── problems_pt-BR.json
    ├── Assets.xcassets/
    │   ├── AppIcon
    │   ├── Colors/
    │   └── Objects/                      // apple, star, bird, etc.
    └── Sounds/
        ├── correct.mp3
        ├── tryagain.mp3
        └── complete.mp3
```

## Sample Problem Content (problems_pt-BR.json)
```json
{
  "subject": "math",
  "problems": [
    {
      "id": "count_001",
      "type": "counting",
      "difficulty": 1,
      "visual": {
        "type": "objects",
        "elements": [
          { "object": "apple", "count": 3 }
        ]
      },
      "prompt": {
        "ptBR": "Quantas maçãs você vê?",
        "en": "How many apples do you see?"
      },
      "correctAnswer": { "number": 3 },
      "answerChoices": [
        { "number": 2 },
        { "number": 3 },
        { "number": 4 },
        { "number": 5 }
      ]
    },
    {
      "id": "add_001",
      "type": "addition",
      "difficulty": 1,
      "visual": {
        "type": "equation",
        "elements": [
          { "object": "star", "count": 2, "position": "left" },
          { "object": "star", "count": 1, "position": "right" }
        ]
      },
      "prompt": {
        "ptBR": "Quantas estrelas ao todo?",
        "en": "How many stars in total?"
      },
      "correctAnswer": { "number": 3 },
      "answerChoices": [
        { "number": 2 },
        { "number": 3 },
        { "number": 4 }
      ]
    },
    {
      "id": "sub_001",
      "type": "subtraction",
      "difficulty": 1,
      "visual": {
        "type": "equation",
        "elements": [
          { "object": "bird", "count": 4, "position": "left" },
          { "object": "bird", "count": 1, "position": "right" }
        ]
      },
      "prompt": {
        "ptBR": "4 pássaros menos 1. Quantos ficam?",
        "en": "4 birds minus 1. How many are left?"
      },
      "correctAnswer": { "number": 3 },
      "answerChoices": [
        { "number": 2 },
        { "number": 3 },
        { "number": 4 },
        { "number": 5 }
      ]
    },
    {
      "id": "comp_001",
      "type": "comparison",
      "difficulty": 1,
      "visual": {
        "type": "comparison",
        "elements": [
          { "object": "banana", "count": 2, "position": "left" },
          { "object": "banana", "count": 7, "position": "right" }
        ]
      },
      "prompt": {
        "ptBR": "Qual lado tem mais bananas?",
        "en": "Which side has more bananas?"
      },
      "correctAnswer": { "object": "right" },
      "answerChoices": [
        { "object": "left" },
        { "object": "right" }
      ]
    },
    {
      "id": "pat_001",
      "type": "patterns",
      "difficulty": 1,
      "visual": {
        "type": "pattern",
        "elements": [
          { "object": "circle_red" },
          { "object": "circle_blue" },
          { "object": "circle_red" },
          { "object": "circle_blue" },
          { "object": "unknown" }
        ]
      },
      "prompt": {
        "ptBR": "O que vem depois?",
        "en": "What comes next?"
      },
      "correctAnswer": { "object": "circle_red" },
      "answerChoices": [
        { "object": "circle_red" },
        { "object": "circle_blue" },
        { "object": "circle_green" }
      ]
    }
  ]
}
```

## UI Strings (Localizable.xcstrings entries needed)
```
Home Screen:
- "Olá!" (greeting)
- "Começar Aventura" (start adventure button)
- "Área dos Pais" (parent zone button)

Adventure:
- "Problema X de 5" (problem X of 5)
- "Aventura Completa!" (adventure complete)
- "Muito bem!" (well done)
- "Mais uma aventura" (another adventure)
- "Tchau por agora!" (bye for now)
- "Você completou todas as aventuras de hoje!" (daily limit reached)
- "Hora de brincar de outras coisas. Até amanhã!" (time to play other things)

Problems:
- "Quantas maçãs você vê?" (counting prompt - varies)
- "Quantos ao todo?" (addition prompt)
- "Quantos ficam?" (subtraction prompt)  
- "Qual é maior?" (comparison - more)
- "Qual é menor?" (comparison - less)
- "O que vem depois?" (patterns prompt)

Feedback:
- "Isso mesmo!" (correct answer)
- "Tente de novo!" (try again)
- "Você consegue!" (encouragement)

Parent Zone:
- "Área dos Pais" (title)
- "Segure os 3 cantos por 2 segundos" (gate instruction)
- "Progresso" (progress section)
- "Aventuras hoje:" (adventures today)
- "Limite diário:" (daily limit)
- "Precisão:" (accuracy)
- "Configurações" (settings)
```

## Implementation Order

### Phase 1: Foundation
1. Create Xcode project (iOS 17+, SwiftUI)
2. Set up folder structure
3. Configure Localizable.xcstrings with pt-BR as development language
4. Implement LumiColors, LumiTypography, LumiSpacing
5. Create basic LumiButton component
6. Set up SwiftData with Child model

### Phase 2: Core Navigation
1. Build HomeView with "Começar Aventura" button
2. Create AdventureView container with progress dots
3. Implement AdventureCompleteView celebration screen
4. Wire up basic navigation flow

### Phase 3: Problem Infrastructure
1. Define all Codable models for problems
2. Create ProblemService to load from JSON
3. Build ProblemContainerView that routes to specific problem types
4. Implement answer selection and feedback flow

### Phase 4: Problem Types
1. CountingProblemView with tappable objects
2. AdditionProblemView with visual groups
3. SubtractionProblemView
4. ComparisonProblemView
5. PatternProblemView

### Phase 5: Progress & Limits
1. Implement ProgressService with SwiftData
2. Build DifficultyManager
3. Create AdventureLimitService for daily caps
4. Add daily limit enforcement to adventure flow

### Phase 6: Parent Zone
1. Build ParentGateView (hold 3 corners)
2. Create ParentDashboardView
3. Add settings controls

### Phase 7: Polish
1. Add sound effects
2. Implement animations (object appearance, celebrations)
3. Create app icon
4. Test on multiple device sizes
5. Add launch screen

## Technical Notes

- Target iOS 17+ (allows latest SwiftUI and SwiftData features)
- Use @Observable macro for view models
- Use Swift's native String Catalog for localization
- All content is local—no network calls needed for MVP
- Support both iPhone and iPad with adaptive layouts
- Store all progress locally with SwiftData
- Use SF Symbols where appropriate, custom assets for objects

## Testing Priorities

1. Test with actual 6-year-old children
2. Verify touch targets are large enough
3. Ensure daily limit actually prevents more adventures
4. Test parent gate is truly too complex for young kids
5. Verify all strings display correctly in Portuguese
6. Test on both iPhone and iPad
7. Test offline functionality (should work 100% offline)
