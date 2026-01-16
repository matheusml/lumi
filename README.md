<p align="center">
  <img src="static/readme-icon.png" alt="Lumi Logo" width="120" height="120">
</p>

<h3 align="center">Lumi</h3>

<p align="center">
  An anti-addictive educational app for children.
</p>

## Philosophy

Most children's educational apps use dark patterns—points, streaks, leaderboards, notifications—to maximize screen time. Lumi is the opposite: **we respect children's wellbeing** while making learning effective.

### What We Don't Do

- ❌ No points, coins, gems, or virtual currencies
- ❌ No streaks or "don't break your streak" pressure
- ❌ No leaderboards or social comparison
- ❌ No timed challenges that create stress
- ❌ No notifications asking kids to return
- ❌ No flashy, hyperactive animations
- ❌ No variable reward schedules

### What We Do

- ✅ Discrete adventures (5 problems each)
- ✅ Respect daily limits (default: 3 adventures/day)
- ✅ Celebrate completion, not speed or scores
- ✅ Use gentle, calm animations
- ✅ Encourage outdoor play when limits are reached
- ✅ Adaptive difficulty that grows with the child

## Features

### Adaptive Difficulty

Each problem type has 4 difficulty levels. The system:

- Moves **UP** after 3 consecutive correct answers
- Moves **DOWN** after 2 consecutive incorrect answers
- Tracks progress independently per activity type

### Parent Zone

Parents can:

- View today's adventure count
- See progress per activity type (level + accuracy)
- Adjust daily limits (1-10 or unlimited)
- Reset today's count if needed

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with TypeScript
- **Styling**: CSS custom properties (design tokens)
- **Storage**: localStorage (fully offline, no accounts)
- **Speech**: Web Speech API for voice prompts

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

We welcome contributions! Please read our guidelines:

1. **Respect the philosophy** - No addictive mechanics
2. **Keep it calm** - Gentle animations, no flashy effects
3. **Think of the children** - Large touch targets, simple language
4. **Test on devices** - Works on tablets, phones, Chromebooks

### Ideas for Contribution

- [ ] New problem types (shapes, time, money)
- [ ] Additional languages
- [ ] Improved accessibility (screen readers)
- [ ] More visual objects and themes
- [ ] Bug fixes
