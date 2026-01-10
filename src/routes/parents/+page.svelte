<script lang="ts">
	/**
	 * Parent Zone
	 *
	 * Dashboard for parents to view progress and adjust settings.
	 * Protected by a simple math problem (adult verification).
	 */

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { LumiButton } from '$lib/components';
	import { difficultyManager, adventureLimitService, speechService } from '$lib/services';
	import type { ProblemType } from '$lib/types';
	import type { VoiceInfo } from '$lib/services/speech';
	import { DEFAULT_DAILY_LIMIT, MAX_DAILY_LIMIT, MIN_DAILY_LIMIT } from '$lib/types';

	// Gate state
	let isUnlocked = $state(false);
	let gateAnswer = $state('');
	let gateQuestion = $state({ a: 0, b: 0, answer: 0 });
	let gateError = $state(false);

	// Settings state
	let dailyLimit = $state(DEFAULT_DAILY_LIMIT);
	let limitEnabled = $state(true);

	// Voice settings
	let availableVoices = $state<VoiceInfo[]>([]);
	let selectedVoiceName = $state<string | null>(null);

	// Progress data
	let todayCount = $state(0);
	let activityProgress = $state<Record<ProblemType, { difficulty: number; accuracy: number }>>({
		counting: { difficulty: 1, accuracy: 0 },
		addition: { difficulty: 1, accuracy: 0 },
		subtraction: { difficulty: 1, accuracy: 0 },
		comparison: { difficulty: 1, accuracy: 0 },
		patterns: { difficulty: 1, accuracy: 0 },
	});

	onMount(() => {
		generateGateQuestion();
		loadState();
		loadVoices();
	});

	function loadVoices() {
		// Voices may load asynchronously, so we try multiple times
		const tryLoadVoices = () => {
			const voices = speechService.getVoicesForLanguage('pt-BR');
			if (voices.length > 0) {
				availableVoices = voices;
				selectedVoiceName = speechService.getSelectedVoiceName();
			}
		};

		tryLoadVoices();
		// Try again after a short delay (voices load async in some browsers)
		setTimeout(tryLoadVoices, 100);
		setTimeout(tryLoadVoices, 500);
	}

	function handleVoiceChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const name = select.value || null;
		speechService.setVoiceName(name);
		selectedVoiceName = name;
	}

	function testVoice() {
		speechService.speak('Olá! Eu sou a Lumi, sua amiga de aprendizado.', { lang: 'pt-BR' });
	}

	function generateGateQuestion() {
		// Generate a multiplication problem (too hard for young children)
		const a = Math.floor(Math.random() * 5) + 5; // 5-9
		const b = Math.floor(Math.random() * 5) + 5; // 5-9
		gateQuestion = { a, b, answer: a * b };
	}

	function checkGate() {
		if (parseInt(gateAnswer) === gateQuestion.answer) {
			isUnlocked = true;
			gateError = false;
		} else {
			gateError = true;
			gateAnswer = '';
			generateGateQuestion();
		}
	}

	function loadState() {
		if (typeof window === 'undefined') return;

		// Load limits
		const limitsData = localStorage.getItem('lumi-limits');
		if (limitsData) {
			try {
				adventureLimitService.loadState(JSON.parse(limitsData));
			} catch {
				// Ignore
			}
		}
		dailyLimit = adventureLimitService.getDailyLimit();
		limitEnabled = adventureLimitService.isLimitEnabled();
		todayCount = adventureLimitService.getTodayCount();

		// Load progress
		const progressData = localStorage.getItem('lumi-progress');
		if (progressData) {
			try {
				difficultyManager.loadProgress(JSON.parse(progressData));
			} catch {
				// Ignore
			}
		}

		// Get progress for each activity
		const types: ProblemType[] = ['counting', 'addition', 'subtraction', 'comparison', 'patterns'];
		const newProgress: Record<string, { difficulty: number; accuracy: number }> = {};
		for (const type of types) {
			newProgress[type] = {
				difficulty: difficultyManager.getDifficulty(type),
				accuracy: difficultyManager.getAccuracy(type),
			};
		}
		activityProgress = newProgress as typeof activityProgress;
	}

	function saveSettings() {
		adventureLimitService.setDailyLimit(dailyLimit);
		adventureLimitService.setLimitEnabled(limitEnabled);
		if (typeof window !== 'undefined') {
			localStorage.setItem('lumi-limits', JSON.stringify(adventureLimitService.getState()));
		}
	}

	function resetTodayCount() {
		adventureLimitService.resetTodayCount();
		todayCount = 0;
		saveSettings();
	}

	function goHome() {
		goto('/');
	}

	const activityNames: Record<ProblemType, string> = {
		counting: 'Contagem',
		addition: 'Adição',
		subtraction: 'Subtração',
		comparison: 'Comparação',
		patterns: 'Padrões',
	};
