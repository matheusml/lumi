import type { Translations } from '../types'

export const fr: Translations = {
	common: {
		back: 'Retour',
		next: 'Suivant',
		finish: 'Terminer',
		loading: 'Chargement...',
		or: 'ou'
	},
	home: {
		title: 'Lumi',
		tagline: "L'éducation qui respecte les enfants",
		whatWeDont: 'Ce que nous NE faisons PAS',
		whatWeDo: 'Ce que nous faisons',
		dontList: {
			noAds: 'Pas de publicités',
			noPoints: 'Pas de points ni de récompenses',
			noNotifications: 'Pas de notifications',
			noPressure: 'Pas de pression de temps',
			noComparisons: 'Pas de comparaisons'
		},
		doList: {
			dailyLimit: 'Limite quotidienne (configurable)',
			private: '100% privé et sécurisé',
			calmAnimations: 'Animations calmes',
			playfulLearning: 'Apprendre en jouant',
			adaptiveDifficulty: 'Difficulté ajustée automatiquement'
		},
		math: 'Maths',
		grammar: 'Grammaire',
		logic: 'Logique',
		adventuresRemaining: "aventures restantes aujourd'hui",
		adventureRemaining: "aventure restante aujourd'hui",
		limitReached: "Tu as terminé toutes les aventures d'aujourd'hui !",
		encourageOutdoor: 'Et si tu jouais dehors ou lisais un livre ?',
		parentZone: 'Espace Parents'
	},
	adventure: {
		backToHome: "Retour à l'accueil",
		preparing: "Préparation de l'aventure...",
		correct: 'Très bien !',
		tryAgain: 'Essaie encore la prochaine fois !'
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
		backToStart: "Retour à l'accueil"
	},
	parents: {
		title: 'Espace Parents',
		gateDescription: 'Résolvez le problème pour entrer :',
		answer: 'Réponse',
		enter: 'Entrer',
		back: 'Retour',
		wrongAnswer: 'Réponse incorrecte. Réessayez.',
		today: "Aujourd'hui",
		adventuresCompleted: 'aventures terminées',
		resetToday: "Réinitialiser le compteur d'aujourd'hui",
		progressByActivity: 'Progrès par activité',
		level: 'Niveau',
		accuracy: 'Précision',
		settings: 'Paramètres',
		dailyLimitEnabled: 'Limite quotidienne activée',
		adventuresPerDay: 'Aventures par jour',
		voice: 'Voix',
		voiceDescription: 'Choisissez la voix pour les instructions parlées.',
		automatic: 'Automatique (meilleure disponible)',
		testVoice: 'Tester la voix',
		// Activity names
		counting: 'Compter',
		addition: 'Addition',
		subtraction: 'Soustraction',
		comparison: 'Comparaison',
		patterns: 'Motifs',
		oddOneOut: "L'intrus",
		matching: 'Associations',
		sequence: 'Séquences',
		letterRecognition: 'Lettres',
		alphabetOrder: 'Alphabet',
		initialLetter: 'Lettre initiale',
		wordCompletion: 'Compléter les mots'
	}
}
