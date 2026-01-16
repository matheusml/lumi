import type { Translations } from '../types'

export const fr: Translations = {
	about: {
		title: 'About Lumi',
		metaDescription:
			"Lumi is a free, open-source, anti-addictive educational app for children. Learn about our mission to create ethical ed-tech that respects screen time and children's wellbeing.",
		whatIsLumi: 'What is Lumi?',
		whatIsLumiIntro: 'Lumi is a free, open-source educational app for children',
		whatIsLumiIntroHighlight: "respect children's wellbeing",
		whatIsLumiIntroEnd:
			'that takes a radically different approach to learning apps. While most educational apps use addictive design patterns to maximize screen time, Lumi is built with one core principle:',
		whatIsLumiDescription:
			'Lumi teaches math, grammar, and logic through short, focused learning sessions called "adventures." Each adventure contains just 5 problems and adapts to your child\'s skill level automatically.',
		problemTitle: 'The Problem with Most Educational Apps',
		problemIntro: "Most children's educational apps are designed like slot machines. They use",
		problemDarkPatterns: 'dark patterns',
		problemList: {
			points: 'Points and virtual currencies that create artificial rewards',
			streaks: 'Streaks that punish missing a day',
			leaderboards: 'Leaderboards that create unhealthy competition',
			timedChallenges: 'Timed challenges that induce stress and anxiety',
			pushNotifications: 'Push notifications that interrupt family time',
			flashyAnimations: 'Flashy animations designed to overstimulate'
		},
		problemConclusion:
			'These techniques maximize "engagement metrics" but harm children\'s relationship with learning and screens.',
		approachTitle: "Lumi's Anti-Addictive Approach",
		approachIntro: 'Lumi is part of the',
		approachHumaneTech: 'humane technology movement',
		approachIntroEnd:
			". We believe educational apps should support healthy development, not exploit children's attention.",
		principles: {
			dailyLimits: {
				title: 'Daily Limits',
				description:
					'Parents set a daily adventure limit (default: 3). When reached, Lumi encourages kids to play outside or read a book.'
			},
			noRewards: {
				title: 'No Rewards',
				description:
					'No points, coins, gems, or virtual rewards. Learning is its own reward. We celebrate completion, not scores.'
			},
			noStreaks: {
				title: 'No Streaks',
				description:
					"Missing a day is fine. There's no punishment for taking breaks. Kids can learn at their own pace."
			},
			calmDesign: {
				title: 'Calm Design',
				description:
					'Gentle animations, warm colors, and no overstimulating effects. Designed to be peaceful, not hyperactive.'
			},
			noNotifications: {
				title: 'No Notifications',
				description:
					"Lumi never sends push notifications asking kids to return. When they're done, they're done."
			},
			adaptiveDifficulty: {
				title: 'Adaptive Difficulty',
				description:
					"Problems automatically adjust to your child's level. Move up after success, get easier problems after struggles."
			}
		},
		featuresTitle: 'Features',
		features: {
			learningTopics: 'Learning Topics: Math, grammar, and logic exercises',
			ageAppropriate: 'Age-Appropriate: Content designed for young children',
			multipleLanguages: 'Multiple Languages: English, Portuguese, German, and French',
			voiceSupport: 'Voice Support: Problems can be read aloud using text-to-speech',
			offlineFirst: 'Offline First: Works without internet, all data stays on device',
			parentDashboard: 'Parent Dashboard: View progress and adjust settings',
			completelyFree: 'Completely Free: No ads, no in-app purchases, no subscriptions',
			openSourceFeature: 'Open Source: Transparent code anyone can inspect and improve'
		},
		privacyTitle: 'Privacy',
		privacyZeroData: 'zero data',
		privacyDescription:
			'. All progress and settings are stored locally on your device using browser storage. Nothing is ever sent to any server. There are no analytics, no tracking, no user accounts.',
		openSourceTitle: 'Open Source',
		openSourceFree: 'free and open source software',
		openSourceDescription:
			' released under the MIT license. You can view the source code, report issues, or contribute improvements on GitHub.',
		viewOnGitHub: 'View on GitHub'
	},
	faq: {
		title: 'Frequently Asked Questions',
		metaDescription:
			'Frequently asked questions about Lumi, the anti-addictive educational app for children. Learn about our approach to ethical ed-tech, privacy, and features.',
		subtitle:
			'Everything you need to know about Lumi, the anti-addictive educational app for children.',
		stillHaveQuestions: 'Still have questions?',
		stillHaveQuestionsDescription:
			'Lumi is open source. You can ask questions, report issues, or suggest improvements on GitHub.',
		askOnGitHub: 'Ask on GitHub',
		questions: {
			antiAddictive: {
				question: 'What is an anti-addictive educational app?',
				answer:
					"An anti-addictive educational app is designed to help children learn without using manipulative techniques that maximize screen time. Unlike most apps that use points, streaks, leaderboards, and notifications to keep users hooked, anti-addictive apps like Lumi respect children's wellbeing by setting daily limits, avoiding rewards systems, and encouraging breaks."
			},
			noStreaksRewards: {
				question: 'What math apps for kids do not use streaks or rewards?',
				answer:
					'Lumi is a free, open-source educational app for children that deliberately avoids addictive mechanics. It has no points, coins, streaks, leaderboards, or push notifications. Instead, it uses daily adventure limits and encourages outdoor play when the limit is reached. Lumi focuses on learning effectiveness rather than engagement metrics.'
			},
			reallyFree: {
				question: 'Is Lumi really free? Are there any hidden costs?',
				answer:
					'Yes, Lumi is completely free with no hidden costs. There are no ads, no in-app purchases, no premium subscriptions, and no data collection to monetize. Lumi is open-source software released under the MIT license, meaning the code is publicly available and can be inspected by anyone.'
			},
			ages: {
				question: 'What ages is Lumi designed for?',
				answer:
					"Lumi is designed for children ages 4-7. The app features adaptive difficulty that automatically adjusts to your child's skill level, making it appropriate for beginners just learning to count as well as children working on addition and subtraction."
			},
			offline: {
				question: 'Does Lumi work offline?',
				answer:
					'Yes, Lumi works completely offline. All data is stored locally on your device using browser storage. No internet connection is required after the initial page load, and no data is ever sent to any server.'
			},
			subjects: {
				question: 'What subjects does Lumi teach?',
				answer:
					"Lumi teaches math, grammar, and logic. Math topics include counting, addition, subtraction, and comparison. Each topic uses adaptive difficulty to match your child's current skill level."
			},
			dailyLimit: {
				question: 'How does the daily limit work?',
				answer:
					'Parents can set a daily adventure limit in the Parent Zone (default is 3 adventures per day). Each adventure consists of 5 problems. When the daily limit is reached, Lumi displays a friendly message encouraging the child to play outside or read a book instead of continuing with more screen time.'
			},
			privacy: {
				question: "Is my child's data private?",
				answer:
					"Absolutely. Lumi collects zero data. All progress and settings are stored only on your device's local storage. There are no user accounts, no analytics, no tracking, and nothing is ever transmitted to any server. Your child's learning data stays completely private."
			},
			languages: {
				question: 'What languages does Lumi support?',
				answer:
					'Lumi currently supports English, Portuguese (Brazilian), German, French, and Spanish. The app automatically detects your browser language but you can manually select a different language using the language picker.'
			},
			voice: {
				question: 'Can Lumi read problems aloud?',
				answer:
					'Yes, Lumi supports text-to-speech. You can enable auto-play voice in the Parent Zone settings, or tap the speaker button on each problem to hear it read aloud. Voice settings can be customized to use different voices available on your device.'
			},
			leaderboard: {
				question: "Why doesn't Lumi have a leaderboard?",
				answer:
					'Leaderboards create unhealthy social comparison and competition, which can cause anxiety and reduce intrinsic motivation to learn. Research shows that comparing children to their peers can be harmful to their self-esteem and relationship with learning. Lumi focuses on individual progress instead.'
			},
			comparison: {
				question: 'How is Lumi different from Khan Academy Kids, Duolingo, or other learning apps?',
				answer:
					'While many educational apps use gamification techniques like streaks, points, and rewards to maximize engagement, Lumi takes the opposite approach. Lumi is designed around the principles of humane technology, intentionally avoiding addictive mechanics. The goal is effective learning with healthy screen time habits, not maximizing time spent in the app.'
			},
			openSource: {
				question: 'Is Lumi open source?',
				answer:
					'Yes, Lumi is fully open source under the MIT license. The complete source code is available on GitHub at github.com/matheusml/lumi. Anyone can inspect the code, report issues, suggest improvements, or create their own version.'
			},
			adaptiveDifficulty: {
				question: 'How does adaptive difficulty work?',
				answer:
					"Lumi tracks your child's performance on each type of problem. After 3 correct answers in a row, the difficulty increases. After 2 incorrect answers, the difficulty decreases. This ensures problems are always appropriately challenging without being frustrating."
			}
		}
	},
	agePicker: {
		label: 'Âge',
		ariaLabel: "Sélectionner l'âge",
		years: 'ans',
		yearsOld: 'ans'
	},
	common: {
		back: 'Retour',
		next: 'Suivant',
		finish: 'Terminer',
		loading: 'Chargement...',
		or: 'ou'
	},
	home: {
		title: 'Lumi',
		tagline: 'Une application éducative anti-addictive pour les enfants.',
		philosophy:
			"La plupart des applications éducatives pour enfants utilisent des dark patterns—points, séries, classements, notifications—pour maximiser le temps d'écran. Lumi est l'opposé : nous respectons le bien-être des enfants tout en rendant l'apprentissage efficace.",
		whatWeDont: 'Ce que nous NE faisons PAS',
		whatWeDo: 'Ce que nous faisons',
		dontList: {
			noPoints: 'Pas de points, pièces ou récompenses',
			noStreaks: 'Pas de séries ou de pression de série',
			noLeaderboards: 'Pas de classements ni de comparaisons',
			noTimedChallenges: 'Pas de défis chronométrés',
			noNotifications: 'Pas de notifications de retour',
			noFlashyAnimations: "Pas d'animations tape-à-l'œil"
		},
		doList: {
			shortAdventures: 'Aventures courtes (5 problèmes)',
			dailyLimits: 'Limites quotidiennes respectées',
			celebrateCompletion: "Célèbre l'achèvement, pas la vitesse",
			calmAnimations: 'Animations douces et calmes',
			encourageOutdoor: 'Encourage à jouer dehors',
			adaptiveDifficulty: 'Difficulté adaptative',
			freeNoAds: 'Gratuit pour toujours, sans pub'
		},
		openSource: 'GitHub',
		about: 'À propos',
		faq: 'FAQ',
		startAdventure: 'Commencer une aventure',
		math: 'Maths',
		grammar: 'Grammaire',
		logic: 'Logique',
		adventuresRemaining: "aventures restantes aujourd'hui",
		adventureRemaining: "aventure restante aujourd'hui",
		limitReached: "Tu as terminé toutes les aventures d'aujourd'hui !",
		encourageOutdoor: 'Et si tu jouais dehors ou lisais un livre ?',
		parentZone: 'Parents'
	},
	adventure: {
		backToHome: "Retour à l'accueil",
		preparing: "Préparation de l'aventure...",
		correct: 'Très bien !',
		tryAgain: 'Presque !',
		tryAgainButton: 'Réessayer'
	},
	complete: {
		title: 'Félicitations !',
		congratulations: 'Félicitations !',
		message: "Tu as terminé l'aventure !",
		youGot: 'Tu as réussi',
		of: 'sur',
		problems: 'problèmes',
		perfect: 'Incroyable ! Tu as tout réussi !',
		great: 'Très bien ! Continue comme ça !',
		goodJob: "Bon travail ! C'est en pratiquant qu'on progresse !",
		backToStart: "Retour à l'accueil",
		chooseNext: 'Choisis ta prochaine aventure',
		continueIfYouWant: 'Tu veux continuer à apprendre ? Essaie une autre !',
		orTakeABreak: 'Ou fais une pause et joue dehors !'
	},
	parents: {
		title: 'Espace Parents',
		gateDescription: 'Résolvez le problème pour entrer :',
		answer: 'Réponse',
		enter: 'Entrer',
		back: 'Retour',
		wrongAnswer: 'Réponse incorrecte. Réessayez.',
		// Tabs
		configTab: 'Paramètres',
		analyticsTab: 'Statistiques',
		// Analytics
		today: "Aujourd'hui",
		adventuresCompleted: 'aventures terminées',
		resetToday: "Réinitialiser le compteur d'aujourd'hui",
		progressByActivity: 'Progrès par activité',
		level: 'Niveau',
		accuracy: 'Précision',
		// Settings
		settings: 'Paramètres',
		dailyLimitEnabled: 'Limite quotidienne activée',
		adventuresPerDay: 'Aventures par jour',
		voice: 'Voix',
		voiceDescription: 'Choisissez la voix pour les instructions parlées.',
		automatic: 'Automatique (meilleure disponible)',
		testVoice: 'Tester la voix',
		autoPlayVoice: 'Lecture automatique',
		autoPlayDescription: 'Lire les problèmes automatiquement à haute voix.',
		// Activity names
		counting: 'Compter',
		addition: 'Addition',
		subtraction: 'Soustraction',
		comparison: 'Comparaison',
		patterns: 'Motifs',
		oddOneOut: "L'intrus",
		matching: 'Associations',
		sequence: 'Séquences',
		sorting: 'Classement',
		shapeRecognition: 'Formes',
		colorRecognition: 'Couleurs',
		letterRecognition: 'Lettres',
		alphabetOrder: 'Alphabet',
		initialLetter: 'Lettre initiale',
		wordCompletion: 'Compléter les mots'
	}
}
