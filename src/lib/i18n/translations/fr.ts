import type { Translations } from '../types'

export const fr: Translations = {
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
			adaptiveDifficulty: 'Difficulté adaptative'
		},
		openSource: 'Open Source',
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
		letterRecognition: 'Lettres',
		alphabetOrder: 'Alphabet',
		initialLetter: 'Lettre initiale',
		wordCompletion: 'Compléter les mots'
	}
}
