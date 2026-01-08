---
name: testing
description: Testing requirements and workflow for Lumi. Use when writing tests, running tests, or making any code changes that require test updates.
---

# Testing in Lumi

## Running Tests

```bash
# Run all unit tests
xcodebuild test -project Lumi.xcodeproj -scheme Lumi \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  -only-testing:LumiTests

# Run a specific test class
xcodebuild test -project Lumi.xcodeproj -scheme Lumi \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  -only-testing:LumiTests/DifficultyManagerTests
```

## Before Delivering Work

**ALWAYS run tests before completing any task.** If tests fail:
1. Fix the failing tests
2. Run again to confirm all pass
3. Only then mark work as complete

## When to Update Tests

| Code Change | Test Action |
|-------------|-------------|
| Add feature | Add tests for new functionality |
| Fix bug | Add test that reproduces bug, then fix |
| Change behavior | Update existing tests to match |
| Remove code | Remove related tests |
| Refactor | Tests should still pass (no changes needed) |

## Test File Locations

```
LumiTests/
├── DifficultyManagerTests.swift      # Core/Services/DifficultyManager
├── ProblemServiceTests.swift         # Core/Services/ProblemService
├── AdventureLimitServiceTests.swift  # Core/Services/AdventureLimitService
├── ProblemModelTests.swift           # Core/Models/Problem (Codable)
├── SwiftDataModelTests.swift         # Core/Models (SwiftData persistence)
└── DateExtensionsTests.swift         # Core/Extensions/Date+Extensions
```

## Writing Tests

### Test Class Template (for @Observable services)

```swift
import XCTest
import SwiftData
@testable import Lumi

@MainActor
final class NewServiceTests: XCTestCase {
    var service: NewService!
    var modelContainer: ModelContainer!
    var modelContext: ModelContext!

    override func setUp() {
        super.setUp()
        let schema = Schema([Child.self, Session.self, ActivityProgress.self, DailyAdventureCount.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        modelContainer = try! ModelContainer(for: schema, configurations: config)
        modelContext = ModelContext(modelContainer)

        service = NewService()
        service.configure(with: modelContext)
    }

    override func tearDown() {
        service = nil
        modelContext = nil
        modelContainer = nil
        super.tearDown()
    }

    func testSomething() {
        // Arrange
        // Act
        // Assert
        XCTAssertEqual(...)
    }
}
```

### Test Class Template (for Codable models)

```swift
import XCTest
@testable import Lumi

final class NewModelTests: XCTestCase {

    func testDecoding() throws {
        let json = """
        {"field": "value"}
        """
        let data = json.data(using: .utf8)!
        let model = try JSONDecoder().decode(NewModel.self, from: data)

        XCTAssertEqual(model.field, "value")
    }
}
```

## Key Patterns

- **Use `@MainActor`** for test classes that use `@Observable` services
- **Use in-memory SwiftData**: `ModelConfiguration(isStoredInMemoryOnly: true)`
- **Use `setUp()` / `tearDown()`** (not `setUpWithError` variants)
- **Test file naming**: `{ClassName}Tests.swift`
- **Test method naming**: `test{WhatIsBeingTested}()`

## What to Test

### Services
- Initial state
- State changes after actions
- Boundary conditions (min/max values)
- Error cases

### Models (Codable)
- JSON decoding
- JSON encoding
- Computed properties
- Edge cases (nil values, empty arrays)

### SwiftData Models
- Creation with default values
- Creation with custom values
- Relationships between models
- Computed properties

## Debugging Failed Tests

```bash
# See detailed output
xcodebuild test -project Lumi.xcodeproj -scheme Lumi \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  -only-testing:LumiTests 2>&1 | grep -E "(passed|failed|error)"
```
