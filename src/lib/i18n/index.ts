/**
 * i18n Language Service
 *
 * Centralized internationalization with browser detection and persistence.
 */

import type { SupportedLanguage, LanguageInfo, Translations } from './types'
import { ptBR } from './translations/pt-BR'
import { en } from './translations/en'
import { de } from './translations/de'
import { fr } from './translations/fr'
import { es } from './translations/es'

const STORAGE_KEY = 'lumi-language'
const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

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

/** All translations */
const translations: Record<SupportedLanguage, Translations> = {
	'pt-BR': ptBR,
	en,
	de,
	fr,
	es
}

/** Current language - module state (initialized synchronously for correct SSR/hydration) */
let currentLanguage: SupportedLanguage = getInitialLanguage()

/** Subscribers for language changes */
const subscribers: Set<(lang: SupportedLanguage) => void> = new Set()

/** Get current language */
export function getLanguage(): SupportedLanguage {
	return currentLanguage
}

/** Get current translations */
export function getTranslations(): Translations {
	return translations[currentLanguage]
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

/** Set language and persist to localStorage */
export function setLanguage(lang: SupportedLanguage): void {
	if (lang === currentLanguage) return
	currentLanguage = lang
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, lang)
		// Update HTML lang attribute
		document.documentElement.lang = lang
	}
	notifySubscribers()
}

/** Speech language type */
export type SpeechLanguage = 'pt-BR' | 'en-US' | 'de-DE' | 'fr-FR' | 'es-ES'

/** Get speech language code for current language */
export function getSpeechLanguage(): SpeechLanguage {
	return languages[currentLanguage].speechLang as SpeechLanguage
}

/** Initialize language (call once on app start) */
export function initLanguage(): void {
	if (typeof window === 'undefined') return

	// Language was already detected synchronously during module init via getInitialLanguage()
	// Here we just need to:
	// 1. Persist to localStorage if not already stored
	// 2. Update the HTML lang attribute
	// 3. Notify subscribers

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
