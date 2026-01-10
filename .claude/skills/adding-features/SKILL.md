---
name: adding-features
description: Step-by-step guides for adding new features to Lumi. Use when adding a new problem type, creating a new screen, adding UI components, adding visual objects, or implementing new functionality.
---

# Adding New Features to Lumi

## Adding a New Problem Type

### 1. Update ProblemType Type
In `src/lib/types/problem.ts`:
```typescript
export type ProblemType = 'counting' | 'addition' | 'subtraction' | 'comparison' | 'patterns' | 'newType';
```

### 2. Create Problem Generator
Create `src/lib/problems/new-type-generator.ts`:
```typescript
import type { Problem, DifficultyLevel } from '$lib/types';
import { getRandomObjects } from './visual-objects';

export function generateNewTypeProblem(difficulty: DifficultyLevel): Problem {
  const objects = getRandomObjects(1);

  return {
    id: `newtype_d${difficulty}_${Date.now()}`,
    type: 'newType',
    difficulty,
    signature: `newtype_${difficulty}_...`,  // Unique signature

    visual: {
      type: 'objects',
      elements: [{ object: objects[0], count: 5 }],
    },

    prompt: {
      ptBR: 'Pergunta em português?',
      en: 'Question in English?',
    },

    correctAnswer: { type: 'number', value: 5 },
    answerChoices: [
      { type: 'number', value: 4 },
      { type: 'number', value: 5 },
      { type: 'number', value: 6 },
    ],
  };
}
```

### 3. Export and Register Generator
In `src/lib/problems/index.ts`:
```typescript
export { generateNewTypeProblem } from './new-type-generator';
```

Update `src/lib/problems/problem-service.ts`:
```typescript
import { generateNewTypeProblem } from './new-type-generator';

// In the generators map:
private generators = new Map<ProblemType, (d: DifficultyLevel) => Problem>([
  ['counting', generateCountingProblem],
  // ...
  ['newType', generateNewTypeProblem],
]);
```

### 4. Update Adventure View (if new visual type)
In `src/routes/adventure/+page.svelte`, add handling for new visual type:
```svelte
{:else if currentProblem.visual.type === 'newVisual'}
  <div class="new-visual">
    <!-- Render your visual here -->
  </div>
{/if}
```

---

## Adding a New UI Component

Create in `src/lib/components/NewComponent.svelte`:
```svelte
<script lang="ts">
  /**
   * NewComponent
   *
   * Brief description of the component.
   */

  interface Props {
    title: string;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    onclick?: () => void;
  }

  let {
    title,
    variant = 'primary',
    disabled = false,
    onclick,
  }: Props = $props();
</script>

<button
  class="new-component {variant}"
  {disabled}
  {onclick}
>
  {title}
</button>

<style>
  .new-component {
    /* Use CSS variables from design system */
    min-height: var(--touch-standard);
    padding: var(--spacing-md) var(--spacing-lg);

    border: none;
    border-radius: var(--radius-lg);

    font-family: var(--font-family);
    font-size: var(--font-size-button-medium);
    font-weight: 600;

    cursor: pointer;
    transition: transform var(--transition-fast);
  }

  .new-component.primary {
    background-color: var(--color-primary);
    color: var(--color-text-on-primary);
  }

  .new-component.secondary {
    background-color: var(--color-secondary);
    color: var(--color-text-on-primary);
  }

  .new-component:active:not(:disabled) {
    transform: scale(0.96);
  }

  .new-component:disabled {
    background-color: var(--color-disabled);
    cursor: not-allowed;
  }
</style>
```

Export from `src/lib/components/index.ts`:
```typescript
export { default as NewComponent } from './NewComponent.svelte';
```

### Component Checklist
- [ ] Uses CSS variables for colors (`var(--color-*)`)
- [ ] Uses CSS variables for spacing (`var(--spacing-*)`)
- [ ] Uses CSS variables for typography (`var(--font-*)`)
- [ ] Touch target >= 44px (prefer 60px)
- [ ] Uses Svelte 5 runes (`$props()`, `$state()`)
- [ ] Animations are gentle (0.15-0.3s)

---

## Adding a New Screen/Route

Create `src/routes/newscreen/+page.svelte`:
```svelte
<script lang="ts">
  /**
   * New Screen
   *
   * Brief description.
   */

  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { LumiButton } from '$lib/components';

  // State
  let isLoading = $state(true);

  onMount(() => {
    loadData();
  });

  function loadData() {
    // Load from localStorage if needed
    isLoading = false;
  }

  function navigateHome() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Page Title - Lumi</title>
</svelte:head>

<main class="screen">
  {#if isLoading}
    <p>Carregando...</p>
  {:else}
    <h1 class="title">Page Title</h1>

    <div class="content">
      <!-- Screen content -->
    </div>

    <LumiButton onclick={navigateHome}>
      Voltar
    </LumiButton>
  {/if}
</main>

<style>
  .screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-screen-horizontal);
    gap: var(--spacing-xl);
  }

  .title {
    font-size: var(--font-size-heading-large);
    color: var(--color-text-primary);
    margin: 0;
  }

  .content {
    /* Content styles */
  }
</style>
```

---

## Adding Visual Objects (Emojis)

In `src/lib/problems/visual-objects.ts`:
```typescript
export const visualObjects = [
  // Existing objects...
  'newEmoji',  // Add new emoji
];
```

Then reference in problem generators:
```typescript
const objects = getRandomObjects(1);  // Gets random object from list
```

---

## Adding a New Service

Create `src/lib/services/new-service.ts`:
```typescript
/**
 * New Service
 *
 * Brief description of what it does.
 */

export class NewService {
  private state: SomeState;

  constructor() {
    this.state = initialState;
  }

  /**
   * Load state from localStorage
   */
  loadState(data: SomeState): void {
    this.state = data;
  }

  /**
   * Get state for persistence
   */
  getState(): SomeState {
    return this.state;
  }

  /**
   * Main functionality
   */
  doSomething(): void {
    // Implementation
  }
}

// Singleton instance
export const newService = new NewService();
```

Export from `src/lib/services/index.ts`:
```typescript
export { newService, NewService } from './new-service';
```

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
