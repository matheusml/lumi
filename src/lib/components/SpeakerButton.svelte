<script lang="ts">
	/**
	 * SpeakerButton
	 *
	 * Button to trigger text-to-speech for problem prompts.
	 */

	import { speechService } from '$lib/services';

	interface Props {
		text: string;
		lang?: 'pt-BR' | 'en-US';
	}

	let { text, lang = 'pt-BR' }: Props = $props();

	let isSpeaking = $state(false);

	function handleClick() {
		if (isSpeaking) {
			speechService.stop();
			isSpeaking = false;
		} else {
			isSpeaking = true;
			speechService.speak(text, { lang });
			// Reset after approximate speech duration
			setTimeout(() => {
				isSpeaking = false;
			}, text.length * 80 + 500);
		}
	}
</script>

<button
	class="speaker-button"
	class:speaking={isSpeaking}
	onclick={handleClick}
	aria-label={isSpeaking ? 'Parar' : 'Ouvir'}
>
	<svg
		width="24"
		height="24"
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
			<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
		{:else}
			<line x1="23" y1="9" x2="17" y2="15" />
			<line x1="17" y1="9" x2="23" y2="15" />
		{/if}
	</svg>
</button>

<style>
	.speaker-button {
		display: flex;
		align-items: center;
		justify-content: center;

		width: var(--touch-standard);
		height: var(--touch-standard);

		border: 2px solid var(--color-border);
		border-radius: var(--radius-full);
		background-color: var(--color-surface);

		color: var(--color-text-secondary);
		cursor: pointer;

		transition: transform var(--transition-fast),
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			color var(--transition-fast);
	}

	.speaker-button:hover {
		border-color: var(--color-secondary);
		color: var(--color-secondary);
	}

	.speaker-button:active {
		transform: scale(0.96);
	}

	.speaker-button.speaking {
		border-color: var(--color-primary);
		background-color: var(--color-primary-light);
		color: var(--color-primary);
	}
</style>
