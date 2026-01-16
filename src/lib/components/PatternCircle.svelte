<script lang="ts">
	/**
	 * PatternCircle
	 *
	 * Colored circle for pattern problems.
	 * Animates in with a pop effect and pulses gently to show rhythm.
	 */

	import { patternColors } from '$lib/problems'

	interface Props {
		colorId: string
		size?: 'small' | 'medium' | 'large'
		isUnknown?: boolean
		/** Animation delay index for staggered appearance */
		index?: number
	}

	let { colorId, size = 'medium', isUnknown = false, index = 0 }: Props = $props()

	const color = $derived(patternColors.find((c) => c.id === colorId)?.color ?? '#888888')
</script>

<div
	class="pattern-circle {size}"
	class:unknown={isUnknown}
	style:background-color={isUnknown ? 'transparent' : color}
	style="--delay: {index * 150}ms"
	role="img"
	aria-label={isUnknown ? 'Unknown' : colorId}
>
	{#if isUnknown}
		<span class="question-mark">?</span>
	{/if}
</div>

<style>
	.pattern-circle {
		border-radius: var(--radius-full);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
		animation-delay: var(--delay, 0ms);
	}

	/* Sizes - responsive for mobile */
	.pattern-circle.small {
		width: clamp(1.5rem, 5vw, 2rem);
		height: clamp(1.5rem, 5vw, 2rem);
	}

	.pattern-circle.medium {
		width: clamp(2rem, 6vw, 3rem);
		height: clamp(2rem, 6vw, 3rem);
	}

	.pattern-circle.large {
		width: clamp(2.5rem, 8vw, 4rem);
		height: clamp(2.5rem, 8vw, 4rem);
	}

	/* Unknown state - gentle pulse to draw attention */
	.pattern-circle.unknown {
		border: 3px dashed var(--color-primary);
		background-color: var(--color-surface);
		animation:
			popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards,
			gentlePulse 2s ease-in-out infinite;
		animation-delay: var(--delay, 0ms), calc(var(--delay, 0ms) + 0.4s);
	}

	.question-mark {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-primary);
	}

	@keyframes popIn {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		70% {
			transform: scale(1.15);
		}
		100% {
			transform: scale(1);
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
			transform: scale(1.08);
			opacity: 0.9;
		}
	}
</style>
