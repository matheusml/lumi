import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		// Disable source maps in production for smaller bundles
		sourcemap: false,
		// Enable minification optimizations
		minify: 'esbuild',
		// Target modern browsers for smaller output
		target: 'es2020'
	}
})
