/**
 * Navigation Utilities
 *
 * Helpers for building localized URLs that preserve the current language.
 */

import { getLanguage } from '$lib/i18n'

const LANGUAGE_PATTERN = /^\/(en|pt-BR|de|fr|es)(\/|$)/

/**
 * Build a localized URL path that includes the current language prefix.
 *
 * @param path - The path without language prefix (e.g., '/about', '/adventure')
 * @returns The path with language prefix (e.g., '/en/about', '/de/adventure')
 */
export function localizedPath(path: string): string {
	const lang = getLanguage()

	// Ensure path starts with /
	const normalizedPath = path.startsWith('/') ? path : `/${path}`

	// Don't double-prefix if path already has a language
	if (LANGUAGE_PATTERN.test(normalizedPath)) {
		return normalizedPath
	}

	// Handle root path
	if (normalizedPath === '/') {
		return `/${lang}`
	}

	return `/${lang}${normalizedPath}`
}

/**
 * Build a localized URL with query parameters.
 *
 * @param path - The path without language prefix
 * @param params - Query parameters to append
 * @returns The full URL with language prefix and query string
 */
export function localizedUrl(path: string, params?: Record<string, string>): string {
	const base = localizedPath(path)
	if (!params || Object.keys(params).length === 0) return base
	const search = new URLSearchParams(params).toString()
	return `${base}?${search}`
}

/**
 * Extract the path without language prefix from a URL.
 *
 * @param pathname - The full pathname (e.g., '/en/about')
 * @returns The path without language prefix (e.g., '/about')
 */
export function stripLanguagePrefix(pathname: string): string {
	const match = pathname.match(LANGUAGE_PATTERN)
	if (match) {
		const stripped = pathname.slice(match[0].length - 1) // Keep the trailing /
		return stripped || '/'
	}
	return pathname
}
