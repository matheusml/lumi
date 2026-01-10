---
name: testing
description: Testing requirements and workflow for Lumi. Use when writing tests, running tests, or making any code changes that require test updates.
---

# Testing in Lumi

## Quick Reference

```bash
npm run check      # Type checking (fast, run first)
npm run test       # Run tests in watch mode
npm run test:run   # Run tests once (CI mode)
```

## Before Delivering Work

1. Run type check: `npm run check`
2. Run tests: `npm run test:run`
3. Fix any failures and run again
4. Only mark work complete when all pass

## When to Update Tests

| Code Change | Test Action |
|-------------|-------------|
| Add feature | Add tests for new functionality |
| Fix bug | Add test that reproduces bug, then fix |
| Change behavior | Update existing tests to match |
| Remove code | Remove related tests |
| Refactor | Tests should still pass |

## Writing Tests

### File Location

Tests go next to source files with `.test.ts` suffix:
```
src/lib/services/
├── difficulty-manager.ts
└── difficulty-manager.test.ts
```

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { DifficultyManager } from './difficulty-manager';

describe('DifficultyManager', () => {
  let manager: DifficultyManager;

  beforeEach(() => {
    manager = new DifficultyManager();
  });

  it('starts at minimum difficulty', () => {
    expect(manager.getDifficulty('counting')).toBe(1);
  });

  it('increases difficulty after 3 correct', () => {
    manager.recordAnswer(true, 'counting');
    manager.recordAnswer(true, 'counting');
    manager.recordAnswer(true, 'counting');
    expect(manager.getDifficulty('counting')).toBe(2);
  });
});
```

### Testing with Mocks

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Service with time', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resets on new day', () => {
    // Advance time by 24 hours
    vi.advanceTimersByTime(24 * 60 * 60 * 1000);
    // Test behavior
  });
});
```

## Common Matchers

```typescript
expect(value).toBe(expected);           // Strict equality
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeTruthy();
expect(value).toBeGreaterThan(3);
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(() => fn()).toThrow();
```

## What to Test

- **Services**: Initial state, state changes, boundaries
- **Generators**: Valid output, difficulty scaling, answer correctness
- **Utilities**: Input/output, edge cases
