---
name: responsive
description: Mobile-first responsive design patterns for Lumi. Use when styling components, adding media queries, or working with responsive layouts.
---

# Responsive Design Patterns for Lumi

## Core Principle: Mobile-First

Write styles for mobile as the **default**, then use `min-width` media queries to enhance for larger screens.

```css
/* CORRECT - Mobile-first */
.element {
	padding: var(--spacing-sm); /* Mobile default */
}

@media (min-width: 480px) {
	.element {
		padding: var(--spacing-md); /* Larger screens */
	}
}

/* INCORRECT - Desktop-first (DO NOT USE) */
.element {
	padding: var(--spacing-md);
}

@media (max-width: 480px) {
	.element {
		padding: var(--spacing-sm);
	}
}
```

## Standard Breakpoints

| Breakpoint          | Target       | Usage                        |
| ------------------- | ------------ | ---------------------------- |
| Default (no query)  | Mobile       | Base styles for all devices  |
| `min-width: 480px`  | Large mobile | Enhanced spacing/sizing      |
| `min-width: 768px`  | Tablet       | Multi-column layouts         |
| `min-width: 1024px` | Desktop      | Maximum widths, larger grids |

**Always use these exact values** for consistency across the codebase.

## Fluid Sizing with clamp()

Use `clamp()` for elements that should scale smoothly:

```css
/* clamp(minimum, preferred, maximum) */
.title {
	font-size: clamp(1.5rem, 5vw, 2.5rem);
}

.card {
	width: clamp(280px, 90vw, 500px);
}

.icon {
	width: clamp(2rem, 8vw, 4rem);
	height: clamp(2rem, 8vw, 4rem);
}
```

## Touch Targets

Children's apps require larger touch targets:

| Variable           | Value | Usage            |
| ------------------ | ----- | ---------------- |
| `--touch-minimum`  | 44px  | Absolute minimum |
| `--touch-standard` | 60px  | Preferred size   |
| `--touch-large`    | 80px  | Primary actions  |

```css
.button {
	min-height: var(--touch-standard);
	min-width: var(--touch-standard);
}
```

## Responsive Component Template

```svelte
<script lang="ts">
	interface Props {
		title: string
	}

	let { title }: Props = $props()
</script>

<div class="card">
	<h2 class="title">{title}</h2>
</div>

<style>
	.card {
		/* Mobile defaults */
		padding: var(--spacing-sm);
		gap: var(--spacing-sm);
	}

	.title {
		/* Fluid typography */
		font-size: clamp(1.25rem, 4vw, 1.5rem);
	}

	@media (min-width: 480px) {
		.card {
			padding: var(--spacing-md);
			gap: var(--spacing-md);
		}
	}

	@media (min-width: 768px) {
		.card {
			padding: var(--spacing-lg);
		}
	}
</style>
```

## Responsive Grid Pattern

```css
.grid {
	display: grid;
	gap: var(--spacing-sm);
	/* Mobile: single column */
	grid-template-columns: 1fr;
}

@media (min-width: 480px) {
	.grid {
		gap: var(--spacing-md);
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 768px) {
	.grid {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (min-width: 1024px) {
	.grid {
		grid-template-columns: repeat(4, 1fr);
	}
}
```

## Common Patterns

### Container with max-width

```css
.container {
	width: 100%;
	max-width: 500px;
	margin: 0 auto;
	padding: var(--spacing-sm);
}

@media (min-width: 480px) {
	.container {
		padding: var(--spacing-md);
	}
}
```

### Responsive spacing

```css
.section {
	padding: var(--spacing-md);
	gap: var(--spacing-md);
}

@media (min-width: 768px) {
	.section {
		padding: var(--spacing-xl);
		gap: var(--spacing-lg);
	}
}
```

### Hide/show elements

```css
.desktop-only {
	display: none;
}

@media (min-width: 768px) {
	.desktop-only {
		display: block;
	}
}
```

## Testing Checklist

Before shipping, test at these viewport widths:

- **320px** - Small mobile (iPhone SE)
- **375px** - Standard mobile (iPhone)
- **480px** - Large mobile
- **768px** - Tablet
- **1024px** - Desktop

Verify:

- Touch targets are 44px+ on mobile
- Text is readable without zooming
- No horizontal scrolling
- Layouts adapt gracefully
