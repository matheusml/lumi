---
name: commands
description: Build commands, file locations, and development workflow for Lumi. Use when building, testing, running npm commands, or asking about project structure and file locations.
---

# Common Development Commands

## Build & Run

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build
```

## Code Quality

```bash
npm run check      # Type checking with svelte-check
npm run check:watch  # Type checking in watch mode
```

## Testing

```bash
npm run test       # Run tests in watch mode
npm run test:run   # Run tests once (for CI)
```

## Key File Locations

| What          | Path                                |
| ------------- | ----------------------------------- |
| App entry     | `src/app.html`                      |
| Global styles | `src/app.css`                       |
| Layout        | `src/routes/+layout.svelte`         |
| Home page     | `src/routes/+page.svelte`           |
| Adventure     | `src/routes/adventure/+page.svelte` |
| Completion    | `src/routes/complete/+page.svelte`  |
| Parents       | `src/routes/parents/+page.svelte`   |

## Source Structure

```
src/
├── lib/
│   ├── components/     # UI components
│   │   ├── LumiButton.svelte
│   │   ├── ChoiceButton.svelte
│   │   ├── ProgressDots.svelte
│   │   ├── CountableObject.svelte
│   │   ├── PatternCircle.svelte
│   │   └── SpeakerButton.svelte
│   ├── problems/       # Problem generation
│   │   ├── counting-generator.ts
│   │   ├── addition-generator.ts
│   │   ├── subtraction-generator.ts
│   │   ├── comparison-generator.ts
│   │   ├── pattern-generator.ts
│   │   ├── problem-service.ts
│   │   └── visual-objects.ts
│   ├── services/       # App services
│   │   ├── difficulty-manager.ts
│   │   ├── adventure-limit.ts
│   │   └── speech.ts
│   ├── theme/          # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── animations.ts
│   └── types/          # TypeScript types
│       ├── problem.ts
│       └── session.ts
└── routes/             # SvelteKit pages
```

## Data Storage

All data is stored in `localStorage`:

| Key               | Purpose                                 |
| ----------------- | --------------------------------------- |
| `lumi-progress`   | Difficulty progress per problem type    |
| `lumi-seen`       | Seen problem signatures (deduplication) |
| `lumi-limits`     | Daily adventure limits                  |
| `lumi-auto-voice` | Voice auto-play setting                 |

### Reset Data

Clear localStorage in browser DevTools, or:

```javascript
localStorage.clear()
```

## Localization

Primary: English - `en`
Supported: `pt-BR`, `de`, `fr`

```typescript
interface LocalizedString {
	en: string
	ptBR: string
}

// Usage
const prompt: LocalizedString = {
	en: 'How many apples?',
	ptBR: 'Quantas maçãs?'
}
```

## Environment

- **Framework**: SvelteKit with Svelte 5
- **Language**: TypeScript
- **Build tool**: Vite
- **Testing**: Vitest
- **Styling**: Scoped CSS with CSS variables
