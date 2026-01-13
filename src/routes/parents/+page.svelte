<script lang="ts">
	/**
	 * Parent Zone
	 *
	 * Dashboard for parents to view progress and adjust settings.
	 * Protected by a simple math problem (adult verification).
	 */

	import { goto } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'
	import { difficultyManager, adventureLimitService, speechService } from '$lib/services'
	import { getTranslations, getSpeechLanguage, subscribe } from '$lib/i18n'
	import type { Translations } from '$lib/i18n'
	import type { ProblemType } from '$lib/types'
	import type { VoiceInfo } from '$lib/services/speech'
	import { DEFAULT_DAILY_LIMIT } from '$lib/types'

	import ParentGate from './components/ParentGate.svelte'
	import ParentTabs from './components/ParentTabs.svelte'
	import ConfigTab from './components/ConfigTab.svelte'
	import AnalyticsTab from './components/AnalyticsTab.svelte'

	// i18n state
	let t = $state<Translations>(getTranslations())
	let unsubscribe: (() => void) | null = null

	// Gate state
	let isUnlocked = $state(false)

	// Tab state
	type TabType = 'config' | 'analytics'
	let activeTab = $state<TabType>('config')

	// Settings state
	let dailyLimit = $state(DEFAULT_DAILY_LIMIT)
	let limitEnabled = $state(true)
	let autoPlayEnabled = $state(false)

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
		loadState()
		loadVoices()
	})

	onDestroy(() => {
		unsubscribe?.()
	})

	function loadVoices() {
		const tryLoadVoices = () => {
			const voices = speechService.getVoicesForLanguage(getSpeechLanguage())
			if (voices.length > 0) {
				availableVoices = voices
				selectedVoiceName = speechService.getSelectedVoiceName()
			}
		}

		tryLoadVoices()
		setTimeout(tryLoadVoices, 100)
		setTimeout(tryLoadVoices, 500)
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

		// Load auto-play setting
		autoPlayEnabled = localStorage.getItem('lumi-auto-voice') === 'true'

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
			'counting',
			'addition',
			'subtraction',
			'comparison',
			'patterns',
			'odd-one-out',
			'matching',
			'sequence',
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

	function goHome() {
		goto('/')
	}

	// Event handlers for components
	function handleUnlock() {
		isUnlocked = true
	}

	function handleTabChange(tab: TabType) {
		activeTab = tab
	}

	function handleDailyLimitChange(limit: number) {
		dailyLimit = limit
		saveSettings()
	}

	function handleLimitEnabledChange(enabled: boolean) {
		limitEnabled = enabled
		saveSettings()
	}

	function handleVoiceChange(name: string | null) {
		speechService.setVoiceName(name)
		selectedVoiceName = name
	}

	function handleTestVoice() {
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

	function handleAutoPlayChange(enabled: boolean) {
		autoPlayEnabled = enabled
		if (typeof window !== 'undefined') {
			localStorage.setItem('lumi-auto-voice', enabled.toString())
		}
	}

	function handleResetToday() {
		adventureLimitService.resetTodayCount()
		todayCount = 0
		saveSettings()
	}
</script>

<svelte:head>
	<title>{t.parents.title} - {t.home.title}</title>
</svelte:head>

<main class="parents">
	{#if !isUnlocked}
		<ParentGate onUnlock={handleUnlock} onBack={goHome} />
	{:else}
		<ParentTabs {activeTab} onTabChange={handleTabChange} onBack={goHome} />

		<div class="tab-content">
			{#if activeTab === 'config'}
				<ConfigTab
					{dailyLimit}
					{limitEnabled}
					{availableVoices}
					{selectedVoiceName}
					{autoPlayEnabled}
					onDailyLimitChange={handleDailyLimitChange}
					onLimitEnabledChange={handleLimitEnabledChange}
					onVoiceChange={handleVoiceChange}
					onTestVoice={handleTestVoice}
					onAutoPlayChange={handleAutoPlayChange}
				/>
			{:else}
				<AnalyticsTab {todayCount} {activityProgress} onResetToday={handleResetToday} />
			{/if}
		</div>
	{/if}
</main>

<style>
	.parents {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: var(--spacing-md) var(--spacing-screen-horizontal);
		gap: var(--spacing-lg);
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
	}

	.tab-content {
		flex: 1;
	}

	@media (max-width: 480px) {
		.parents {
			padding: var(--spacing-sm) var(--spacing-md);
		}
	}
</style>
