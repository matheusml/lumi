<script lang="ts">
	/**
	 * LetterDisplay
	 *
	 * Displays a single letter prominently for recognition problems.
	 */

	interface Props {
		letter: string
		size?: 'small' | 'medium' | 'large'
	}

	let { letter, size = 'large' }: Props = $props()
</script>

<div class="letter-display {size}" role="img" aria-label={`Letra ${letter}`}>
	<span class="letter">{letter}</span>
</div>

<style>
	.letter-display {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-surface);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		border: 3px solid var(--color-border);
	}

	.letter {
		font-family: var(--font-family);
		font-weight: 700;
		color: var(--color-primary);
	}

	/* Sizes */
	.letter-display.small {
		width: 4rem;
		height: 4rem;
	}

	.letter-display.small .letter {
		font-size: 2rem;
	}

	.letter-display.medium {
		width: 6rem;
		height: 6rem;
	}

	.letter-display.medium .letter {
		font-size: 3rem;
	}

	.letter-display.large {
		width: 8rem;
		height: 8rem;
	}

	.letter-display.large .letter {
		font-size: 4.5rem;
	}
</style>
