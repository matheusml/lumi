<script lang="ts">
	/**
	 * AdventureTiles
	 *
	 * Reusable grid of adventure tiles for Math, Grammar, and Logic.
	 * Used on home page and completion page.
	 */

	import { goto } from '$app/navigation'
	import { Icon } from '$lib/components'
	import type { Translations } from '$lib/i18n'

	interface Props {
		canStart?: boolean
		t: Translations
	}

	let { canStart = true, t }: Props = $props()

	function startMathAdventure() {
		if (canStart) {
			goto('/adventure?type=math')
		}
	}

	function startGrammarAdventure() {
		if (canStart) {
			goto('/adventure?type=grammar')
		}
	}

	function startLogicAdventure() {
		if (canStart) {
			goto('/adventure?type=logic')
		}
	}
</script>

<div class="adventure-tiles">
	<button class="adventure-tile math" onclick={startMathAdventure} disabled={!canStart}>
		<Icon name="math" size={32} />
		<span class="tile-label">{t.home.math}</span>
	</button>
	<button class="adventure-tile grammar" onclick={startGrammarAdventure} disabled={!canStart}>
		<Icon name="book" size={32} />
		<span class="tile-label">{t.home.grammar}</span>
	</button>
	<button class="adventure-tile logic" onclick={startLogicAdventure} disabled={!canStart}>
		<Icon name="puzzle" size={32} />
		<span class="tile-label">{t.home.logic}</span>
	</button>
</div>

<style>
	.adventure-tiles {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-md);
		width: 100%;
	}

	.adventure-tile {
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		border: none;
		border-radius: var(--radius-xl);
		cursor: pointer;
		color: var(--color-text-on-primary);
		box-shadow: var(--shadow-md);
		transition:
			transform var(--transition-fast),
			box-shadow var(--transition-fast),
			border-bottom-width var(--transition-fast);
		/* 3D effect */
		border-bottom: 4px solid rgba(0, 0, 0, 0.15);
	}

	.adventure-tile:active:not(:disabled) {
		transform: translateY(2px);
		border-bottom-width: 2px;
	}

	.adventure-tile:hover:not(:disabled) {
		box-shadow: var(--shadow-lg);
	}

	.adventure-tile:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.adventure-tile.math {
		background-color: var(--color-primary);
		border-bottom-color: var(--color-primary-hover);
	}

	.adventure-tile.grammar {
		background-color: var(--color-secondary);
		border-bottom-color: var(--color-secondary-hover);
	}

	.adventure-tile.logic {
		background-color: var(--color-success);
		border-bottom-color: var(--color-success-dark);
	}

	.tile-label {
		font-family: var(--font-family);
		font-size: var(--font-size-body-medium);
		font-weight: 600;
	}
</style>
