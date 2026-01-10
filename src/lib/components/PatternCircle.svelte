<script lang="ts">
	/**
	 * PatternCircle
	 *
	 * Colored circle for pattern problems.
	 */

	import { patternColors } from '$lib/problems';

	interface Props {
		colorId: string;
		size?: 'small' | 'medium' | 'large';
		isUnknown?: boolean;
	}

	let { colorId, size = 'medium', isUnknown = false }: Props = $props();

	const color = $derived(
		patternColors.find((c) => c.id === colorId)?.color ?? '#888888'
	);
</script>

<div
	class="pattern-circle {size}"
	class:unknown={isUnknown}
	style:background-color={isUnknown ? 'transparent' : color}
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
	}

	/* Sizes */
	.pattern-circle.small {
		width: 2rem;
		height: 2rem;
	}

	.pattern-circle.medium {
		width: 3rem;
		height: 3rem;
	}

	.pattern-circle.large {
		width: 4rem;
		height: 4rem;
	}

	/* Unknown state */
	.pattern-circle.unknown {
		border: 3px dashed var(--color-border);
		background-color: var(--color-surface);
	}

	.question-mark {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-muted);
	}
</style>
