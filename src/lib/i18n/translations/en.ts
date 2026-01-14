import type { Translations } from '../types'

export const en: Translations = {
	agePicker: {
		label: 'Age',
		ariaLabel: 'Select age',
		years: 'yrs',
		yearsOld: 'years old'
	},
	common: {
		back: 'Back',
		next: 'Next',
		finish: 'Finish',
		loading: 'Loading...',
		or: 'or'
	},
	home: {
		title: 'Lumi',
		tagline: 'An anti-addictive educational app for children.',
		philosophy:
			"Most children's educational apps use dark patterns—points, streaks, leaderboards, notifications—to maximize screen time. Lumi is the opposite: we respect children's wellbeing while making learning effective.",
		whatWeDont: "What we DON'T do",
		whatWeDo: 'What we do',
		dontList: {
			noPoints: 'No points, coins, or rewards',
			noStreaks: 'No streaks or streak pressure',
			noLeaderboards: 'No leaderboards or comparisons',
			noTimedChallenges: 'No timed challenges',
			noNotifications: 'No notifications asking to return',
			noFlashyAnimations: 'No flashy, hyperactive animations'
		},
		doList: {
			shortAdventures: 'Short adventures (5 problems)',
			dailyLimits: 'Daily limits respected',
			celebrateCompletion: 'Celebrates completion, not speed',
			calmAnimations: 'Gentle, calm animations',
			encourageOutdoor: 'Encourages outdoor play',
			adaptiveDifficulty: 'Adaptive difficulty',
			freeNoAds: 'Free forever, no ads'
		},
		openSource: 'GitHub',
		startAdventure: 'Start an adventure',
		math: 'Math',
		grammar: 'Grammar',
		logic: 'Logic',
		adventuresRemaining: 'adventures remaining today',
		adventureRemaining: 'adventure remaining today',
		limitReached: 'You completed all adventures for today!',
		encourageOutdoor: 'How about playing outside or reading a book?',
		parentZone: 'Parents'
	},
	adventure: {
		backToHome: 'Back to home',
		preparing: 'Preparing adventure...',
		correct: 'Well done!',
		tryAgain: 'Not quite!',
		tryAgainButton: 'Try Again'
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
		backToStart: 'Back to Start',
		chooseNext: 'Choose your next adventure',
		continueIfYouWant: 'Want to keep learning? Try another!',
		orTakeABreak: 'Or take a break and play outside!'
	},
	parents: {
		title: 'Parent Zone',
		gateDescription: 'Solve the problem to enter:',
		answer: 'Answer',
		enter: 'Enter',
		back: 'Back',
		wrongAnswer: 'Incorrect answer. Try again.',
		// Tabs
		configTab: 'Settings',
		analyticsTab: 'Analytics',
		// Analytics
		today: 'Today',
		adventuresCompleted: 'adventures completed',
		resetToday: 'Reset today count',
		progressByActivity: 'Progress by Activity',
		level: 'Level',
		accuracy: 'Accuracy',
		// Settings
		settings: 'Settings',
		dailyLimitEnabled: 'Daily limit enabled',
		adventuresPerDay: 'Adventures per day',
		voice: 'Voice',
		voiceDescription: 'Choose the voice for spoken instructions.',
		automatic: 'Automatic (best available)',
		testVoice: 'Test voice',
		autoPlayVoice: 'Auto-play voice',
		autoPlayDescription: 'Automatically read problems aloud.',
		// Activity names
		counting: 'Counting',
		addition: 'Addition',
		subtraction: 'Subtraction',
		comparison: 'Comparison',
		patterns: 'Patterns',
		oddOneOut: 'Odd One Out',
		matching: 'Matching',
		sequence: 'Sequences',
		sorting: 'Sorting',
		letterRecognition: 'Letters',
		alphabetOrder: 'Alphabet',
		initialLetter: 'Initial Letter',
		wordCompletion: 'Word Completion'
	}
}
