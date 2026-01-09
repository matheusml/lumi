---
name: commands
description: Build commands, file locations, and development workflow for Lumi. Use when building, testing, running xcodebuild, or asking about project structure and file locations.
---

# Common Development Commands

## Build & Run

```bash
# Quick build check (fast, no simulator needed)
xcodebuild build -project Lumi.xcodeproj -scheme Lumi \
  -destination generic/platform=iOS \
  CODE_SIGNING_ALLOWED=NO -quiet

# Run unit tests (slower, requires simulator)
xcodebuild test -project Lumi.xcodeproj -scheme Lumi \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  -only-testing:LumiTests

# Clean build folder
xcodebuild -project Lumi.xcodeproj -scheme Lumi clean

# Open in Xcode
open Lumi.xcodeproj
```

**Prefer the quick build check** for verifying code compiles. Only run full tests when specifically needed or before delivering work.

## SwiftLint (if installed)

```bash
swiftlint
swiftlint --fix
```

## Key File Locations

| What | Path |
|------|------|
| Xcode project | `Lumi.xcodeproj` |
| App entry | `Lumi/LumiApp.swift` |
| Problem JSON | `Lumi/Resources/Content/Math/problems_pt-BR.json` |
| Assets | `Lumi/Assets.xcassets/` |
| SwiftData models | `Lumi/Core/Models/` |
| Services | `Lumi/Core/Services/` |
| Design system | `Lumi/Design/Theme/` |
| Components | `Lumi/Design/Components/` |
| Feature views | `Lumi/Features/` |

## SwiftData

### Models
- `Child.swift` - Child profile
- `Session.swift` - Adventure sessions
- `DailyAdventureCount.swift` - Daily tracking

### Container Setup (LumiApp.swift)
```swift
.modelContainer(for: [Child.self, Session.self, DailyAdventureCount.self])
```

### Reset Data
Delete app from simulator to clear SwiftData storage.

## Problem ID Format

- Counting: `count_d{difficulty}_{index}`
- Addition: `add_d{difficulty}_{index}`
- Subtraction: `sub_d{difficulty}_{index}`
- Comparison: `comp_d{difficulty}_{index}`
- Patterns: `pat_d{difficulty}_{index}`

## Previews

All UI components include `#Preview` macros:
```swift
#Preview("Component Name") {
    SomeComponent()
        .padding()
        .background(LumiColors.background)
}
```

## Localization

Primary: Portuguese (Brazil) - `pt-BR`

```swift
LocalizedString(
    ptBR: "Texto em português",
    en: "English text"
)
```