</script>

<svelte:head>
	<title>Área dos Pais - Lumi</title>
</svelte:head>

<main class="parents">
	{#if !isUnlocked}
		<!-- Gate -->
		<div class="gate">
			<h1 class="gate-title">Área dos Pais</h1>
			<p class="gate-description">
				Resolva o problema para entrar:
			</p>
			<p class="gate-question">
				{gateQuestion.a} × {gateQuestion.b} = ?
			</p>
			<input
				type="number"
				bind:value={gateAnswer}
				class="gate-input"
				class:error={gateError}
				placeholder="Resposta"
				onkeydown={(e) => e.key === 'Enter' && checkGate()}
			/>
			{#if gateError}
				<p class="gate-error">Resposta incorreta. Tente novamente.</p>
			{/if}
			<div class="gate-actions">
				<LumiButton onclick={checkGate} variant="primary">
					Entrar
				</LumiButton>
				<LumiButton onclick={goHome} variant="ghost">
					Voltar
				</LumiButton>
			</div>
		</div>
	{:else}
		<!-- Dashboard -->
		<header class="header">
			<h1 class="title">Área dos Pais</h1>
			<button class="back-button" onclick={goHome}>← Voltar</button>
		</header>

		<section class="section">
			<h2 class="section-title">Hoje</h2>
			<div class="card">
				<p class="stat">
					<span class="stat-value">{todayCount}</span>
					<span class="stat-label">aventuras completadas</span>
				</p>
				{#if todayCount > 0}
					<button class="text-button" onclick={resetTodayCount}>
						Resetar contagem de hoje
					</button>
				{/if}
			</div>
		</section>

		<section class="section">
			<h2 class="section-title">Progresso por Atividade</h2>
			<div class="progress-grid">
				{#each Object.entries(activityProgress) as [type, data]}
					<div class="progress-card">
						<h3 class="progress-title">{activityNames[type as ProblemType]}</h3>
						<div class="progress-stats">
							<span class="progress-stat">
								Nível: <strong>{data.difficulty}</strong>/4
							</span>
							<span class="progress-stat">
								Precisão: <strong>{data.accuracy}%</strong>
							</span>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="section">
			<h2 class="section-title">Configurações</h2>
			<div class="card">
				<div class="setting">
					<label class="setting-label">
						<input
							type="checkbox"
							bind:checked={limitEnabled}
							onchange={saveSettings}
						/>
						Limite diário ativado
					</label>
				</div>
				{#if limitEnabled}
					<div class="setting">
						<label class="setting-label">
							Aventuras por dia:
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
					<h3 class="card-title">Voz</h3>
					<p class="card-description">Escolha a voz para as instruções faladas.</p>
					<div class="setting">
						<select
							class="voice-select"
							value={selectedVoiceName ?? ''}
							onchange={handleVoiceChange}
						>
							<option value="">Automático (melhor disponível)</option>
							{#each availableVoices as voice}
								<option value={voice.name}>
									{voice.name}{voice.isCloud ? ' ★' : ''}
								</option>
							{/each}
						</select>
					</div>
					<button class="text-button" onclick={testVoice}>
						▶ Testar voz
					</button>
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
		width: 120px;
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
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
