/**
 * i18n Language Service
 *
 * Centralized internationalization with browser detection and persistence.
 * Uses dynamic imports to only load the required language, improving initial bundle size.
 */

import { writable } from 'svelte/store'
import type { SupportedLanguage, LanguageInfo, Translations } from './types'
// Only import English synchronously as the default/fallback language
import { en } from './translations/en'

const STORAGE_KEY = 'lumi-language'
const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

/**
 * Translation loaders - use dynamic imports for non-default languages
 * This reduces initial bundle size by only loading translations when needed
 */
const translationLoaders: Record<SupportedLanguage, () => Promise<Translations>> = {
	en: async () => en, // Already loaded synchronously
	'pt-BR': async () => {
		const { ptBR } = await import('./translations/pt-BR')
		return ptBR
	},
	de: async () => {
		const { de } = await import('./translations/de')
		return de
	},
	fr: async () => {
		const { fr } = await import('./translations/fr')
		return fr
	},
	es: async () => {
		const { es } = await import('./translations/es')
		return es
	}
}

/** Cache for loaded translations */
const loadedTranslations: Partial<Record<SupportedLanguage, Translations>> = {
	en // English is always available
}

/** Detect browser language (can be called during module init) */
function detectBrowserLanguage(): SupportedLanguage {
	if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE

	const browserLang = navigator.language || navigator.languages?.[0]
	if (!browserLang) return DEFAULT_LANGUAGE

	// Normalize to lowercase for comparison
	const normalizedBrowserLang = browserLang.toLowerCase()

	// Check for exact match first (e.g., 'pt-br' matches 'pt-BR')
	const exactMatch = (Object.keys(languages) as SupportedLanguage[]).find(
		(lang) => lang.toLowerCase() === normalizedBrowserLang
	)
	if (exactMatch) return exactMatch

	// Check for language prefix match (e.g., 'de-DE' matches 'de', 'pt' matches 'pt-BR')
	const prefix = browserLang.split('-')[0].toLowerCase()

	// First try to find exact prefix match (e.g., 'de' for German)
	const prefixMatch = (Object.keys(languages) as SupportedLanguage[]).find(
		(lang) => lang.toLowerCase() === prefix
	)
	if (prefixMatch) return prefixMatch

	// Then try to find a language that starts with the prefix (e.g., 'pt' matches 'pt-BR')
	const startsWithMatch = (Object.keys(languages) as SupportedLanguage[]).find((lang) =>
		lang.toLowerCase().startsWith(prefix)
	)
	if (startsWithMatch) return startsWithMatch

	return DEFAULT_LANGUAGE
}

/** Get initial language synchronously (for module init) */
function getInitialLanguage(): SupportedLanguage {
	if (typeof window === 'undefined') return DEFAULT_LANGUAGE

	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored && stored in languages) {
			return stored as SupportedLanguage
		}
	} catch {
		// localStorage might not be available
	}

	return detectBrowserLanguage()
}

/** Language metadata */
export const languages: Record<SupportedLanguage, LanguageInfo> = {
	'pt-BR': { code: 'pt-BR', name: 'Português', flag: '🇧🇷', speechLang: 'pt-BR' },
	en: { code: 'en', name: 'English', flag: '🇺🇸', speechLang: 'en-US' },
	de: { code: 'de', name: 'Deutsch', flag: '🇩🇪', speechLang: 'de-DE' },
	fr: { code: 'fr', name: 'Français', flag: '🇫🇷', speechLang: 'fr-FR' },
	es: { code: 'es', name: 'Español', flag: '🇪🇸', speechLang: 'es-ES' }
}

/** Current language - module state (initialized synchronously for correct SSR/hydration) */
let currentLanguage: SupportedLanguage = getInitialLanguage()

/** Translation version store - increments when translations are loaded to trigger reactivity */
export const translationVersion = writable(0)

/**
 * Load translations for a language (async, with caching)
 */
async function loadTranslations(lang: SupportedLanguage): Promise<Translations> {
	// Return cached if available
	if (loadedTranslations[lang]) {
		return loadedTranslations[lang]!
	}

	// Load and cache
	const translations = await translationLoaders[lang]()
	loadedTranslations[lang] = translations
	// Increment version to trigger reactivity in components
	translationVersion.update((v) => v + 1)
	return translations
}

