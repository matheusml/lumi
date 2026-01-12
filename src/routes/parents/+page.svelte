<script lang="ts">
	/**
	 * Parent Zone
	 *
	 * Dashboard for parents to view progress and adjust settings.
	 * Protected by a simple math problem (adult verification).
	 */

	import { goto } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'
	import { LumiButton } from '$lib/components'
	import { difficultyManager, adventureLimitService, speechService } from '$lib/services'
	import { getTranslations, getSpeechLanguage, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'
	import type { ProblemType } from '$lib/types'
	import type { VoiceInfo } from '$lib/services/speech'
	import { DEFAULT_DAILY_LIMIT, MAX_DAILY_LIMIT, MIN_DAILY_LIMIT } from '$lib/types'

	// i18n state
	let t = $state<Translations>(getTranslations())
	let unsubscribe: (() => void) | null = null

	// Gate state
	let isUnlocked = $state(false)
	let gateAnswer = $state('')
	let gateQuestion = $state({ a: 0, b: 0, answer: 0 })
	let gateError = $state(false)

	// Settings state
	let dailyLimit = $state(DEFAULT_DAILY_LIMIT)
	let limitEnabled = $state(true)

	// Voice settings
	let availableVoices = $state<VoiceInfo[]>([])
	let selectedVoiceName = $state<string | null>(null)

	// Progress data
	let todayCount = $state(0)
	let activityProgress = $state<Record<ProblemType, { difficulty: number; accuracy: number }>>({
		// Math
		counting: { difficulty: 1, accuracy: 0 },
		addition: { difficulty: 1, accuracy: 0 },
		subtraction: { difficulty: 1, accuracy: 0 },
		comparison: { difficulty: 1, accuracy: 0 },
		patterns: { difficulty: 1, accuracy: 0 },
		// Logic
		'odd-one-out': { difficulty: 1, accuracy: 0 },
		matching: { difficulty: 1, accuracy: 0 },
		sequence: { difficulty: 1, accuracy: 0 },
		// Grammar
		'letter-recognition': { difficulty: 1, accuracy: 0 },
		'alphabet-order': { difficulty: 1, accuracy: 0 },
		'initial-letter': { difficulty: 1, accuracy: 0 },
		'word-completion': { difficulty: 1, accuracy: 0 }
	})

	onMount(() => {
		unsubscribe = subscribe(() => {
			t = getTranslations()
		})
		generateGateQuestion()
		loadState()
		loadVoices()
	})

	onDestroy(() => {
		unsubscribe?.()
	})

	function loadVoices() {
		// Voices may load asynchronously, so we try multiple times
		const tryLoadVoices = () => {
			const voices = speechService.getVoicesForLanguage(getSpeechLanguage())
			if (voices.length > 0) {
				availableVoices = voices
				selectedVoiceName = speechService.getSelectedVoiceName()
			}
		}

		tryLoadVoices()
		// Try again after a short delay (voices load async in some browsers)
		setTimeout(tryLoadVoices, 100)
		setTimeout(tryLoadVoices, 500)
	}

	function handleVoiceChange(event: Event) {
		const select = event.target as HTMLSelectElement
		const name = select.value || null
		speechService.setVoiceName(name)
		selectedVoiceName = name
	}

	function testVoice() {
		const testMessages: Record<string, string> = {
			'pt-BR': 'Olá! Eu sou a Lumi, sua amiga de aprendizado.',
			'en-US': "Hello! I'm Lumi, your learning friend.",
			'de-DE': 'Hallo! Ich bin Lumi, dein Lernfreund.',
			'fr-FR': "Bonjour! Je suis Lumi, ton ami d'apprentissage."
		}
		const lang = getSpeechLanguage()
		speechService.speak(testMessages[lang] || testMessages['en-US'], {
			lang: lang as 'pt-BR' | 'en-US' | 'de-DE' | 'fr-FR'
		})
	}

	function generateGateQuestion() {
		// Generate a multiplication problem (too hard for young children)
		const a = Math.floor(Math.random() * 5) + 5 // 5-9
		const b = Math.floor(Math.random() * 5) + 5 // 5-9
		gateQuestion = { a, b, answer: a * b }
	}

	function checkGate() {
		if (parseInt(gateAnswer) === gateQuestion.answer) {
			isUnlocked = true
			gateError = false
		} else {
			gateError = true
			gateAnswer = ''
			generateGateQuestion()
		}
	}

	function loadState() {
		if (typeof window === 'undefined') return

		// Load limits
		const limitsData = localStorage.getItem('lumi-limits')
		if (limitsData) {
			try {
				adventureLimitService.loadState(JSON.parse(limitsData))
			} catch {
				// Ignore
			}
		}
		dailyLimit = adventureLimitService.getDailyLimit()
		limitEnabled = adventureLimitService.isLimitEnabled()
		todayCount = adventureLimitService.getTodayCount()

		// Load progress
		const progressData = localStorage.getItem('lumi-progress')
		if (progressData) {
			try {
				difficultyManager.loadProgress(JSON.parse(progressData))
			} catch {
				// Ignore
			}
		}

		// Get progress for each activity
		const types: ProblemType[] = [
			// Math
			'counting',
			'addition',
			'subtraction',
			'comparison',
			'patterns',
			// Logic
			'odd-one-out',
			'matching',
			'sequence',
			// Grammar
			'letter-recognition',
			'alphabet-order',
			'initial-letter',
			'word-completion'
		]
		const newProgress: Record<string, { difficulty: number; accuracy: number }> = {}
		for (const type of types) {
			newProgress[type] = {
				difficulty: difficultyManager.getDifficulty(type),
				accuracy: difficultyManager.getAccuracy(type)
			}
		}
		activityProgress = newProgress as typeof activityProgress
	}

	function saveSettings() {
		adventureLimitService.setDailyLimit(dailyLimit)
		adventureLimitService.setLimitEnabled(limitEnabled)
		if (typeof window !== 'undefined') {
			localStorage.setItem('lumi-limits', JSON.stringify(adventureLimitService.getState()))
		}
	}

	function resetTodayCount() {
		adventureLimitService.resetTodayCount()
		todayCount = 0
		saveSettings()
	}

	function goHome() {
		goto('/')
	}

	function getActivityName(type: ProblemType): string {
		const names: Record<ProblemType, string> = {
			// Math
			counting: t.parents.counting,
			addition: t.parents.addition,
			subtraction: t.parents.subtraction,
			comparison: t.parents.comparison,
			patterns: t.parents.patterns,
			// Logic
			'odd-one-out': t.parents.oddOneOut,
			matching: t.parents.matching,
			sequence: t.parents.sequence,
			// Grammar
			'letter-recognition': t.parents.letterRecognition,
			'alphabet-order': t.parents.alphabetOrder,
			'initial-letter': t.parents.initialLetter,
			'word-completion': t.parents.wordCompletion
		}
		return names[type]
	}
</script>

<svelte:head>
	<title>{t.parents.title} - {t.home.title}</title>
</svelte:head>

<main class="parents">
	{#if !isUnlocked}
		<!-- Gate -->
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
				onkeydown={(e) => e.key === 'Enter' && checkGate()}
			/>
			{#if gateError}
				<p class="gate-error">{t.parents.wrongAnswer}</p>
			{/if}
			<div class="gate-actions">
				<LumiButton onclick={checkGate} variant="primary">{t.parents.enter}</LumiButton>
				<LumiButton onclick={goHome} variant="ghost">{t.parents.back}</LumiButton>
			</div>
		</div>
	{:else}
		<!-- Dashboard -->
		<header class="header">
			<h1 class="title">{t.parents.title}</h1>
			<button class="back-button" onclick={goHome}>← {t.parents.back}</button>
		</header>

		<section class="section">
			<h2 class="section-title">{t.parents.today}</h2>
			<div class="card">
				<p class="stat">
					<span class="stat-value">{todayCount}</span>
					<span class="stat-label">{t.parents.adventuresCompleted}</span>
				</p>
				{#if todayCount > 0}
					<button class="text-button" onclick={resetTodayCount}>{t.parents.resetToday}</button>
				{/if}
			</div>
		</section>

		<section class="section">
			<h2 class="section-title">{t.parents.progressByActivity}</h2>
			<div class="progress-grid">
				{#each Object.entries(activityProgress) as [type, data]}
					<div class="progress-card">
						<h3 class="progress-title">{getActivityName(type as ProblemType)}</h3>
						<div class="progress-stats">
							<span class="progress-stat">
								{t.parents.level}: <strong>{data.difficulty}</strong>/4
							</span>
							<span class="progress-stat">
								{t.parents.accuracy}: <strong>{data.accuracy}%</strong>
							</span>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="section">
			<h2 class="section-title">{t.parents.settings}</h2>
			<div class="card">
				<div class="setting">
					<label class="setting-label">
						<input type="checkbox" bind:checked={limitEnabled} onchange={saveSettings} />
						{t.parents.dailyLimitEnabled}
					</label>
				</div>
				{#if limitEnabled}
					<div class="setting">
						<label class="setting-label">
							{t.parents.adventuresPerDay}:
							<input
								type="number"
								bind:value={dailyLimit}
								min={MIN_DAILY_LIMIT}
								max={MAX_DAILY_LIMIT}
								class="number-input"
								onchange={saveSettings}
							/>
						</label>
					</div>
				{/if}
			</div>

			{#if availableVoices.length > 0}
				<div class="card">
					<h3 class="card-title">{t.parents.voice}</h3>
					<p class="card-description">{t.parents.voiceDescription}</p>
					<div class="setting">
						<select
							class="voice-select"
							value={selectedVoiceName ?? ''}
							onchange={handleVoiceChange}
						>
							<option value="">{t.parents.automatic}</option>
							{#each availableVoices as voice}
								<option value={voice.name}>
									{voice.name}{voice.isCloud ? ' ★' : ''}
								</option>
							{/each}
						</select>
					</div>
					<button class="text-button" onclick={testVoice}>▶ {t.parents.testVoice}</button>
				</div>
			{/if}
		</section>
	{/if}
</main>

<style>
	.parents {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: var(--spacing-screen-horizontal);
		padding-top: var(--spacing-lg);
		gap: var(--spacing-xl);
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}

	/* Gate styles */
	.gate {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
		text-align: center;
	}

	.gate-title {
		font-size: var(--font-size-heading-large);
		color: var(--color-text-primary);
		margin: 0;
	}

	.gate-description {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.gate-question {
		font-size: var(--font-size-number-medium);
		font-weight: 700;
		color: var(--color-text-primary);
		margin: 0;
	}

	.gate-input {
		width: 160px;
		padding: var(--spacing-md);
		font-size: var(--font-size-heading-medium);
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
	}

	/* Dashboard styles */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title {
		font-size: var(--font-size-heading-large);
		color: var(--color-text-primary);
		margin: 0;
	}

	.back-button {
		background: none;
		border: none;
		font-family: var(--font-family);
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
		cursor: pointer;
		padding: var(--spacing-sm);
	}

	.back-button:hover {
		color: var(--color-text-primary);
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.section-title {
		font-size: var(--font-size-heading-small);
		color: var(--color-text-primary);
		margin: 0;
	}

	.card {
		background-color: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: var(--spacing-lg);
		box-shadow: var(--shadow-sm);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.stat {
		display: flex;
		align-items: baseline;
		gap: var(--spacing-sm);
		margin: 0;
	}

	.stat-value {
		font-size: var(--font-size-display-medium);
		font-weight: 700;
		color: var(--color-primary);
	}

	.stat-label {
		font-size: var(--font-size-body-medium);
		color: var(--color-text-secondary);
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
	}

	.text-button:hover {
		color: var(--color-text-secondary);
	}

	.progress-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: var(--spacing-md);
	}

	.progress-card {
		background-color: var(--color-surface);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
		box-shadow: var(--shadow-sm);
	}

	.progress-title {
		font-size: var(--font-size-body-medium);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-sm) 0;
	}

	.progress-stats {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.progress-stat {
		font-size: var(--font-size-body-small);
		color: var(--color-text-secondary);
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

	.number-input {
		width: 60px;
		padding: var(--spacing-sm);
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

	.card-title {
		font-size: var(--font-size-body-medium);
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 var(--spacing-xs) 0;
	}

	.card-description {
		font-size: var(--font-size-body-small);
		color: var(--color-text-secondary);
		margin: 0 0 var(--spacing-md) 0;
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
</style>
