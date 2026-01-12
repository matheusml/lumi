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

const STORAGE_KEY = 'lumi-language'
const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

/** Language metadata */
export const languages: Record<SupportedLanguage, LanguageInfo> = {
	'pt-BR': { code: 'pt-BR', name: 'Português', flag: '🇧🇷', speechLang: 'pt-BR' },
	en: { code: 'en', name: 'English', flag: '🇺🇸', speechLang: 'en-US' },
	de: { code: 'de', name: 'Deutsch', flag: '🇩🇪', speechLang: 'de-DE' },
	fr: { code: 'fr', name: 'Français', flag: '🇫🇷', speechLang: 'fr-FR' }
}

/** All translations */
const translations: Record<SupportedLanguage, Translations> = {
	'pt-BR': ptBR,
	en,
	de,
	fr
}

/** Current language - module state */
let currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE

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
export type SpeechLanguage = 'pt-BR' | 'en-US' | 'de-DE' | 'fr-FR'

/** Get speech language code for current language */
export function getSpeechLanguage(): SpeechLanguage {
	return languages[currentLanguage].speechLang as SpeechLanguage
}

/** Detect browser language */
function detectBrowserLanguage(): SupportedLanguage {
	if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE

	const browserLang = navigator.language || navigator.languages?.[0]
	if (!browserLang) return DEFAULT_LANGUAGE

	// Check for exact match first
	if (browserLang in languages) {
		return browserLang as SupportedLanguage
	}

	// Check for language prefix match (e.g., 'pt' matches 'pt-BR')
	const prefix = browserLang.split('-')[0]
	const match = Object.keys(languages).find((lang) => lang.startsWith(prefix)) as
		| SupportedLanguage
		| undefined

	return match || DEFAULT_LANGUAGE
}

/** Initialize language (call once on app start) */
export function initLanguage(): void {
	if (typeof window === 'undefined') return

	const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null
	if (stored && stored in languages) {
		currentLanguage = stored
	} else {
		currentLanguage = detectBrowserLanguage()
		localStorage.setItem(STORAGE_KEY, currentLanguage)
	}

	// Update HTML lang attribute
	document.documentElement.lang = currentLanguage
	notifySubscribers()
}

/** Helper to get localized string from LocalizedString type */
export function localize(str: { ptBR: string; en: string; de: string; fr: string }): string {
	if (currentLanguage === 'pt-BR') return str.ptBR
	if (currentLanguage === 'de') return str.de
	if (currentLanguage === 'fr') return str.fr
	return str.en
}

// Re-export types
export type { SupportedLanguage, LanguageInfo, Translations }
