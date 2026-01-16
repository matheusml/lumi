/**
 * Language Layout Server
 *
 * Validates the language parameter and syncs it to a cookie for future visits.
 */

import { error, type ServerLoadEvent } from '@sveltejs/kit'

const SUPPORTED_LANGUAGES = ['en', 'pt-BR', 'de', 'fr', 'es']

export const load = async ({ params, cookies }: ServerLoadEvent) => {
	const lang = params.lang as string

	// Validate language (extra safety - param matcher should catch invalid values)
	if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) {
		error(404, 'Language not supported')
	}

	// Set cookie for future visits (expires in 1 year)
	// This allows the root redirect to use the user's preferred language
	cookies.set('lumi-language', lang, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365,
		httpOnly: false, // Allow client-side access for localStorage sync
		sameSite: 'lax'
	})

	return {
		lang
	}
}
