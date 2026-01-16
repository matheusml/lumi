/**
 * Dynamic XML Sitemap
 *
 * Generates a sitemap for search engine crawlers with all language variants.
 */

const SITE_URL = 'https://playlumi.app'
const LANGUAGES = ['en', 'pt-BR', 'de', 'fr', 'es']

const pages = [
	{ path: '', priority: 1.0, changefreq: 'weekly' }, // Home (empty path, lang prefix adds the /)
	{ path: '/about', priority: 0.9, changefreq: 'monthly' },
	{ path: '/faq', priority: 0.8, changefreq: 'monthly' },
	{ path: '/parents', priority: 0.7, changefreq: 'monthly' }
]

export async function GET() {
	const today = new Date().toISOString().split('T')[0]

	// Generate URLs for each page in each language
	const urls = pages.flatMap((page) =>
		LANGUAGES.map((lang) => ({
			loc: `${SITE_URL}/${lang}${page.path}`,
			lastmod: today,
			changefreq: page.changefreq,
			priority: page.priority,
			path: page.path // Keep for alternate links
		}))
	)

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
	.map(
		(url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${LANGUAGES.map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}/${lang}${url.path}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en${url.path}" />
  </url>`
	)
	.join('\n')}
</urlset>`

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	})
}
