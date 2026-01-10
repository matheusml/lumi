---
name: design-system
description: Lumi design system reference for colors, typography, spacing, and components. Use when styling UI, creating components, working with CSS variables, or asking about the design tokens.
---

# Lumi Design System Reference

## Using Design Tokens

All design tokens are available as CSS variables in `src/app.css`. Use them in component styles:

```css
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  font-size: var(--font-size-button-large);
  border-radius: var(--radius-lg);
}
```

## Color Palette

### Primary Colors
| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--color-primary` | #F59E8C | Coral - main actions |
| `--color-primary-hover` | #E88A76 | Hover state |
| `--color-primary-light` | #FBD4CC | Light backgrounds |
| `--color-secondary` | #8CC7F0 | Sky blue - secondary |
| `--color-secondary-hover` | #6BB5E8 | Hover state |
| `--color-secondary-light` | #C5E3F7 | Light backgrounds |

### Feedback Colors
| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--color-success` | #99D9BF | Mint - correct answers |
| `--color-success-dark` | #7CC9A8 | Text on success bg |
| `--color-try-again` | #FFCDB2 | Soft peach - incorrect (NOT red!) |
| `--color-try-again-dark` | #E5A588 | Text on try-again bg |

### Background Colors
| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--color-background` | #FCF8F0 | Warm cream - main bg |
| `--color-surface` | #FFFFFF | Cards, elevated surfaces |
| `--color-surface-hover` | #F7F3EB | Hover state |

### Text Colors
| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--color-text-primary` | #4A4A4A | Main text |
| `--color-text-secondary` | #7A7A7A | Secondary text |
| `--color-text-muted` | #A0A0A0 | Placeholder/disabled |
| `--color-text-on-primary` | #FFFFFF | Text on primary buttons |

### Other
| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--color-border` | #E8E4DC | Borders |
| `--color-disabled` | #D4D0C8 | Disabled elements |

## Typography

### Font Sizes
| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--font-size-display-large` | 3rem | Celebrations |
| `--font-size-number-large` | 3.5rem | Big numbers |
| `--font-size-number-medium` | 2.25rem | Answer choices |
| `--font-size-heading-large` | 2rem | Page titles |
| `--font-size-heading-medium` | 1.5rem | Section headers |
| `--font-size-body-large` | 1.25rem | Important text |
| `--font-size-body-medium` | 1rem | Regular text |
| `--font-size-button-large` | 1.5rem | Primary buttons |
| `--font-size-button-medium` | 1.125rem | Secondary buttons |

### Font Family
```css
--font-family: "SF Pro Rounded", "Nunito", system-ui, sans-serif;
```

## Spacing

| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--spacing-xs` | 0.25rem | 4px - tight |
| `--spacing-sm` | 0.5rem | 8px - small |
| `--spacing-md` | 1rem | 16px - standard |
| `--spacing-lg` | 1.5rem | 24px - large |
| `--spacing-xl` | 2rem | 32px - sections |
| `--spacing-2xl` | 3rem | 48px - major |
| `--spacing-screen-horizontal` | 1.5rem | Screen padding |

## Touch Targets

| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--touch-minimum` | 2.75rem | 44px - minimum |
| `--touch-standard` | 3.75rem | 60px - preferred |
| `--touch-large` | 5rem | 80px - large buttons |
| `--touch-choice-button` | 5rem | Answer choices |

## Border Radius

| CSS Variable | Value |
|--------------|-------|
| `--radius-sm` | 0.5rem |
| `--radius-md` | 0.75rem |
| `--radius-lg` | 1rem |
| `--radius-xl` | 1.5rem |
| `--radius-full` | 9999px |

## Shadows

| CSS Variable | Usage |
|--------------|-------|
| `--shadow-sm` | Subtle elevation |
| `--shadow-md` | Standard cards |
| `--shadow-lg` | Prominent elements |

## Transitions

| CSS Variable | Value |
|--------------|-------|
| `--transition-fast` | 150ms ease |
| `--transition-normal` | 250ms ease |

## Components

### LumiButton
```svelte
<LumiButton variant="primary" onclick={handleClick}>
  Button Text
</LumiButton>
```
Variants: `primary`, `secondary`, `ghost`
Sizes: `medium`, `large` (default)

### ChoiceButton
```svelte
<ChoiceButton state="default" onclick={handleSelect}>
  5
</ChoiceButton>
```
States: `default`, `selected`, `correct`, `incorrect`

### ProgressDots
```svelte
<ProgressDots total={5} current={2} completed={2} />
```

### CountableObject
```svelte
<CountableObject objectId="apple" count={5} maxPerRow={5} />
```

### PatternCircle
```svelte
<PatternCircle colorId="circle_red" size="large" />
```
Sizes: `small`, `medium`, `large`

### SpeakerButton
```svelte
<SpeakerButton text="Quantas maçãs?" lang="pt-BR" />
```

## Layout Guidelines

### Screen Structure
```svelte
<main class="screen">
  <!-- Content -->
</main>

<style>
  .screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-screen-horizontal);
    gap: var(--spacing-xl);
  }
</style>
```

### Touch Targets
Always ensure interactive elements have adequate touch targets:
```css
.interactive {
  min-height: var(--touch-standard);  /* 60px minimum */
  min-width: var(--touch-standard);
}
```

### Animation Guidelines
- Use gentle transitions (150-300ms)
- Scale effect on press: `transform: scale(0.96)`
- Avoid flashy or hyperactive animations
