<script lang="ts">
	/**
	 * ParentGate - Adult verification gate
	 *
	 * Presents a multiplication problem to verify adult access.
	 * Uses compact styling appropriate for parent UI.
	 */

	import { getTranslations, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'
	import { onMount, onDestroy } from 'svelte'

	interface Props {
		onUnlock: () => void
		onBack: () => void
	}

	let { onUnlock, onBack }: Props = $props()

	let t = $state<Translations>(getTranslations())
	let unsubscribe: (() => void) | null = null

	let gateAnswer = $state('')
	let gateQuestion = $state({ a: 0, b: 0, answer: 0 })
	let gateError = $state(false)

	onMount(() => {
		unsubscribe = subscribe(() => {
			t = getTranslations()
		})
		generateGateQuestion()
	})

	onDestroy(() => {
		unsubscribe?.()
	})

	function generateGateQuestion() {
		const a = Math.floor(Math.random() * 5) + 5 // 5-9
		const b = Math.floor(Math.random() * 5) + 5 // 5-9
		gateQuestion = { a, b, answer: a * b }
	}

	function checkGate() {
		if (parseInt(gateAnswer) === gateQuestion.answer) {
			gateError = false
			onUnlock()
		} else {
			gateError = true
			gateAnswer = ''
			generateGateQuestion()
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			checkGate()
		}
	}
</script>

<div class="gate">
	<h1 class="gate-title">{t.parents.title}</h1>
	<p class="gate-description">{t.parents.gateDescription}</p>
	<p class="gate-question">
		{gateQuestion.a} × {gateQuestion.b} = ?
	</p>
	<input
		type="number"
		bind:value={gateAnswer}
		class="gate-input"
		class:error={gateError}
		placeholder={t.parents.answer}
		onkeydown={handleKeydown}
	/>
	{#if gateError}
		<p class="gate-error">{t.parents.wrongAnswer}</p>
	{/if}
	<div class="gate-actions">
		<button class="gate-button primary" onclick={checkGate}>{t.parents.enter}</button>
		<button class="gate-button ghost" onclick={onBack}>{t.parents.back}</button>
	</div>
</div>

<style>
	.gate {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-md);
		text-align: center;
		padding: var(--spacing-lg);
	}

	.gate-title {
		font-size: var(--font-size-heading-medium);
		color: var(--color-text-primary);
		margin: 0;
	}

	.gate-description {
		font-size: var(--font-size-body-small);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.gate-question {
		font-size: var(--font-size-heading-medium);
		font-weight: 700;
		color: var(--color-text-primary);
		margin: 0;
	}

	.gate-input {
		width: 140px;
		padding: var(--spacing-sm);
		font-size: var(--font-size-body-large);
		text-align: center;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-family);
	}

	.gate-input:focus {
		outline: none;
		border-color: var(--color-secondary);
	}

	.gate-input.error {
		border-color: var(--color-try-again-dark);
	}

	.gate-error {
		font-size: var(--font-size-body-small);
		color: var(--color-try-again-dark);
		margin: 0;
	}

	.gate-actions {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		margin-top: var(--spacing-sm);
	}

	.gate-button {
		min-height: 44px;
		min-width: 120px;
		padding: var(--spacing-sm) var(--spacing-lg);
		font-size: var(--font-size-body-medium);
		font-family: var(--font-family);
		font-weight: 600;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition:
			transform var(--transition-fast),
			opacity var(--transition-fast);
	}

	.gate-button:active {
		transform: scale(0.98);
	}

	.gate-button.primary {
		background-color: var(--color-primary);
		color: white;
	}

	.gate-button.primary:hover {
		opacity: 0.9;
	}

	.gate-button.ghost {
		background: none;
		color: var(--color-text-secondary);
	}

	.gate-button.ghost:hover {
		color: var(--color-text-primary);
	}
</style>
