/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker'

const sw = self as unknown as ServiceWorkerGlobalScope

const CACHE_NAME = `lumi-cache-${version}`

// Assets to cache: built files + static files
const ASSETS = [...build, ...files]

sw.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(ASSETS))
			.then(() => sw.skipWaiting())
	)
})

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			// Delete old caches
			for (const key of keys) {
				if (key !== CACHE_NAME) {
					await caches.delete(key)
				}
			}
			await sw.clients.claim()
		})
	)
})

sw.addEventListener('fetch', (event) => {
	// Skip non-GET requests
	if (event.request.method !== 'GET') return

	const url = new URL(event.request.url)

	// Skip cross-origin requests
	if (url.origin !== location.origin) return

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			if (cachedResponse) {
				return cachedResponse
			}

			// For navigation requests, try network first, fall back to cache
			if (event.request.mode === 'navigate') {
				return fetch(event.request).catch(() => {
					return caches.match('/') as Promise<Response>
				})
			}

			// For other requests, try network
			return fetch(event.request)
		})
	)
})
