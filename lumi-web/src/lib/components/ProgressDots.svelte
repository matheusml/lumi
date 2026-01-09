<script lang="ts">
	/**
	 * ProgressDots
	 *
	 * Shows progress through an adventure (5 dots).
	 * Dots are filled for completed problems, empty for remaining.
	 */

	interface Props {
		total?: number;
		current: number;  // 0-indexed current problem
		completed: number;  // Number of completed problems
	}

	let { total = 5, current, completed }: Props = $props();
</script>

<div class="progress-dots" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total}>
	{#each Array(total) as _, index}
		<div
			class="dot"
			class:completed={index < completed}
			class:current={index === current}
			aria-hidden="true"
		></div>
	{/each}
</div>

<style>
	.progress-dots {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: var(--radius-full);
		background-color: var(--color-border);
		transition: background-color var(--transition-normal),
			transform var(--transition-normal);
	}

	.dot.completed {
		background-color: var(--color-success);
	}

	.dot.current {
		background-color: var(--color-primary);
		transform: scale(1.2);
	}
</style>
