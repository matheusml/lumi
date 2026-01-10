# Lumi - Educational App for Children

Web educational app for kids. Learning-focused MVP. Portuguese (Brazil) primary language.

**Tech**: SvelteKit, TypeScript, Svelte 5 | **Storage**: localStorage (fully offline)

## Anti-Addiction Principles (CRITICAL)

**NEVER add:**

- Stars, coins, gems, or virtual currencies
- Streaks or "don't break your streak" mechanics
- Leaderboards or social comparison
- Timed challenges that create stress
- Notifications asking kids to return
- Flashy/hyperactive animations
- Variable reward schedules

**ALWAYS:**

- Keep adventures discrete (5 problems each)
- Respect daily limits (default: 3/day)
- Celebrate completion, not speed/scores
- Use gentle, calm animations
- When limits reached, encourage outdoor play

## Architecture

```
src/
├── lib/
│   ├── components/     # UI components (LumiButton, ChoiceButton, etc.)
│   ├── problems/       # Problem generators and service
│   ├── services/       # Difficulty manager, speech, limits
│   ├── theme/          # Design system tokens (colors, typography, spacing)
│   └── types/          # TypeScript types
├── routes/
│   ├── +page.svelte    # Home screen
│   ├── adventure/      # Learning experience
│   ├── complete/       # Completion celebration
│   └── parents/        # Parent dashboard
└── app.css             # Global styles
```

## Design System Quick Reference

**Colors** (CSS variables):

- `--color-primary` (#F59E8C) - Main actions (coral)
- `--color-secondary` (#8CC7F0) - Secondary actions (sky blue)
- `--color-success` (#99D9BF) - Correct answers (mint)
- `--color-try-again` (#FFCDB2) - Incorrect (soft peach, not red!)
- `--color-background` (#FCF8F0) - Warm cream background

**Touch targets**: Minimum 44px, prefer 60-80px for children's fingers

## Key Patterns

**Components**: Svelte 5 with runes (`$state`, `$derived`, `$effect`)
**Routing**: SvelteKit file-based routing
**State**: localStorage for persistence, stores for reactive state
**Speech**: Web Speech API for voice prompts

## Adaptive Difficulty

- Start at level 1, move UP after 3 correct, DOWN after 2 incorrect
- Range: 1-4

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run check    # Type checking
npm run test     # Run tests
```

## Testing (REQUIRED)

- **Always run tests before delivering work**
- **Update tests when changing code** (add for features, update for changes, remove for deletions)
- Run `npm run test` for watch mode, `npm run test:run` for single run
