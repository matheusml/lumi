---
name: translations
description: Translation checklist for game changes. Use when adding, modifying, or removing problem types/games to ensure all 5 languages are updated.
---

# Translation Updates for Games

## When to Use

Use this skill when:

- Adding a new problem type/game
- Modifying prompts, hints, or names in existing games
- Removing a problem type
- Adding new visual objects or grammar words

## Supported Languages

ALL 5 must be updated together:

| Code   | Language             |
| ------ | -------------------- |
| `en`   | English              |
| `ptBR` | Brazilian Portuguese |
| `de`   | German               |
| `fr`   | French               |
| `es`   | Spanish              |

---

## Adding a New Game

### Checklist

- [ ] **1. Add to i18n types** - `src/lib/i18n/types.ts`
  - Add key to `parents` section in `Translations` interface

- [ ] **2. Add to ALL 5 translation files** (parents section)
  - `src/lib/i18n/translations/en.ts`
  - `src/lib/i18n/translations/pt-BR.ts`
  - `src/lib/i18n/translations/de.ts`
  - `src/lib/i18n/translations/fr.ts`
  - `src/lib/i18n/translations/es.ts`

- [ ] **3. Update AnalyticsTab** - `src/routes/[lang=lang]/parents/components/AnalyticsTab.svelte`
  - Add to `getActivityName()` mapping (line ~35)
  - Add to category array (`mathActivities`, `logicActivities`, `grammarActivities`, or `socialEmotionalActivities`)

- [ ] **4. LocalizedStrings in generator**
  - Ensure `prompt` has all 5 languages
  - Ensure `hint` (if present) has all 5 languages
  - Ensure answer `label` fields have all 5 languages

### Key Naming Convention

Convert `ProblemType` (kebab-case) to camelCase for translation key:

| ProblemType         | Translation Key    |
| ------------------- | ------------------ |
| `counting`          | `counting`         |
| `odd-one-out`       | `oddOneOut`        |
| `shape-recognition` | `shapeRecognition` |
| `emotion-scenario`  | `emotionScenario`  |

### Example: Adding "memory-match"

**types.ts:**

```typescript
parents: {
	// ... existing
	memoryMatch: string
}
```

**en.ts:**

```typescript
parents: {
	// ... existing
	memoryMatch: 'Memory Match'
}
```

**AnalyticsTab.svelte:**

```typescript
const names: Record<ProblemType, string> = {
	// ... existing
	'memory-match': t.parents.memoryMatch
}

const logicActivities: ProblemType[] = [
	// ... existing
	'memory-match'
]
```

---

## Modifying an Existing Game

### Checklist

- [ ] If changing game name → Update all 5 translation files (`parents` section)
- [ ] If changing prompts/hints → Update ALL 5 languages in generator's `LocalizedString`
- [ ] If adding visual objects → Add to `visual-objects.ts` with all language fields

### LocalizedString Template

```typescript
{
  ptBR: 'Texto em português',
  en: 'Text in English',
  de: 'Text auf Deutsch',
  fr: 'Texte en français',
  es: 'Texto en español'
}
```

---

## Removing a Game

### Checklist

- [ ] Remove from `src/lib/i18n/types.ts` (parents section)
- [ ] Remove from all 5 translation files
- [ ] Remove from `AnalyticsTab.svelte` (mapping + category array)

---

## Adding Visual Objects

File: `src/lib/problems/visual-objects.ts`

```typescript
{
  id: 'uniqueId',
  emoji: '🎯',
  namePtBR: 'nome (plural)',
  nameEn: 'name (plural)',
  nameDe: 'Name (plural)',
  nameFr: 'nom (plural)',
  nameEs: 'nombre (plural)',
  singularPtBR: 'nome',
  singularEs: 'nombre',
  quantifierPtBR: 'Quantos',  // or 'Quantas' for feminine
  quantifierEs: 'Cuántos'     // or 'Cuántas' for feminine
}
```

---

## Adding Grammar Words

File: `src/lib/problems/grammar-data/words.ts`

```typescript
{
  word: 'palavra',
  emoji: '📚',
  syllables: ['pa', 'la', 'vra'],
  namePtBR: 'palavra',
  nameEn: 'word',
  nameDe: 'Wort',      // optional, falls back to English
  nameFr: 'mot',       // optional, falls back to English
  nameEs: 'palabra'    // optional, falls back to English
}
```

---

## Verification

After making changes:

1. `npm run check` - TypeScript catches missing keys
2. `npm run test:run` - Tests pass
3. Manual: Switch language in app → Parent Zone → Analytics → Verify names

---

## File Quick Reference

| Purpose           | Path                                                            |
| ----------------- | --------------------------------------------------------------- |
| Translation types | `src/lib/i18n/types.ts`                                         |
| English           | `src/lib/i18n/translations/en.ts`                               |
| Portuguese        | `src/lib/i18n/translations/pt-BR.ts`                            |
| German            | `src/lib/i18n/translations/de.ts`                               |
| French            | `src/lib/i18n/translations/fr.ts`                               |
| Spanish           | `src/lib/i18n/translations/es.ts`                               |
| Analytics mapping | `src/routes/[lang=lang]/parents/components/AnalyticsTab.svelte` |
| Visual objects    | `src/lib/problems/visual-objects.ts`                            |
| Grammar words     | `src/lib/problems/grammar-data/words.ts`                        |
