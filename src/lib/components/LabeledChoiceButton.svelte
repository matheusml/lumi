<script lang="ts">
	/**
	 * LabeledChoiceButton
	 *
	 * Pill-shaped button for answer choices with emoji + text label.
	 * Used for social-emotional problems where text labels help clarify meaning.
	 * Shows different states: default, selected, correct, incorrect.
	 * Includes a speaker button for audio support.
	 */

	import type { AnswerState } from '$lib/types'
	import { speechService } from '$lib/services'

	interface Props {
		emoji: string
		label: string
		lang?: 'pt-BR' | 'en-US' | 'de-DE' | 'fr-FR' | 'es-ES'
		state?: AnswerState
		disabled?: boolean
		onclick?: () => void
	}

	let {
		emoji,
		label,
		lang = 'en-US',
		state: answerState = 'default',
		disabled = false,
		onclick
	}: Props = $props()

	let isSpeaking = $state(false)

	function handleSpeakerClick() {
		if (isSpeaking) {
			speechService.stop()
			isSpeaking = false
		} else {
			isSpeaking = true
			speechService.speak(label, { lang })
			// Reset after approximate speech duration
			setTimeout(
				() => {
					isSpeaking = false
				},
				label.length * 80 + 500
			)
		}
	}
</script>

<div class="labeled-choice-wrapper {answerState}">
	<button
		class="labeled-choice-button"
		disabled={disabled || answerState === 'correct' || answerState === 'incorrect'}
		{onclick}
	>
		<span class="labeled-emoji">{emoji}</span>
		<span class="labeled-text">{label}</span>
	</button>
	<button
		class="mini-speaker"
		class:speaking={isSpeaking}
		onclick={handleSpeakerClick}
		aria-label={isSpeaking ? 'Stop' : 'Listen'}
		type="button"
	>
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
			{#if !isSpeaking}
				<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
			{:else}
				<line x1="18" y1="9" x2="14" y2="13" />
				<line x1="14" y1="9" x2="18" y2="13" />
			{/if}
		</svg>
	</button>
</div>

<style>
	.labeled-choice-wrapper {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		width: 100%;
	}

	.labeled-choice-button {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: var(--spacing-sm);

		flex: 1;
		min-height: var(--touch-standard);
		padding: var(--spacing-sm) var(--spacing-md);

		border: 3px solid var(--color-border);
		border-radius: var(--radius-xl);
		background-color: var(--color-surface);

		font-family: var(--font-family);
		color: var(--color-text-primary);

		cursor: pointer;
		transition:
			transform var(--transition-fast),
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);

		box-shadow: var(--shadow-md);
	}

	.labeled-emoji {
		font-size: 28px;
		flex-shrink: 0;
	}

	.labeled-text {
		font-size: var(--font-size-body);
		font-weight: 600;
		text-align: left;
		line-height: 1.2;
		flex: 1;
	}

	.mini-speaker {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 32px;
		height: 32px;
		flex-shrink: 0;

		border: 2px solid var(--color-border);
		border-radius: var(--radius-full);
		background-color: var(--color-background);

		color: var(--color-text-secondary);
		cursor: pointer;

		transition:
			transform var(--transition-fast),
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			color var(--transition-fast);
	}

	.mini-speaker:hover {
		border-color: var(--color-secondary);
		color: var(--color-secondary);
	}

	.mini-speaker:active {
		transform: scale(0.92);
	}

	.mini-speaker.speaking {
		border-color: var(--color-primary);
		background-color: var(--color-primary-light);
		color: var(--color-primary);
	}

	/* Hover state - only on devices that support hover */
	@media (hover: hover) {
		.labeled-choice-wrapper.default .labeled-choice-button:hover:not(:disabled) {
			border-color: var(--color-primary);
			transform: scale(1.02);
		}
	}

	/* Selected state */
	.labeled-choice-wrapper.selected .labeled-choice-button {
		border-color: var(--color-secondary);
		background-color: var(--color-secondary-light);
	}

	/* Correct state */
	.labeled-choice-wrapper.correct .labeled-choice-button {
		border-color: var(--color-success-dark);
		background-color: var(--color-success);
		color: var(--color-text-primary);
		animation: gentlePulse 0.6s ease-in-out;
	}

	/* Incorrect state */
	.labeled-choice-wrapper.incorrect .labeled-choice-button {
		border-color: var(--color-try-again-dark);
		background-color: var(--color-try-again);
		color: var(--color-text-primary);
	}

	/* Press state */
	.labeled-choice-button:active:not(:disabled) {
		transform: scale(0.98);
	}

	/* Disabled state */
	.labeled-choice-button:disabled {
		cursor: not-allowed;
	}

	@keyframes gentlePulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.02);
		}
	}

	/* Toddler mode: slightly larger */
	:global(.toddler-mode) .labeled-choice-button {
		min-height: 60px;
		padding: var(--spacing-md);
	}

	:global(.toddler-mode) .labeled-emoji {
		font-size: 36px;
	}

	:global(.toddler-mode) .labeled-text {
		font-size: var(--font-size-body-large);
	}

	:global(.toddler-mode) .mini-speaker {
		width: 40px;
		height: 40px;
	}

	:global(.toddler-mode) .mini-speaker svg {
		width: 22px;
		height: 22px;
	}
</style>
