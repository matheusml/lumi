import type { Translations } from '../types'

export const en: Translations = {
	common: {
		back: 'Back',
		next: 'Next',
		finish: 'Finish',
		loading: 'Loading...',
		or: 'or'
	},
	home: {
		title: 'Lumi',
		tagline: 'Education that respects children',
		whatWeDont: "What we DON'T do",
		whatWeDo: 'What we do',
		dontList: {
			noAds: 'No ads',
			noPoints: 'No points or rewards',
			noNotifications: 'No notifications',
			noPressure: 'No time pressure',
			noComparisons: 'No comparisons'
		},
		doList: {
			dailyLimit: 'Daily limit (configurable)',
			private: '100% private and secure',
			calmAnimations: 'Calm animations',
			playfulLearning: 'Learning through play',
			adaptiveDifficulty: 'Automatically adjusted difficulty'
		},
		math: 'Math',
		grammar: 'Grammar',
		logic: 'Logic',
		adventuresRemaining: 'adventures remaining today',
		adventureRemaining: 'adventure remaining today',
		limitReached: 'You completed all adventures for today!',
		encourageOutdoor: 'How about playing outside or reading a book?',
		parentZone: 'Parent Zone'
	},
	adventure: {
		backToHome: 'Back to home',
		preparing: 'Preparing adventure...',
		correct: 'Well done!',
		tryAgain: 'Try again next time!'
	},
	complete: {
		title: 'Congratulations!',
		congratulations: 'Congratulations!',
		message: 'You completed the adventure!',
		youGot: 'You got',
		of: 'of',
		problems: 'problems',
		perfect: 'Amazing! You got them all!',
		great: 'Great job! Keep it up!',
		goodJob: 'Good work! Practice makes perfect!',
		backToStart: 'Back to Start'
	},
	parents: {
		title: 'Parent Zone',
		gateDescription: 'Solve the problem to enter:',
		answer: 'Answer',
		enter: 'Enter',
		back: 'Back',
		wrongAnswer: 'Incorrect answer. Try again.',
		today: 'Today',
		adventuresCompleted: 'adventures completed',
		resetToday: 'Reset today count',
		progressByActivity: 'Progress by Activity',
		level: 'Level',
		accuracy: 'Accuracy',
		settings: 'Settings',
		dailyLimitEnabled: 'Daily limit enabled',
		adventuresPerDay: 'Adventures per day',
		voice: 'Voice',
		voiceDescription: 'Choose the voice for spoken instructions.',
		automatic: 'Automatic (best available)',
		testVoice: 'Test voice',
		// Activity names
		counting: 'Counting',
		addition: 'Addition',
		subtraction: 'Subtraction',
		comparison: 'Comparison',
		patterns: 'Patterns',
		oddOneOut: 'Odd One Out',
		matching: 'Matching',
		sequence: 'Sequences',
		letterRecognition: 'Letters',
		alphabetOrder: 'Alphabet',
		initialLetter: 'Initial Letter',
		wordCompletion: 'Word Completion'
	}
}