/**
 * Preload translations for a language (call early to warm the cache)
 */
export function preloadTranslations(lang: SupportedLanguage): void {
	if (!loadedTranslations[lang]) {
		loadTranslations(lang).catch(() => {
			// Silently fail - will use fallback
		})
	}
}

/** Subscribers for language changes */
const subscribers: Set<(lang: SupportedLanguage) => void> = new Set()

/** Get current language */
export function getLanguage(): SupportedLanguage {
	return currentLanguage
}

/** Get current translations (sync - returns cached or fallback to English) */
export function getTranslations(): Translations {
	return loadedTranslations[currentLanguage] || en
}

/** Get translations for a specific language (sync - returns cached or fallback) */
export function getTranslationsForLang(lang: string): Translations {
	if (lang in languages) {
		return loadedTranslations[lang as SupportedLanguage] || en
	}
	return en
}

/** Get translations async (loads if needed) */
export async function getTranslationsAsync(lang?: SupportedLanguage): Promise<Translations> {
	const targetLang = lang || currentLanguage
	return loadTranslations(targetLang)
}

/** Subscribe to language changes */
export function subscribe(callback: (lang: SupportedLanguage) => void): () => void {
	subscribers.add(callback)
	return () => subscribers.delete(callback)
}

/** Notify all subscribers */
function notifySubscribers() {
	for (const callback of subscribers) {
		callback(currentLanguage)
	}
}

/** Set language and persist to localStorage (loads translations async) */
export async function setLanguage(lang: SupportedLanguage): Promise<void> {
	if (lang === currentLanguage) return
	currentLanguage = lang

	// Load translations for new language
	await loadTranslations(lang)

	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, lang)
		// Update HTML lang attribute
		document.documentElement.lang = lang
	}
	notifySubscribers()
}

/** Set language from URL parameter (used by language-prefixed routes) */
export async function setLanguageFromUrl(lang: string): Promise<void> {
	if (!(lang in languages)) return

	const langKey = lang as SupportedLanguage
	currentLanguage = langKey

	// Always load translations (they might not be loaded yet even if language is already set)
	await loadTranslations(langKey)

	if (typeof window !== 'undefined') {
		// Sync to localStorage so it persists
		localStorage.setItem(STORAGE_KEY, lang)
		// Update HTML lang attribute (also done server-side via hooks)
		document.documentElement.lang = lang
	}

	// Always notify subscribers so components can re-render with loaded translations
	notifySubscribers()
}

/** Speech language type */
export type SpeechLanguage = 'pt-BR' | 'en-US' | 'de-DE' | 'fr-FR' | 'es-ES'

/** Get speech language code for current language */
export function getSpeechLanguage(): SpeechLanguage {
	return languages[currentLanguage].speechLang as SpeechLanguage
}

/** Initialize language (call once on app start) - loads translations async */
export async function initLanguage(): Promise<void> {
	if (typeof window === 'undefined') return

	// Language was already detected synchronously during module init via getInitialLanguage()
	// Here we need to:
	// 1. Load translations for the detected language
	// 2. Persist to localStorage if not already stored
	// 3. Update the HTML lang attribute
	// 4. Notify subscribers

	// Load translations for the current language (if not English, which is already loaded)
	await loadTranslations(currentLanguage)

	const stored = localStorage.getItem(STORAGE_KEY)
	if (!stored || !(stored in languages)) {
		// Persist the detected language
		localStorage.setItem(STORAGE_KEY, currentLanguage)
	}

	// Update HTML lang attribute
	document.documentElement.lang = currentLanguage
	notifySubscribers()
}

/** Helper to get localized string from LocalizedString type */
export function localize(str: {
	ptBR: string
	en: string
	de: string
	fr: string
	es: string
}): string {
	if (currentLanguage === 'pt-BR') return str.ptBR
	if (currentLanguage === 'de') return str.de
	if (currentLanguage === 'fr') return str.fr
	if (currentLanguage === 'es') return str.es
	return str.en
}

// Re-export types
export type { SupportedLanguage, LanguageInfo, Translations }
