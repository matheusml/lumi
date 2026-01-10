---
name: svelte-patterns
description: Svelte code patterns and templates for Lumi. Use when creating views, components, services, or asking about Svelte/SvelteKit architecture patterns in this project.
---

# Svelte Patterns for Lumi

## Component Pattern (Svelte 5)

```svelte
<script lang="ts">
  /**
   * ComponentName
   *
   * Brief description.
   */

  interface Props {
    title: string;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    onclick?: () => void;
    children?: import('svelte').Snippet;
  }

  let {
    title,
    variant = 'primary',
    disabled = false,
    onclick,
    children,
  }: Props = $props();

  // Reactive state
  let count = $state(0);

  // Derived values
  const doubled = $derived(count * 2);

  // Side effects
  $effect(() => {
    console.log('count changed:', count);
  });
</script>

<button
  class="component {variant}"
  {disabled}
  {onclick}
>
  {#if children}
    {@render children()}
  {:else}
    {title}
  {/if}
</button>

<style>
  .component {
    /* Use CSS variables */
    min-height: var(--touch-standard);
    background-color: var(--color-primary);
  }
</style>
```

## Page/Route Pattern

```svelte
<script lang="ts">
  /**
   * Page Name
   *
   * Brief description.
   */

  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { LumiButton } from '$lib/components';
  import { someService } from '$lib/services';

  // State
  let isLoading = $state(true);
  let data = $state<SomeType | null>(null);

  onMount(() => {
    loadData();
  });

  function loadData() {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('key');
    if (stored) {
      data = JSON.parse(stored);
    }
    isLoading = false;
  }

  function handleAction() {
    // Do something
    goto('/next-page');
  }
</script>

<svelte:head>
  <title>Page Title - Lumi</title>
</svelte:head>

<main class="page">
  {#if isLoading}
    <p>Carregando...</p>
  {:else}
    <h1 class="title">Page Title</h1>
    <LumiButton onclick={handleAction}>Action</LumiButton>
  {/if}
</main>

<style>
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-screen-horizontal);
    gap: var(--spacing-xl);
  }
</style>
```

## Service Pattern

```typescript
/**
 * Service Name
 *
 * Brief description.
 */

export class SomeService {
  private state: StateType;

  constructor() {
    this.state = defaultState;
  }

  /** Load state from storage */
  loadState(data: StateType): void {
    this.state = data;
  }

  /** Get state for persistence */
  getState(): StateType {
    return this.state;
  }

  /** Main functionality */
  doSomething(): ResultType {
    // Implementation
    return result;
  }
}

// Singleton instance
export const someService = new SomeService();
```

## State Management

### Local Component State
```svelte
<script lang="ts">
  let count = $state(0);
  let items = $state<string[]>([]);

  function increment() {
    count += 1;
  }

  function addItem(item: string) {
    items = [...items, item];  // Create new array for reactivity
  }
</script>
```

### Derived State
```svelte
<script lang="ts">
  let items = $state<Item[]>([]);

  const total = $derived(items.length);
  const completed = $derived(items.filter(i => i.done).length);
  const remaining = $derived(total - completed);
</script>
```

### Effects
```svelte
<script lang="ts">
  let count = $state(0);

  // Runs when count changes
  $effect(() => {
    console.log('Count is now:', count);
  });

  // Cleanup pattern
  $effect(() => {
    const interval = setInterval(() => {}, 1000);
    return () => clearInterval(interval);
  });
</script>
```

## localStorage Persistence

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let data = $state<DataType | null>(null);

  onMount(() => {
    // Load on mount
    const stored = localStorage.getItem('key');
    if (stored) {
      data = JSON.parse(stored);
    }
  });

  function saveData() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('key', JSON.stringify(data));
    }
  }
</script>
```

## Navigation

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  // Navigate programmatically
  function goToAdventure() {
    goto('/adventure');
  }

  // Navigate with query params
  function goToComplete(correct: number, total: number) {
    goto(`/complete?correct=${correct}&total=${total}`);
  }

  // Read query params
  const searchParams = $page.url.searchParams;
  const correct = searchParams.get('correct');
</script>
```

## Conditional Rendering

```svelte
{#if condition}
  <p>Shown when true</p>
{:else if otherCondition}
  <p>Alternative</p>
{:else}
  <p>Default</p>
{/if}

{#each items as item, index}
  <div>{index}: {item.name}</div>
{/each}

{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}
```

## Event Handling

```svelte
<button onclick={handleClick}>Click</button>
<button onclick={() => handleClick(arg)}>With arg</button>

<input
  bind:value={text}
  oninput={(e) => handleInput(e.currentTarget.value)}
/>
```

## CSS Patterns

### Scoped Styles
```svelte
<style>
  /* Only applies to this component */
  .button {
    background: var(--color-primary);
  }
</style>
```

### Global Styles (use sparingly)
```svelte
<style>
  :global(body) {
    margin: 0;
  }
</style>
```

### Animation
```svelte
<style>
  .element {
    transition: transform var(--transition-fast);
  }

  .element:active {
    transform: scale(0.96);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate {
    animation: fadeIn 0.3s ease-out;
  }
</style>
```
