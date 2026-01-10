<script lang="ts">
	/**
	 * WordDisplay
	 *
	 * Displays a word with emoji, optionally with a missing letter shown as underscore.
	 */

	interface Props {
		word: string
		emoji?: string
		missingIndex?: number // If set, this position shows as underscore
		highlightFirst?: boolean // Highlight the first letter
	}

	let { word, emoji, missingIndex, highlightFirst = false }: Props = $props()

	// Split word into characters
	const characters = $derived(
		word.split('').map((char, i) => ({
			char,
			isMissing: missingIndex === i,
			isFirst: i === 0
		}))
	)
</script>

<div class="word-display" role="img" aria-label={word}>
	{#if emoji}
		<span class="emoji">{emoji}</span>
	{/if}
	<div class="word">
		{#each characters as { char, isMissing, isFirst }}
			{#if isMissing}
				<span class="letter missing" aria-label="letra faltando"></span>
			{:else}
				<span
					class="letter"
					class:highlight={highlightFirst && isFirst}
				>
					{char}
				</span>
			{/if}
		{/each}
	</div>
</div>

<style>
	.word-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
	}

	.emoji {
		font-size: 4rem;
	}

	.word {
		display: flex;
		gap: 0.25rem;
	}

	.letter {
		font-family: var(--font-family);
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
	}

	.letter.missing {
		display: inline-block;
		width: 1.5rem;
		height: 2.5rem;
		border-bottom: 4px solid var(--color-primary);
		margin: 0 0.1rem;
	}

	.letter.highlight {
		color: var(--color-primary);
		background-color: var(--color-primary-light, rgba(245, 158, 140, 0.2));
		padding: 0.1rem 0.3rem;
		border-radius: var(--radius-sm);
	}
</style>
