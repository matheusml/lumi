<script lang="ts">
	/**
	 * ChoiceButton
	 *
	 * Circular button for answer choices.
	 * Shows different states: default, selected, correct, incorrect.
	 */

	import type { AnswerState } from '$lib/types'

	interface Props {
		state?: AnswerState
		disabled?: boolean
		onclick?: () => void
		children?: import('svelte').Snippet
	}

	let { state = 'default', disabled = false, onclick, children }: Props = $props()
</script>

<button
	class="choice-button {state}"
	disabled={disabled || state === 'correct' || state === 'incorrect'}
	{onclick}
>
	{#if children}
		{@render children()}
	{/if}
</button>

<style>
	.choice-button {
		display: flex;
		align-items: center;
		justify-content: center;

		width: var(--touch-choice-button);
		height: var(--touch-choice-button);
		min-width: var(--touch-choice-button);

		border: 3px solid var(--color-border);
		border-radius: var(--radius-full);
		background-color: var(--color-surface);

		font-family: var(--font-family);
		font-size: var(--font-size-number-medium);
		font-weight: 700;
		color: var(--color-text-primary);

		cursor: pointer;
		transition:
			transform var(--transition-fast),
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);

		box-shadow: var(--shadow-md);
	}

	/* Hover state */
	.choice-button.default:hover:not(:disabled) {
		border-color: var(--color-primary);
		transform: scale(1.02);
	}

	/* Selected state */
	.choice-button.selected {
		border-color: var(--color-secondary);
		background-color: var(--color-secondary-light);
	}

	/* Correct state */
	.choice-button.correct {
		border-color: var(--color-success-dark);
		background-color: var(--color-success);
		color: var(--color-text-primary);
		animation: gentlePulse 0.6s ease-in-out;
	}

	/* Incorrect state */
	.choice-button.incorrect {
		border-color: var(--color-try-again-dark);
		background-color: var(--color-try-again);
		color: var(--color-text-primary);
	}

	/* Press state */
	.choice-button:active:not(:disabled) {
		transform: scale(0.96);
	}

	/* Disabled state */
	.choice-button:disabled {
		cursor: not-allowed;
	}

	@keyframes gentlePulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}
</style>
