import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'

export default defineConfig({
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url))
		}
	},
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'jsdom',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			include: ['src/lib/**/*.ts'],
			exclude: [
				'src/lib/**/*.test.ts',
				'src/lib/types/**',
				'src/lib/**/index.ts', // Re-export barrel files
				'src/lib/theme/**', // Theme constants (no logic)
				'src/lib/i18n/translations/**' // Pure data - no logic to test
			],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80
			}
		}
	}
})
