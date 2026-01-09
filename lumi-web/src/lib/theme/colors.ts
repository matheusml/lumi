/**
 * Lumi Design System - Colors
 *
 * Warm, child-friendly palette designed for calm, focused learning.
 * All colors tested for accessibility and visual comfort.
 */

export const colors = {
	// Primary palette
	primary: '#F59E8C',        // Coral - main action color
	primaryHover: '#E88A76',   // Darker coral for hover states
	primaryLight: '#FBD4CC',   // Light coral for backgrounds

	secondary: '#8CC7F0',      // Sky blue - secondary actions
	secondaryHover: '#6BB5E8', // Darker blue for hover
	secondaryLight: '#C5E3F7', // Light blue for backgrounds

	// Feedback colors (gentle, not harsh)
	success: '#99D9BF',        // Mint green - correct answers
	successDark: '#7CC9A8',    // Darker mint for text on success bg
	tryAgain: '#FFCDB2',       // Soft peach - incorrect (not red!)
	tryAgainDark: '#E5A588',   // Darker peach for text

	// Neutral palette
	background: '#FCF8F0',     // Warm cream - main background
	surface: '#FFFFFF',        // White - cards and elevated surfaces
	surfaceHover: '#F7F3EB',   // Slight tint for hover

	// Text colors
	textPrimary: '#4A4A4A',    // Dark gray - main text
	textSecondary: '#7A7A7A',  // Medium gray - secondary text
	textMuted: '#A0A0A0',      // Light gray - disabled/placeholder
	textOnPrimary: '#FFFFFF',  // White text on primary buttons

	// Borders and dividers
	border: '#E8E4DC',         // Warm gray border
	borderLight: '#F0EDE6',    // Very light border

	// Special states
	disabled: '#D4D0C8',       // Disabled elements
	overlay: 'rgba(0, 0, 0, 0.3)', // Modal overlays
} as const;

export type ColorKey = keyof typeof colors;
