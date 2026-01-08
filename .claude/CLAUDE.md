# Lumi - Educational App for Children

iOS educational app for kids ages 4-7. Math-focused MVP. Portuguese (Brazil) primary language.

**Tech**: SwiftUI, Swift, SwiftData | **Target**: iOS 17+

## Anti-Addiction Principles (CRITICAL)

**NEVER add:**
- Stars, coins, gems, or virtual currencies
- Streaks or "don't break your streak" mechanics
- Leaderboards or social comparison
- Timed challenges that create stress
- Notifications asking kids to return
- Flashy/hyperactive animations
- Variable reward schedules

**ALWAYS:**
- Keep adventures discrete (5 problems each)
- Respect daily limits (default: 3/day)
- Celebrate completion, not speed/scores
- Use gentle, calm animations
- When limits reached, encourage outdoor play

## Architecture

```
Lumi/
├── Features/           # Home, Adventure, Problems, Feedback, ParentZone
├── Core/Models/        # SwiftData: Child, Session, DailyAdventureCount
├── Core/Services/      # ProblemService, DifficultyManager, AdventureLimitService
├── Design/Theme/       # LumiColors, LumiTypography, LumiSpacing
├── Design/Components/  # LumiButton, ChoiceButton, CountableObject
└── Resources/Content/  # Problem JSON files
```

## Design System Quick Reference

**Colors**: `LumiColors.primary`, `.secondary`, `.success`, `.background`, `.textPrimary`
**Typography**: `LumiTypography.displayLarge`, `.headingMedium`, `.bodyLarge`, `.buttonLarge`
**Spacing**: `LumiSpacing.sm` (8), `.md` (16), `.lg` (24), `.xl` (32), `.screenHorizontal` (24)
**Touch targets**: Minimum 44pt, prefer `LumiSpacing.largeTouchTarget` (60pt)

## Key Patterns

**ViewModels**: Use `@Observable`, call `configure(with: modelContext)` in `.onAppear`
**Views**: Always wrap content in `ZStack { LumiColors.background.ignoresSafeArea() ... }`
**Localization**: Use `LocalizedString(ptBR: "...", en: "...")`, call `.localized()`

## Adaptive Difficulty

- Start at level 1, move UP after 3 correct, DOWN after 2 incorrect
- Range: 1-4

## Testing (REQUIRED)

- **Always run tests before delivering work**
- **Update tests when changing code** (add for features, update for changes, remove for deletions)
- See `/testing` skill for commands and patterns
