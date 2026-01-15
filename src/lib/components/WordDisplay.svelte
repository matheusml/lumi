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
		{#each characters as { char, isMissing, isFirst }, i}
			{#if isMissing}
				<span class="letter missing" aria-label="letra faltando" style="--delay: {300 + i * 80}ms"
				></span>
			{:else}
				<span
					class="letter"
					class:highlight={highlightFirst && isFirst}
					style="--delay: {300 + i * 80}ms"
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
		font-size: clamp(2.5rem, 10vw, 4rem);
		animation: emojiPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
	}

	.word {
		display: flex;
		gap: 0.25rem;
	}

	.letter {
		font-family: var(--font-family);
		font-size: clamp(1.75rem, 6vw, 2.5rem);
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		animation: letterDrop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
		animation-delay: var(--delay, 0ms);
	}

	.letter.missing {
		display: inline-block;
		width: clamp(1rem, 4vw, 1.5rem);
		height: clamp(1.75rem, 6vw, 2.5rem);
		border-bottom: 4px solid var(--color-primary);
		margin: 0 0.1rem;
		animation:
			letterDrop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards,
			gentlePulse 2s ease-in-out infinite;
		animation-delay: var(--delay, 0ms), calc(var(--delay, 0ms) + 0.35s);
	}

	.letter.highlight {
		color: var(--color-primary);
		background-color: var(--color-primary-light, rgba(245, 158, 140, 0.2));
		padding: 0.1rem 0.3rem;
		border-radius: var(--radius-sm);
	}

	@keyframes emojiPop {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		60% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes letterDrop {
		0% {
			transform: translateY(-15px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes gentlePulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
	}
</style>
