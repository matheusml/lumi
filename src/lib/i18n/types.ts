/**
 * i18n Type Definitions
 */

/** Supported language codes */
export type SupportedLanguage = 'pt-BR' | 'en' | 'de' | 'fr'

/** Language metadata */
export interface LanguageInfo {
	code: SupportedLanguage
	name: string
	flag: string
	speechLang: string
}

/** Translation keys organized by page/section */
export interface Translations {
	agePicker: {
		label: string
		ariaLabel: string
		years: string
		yearsOld: string
	}
	common: {
		back: string
		next: string
		finish: string
		loading: string
		or: string
	}
	home: {
		title: string
		tagline: string
		philosophy: string
		whatWeDont: string
		whatWeDo: string
		dontList: {
			noPoints: string
			noStreaks: string
			noLeaderboards: string
			noTimedChallenges: string
			noNotifications: string
			noFlashyAnimations: string
		}
		doList: {
			shortAdventures: string
			dailyLimits: string
			celebrateCompletion: string
			calmAnimations: string
			encourageOutdoor: string
			adaptiveDifficulty: string
			freeNoAds: string
		}
		openSource: string
		startAdventure: string
		math: string
		grammar: string
		logic: string
		adventuresRemaining: string
		adventureRemaining: string
		limitReached: string
		encourageOutdoor: string
		parentZone: string
	}
	adventure: {
		backToHome: string
		preparing: string
		correct: string
		tryAgain: string
		tryAgainButton: string
	}
	complete: {
		title: string
		congratulations: string
		message: string
		youGot: string
		of: string
		problems: string
		perfect: string
		great: string
		goodJob: string
		backToStart: string
		chooseNext: string
		continueIfYouWant: string
		orTakeABreak: string
	}
	parents: {
		title: string
		gateDescription: string
		answer: string
		enter: string
		back: string
		wrongAnswer: string
		// Tabs
		configTab: string
		analyticsTab: string
		// Analytics
		today: string
		adventuresCompleted: string
		resetToday: string
		progressByActivity: string
		level: string
		accuracy: string
		// Settings
		settings: string
		dailyLimitEnabled: string
		adventuresPerDay: string
		voice: string
		voiceDescription: string
		automatic: string
		testVoice: string
		autoPlayVoice: string
		autoPlayDescription: string
		// Activity names
		counting: string
		addition: string
		subtraction: string
		comparison: string
		patterns: string
		oddOneOut: string
		matching: string
		sequence: string
		sorting: string
		shapeRecognition: string
		colorRecognition: string
		letterRecognition: string
		alphabetOrder: string
		initialLetter: string
		wordCompletion: string
	}
}
