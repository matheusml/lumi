<script lang="ts">
	/**
	 * CountableObject
	 *
	 * Renders a grid of emoji objects for counting/comparison problems.
	 */

	import { visualObjects } from '$lib/problems'

	interface Props {
		objectId: string
		count: number
		maxPerRow?: number
	}

	let { objectId, count, maxPerRow = 5 }: Props = $props()

	// Find the emoji for this object
	const object = $derived(visualObjects.find((o) => o.id === objectId))
	const emoji = $derived(object?.emoji ?? '⭐')

	// Calculate grid layout
	const rows = $derived(Math.ceil(count / maxPerRow))
	const itemsInLastRow = $derived(count % maxPerRow || maxPerRow)
</script>

<div class="countable-objects" role="img" aria-label="{count} {object?.nameEn ?? 'objects'}">
	{#each Array(rows) as _, rowIndex}
		<div class="row">
			{#each Array(rowIndex === rows - 1 ? itemsInLastRow : maxPerRow) as _}
				<span class="object">{emoji}</span>
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
		font-size: 2.5rem;
		line-height: 1;
		animation: scaleIn 0.3s ease-out backwards;
	}

	/* Stagger animation for each object */
	.object:nth-child(1) {
		animation-delay: 0ms;
	}
	.object:nth-child(2) {
		animation-delay: 50ms;
	}
	.object:nth-child(3) {
		animation-delay: 100ms;
	}
	.object:nth-child(4) {
		animation-delay: 150ms;
	}
	.object:nth-child(5) {
		animation-delay: 200ms;
	}

	@keyframes scaleIn {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
