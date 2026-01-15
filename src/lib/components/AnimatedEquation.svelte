<script lang="ts">
	/**
	 * AnimatedEquation
	 *
	 * Shows math problems with animated actions to help kids understand:
	 * - Addition: First group appears, then second group bounces in
	 * - Subtraction: All objects appear, then some fly away
	 *
	 * The math notation is shown in the prompt row above (with speaker button).
	 */

	import { visualObjects } from '$lib/problems'

	interface Props {
		objectId: string
		operandA: number
		operandB: number
		operator: '+' | '-'
	}

	let { objectId, operandA, operandB, operator }: Props = $props()

	// Find the emoji for this object
	const object = $derived(visualObjects.find((o) => o.id === objectId))
	const emoji = $derived(object?.emoji ?? '⭐')

	// For subtraction: show all objects, some will fly away
	// For addition: show first group, second group will appear
	const isSubtraction = $derived(operator === '-')

	// Calculate which objects should animate out (for subtraction)
	// We animate the LAST 'operandB' objects
	const flyAwayStartIndex = $derived(operandA - operandB)
</script>

<div class="animated-equation">
	<!-- Visual objects -->
	<div class="objects-container">
		{#if isSubtraction}
			<!-- Subtraction: Show all objects, some fly away -->
			<div class="objects-row">
				{#each Array(operandA) as _, i}
					<span
						class="object"
						class:flying-away={i >= flyAwayStartIndex}
						style="--delay: {i * 60}ms; --fly-delay: {800 + (i - flyAwayStartIndex) * 100}ms"
					>
						{emoji}
					</span>
				{/each}
			</div>
		{:else}
			<!-- Addition: Show first group, then second group bounces in -->
			<div class="objects-row">
				<!-- First group -->
				{#each Array(operandA) as _, i}
					<span class="object" style="--delay: {i * 60}ms">
						{emoji}
					</span>
				{/each}

				<!-- Visual separator -->
				<span class="group-separator">
					<span class="plus-indicator">+</span>
				</span>

				<!-- Second group (bounces in) -->
				{#each Array(operandB) as _, i}
					<span class="object bouncing-in" style="--delay: {600 + i * 80}ms">
						{emoji}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.animated-equation {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.objects-container {
		min-height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.objects-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-xs);
		max-width: 100%;
	}

	.object {
		font-size: clamp(2rem, 6vw, 3rem);
		line-height: 1;
		animation: scaleIn 0.3s ease-out backwards;
		animation-delay: var(--delay);
	}

	/* Subtraction: objects fly away */
	.object.flying-away {
		animation:
			scaleIn 0.3s ease-out backwards,
			flyAway 0.6s ease-in forwards;
		animation-delay: var(--delay), var(--fly-delay);
	}

	/* Addition: second group bounces in */
	.object.bouncing-in {
		animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
		animation-delay: var(--delay);
	}

	.group-separator {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 var(--spacing-xs);
		opacity: 0;
		animation: fadeIn 0.3s ease-out forwards;
		animation-delay: 500ms;
	}

	.plus-indicator {
		font-size: clamp(1.25rem, 4vw, 1.75rem);
		font-weight: bold;
		color: var(--color-primary);
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

	@keyframes flyAway {
		0% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
		50% {
			transform: scale(0.8) translateY(-20px);
			opacity: 0.7;
		}
		100% {
			transform: scale(0.3) translateY(-60px);
			opacity: 0;
		}
	}

	@keyframes bounceIn {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
