<script lang="ts">
	/**
	 * LetterSequence
	 *
	 * Displays a sequence of letters for alphabet-order problems.
	 * One letter position can be marked as unknown (shows "?").
	 */

	interface Props {
		letters: string[]
		unknownIndex?: number // Which position shows "?"
	}

	let { letters, unknownIndex }: Props = $props()
</script>

<div class="letter-sequence" role="img" aria-label="Sequencia de letras">
	{#each letters as letter, i}
		<div class="letter-box" class:unknown={unknownIndex === i} style="--delay: {i * 120}ms">
			{#if unknownIndex === i}
				<span class="question-mark">?</span>
			{:else}
				<span class="letter">{letter}</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	.letter-sequence {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
		align-items: center;
		justify-content: center;
		max-width: 100%;
	}

	.letter-box {
		width: clamp(2.5rem, 12vw, 3.5rem);
		height: clamp(2.5rem, 12vw, 3.5rem);
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-surface);
		border-radius: var(--radius-md);
		border: 3px solid var(--color-border);
		box-shadow: var(--shadow-sm);
		animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
		animation-delay: var(--delay, 0ms);
	}

	.letter-box.unknown {
		border-style: dashed;
		border-color: var(--color-primary);
		background-color: transparent;
		animation:
			slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards,
			gentlePulse 2s ease-in-out infinite;
		animation-delay: var(--delay, 0ms), calc(var(--delay, 0ms) + 0.4s);
	}

	.letter {
		font-family: var(--font-family);
		font-size: clamp(1.25rem, 5vw, 1.75rem);
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.question-mark {
		font-size: clamp(1.25rem, 5vw, 1.75rem);
		font-weight: 700;
		color: var(--color-primary);
	}

	@keyframes slideIn {
		0% {
			transform: translateY(-20px) scale(0.8);
			opacity: 0;
		}
		100% {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
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
