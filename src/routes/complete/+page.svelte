<script lang="ts">
	/**
	 * Adventure Complete Page
	 *
	 * Celebrates completion without emphasizing scores.
	 */

	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { LumiButton } from '$lib/components'

	const correct = $derived(parseInt($page.url.searchParams.get('correct') ?? '0'))
	const total = $derived(parseInt($page.url.searchParams.get('total') ?? '5'))

	function goHome() {
		goto('/')
	}
</script>

<svelte:head>
	<title>Parabéns! - Lumi</title>
</svelte:head>

<main class="complete">
	<div class="celebration">
		<span class="emoji">🎉</span>
		<h1 class="title">Parabéns!</h1>
		<p class="message">Você completou a aventura!</p>
	</div>

	<div class="summary">
		<p class="summary-text">
			Você acertou {correct} de {total} problemas
		</p>
		{#if correct === total}
			<p class="encouragement">Incrível! Você acertou todos! ⭐</p>
		{:else if correct >= total * 0.6}
			<p class="encouragement">Muito bom! Continue assim! 💪</p>
		{:else}
			<p class="encouragement">Bom trabalho! A prática leva à perfeição! 🌟</p>
		{/if}
	</div>

	<div class="actions">
		<LumiButton onclick={goHome}>Voltar ao Início</LumiButton>
	</div>
</main>

<style>
	.complete {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-screen-horizontal);
		gap: var(--spacing-2xl);
		text-align: center;
	}

	.celebration {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		animation: scaleIn 0.5s ease-out;
	}

	.emoji {
		font-size: 5rem;
		animation: gentlePulse 2s ease-in-out infinite;
	}

	.title {
		font-size: var(--font-size-display-large);
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
	}

	.message {
		font-size: var(--font-size-heading-medium);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.summary {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		background-color: var(--color-surface);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-md);
	}

	.summary-text {
		font-size: var(--font-size-body-large);
		color: var(--color-text-primary);
		margin: 0;
	}

	.encouragement {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.actions {
		margin-top: var(--spacing-lg);
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes gentlePulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}
</style>
