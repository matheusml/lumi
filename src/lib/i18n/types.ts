/**
 * i18n Type Definitions
 */

/** Supported language codes */
export type SupportedLanguage = 'pt-BR' | 'en' | 'de' | 'fr' | 'es'

/** Language metadata */
export interface LanguageInfo {
	code: SupportedLanguage
	name: string
	flag: string
	speechLang: string
}

/** Translation keys organized by page/section */
export interface Translations {
	about: {
		title: string
		metaDescription: string
		// Section: What is Lumi?
		whatIsLumi: string
		whatIsLumiIntro: string
		whatIsLumiIntroHighlight: string
		whatIsLumiIntroEnd: string
		whatIsLumiDescription: string
		// Section: The Problem
		problemTitle: string
		problemIntro: string
		problemDarkPatterns: string
		problemList: {
			points: string
			streaks: string
			leaderboards: string
			timedChallenges: string
			pushNotifications: string
			flashyAnimations: string
		}
		problemConclusion: string
		// Section: Anti-Addictive Approach
		approachTitle: string
		approachIntro: string
		approachHumaneTech: string
		approachIntroEnd: string
		principles: {
			dailyLimits: { title: string; description: string }
			noRewards: { title: string; description: string }
			noStreaks: { title: string; description: string }
			calmDesign: { title: string; description: string }
			noNotifications: { title: string; description: string }
			adaptiveDifficulty: { title: string; description: string }
		}
		// Section: Features
		featuresTitle: string
		features: {
			learningTopics: string
			ageAppropriate: string
			multipleLanguages: string
			voiceSupport: string
			offlineFirst: string
			parentDashboard: string
			completelyFree: string
			openSourceFeature: string
		}
		// Section: Privacy
		privacyTitle: string
		privacyDescription: string
		privacyZeroData: string
		// Section: Open Source
		openSourceTitle: string
		openSourceDescription: string
		openSourceFree: string
		viewOnGitHub: string
	}
	faq: {
		title: string
		metaDescription: string
		subtitle: string
		stillHaveQuestions: string
		stillHaveQuestionsDescription: string
		askOnGitHub: string
		questions: {
			antiAddictive: { question: string; answer: string }
			noStreaksRewards: { question: string; answer: string }
			reallyFree: { question: string; answer: string }
			ages: { question: string; answer: string }
			offline: { question: string; answer: string }
			subjects: { question: string; answer: string }
			dailyLimit: { question: string; answer: string }
			privacy: { question: string; answer: string }
			languages: { question: string; answer: string }
			voice: { question: string; answer: string }
			leaderboard: { question: string; answer: string }
			comparison: { question: string; answer: string }
			openSource: { question: string; answer: string }
			adaptiveDifficulty: { question: string; answer: string }
		}
	}
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
		about: string
		faq: string
		startAdventure: string
		startNow: string
		math: string
		grammar: string
		logic: string
		socialEmotional: string
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
		emotionRecognition: string
		emotionScenario: string
		kindnessChoices: string
	}
}
