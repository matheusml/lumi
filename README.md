# Lumi

An educational iOS app for children ages 4-7, focused on making learning math fun and healthy.

## Philosophy

Lumi is intentionally **anti-addictive**. Unlike most children's apps that use dark patterns to maximize screen time, Lumi:

- Has **no** stars, coins, or virtual currencies
- Has **no** streaks or "come back tomorrow" mechanics
- Has **no** leaderboards or social comparison
- Has **no** timed challenges that create stress
- Sends **no** notifications asking kids to return
- Uses **calm, gentle animations** instead of flashy dopamine hits

Instead, Lumi uses "adventures" with clear beginnings and endings, respects daily limits, and warmly encourages children to go play elsewhere when they're done.

## Features

### Math Activities
- **Counting** - Count objects and select the total
- **Addition** - Visual addition with object groups
- **Subtraction** - Objects "flying away" to teach subtraction
- **Comparison** - "Which side has more?"
- **Patterns** - Complete the sequence

### Adaptive Difficulty
The app adjusts to each child's level:
- Moves up after 3 correct answers in a row
- Moves down after 2 incorrect answers
- 4 difficulty levels per activity

### Daily Limits
- Default: 3 adventures per day (configurable by parents)
- Each adventure = 5 problems
- When done, the app encourages outdoor play

### Parent Zone
- Protected by a gesture too complex for young children (hold 3 corners for 2 seconds)
- View progress and accuracy
- Adjust daily limits
- Reset today's count if needed

## Technical Details

### Requirements
- iOS 17.0+
- Xcode 15.0+
- Swift 5.9+

### Tech Stack
- **SwiftUI** - Declarative UI framework
- **SwiftData** - Local data persistence
- **No external dependencies** - Fully self-contained

### Architecture
```
Lumi/
├── LumiApp.swift              # App entry point
├── ContentView.swift          # Root navigation
├── Features/
│   ├── Home/                  # Home screen
│   ├── Adventure/             # Adventure flow
│   ├── Problems/              # Problem type views
│   ├── Feedback/              # Answer feedback
│   └── ParentZone/            # Parent dashboard
├── Core/
│   ├── Models/                # Data models
│   ├── Services/              # Business logic
│   └── Extensions/
├── Design/
│   ├── Theme/                 # Colors, Typography, Spacing
│   ├── Components/            # Reusable UI
│   └── Animations/
└── Resources/
    └── Content/Math/          # Problem definitions (JSON)
```

### Data Models

**SwiftData (persisted locally):**
- `Child` - Child profile with settings
- `Session` - Completed adventure sessions
- `DailyAdventureCount` - Daily usage tracking

**Codable (loaded from JSON):**
- `Problem` - Problem definitions
- `ProblemBank` - Collection of problems

## Getting Started

### Clone and Open
```bash
git clone <repository-url>
cd lumi
open Lumi.xcodeproj
```

### Build and Run
1. Select a simulator (iPhone or iPad)
2. Press ⌘R to build and run

### Run Tests
```bash
xcodebuild test -project Lumi.xcodeproj -scheme Lumi \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  -only-testing:LumiTests
```

## Design System

Lumi uses a soft, friendly color palette designed for young children:

### Colors
- **Primary**: Warm coral (`#F59E8C`)
- **Secondary**: Soft sky blue (`#8CC7F0`)
- **Success**: Gentle mint (`#99D9BF`)
- **Background**: Warm cream (`#FCF8F0`)

### Typography
- Large, rounded fonts
- High contrast for readability
- Consistent sizing across the app

### Touch Targets
- Minimum 44pt (Apple guideline)
- Preferred 60pt for young children
- Extra padding around interactive elements

## Localization

- **Primary**: Portuguese (Brazil) - `pt-BR`
- **Secondary**: English - `en`

All user-facing strings use the `LocalizedString` struct for easy localization.

## Adding Content

### Adding Problems
Edit `Lumi/Resources/Content/Math/problems_pt-BR.json`:

```json
{
  "id": "count_d1_005",
  "type": "counting",
  "difficulty": 1,
  "visual": {
    "type": "objects",
    "elements": [{ "object": "star", "count": 4 }]
  },
  "prompt": {
    "ptBR": "Quantas estrelas você vê?",
    "en": "How many stars do you see?"
  },
  "correctAnswer": { "number": 4 },
  "answerChoices": [
    { "number": 3 },
    { "number": 4 },
    { "number": 5 },
    { "number": 6 }
  ]
}
```

### Adding Visual Objects
1. Add image to `Assets.xcassets/Objects/`
2. Reference by name in problem JSON (e.g., `"object": "butterfly"`)
3. Update `CountableObject` if special rendering needed

## Contributing

When contributing, please:

1. Follow the anti-addiction principles
2. Use the design system (LumiColors, LumiTypography, LumiSpacing)
3. Ensure touch targets are large enough for children
4. Test on both iPhone and iPad
5. Add Portuguese strings for all user-facing text
6. Include `#Preview` macros for UI components

## Testing Checklist

- [ ] Touch targets large enough (44pt minimum)
- [ ] Daily limit enforcement works
- [ ] Parent gate blocks children
- [ ] Portuguese strings display correctly
- [ ] Works fully offline
- [ ] Adapts to iPhone and iPad
- [ ] Animations are gentle, not jarring
- [ ] No engagement hooks or dark patterns

## License

Private project - All rights reserved.
