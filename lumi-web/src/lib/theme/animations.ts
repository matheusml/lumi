/**
 * Lumi Design System - Animations
 *
 * Gentle, calm animations that don't overstimulate.
 * No flashy effects or rapid movements.
 */

export const animations = {
	// Timing functions
	easing: {
		default: 'cubic-bezier(0.4, 0, 0.2, 1)',
		gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
		bounce: 'cubic-bezier(0.68, -0.1, 0.32, 1.1)',
	},

	// Durations (slower for calmness)
	duration: {
		fast: '150ms',
		normal: '250ms',
		slow: '400ms',
		gentle: '600ms',
	},

	// Pre-composed transitions
	transition: {
		default: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
		fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
		scale: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
		fade: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
		color: 'background-color 200ms, border-color 200ms, color 200ms',
	},

	// Scale values for press states
	scale: {
		pressed: 0.96,
		hover: 1.02,
	},
} as const;

// CSS keyframes as strings (to be injected into global styles)
export const keyframes = {
	fadeIn: `
		@keyframes fadeIn {
			from { opacity: 0; }
			to { opacity: 1; }
		}
	`,
	fadeOut: `
		@keyframes fadeOut {
			from { opacity: 1; }
			to { opacity: 0; }
		}
	`,
	scaleIn: `
		@keyframes scaleIn {
			from { transform: scale(0.9); opacity: 0; }
			to { transform: scale(1); opacity: 1; }
		}
	`,
	gentlePulse: `
		@keyframes gentlePulse {
			0%, 100% { transform: scale(1); }
			50% { transform: scale(1.02); }
		}
	`,
	slideUp: `
		@keyframes slideUp {
			from { transform: translateY(20px); opacity: 0; }
			to { transform: translateY(0); opacity: 1; }
		}
	`,
} as const;
