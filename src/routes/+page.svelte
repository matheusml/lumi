<script lang="ts">
	/**
	 * Home Page
	 *
	 * Welcome screen with "Start Adventure" button.
	 * Shows remaining adventures and link to parent zone.
	 */

	import { goto } from '$app/navigation'
	import { LumiButton } from '$lib/components'
	import { adventureLimitService } from '$lib/services'

	let canStart = $state(true)
	let remaining = $state(3)

	$effect(() => {
		// Load state from localStorage
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('lumi-limits')
			if (stored) {
				try {
					adventureLimitService.loadState(JSON.parse(stored))
				} catch {
					// Ignore parse errors
				}
			}
			canStart = adventureLimitService.canStartAdventure()
			remaining = adventureLimitService.getRemainingAdventures()
		}
	})

	function startAdventure() {
		if (canStart) {
			goto('/adventure')
		}
	}

	function openParentZone() {
		goto('/parents')
	}
</script>

<svelte:head>
	<title>Lumi - Aprenda Brincando</title>
</svelte:head>

<main class="home">
	<div class="content">
		<div class="logo">
			<span class="logo-emoji">✨</span>
			<h1 class="logo-text">Lumi</h1>
		</div>

		<p class="tagline">Vamos aprender!</p>

		{#if canStart}
			<div class="action-area">
				<LumiButton onclick={startAdventure} size="large">Matemática 🔢</LumiButton>

				{#if remaining !== Infinity}
					<p class="remaining">
						{remaining}
						{remaining === 1 ? 'aventura restante' : 'aventuras restantes'} hoje
					</p>
				{/if}
			</div>
		{:else}
			<div class="limit-reached">
				<p class="limit-message">Você completou todas as aventuras de hoje! 🎉</p>
				<p class="encouragement">Que tal brincar lá fora ou ler um livro?</p>
			</div>
		{/if}
	</div>

	<footer class="footer">
		<button class="parent-link" onclick={openParentZone}> Área dos Pais </button>
	</footer>
</main>

<style>
	.home {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-screen-horizontal);
		text-align: center;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xl);
		max-width: 400px;
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.logo-emoji {
		font-size: 4rem;
		animation: gentlePulse 3s ease-in-out infinite;
	}

	.logo-text {
		font-size: var(--font-size-display-large);
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
	}

	.tagline {
		font-size: var(--font-size-heading-medium);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.action-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
	}

	.remaining {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-muted);
		margin: 0;
	}

	.limit-reached {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		background-color: var(--color-surface);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
	}

	.limit-message {
		font-size: var(--font-size-body-large);
		color: var(--color-text-primary);
		margin: 0;
	}

	.encouragement {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.footer {
		padding: var(--spacing-lg);
	}

	.parent-link {
		background: none;
		border: none;
		font-family: var(--font-family);
		font-size: var(--font-size-body-small);
		color: var(--color-text-muted);
		cursor: pointer;
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius-md);
		transition:
			color var(--transition-fast),
			background-color var(--transition-fast);
	}

	.parent-link:hover {
		color: var(--color-text-secondary);
		background-color: var(--color-surface-hover);
	}

	@keyframes gentlePulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}
</style>
