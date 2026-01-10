/**
 * Lumi Design System - Typography
 *
 * Large, rounded, readable fonts optimized for children ages 4-7.
 * Uses system fonts with rounded variants where available.
 */

export const fontFamily = {
	// Primary font stack - prefers rounded variants
	primary: '"SF Pro Rounded", "Nunito", "Quicksand", system-ui, -apple-system, sans-serif',
	// Monospace for numbers (more readable)
	mono: '"SF Mono Rounded", "JetBrains Mono", monospace',
} as const;

export const fontSize = {
	// Display sizes (for big numbers, celebrations)
	displayLarge: '3rem',      // 48px
	displayMedium: '2.5rem',   // 40px

	// Number sizes (for equations and answers)
	numberLarge: '3.5rem',     // 56px
	numberMedium: '2.25rem',   // 36px
	numberSmall: '1.75rem',    // 28px

	// Heading sizes
	headingLarge: '2rem',      // 32px
	headingMedium: '1.5rem',   // 24px
	headingSmall: '1.25rem',   // 20px

	// Body text
	bodyLarge: '1.25rem',      // 20px
	bodyMedium: '1rem',        // 16px
	bodySmall: '0.875rem',     // 14px

	// UI elements
	buttonLarge: '1.5rem',     // 24px
	buttonMedium: '1.125rem',  // 18px
	label: '0.875rem',         // 14px
} as const;

export const fontWeight = {
	normal: '400',
	medium: '500',
	semibold: '600',
	bold: '700',
} as const;

export const lineHeight = {
	tight: '1.1',
	normal: '1.4',
	relaxed: '1.6',
} as const;

// Pre-composed typography styles
export const typography = {
	displayLarge: {
		fontFamily: fontFamily.primary,
		fontSize: fontSize.displayLarge,
		fontWeight: fontWeight.bold,
		lineHeight: lineHeight.tight,
	},
	numberLarge: {
		fontFamily: fontFamily.mono,
		fontSize: fontSize.numberLarge,
		fontWeight: fontWeight.bold,
		lineHeight: lineHeight.tight,
	},
	numberMedium: {
		fontFamily: fontFamily.mono,
		fontSize: fontSize.numberMedium,
		fontWeight: fontWeight.semibold,
		lineHeight: lineHeight.tight,
	},
	headingMedium: {
		fontFamily: fontFamily.primary,
		fontSize: fontSize.headingMedium,
		fontWeight: fontWeight.semibold,
		lineHeight: lineHeight.normal,
	},
	bodyLarge: {
		fontFamily: fontFamily.primary,
		fontSize: fontSize.bodyLarge,
		fontWeight: fontWeight.normal,
		lineHeight: lineHeight.relaxed,
	},
	buttonLarge: {
		fontFamily: fontFamily.primary,
		fontSize: fontSize.buttonLarge,
		fontWeight: fontWeight.semibold,
		lineHeight: lineHeight.tight,
	},
} as const;
