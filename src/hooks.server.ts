/**
 * Server Hooks
 *
 * Handles:
 * - Legacy URL redirects (e.g., /about -> /en/about)
 * - HTML lang attribute transformation
 */

import type { Handle } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'

const SUPPORTED_LANGUAGES = ['en', 'pt-BR', 'de', 'fr', 'es']
const LEGACY_ROUTES = ['/adventure', '/complete', '/about', '/faq', '/parents']

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url

	// Check if this is a legacy URL without language prefix (not root, not sitemap, not static)
	if (
		LEGACY_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/')) &&
		!pathname.startsWith('/sitemap')
	) {
		// Get preferred language from cookie or default to 'en'
		const lang = event.cookies.get('lumi-language') || 'en'
		const validLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en'

		// Preserve query string
		const query = event.url.search
		redirect(301, `/${validLang}${pathname}${query}`)
	}

	// Determine language from URL for HTML lang attribute
	const langMatch = pathname.match(/^\/(en|pt-BR|de|fr|es)(\/|$)/)
	const lang = langMatch ? langMatch[1] : 'en'

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('lang="en"', `lang="${lang}"`)
		}
	})
}
