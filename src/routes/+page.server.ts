/**
 * Root Page Server Load
 *
 * Redirects the root URL (/) to the appropriate language-prefixed URL.
 * Detection priority: cookie > Accept-Language header > default (en)
 */

import { redirect } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'

const SUPPORTED_LANGUAGES = ['en', 'pt-BR', 'de', 'fr', 'es']
const DEFAULT_LANGUAGE = 'en'

/**
 * Detect the best language from the Accept-Language header.
 */
function detectLanguageFromHeader(header: string): string | null {
	const languages = header
		.split(',')
		.map((lang) => {
			const [code, q = 'q=1'] = lang.trim().split(';')
			return { code: code.trim().toLowerCase(), quality: parseFloat(q.split('=')[1] || '1') }
		})
		.sort((a, b) => b.quality - a.quality)

	for (const { code } of languages) {
		// Exact match (case-insensitive)
		const exactMatch = SUPPORTED_LANGUAGES.find((l) => l.toLowerCase() === code)
		if (exactMatch) return exactMatch

		// Prefix match (e.g., 'pt' -> 'pt-BR', 'de-de' -> 'de')
		const prefix = code.split('-')[0]
		const prefixMatch = SUPPORTED_LANGUAGES.find(
			(l) => l.toLowerCase() === prefix || l.toLowerCase().startsWith(prefix + '-')
		)
		if (prefixMatch) return prefixMatch
	}

	return null
}

export const load = async ({ request, cookies }: RequestEvent) => {
	// 1. Check for stored preference in cookie
	const storedLang = cookies.get('lumi-language')
	if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
		redirect(307, `/${storedLang}`)
	}

	// 2. Detect from Accept-Language header
	const acceptLanguage = request.headers.get('accept-language')
	if (acceptLanguage) {
		const browserLang = detectLanguageFromHeader(acceptLanguage)
		if (browserLang) {
			redirect(307, `/${browserLang}`)
		}
	}

	// 3. Default to English
	redirect(307, `/${DEFAULT_LANGUAGE}`)
}
