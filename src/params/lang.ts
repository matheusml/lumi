/**
 * Language Parameter Matcher
 *
 * Validates that the lang parameter is a supported language code.
 */

import type { ParamMatcher } from '@sveltejs/kit'

const SUPPORTED_LANGUAGES = ['en', 'pt-BR', 'de', 'fr', 'es']

export const match: ParamMatcher = (param) => {
	return SUPPORTED_LANGUAGES.includes(param)
}
