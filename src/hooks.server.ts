/**
 * Server Hooks
 *
 * Handles:
 * - Legacy URL redirects (e.g., /about -> /en/about)
 * - HTML lang attribute transformation
 * - SEO headers to override platform noindex
 */

import type { Handle } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'

const SUPPORTED_LANGUAGES = ['en', 'pt-BR', 'de', 'fr', 'es']
const LEGACY_ROUTES = ['/adventure', '/complete', '/about', '/faq', '/parents']

// Pages that should NOT be indexed (private/transient pages)
const NOINDEX_ROUTES = ['/complete', '/parents', '/adventure']

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

	// Determine if this route should be noindexed
	const shouldNoindex = NOINDEX_ROUTES.some(
		(route) => pathname.includes(route) || pathname.endsWith(route)
	)

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('lang="en"', `lang="${lang}"`)
		}
	})

	// Set X-Robots-Tag header to override any platform-level noindex
	// This ensures search engines can index public pages
	if (shouldNoindex) {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow')
	} else {
		response.headers.set('X-Robots-Tag', 'index, follow')
	}

	return response
}
