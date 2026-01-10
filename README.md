# Lumi 🌟

An anti-addictive educational app for children ages 4-7.

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

### Problem Types

1. **Counting** - "How many apples do you see?"
2. **Addition** - Visual addition with emoji objects
3. **Subtraction** - Objects "flying away"
4. **Comparison** - "Which side has more?"
5. **Patterns** - Complete the sequence

### Adaptive Difficulty

Each problem type has 4 difficulty levels. The system:
- Moves **UP** after 3 consecutive correct answers
- Moves **DOWN** after 2 consecutive incorrect answers
- Tracks progress independently per activity type

### Parent Zone

Protected by a simple math problem (multiplication), parents can:
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

## Project Structure

```
src/
├── lib/
│   ├── components/     # UI components (LumiButton, ChoiceButton, etc.)
│   ├── problems/       # Problem generators and service
│   ├── services/       # Difficulty manager, speech, limits
│   ├── theme/          # Design system tokens
│   └── types/          # TypeScript types
├── routes/
│   ├── +page.svelte    # Home screen
│   ├── adventure/      # Learning experience
│   ├── complete/       # Completion celebration
│   └── parents/        # Parent dashboard
└── app.css             # Global styles
```

## Design System

### Colors

| Token | Value | Use |
|-------|-------|-----|
| `--color-primary` | #F59E8C | Main actions (coral) |
| `--color-secondary` | #8CC7F0 | Secondary actions (sky blue) |
| `--color-success` | #99D9BF | Correct answers (mint) |
| `--color-try-again` | #FFCDB2 | Incorrect (soft peach, not red!) |
| `--color-background` | #FCF8F0 | Warm cream background |

### Touch Targets

Minimum 44px, prefer 60-80px for children's fingers.

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
- [ ] PWA support for offline use
- [ ] More visual objects and themes

## License

MIT License - Use it freely, fork it, improve it!

## Credits

Built with love for children's healthy development.

---

*"Learning should be joyful, not addictive."*
