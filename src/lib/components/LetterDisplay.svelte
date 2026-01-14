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

	/* Sizes - fluid with clamp() */
	.letter-display.small {
		width: clamp(3rem, 12vw, 4rem);
		height: clamp(3rem, 12vw, 4rem);
	}

	.letter-display.small .letter {
		font-size: clamp(1.5rem, 8vw, 2rem);
	}

	.letter-display.medium {
		width: clamp(4rem, 15vw, 6rem);
		height: clamp(4rem, 15vw, 6rem);
	}

	.letter-display.medium .letter {
		font-size: clamp(2rem, 10vw, 3rem);
	}

	.letter-display.large {
		width: clamp(5rem, 20vw, 8rem);
		height: clamp(5rem, 20vw, 8rem);
	}

	.letter-display.large .letter {
		font-size: clamp(2.5rem, 12vw, 4.5rem);
	}
</style>
