<script lang="ts">
	/**
	 * ConfigTab - Settings configuration tab
	 *
	 * Contains daily limits, voice settings, and auto-play toggle.
	 */

	import { getTranslations, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'
	import type { VoiceInfo } from '$lib/services/speech'
	import { MIN_DAILY_LIMIT, MAX_DAILY_LIMIT } from '$lib/types'
	import { onMount, onDestroy } from 'svelte'

	interface Props {
		dailyLimit: number
		limitEnabled: boolean
		availableVoices: VoiceInfo[]
		selectedVoiceName: string | null
		autoPlayEnabled: boolean
		onDailyLimitChange: (limit: number) => void
		onLimitEnabledChange: (enabled: boolean) => void
		onVoiceChange: (name: string | null) => void
		onTestVoice: () => void
		onAutoPlayChange: (enabled: boolean) => void
	}

	let {
		dailyLimit,
		limitEnabled,
		availableVoices,
		selectedVoiceName,
		autoPlayEnabled,
		onDailyLimitChange,
		onLimitEnabledChange,
		onVoiceChange,
		onTestVoice,
		onAutoPlayChange
	}: Props = $props()

	let t = $state<Translations>(getTranslations())
	let unsubscribe: (() => void) | null = null

	onMount(() => {
		unsubscribe = subscribe(() => {
			t = getTranslations()
		})
	})

	onDestroy(() => {
		unsubscribe?.()
	})

	function handleVoiceChange(event: Event) {
		const select = event.target as HTMLSelectElement
		const name = select.value || null
		onVoiceChange(name)
	}

	function handleLimitChange(event: Event) {
		const input = event.target as HTMLInputElement
		onDailyLimitChange(parseInt(input.value) || MIN_DAILY_LIMIT)
	}
</script>

<div class="config-tab">
	<section class="section">
		<h2 class="section-title">{t.parents.settings}</h2>

		<div class="card">
			<div class="setting">
				<label class="setting-label">
					<input
						type="checkbox"
						checked={limitEnabled}
						onchange={() => onLimitEnabledChange(!limitEnabled)}
					/>
					{t.parents.dailyLimitEnabled}
				</label>
			</div>
			{#if limitEnabled}
				<div class="setting">
					<label class="setting-label">
						{t.parents.adventuresPerDay}:
						<input
							type="number"
							value={dailyLimit}
							min={MIN_DAILY_LIMIT}
							max={MAX_DAILY_LIMIT}
							class="number-input"
							onchange={handleLimitChange}
						/>
					</label>
				</div>
			{/if}
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">{t.parents.voice}</h2>

		<div class="card">
			<div class="setting">
				<label class="setting-label">
					<input
						type="checkbox"
						checked={autoPlayEnabled}
						onchange={() => onAutoPlayChange(!autoPlayEnabled)}
					/>
					{t.parents.autoPlayVoice}
				</label>
			</div>
			<p class="setting-description">{t.parents.autoPlayDescription}</p>
		</div>

		{#if availableVoices.length > 0}
			<div class="card">
				<p class="card-description">{t.parents.voiceDescription}</p>
				<div class="setting">
					<select class="voice-select" value={selectedVoiceName ?? ''} onchange={handleVoiceChange}>
						<option value="">{t.parents.automatic}</option>
						{#each availableVoices as voice}
							<option value={voice.name}>
								{voice.name}{voice.isCloud ? ' ★' : ''}
							</option>
						{/each}
					</select>
				</div>
				<button class="text-button" onclick={onTestVoice}>▶ {t.parents.testVoice}</button>
			</div>
		{/if}
	</section>
</div>

<style>
	.config-tab {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.section-title {
		font-size: var(--font-size-body-large);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
	}

	.card {
		background-color: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: var(--spacing-md);
		box-shadow: var(--shadow-sm);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.setting {
		display: flex;
		align-items: center;
	}

	.setting-label {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-size: var(--font-size-body-medium);
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.setting-description {
		font-size: var(--font-size-body-small);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.card-description {
		font-size: var(--font-size-body-small);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.number-input {
		width: 60px;
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: var(--font-size-body-medium);
		text-align: center;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-family: var(--font-family);
	}

	.number-input:focus {
		outline: none;
		border-color: var(--color-secondary);
	}

	.voice-select {
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		font-size: var(--font-size-body-medium);
		font-family: var(--font-family);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-sm);
		background-color: var(--color-surface);
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.voice-select:focus {
		outline: none;
		border-color: var(--color-secondary);
	}

	.text-button {
		background: none;
		border: none;
		font-family: var(--font-family);
		font-size: var(--font-size-body-small);
		color: var(--color-text-muted);
		cursor: pointer;
		padding: var(--spacing-xs);
		text-decoration: underline;
		align-self: flex-start;
	}

	.text-button:hover {
		color: var(--color-text-secondary);
	}
</style>
