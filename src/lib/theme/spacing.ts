/**
 * Lumi Design System - Spacing
 *
 * Generous spacing for calm, uncluttered visuals.
 * Touch targets sized for small fingers (minimum 44px, prefer 60px+).
 */

export const spacing = {
	// Base spacing scale (in pixels, use with rem conversion)
	xs: '0.25rem', // 4px
	sm: '0.5rem', // 8px
	md: '1rem', // 16px
	lg: '1.5rem', // 24px
	xl: '2rem', // 32px
	'2xl': '3rem', // 48px
	'3xl': '4rem', // 64px

	// Screen-level spacing
	screenHorizontal: '1.5rem', // 24px - consistent horizontal margins
	screenVertical: '2rem', // 32px - top/bottom padding

	// Component-specific
	cardPadding: '1.5rem', // 24px
	buttonPadding: '1rem 2rem', // 16px 32px
	inputPadding: '0.75rem 1rem', // 12px 16px

	// Grid and layout
	gridGap: '1rem', // 16px
	stackGap: '1.25rem', // 20px
	sectionGap: '2.5rem' // 40px
} as const

export const touchTargets = {
	// Minimum touch target (Apple HIG)
	minimum: '2.75rem', // 44px

	// Preferred for children
	standard: '3.75rem', // 60px
	large: '5rem', // 80px

	// Choice buttons (circular)
	choiceButton: '5rem' // 80px diameter
} as const

export const borderRadius = {
	sm: '0.5rem', // 8px
	md: '0.75rem', // 12px
	lg: '1rem', // 16px
	xl: '1.5rem', // 24px
	full: '9999px' // Fully rounded (circles, pills)
} as const

export const shadows = {
	// Subtle shadows for gentle elevation
	sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
	md: '0 2px 8px rgba(0, 0, 0, 0.08)',
	lg: '0 4px 16px rgba(0, 0, 0, 0.1)',

	// Button press effect (inset)
	pressed: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
} as const
