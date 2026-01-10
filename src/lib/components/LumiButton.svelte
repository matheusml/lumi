<script lang="ts">
	/**
	 * LumiButton
	 *
	 * Primary button component with child-friendly styling.
	 * Large touch targets, gentle scale animation on press.
	 */

	interface Props {
		variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost'
		size?: 'medium' | 'large'
		disabled?: boolean
		fullWidth?: boolean
		onclick?: () => void
		children?: import('svelte').Snippet
	}

	let {
		variant = 'primary',
		size = 'large',
		disabled = false,
		fullWidth = false,
		onclick,
		children
	}: Props = $props()
</script>

<button class="lumi-button {variant} {size}" class:full-width={fullWidth} {disabled} {onclick}>
	{#if children}
		{@render children()}
	{/if}
</button>

<style>
	.lumi-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);

		border: none;
		border-radius: var(--radius-xl);
		cursor: pointer;

		font-family: var(--font-family);
		font-weight: 600;

		transition:
			transform var(--transition-fast),
			background-color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	/* Sizes */
	.lumi-button.medium {
		min-height: var(--touch-standard);
		padding: var(--spacing-md) var(--spacing-xl);
		font-size: var(--font-size-button-medium);
	}

	.lumi-button.large {
		min-height: var(--touch-large);
		padding: var(--spacing-lg) var(--spacing-2xl);
		font-size: var(--font-size-button-large);
	}

	/* Variants */
	.lumi-button.primary {
		background-color: var(--color-primary);
		color: var(--color-text-on-primary);
		box-shadow: var(--shadow-md);
	}

	.lumi-button.primary:hover:not(:disabled) {
		background-color: var(--color-primary-hover);
	}

	.lumi-button.secondary {
		background-color: var(--color-secondary);
		color: var(--color-text-on-primary);
		box-shadow: var(--shadow-md);
	}

	.lumi-button.secondary:hover:not(:disabled) {
		background-color: var(--color-secondary-hover);
	}

	.lumi-button.tertiary {
		background-color: var(--color-success);
		color: var(--color-text-on-primary);
		box-shadow: var(--shadow-md);
	}

	.lumi-button.tertiary:hover:not(:disabled) {
		background-color: var(--color-success-dark);
	}

	.lumi-button.ghost {
		background-color: transparent;
		color: var(--color-text-primary);
		box-shadow: none;
	}

	.lumi-button.ghost:hover:not(:disabled) {
		background-color: var(--color-surface-hover);
	}

	/* Press state */
	.lumi-button:active:not(:disabled) {
		transform: scale(0.96);
	}

	/* Disabled state */
	.lumi-button:disabled {
		background-color: var(--color-disabled);
		color: var(--color-text-muted);
		cursor: not-allowed;
		box-shadow: none;
	}

	/* Full width */
	.full-width {
		width: 100%;
	}
</style>
