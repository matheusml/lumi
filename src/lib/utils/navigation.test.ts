import { describe, it, expect, vi, beforeEach } from 'vitest'
import { localizedPath, localizedUrl, stripLanguagePrefix } from './navigation'

// Mock the i18n module
vi.mock('$lib/i18n', () => ({
	getLanguage: vi.fn(() => 'en')
}))

import { getLanguage } from '$lib/i18n'

describe('navigation utilities', () => {
	beforeEach(() => {
		vi.mocked(getLanguage).mockReturnValue('en')
	})

	describe('localizedPath', () => {
		it('should add language prefix to path', () => {
			expect(localizedPath('/about')).toBe('/en/about')
		})

		it('should normalize path without leading slash', () => {
			expect(localizedPath('about')).toBe('/en/about')
		})

		it('should handle root path', () => {
			expect(localizedPath('/')).toBe('/en')
		})

		it('should not double-prefix when path already has language prefix', () => {
			expect(localizedPath('/en/about')).toBe('/en/about')
			expect(localizedPath('/pt-BR/about')).toBe('/pt-BR/about')
			expect(localizedPath('/de/about')).toBe('/de/about')
			expect(localizedPath('/fr/about')).toBe('/fr/about')
			expect(localizedPath('/es/about')).toBe('/es/about')
		})

		it('should not double-prefix when path is just language', () => {
			expect(localizedPath('/en')).toBe('/en')
			expect(localizedPath('/pt-BR')).toBe('/pt-BR')
		})

		it('should work with all 5 languages', () => {
			vi.mocked(getLanguage).mockReturnValue('en')
			expect(localizedPath('/test')).toBe('/en/test')

			vi.mocked(getLanguage).mockReturnValue('pt-BR')
			expect(localizedPath('/test')).toBe('/pt-BR/test')

			vi.mocked(getLanguage).mockReturnValue('de')
			expect(localizedPath('/test')).toBe('/de/test')

			vi.mocked(getLanguage).mockReturnValue('fr')
			expect(localizedPath('/test')).toBe('/fr/test')

			vi.mocked(getLanguage).mockReturnValue('es')
			expect(localizedPath('/test')).toBe('/es/test')
		})

		it('should not strip similar prefixes that are not languages', () => {
			// '/en-US' should get prefixed because 'en-US' is not a supported language
			expect(localizedPath('/en-US/about')).toBe('/en/en-US/about')
		})
	})

	describe('localizedUrl', () => {
		it('should return localized path when no params', () => {
			expect(localizedUrl('/about')).toBe('/en/about')
		})

		it('should return localized path when params is empty object', () => {
			expect(localizedUrl('/about', {})).toBe('/en/about')
		})

		it('should append single query parameter', () => {
			expect(localizedUrl('/about', { foo: 'bar' })).toBe('/en/about?foo=bar')
		})

		it('should append multiple query parameters', () => {
			const result = localizedUrl('/about', { foo: 'bar', baz: 'qux' })
			expect(result).toContain('/en/about?')
			expect(result).toContain('foo=bar')
			expect(result).toContain('baz=qux')
		})

		it('should URL-encode special characters', () => {
			const result = localizedUrl('/search', { q: 'hello world' })
			expect(result).toBe('/en/search?q=hello+world')
		})

		it('should URL-encode unicode characters', () => {
			const result = localizedUrl('/search', { q: 'café' })
			expect(result).toContain('/en/search?q=caf')
		})
	})

	describe('stripLanguagePrefix', () => {
		it('should remove language prefix from path', () => {
			expect(stripLanguagePrefix('/en/about')).toBe('/about')
		})

		it('should work with all 5 languages', () => {
			expect(stripLanguagePrefix('/en/about')).toBe('/about')
			expect(stripLanguagePrefix('/pt-BR/about')).toBe('/about')
			expect(stripLanguagePrefix('/de/about')).toBe('/about')
			expect(stripLanguagePrefix('/fr/about')).toBe('/about')
			expect(stripLanguagePrefix('/es/about')).toBe('/about')
		})

		it('should return / for language-only paths', () => {
			expect(stripLanguagePrefix('/en')).toBe('/')
			expect(stripLanguagePrefix('/en/')).toBe('/')
			expect(stripLanguagePrefix('/pt-BR')).toBe('/')
			expect(stripLanguagePrefix('/pt-BR/')).toBe('/')
		})

		it('should return unchanged path if no language prefix', () => {
			expect(stripLanguagePrefix('/about')).toBe('/about')
			expect(stripLanguagePrefix('/some/deep/path')).toBe('/some/deep/path')
			expect(stripLanguagePrefix('/')).toBe('/')
		})

		it('should not strip similar prefixes that are not languages', () => {
			expect(stripLanguagePrefix('/en-US/about')).toBe('/en-US/about')
			expect(stripLanguagePrefix('/english/about')).toBe('/english/about')
			expect(stripLanguagePrefix('/deutschland/about')).toBe('/deutschland/about')
		})

		it('should handle nested paths after language prefix', () => {
			expect(stripLanguagePrefix('/en/about/team')).toBe('/about/team')
			expect(stripLanguagePrefix('/de/products/item/123')).toBe('/products/item/123')
		})
	})
})
