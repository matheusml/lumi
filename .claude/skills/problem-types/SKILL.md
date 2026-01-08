---
name: problem-types
description: Math problem types and JSON structure for Lumi. Use when working with problems, adding new problem types, editing problems_pt-BR.json, or working with counting, addition, subtraction, comparison, or pattern problems.
---

# Working with Problem Types

## Problem Type Reference

### Counting (type: "counting")
- Display N objects, child taps to count, selects total
- Difficulty 1: 1-5 objects
- Difficulty 2: 1-10 objects
- Difficulty 3: 1-15 objects
- Difficulty 4: 1-20 objects

### Addition (type: "addition")
- Two groups of objects with equation "X + Y = ?"
- Difficulty 1: sums ≤ 5
- Difficulty 2: sums ≤ 10
- Difficulty 3: sums ≤ 15
- Difficulty 4: sums ≤ 20

### Subtraction (type: "subtraction")
- Objects with some "leaving", equation "X - Y = ?"
- Result always ≥ 0
- Same difficulty progression as addition

### Comparison (type: "comparison")
- Two groups side by side
- Prompt: "Qual lado tem mais?" / "Qual é maior?"
- Returns "left" or "right"
- Difficulty 1: obvious differences (2 vs 8)
- Difficulty 2-4: progressively closer values

### Patterns (type: "patterns")
- Sequence with missing element (marked as "unknown")
- Prompt: "O que vem depois?"
- Difficulty 1: AB patterns
- Difficulty 2: ABC patterns
- Difficulty 3: number sequences
- Difficulty 4: complex patterns

## JSON Structure

```json
{
  "id": "count_d1_001",
  "type": "counting",
  "difficulty": 1,
  "visual": {
    "type": "objects",
    "elements": [{ "object": "apple", "count": 3 }]
  },
  "prompt": { "ptBR": "Quantas maçãs?", "en": "How many apples?" },
  "correctAnswer": { "number": 3 },
  "answerChoices": [{ "number": 2 }, { "number": 3 }, { "number": 4 }]
}
```

### Visual Types
- `objects` - Grid of countable objects
- `equation` - Two groups with operator
- `comparison` - Side-by-side groups
- `pattern` - Sequence of elements

### Answer Value Types
- `{ "number": 5 }` - Numeric answer
- `{ "object": "left" }` - String/object answer
- `{ "pattern": ["a", "b"] }` - Pattern array

### Pattern Circle Colors
- `circle_red` → `LumiColors.circleRed`
- `circle_blue` → `LumiColors.circleBlue`
- `circle_green` → `LumiColors.circleGreen`
- `circle_yellow` → `LumiColors.circleYellow`
- `circle_purple` → `LumiColors.circlePurple`
- `unknown` → Placeholder (question mark)

### Problem ID Convention
Format: `{type}_d{difficulty}_{index}`
- `count_d1_001` - Counting, difficulty 1, problem 1
- `add_d2_003` - Addition, difficulty 2, problem 3
- `sub_d1_002` - Subtraction
- `comp_d3_001` - Comparison
- `pat_d1_004` - Patterns

## File Locations

- Problem JSON: `Lumi/Resources/Content/Math/problems_pt-BR.json`
- Problem model: `Lumi/Core/Models/Problem.swift`
- Problem service: `Lumi/Core/Services/ProblemService.swift`
- Problem views: `Lumi/Features/Problems/`

## Adding a New Problem Type

1. Add case to `ProblemType` enum in `Subject.swift`
2. Create `NewTypeProblemView.swift` in `Features/Problems/`
3. Add routing in `ProblemContainerView.swift`
4. Add problems to `problems_pt-BR.json`
5. Update `ProblemService` generation if needed
