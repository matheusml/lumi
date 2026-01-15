<script lang="ts">
	/**
	 * CountableObject
	 *
	 * Renders a grid of emoji objects for counting/comparison problems.
	 * Objects appear one-by-one with staggered animation to encourage counting.
	 */

	import { visualObjects } from '$lib/problems'

	interface Props {
		objectId: string
		count: number
		maxPerRow?: number
		/** Delay before starting animations (for comparison side-by-side timing) */
		startDelay?: number
	}

	let { objectId, count, maxPerRow = 5, startDelay = 0 }: Props = $props()

	// Find the emoji for this object
	const object = $derived(visualObjects.find((o) => o.id === objectId))
	const emoji = $derived(object?.emoji ?? '⭐')

	// Calculate grid layout
	const rows = $derived(Math.ceil(count / maxPerRow))
	const itemsInLastRow = $derived(count % maxPerRow || maxPerRow)

	// Get global index for an object in row/col position
	function getGlobalIndex(rowIndex: number, colIndex: number): number {
		return rowIndex * maxPerRow + colIndex
	}
</script>

<div class="countable-objects" role="img" aria-label="{count} {object?.nameEn ?? 'objects'}">
	{#each Array(rows) as _, rowIndex}
		<div class="row">
			{#each Array(rowIndex === rows - 1 ? itemsInLastRow : maxPerRow) as _, colIndex}
				<span
					class="object"
					style="--delay: {startDelay + getGlobalIndex(rowIndex, colIndex) * 120}ms"
				>
					{emoji}
				</span>
			{/each}
		</div>
	{/each}
</div>

<style>
	.countable-objects {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.row {
		display: flex;
		justify-content: center;
		gap: var(--spacing-xs);
	}

	.object {
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		line-height: 1;
		animation: popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
		animation-delay: var(--delay, 0ms);
	}

	@keyframes popIn {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		70% {
			transform: scale(1.15);
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
