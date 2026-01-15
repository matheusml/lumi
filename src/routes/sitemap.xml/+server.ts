/**
 * Dynamic XML Sitemap
 *
 * Generates a sitemap for search engine crawlers.
 */

const SITE_URL = 'https://playlumi.app'

const pages = [
	{ path: '/', priority: 1.0, changefreq: 'weekly' },
	{ path: '/about', priority: 0.9, changefreq: 'monthly' },
	{ path: '/faq', priority: 0.8, changefreq: 'monthly' },
	{ path: '/parents', priority: 0.7, changefreq: 'monthly' }
]

export async function GET() {
	const today = new Date().toISOString().split('T')[0]

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
