<script lang="ts">
	/**
	 * SEO Component
	 *
	 * Provides comprehensive meta tags for search engines and social sharing.
	 * Includes Open Graph, Twitter Cards, and JSON-LD structured data.
	 */

	interface Props {
		title: string
		description: string
		path?: string
		type?: 'website' | 'article'
		image?: string
		noindex?: boolean
	}

	const SITE_URL = 'https://playlumi.app'
	const SITE_NAME = 'Lumi'
	const DEFAULT_IMAGE = '/icon-512.png'

	let {
		title,
		description,
		path = '',
		type = 'website',
		image = DEFAULT_IMAGE,
		noindex = false
	}: Props = $props()

	const canonicalUrl = $derived(`${SITE_URL}${path}`)
	const imageUrl = $derived(image.startsWith('http') ? image : `${SITE_URL}${image}`)
	const fullTitle = $derived(path === '/' ? title : `${title} - ${SITE_NAME}`)

	// JSON-LD structured data for organization
	const organizationSchema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Lumi',
		url: SITE_URL,
		logo: `${SITE_URL}/icon-512.png`,
		description: 'Anti-addictive educational app for children',
		sameAs: ['https://github.com/matheusml/lumi']
	}

	// JSON-LD structured data for the software application
	const appSchema = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Lumi',
		applicationCategory: 'EducationalApplication',
		operatingSystem: 'Web',
		description:
			'Lumi is a free, open-source, anti-addictive educational math app for children. Unlike other apps, Lumi respects screen time with daily limits, no points or streaks, and encourages outdoor play.',
		url: SITE_URL,
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: '5',
			ratingCount: '1'
		},
		author: {
			'@type': 'Organization',
			name: 'Lumi'
		},
		keywords:
			'educational app, math app for kids, anti-addictive, screen time, ethical ed-tech, children learning, no ads, open source'
	}

	const jsonLdOrg = JSON.stringify(organizationSchema)
	const jsonLdApp = JSON.stringify(appSchema)

	// Construct script tags to avoid ESLint parsing issues with <script in template literals
	const ldScriptOrg = '<scr' + 'ipt type="application/ld+json">' + jsonLdOrg + '</scr' + 'ipt>'
	const ldScriptApp = '<scr' + 'ipt type="application/ld+json">' + jsonLdApp + '</scr' + 'ipt>'
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="educational app, math app for kids, anti-addictive, screen time conscious, ethical ed-tech, children learning, no ads, open source, humane technology"
	/>
	<meta name="author" content="Lumi" />

	<!-- Robots -->
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}

	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />

	<!-- Language alternates -->
	<link rel="alternate" hreflang="en" href={canonicalUrl} />
	<link rel="alternate" hreflang="pt-BR" href={canonicalUrl} />
	<link rel="alternate" hreflang="de" href={canonicalUrl} />
	<link rel="alternate" hreflang="fr" href={canonicalUrl} />
	<link rel="alternate" hreflang="x-default" href={canonicalUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:locale:alternate" content="pt_BR" />
	<meta property="og:locale:alternate" content="de_DE" />
	<meta property="og:locale:alternate" content="fr_FR" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	<!-- JSON-LD Structured Data -->
	{@html ldScriptOrg}
	{@html ldScriptApp}
</svelte:head>
