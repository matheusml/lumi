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
		<div class="letter-box" class:unknown={unknownIndex === i}>
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
		gap: var(--spacing-sm);
		align-items: center;
		justify-content: center;
	}

	.letter-box {
		width: 3.5rem;
		height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-surface);
		border-radius: var(--radius-md);
		border: 3px solid var(--color-border);
		box-shadow: var(--shadow-sm);
	}

	.letter-box.unknown {
		border-style: dashed;
		border-color: var(--color-primary);
		background-color: transparent;
	}

	.letter {
		font-family: var(--font-family);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.question-mark {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-primary);
	}
</style>
