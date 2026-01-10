---
name: problem-types
description: Math problem types and TypeScript types for Lumi. Use when working with problems, adding new problem types, or working with counting, addition, subtraction, comparison, or pattern problems.
---

# Working with Problem Types

## Problem Type Reference

### Counting (type: "counting")

- Display N objects, child selects total count
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

## TypeScript Types

```typescript
// Problem types
type ProblemType = 'counting' | 'addition' | 'subtraction' | 'comparison' | 'patterns'
type DifficultyLevel = 1 | 2 | 3 | 4

// Localized string
interface LocalizedString {
	ptBR: string
	en: string
}

// Visual elements
interface VisualElement {
	object: string // Emoji or image identifier
	count: number
	position?: 'left' | 'right' // For comparison problems
}

interface ProblemVisual {
	type: 'objects' | 'equation' | 'pattern' | 'comparison'
	elements: VisualElement[]
	operator?: '+' | '-' // For equations
}

// Answer types
type AnswerValue =
	| { type: 'number'; value: number }
	| { type: 'side'; value: 'left' | 'right' }
	| { type: 'pattern'; value: string[] }

// Problem structure
interface Problem {
	id: string
	type: ProblemType
	difficulty: DifficultyLevel
	signature: string // Unique identifier for deduplication

	visual: ProblemVisual
	prompt: LocalizedString

	correctAnswer: AnswerValue
	answerChoices: AnswerValue[]
}
```

## File Locations

- Problem types: `src/lib/types/problem.ts`
- Problem generators: `src/lib/problems/`
  - `counting-generator.ts`
  - `addition-generator.ts`
  - `subtraction-generator.ts`
  - `comparison-generator.ts`
  - `pattern-generator.ts`
- Problem service: `src/lib/problems/problem-service.ts`
- Visual objects (emojis): `src/lib/problems/visual-objects.ts`

## Adding a New Problem Type

1. Add type to `ProblemType` union in `src/lib/types/problem.ts`
2. Create generator in `src/lib/problems/new-type-generator.ts`:

   ```typescript
   import type { Problem, DifficultyLevel } from '$lib/types';

   export function generateNewTypeProblem(difficulty: DifficultyLevel): Problem {
     // Generate problem based on difficulty
     return {
       id: `new_d${difficulty}_${Date.now()}`,
       type: 'newType',
       difficulty,
       signature: '...', // Unique signature for deduplication
       visual: { type: 'objects', elements: [...] },
       prompt: { ptBR: '...', en: '...' },
       correctAnswer: { type: 'number', value: 0 },
       answerChoices: [...],
     };
   }
   ```

3. Export from `src/lib/problems/index.ts`
4. Update `ProblemService` in `problem-service.ts` to include the generator
5. Update adventure view to handle new visual type if needed

## Visual Object Emojis

Common objects defined in `visual-objects.ts`:

- Fruits: apple, banana, orange, strawberry
- Animals: dog, cat, bird, fish
- Objects: star, heart, ball, flower

## Pattern Circle Colors

For pattern problems, use these color IDs:

- `circle_red`, `circle_blue`, `circle_green`
- `circle_yellow`, `circle_purple`
- `unknown` - Placeholder (renders as question mark)

Colors are defined in `src/lib/problems/pattern-generator.ts`:

```typescript
export const patternColors = {
	circle_red: '#E57373',
	circle_blue: '#64B5F6',
	circle_green: '#81C784',
	circle_yellow: '#FFD54F',
	circle_purple: '#BA68C8'
}
```

## Problem ID Convention

Format: `{type}_d{difficulty}_{timestamp}`

- `counting_d1_1704067200000`
- `add_d2_1704067200001`
- `sub_d1_1704067200002`
- `comp_d3_1704067200003`
- `pat_d1_1704067200004`
