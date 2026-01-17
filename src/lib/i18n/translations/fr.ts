import type { Translations } from '../types'

export const fr: Translations = {
	about: {
		title: 'À propos de Lumi',
		metaDescription:
			"Lumi est une application éducative gratuite, open source et anti-addictive pour les enfants. Découvrez notre mission de créer une technologie éducative éthique qui respecte le temps d'écran et le bien-être des enfants.",
		whatIsLumi: "Qu'est-ce que Lumi ?",
		whatIsLumiIntro: 'Lumi est une application éducative gratuite et open source pour les enfants',
		whatIsLumiIntroHighlight: 'respecter le bien-être des enfants',
		whatIsLumiIntroEnd:
			"qui adopte une approche radicalement différente des applications d'apprentissage. Alors que la plupart des applications éducatives utilisent des schémas addictifs pour maximiser le temps d'écran, Lumi est construit avec un principe fondamental :",
		whatIsLumiDescription:
			'Lumi enseigne les mathématiques, la grammaire et la logique à travers de courtes sessions d\'apprentissage concentrées appelées "aventures". Chaque aventure contient seulement 5 problèmes et s\'adapte automatiquement au niveau de votre enfant.',
		problemTitle: 'Le problème avec la plupart des applications éducatives',
		problemIntro:
			'La plupart des applications éducatives pour enfants sont conçues comme des machines à sous. Elles utilisent des',
		problemDarkPatterns: 'dark patterns',
		problemList: {
			points: 'Points et monnaies virtuelles qui créent des récompenses artificielles',
			streaks: 'Séries qui punissent de manquer un jour',
			leaderboards: 'Classements qui créent une compétition malsaine',
			timedChallenges: 'Défis chronométrés qui induisent stress et anxiété',
			pushNotifications: 'Notifications push qui interrompent le temps en famille',
			flashyAnimations: "Animations tape-à-l'œil conçues pour surstimuler"
		},
		problemConclusion:
			'Ces techniques maximisent les "métriques d\'engagement" mais nuisent à la relation des enfants avec l\'apprentissage et les écrans.',
		approachTitle: "L'approche anti-addictive de Lumi",
		approachIntro: 'Lumi fait partie du',
		approachHumaneTech: 'mouvement de la technologie humaine',
		approachIntroEnd:
			". Nous croyons que les applications éducatives doivent soutenir un développement sain, pas exploiter l'attention des enfants.",
		principles: {
			dailyLimits: {
				title: 'Limites quotidiennes',
				description:
					"Les parents fixent une limite quotidienne d'aventures (par défaut : 3). Une fois atteinte, Lumi encourage les enfants à jouer dehors ou à lire un livre."
			},
			noRewards: {
				title: 'Pas de récompenses',
				description:
					"Pas de points, pièces, gemmes ou récompenses virtuelles. L'apprentissage est sa propre récompense. Nous célébrons l'achèvement, pas les scores."
			},
			noStreaks: {
				title: 'Pas de séries',
				description:
					"Manquer un jour n'est pas grave. Il n'y a pas de punition pour faire des pauses. Les enfants peuvent apprendre à leur propre rythme."
			},
			calmDesign: {
				title: 'Design calme',
				description:
					'Animations douces, couleurs chaudes et aucun effet surstimulant. Conçu pour être paisible, pas hyperactif.'
			},
			noNotifications: {
				title: 'Pas de notifications',
				description:
					"Lumi n'envoie jamais de notifications push demandant aux enfants de revenir. Quand ils ont fini, ils ont fini."
			},
			adaptiveDifficulty: {
				title: 'Difficulté adaptative',
				description:
					"Les problèmes s'ajustent automatiquement au niveau de votre enfant. La difficulté augmente après les succès, et diminue après les difficultés."
			}
		},
		featuresTitle: 'Fonctionnalités',
		features: {
			learningTopics: "Sujets d'apprentissage : Exercices de mathématiques, grammaire et logique",
			ageAppropriate: "Adapté à l'âge : Contenu conçu pour les jeunes enfants",
			multipleLanguages: 'Plusieurs langues : Anglais, portugais, allemand et français',
			voiceSupport: 'Support vocal : Les problèmes peuvent être lus à haute voix',
			offlineFirst:
				"Hors ligne d'abord : Fonctionne sans internet, toutes les données restent sur l'appareil",
			parentDashboard: 'Tableau de bord parents : Voir la progression et ajuster les paramètres',
			completelyFree: "Entièrement gratuit : Pas de pub, pas d'achats intégrés, pas d'abonnement",
			openSourceFeature:
				'Open Source : Code transparent que tout le monde peut inspecter et améliorer'
		},
		privacyTitle: 'Confidentialité',
		privacyZeroData: 'zéro donnée',
		privacyDescription:
			". Toute la progression et les paramètres sont stockés localement sur votre appareil. Rien n'est jamais envoyé à un serveur. Il n'y a pas d'analyses, pas de suivi, pas de comptes utilisateurs.",
		openSourceTitle: 'Open Source',
		openSourceFree: 'logiciel libre et open source',
		openSourceDescription:
			' publié sous licence MIT. Vous pouvez consulter le code source, signaler des problèmes ou contribuer des améliorations sur GitHub.',
		viewOnGitHub: 'Voir sur GitHub'
	},
	faq: {
		title: 'Questions fréquemment posées',
		metaDescription:
			"Questions fréquemment posées sur Lumi, l'application éducative anti-addictive pour les enfants. Découvrez notre approche de la technologie éducative éthique, la confidentialité et les fonctionnalités.",
		subtitle:
			"Tout ce que vous devez savoir sur Lumi, l'application éducative anti-addictive pour les enfants.",
		stillHaveQuestions: 'Encore des questions ?',
		stillHaveQuestionsDescription:
			'Lumi est open source. Vous pouvez poser des questions, signaler des problèmes ou suggérer des améliorations sur GitHub.',
		askOnGitHub: 'Demander sur GitHub',
		questions: {
			antiAddictive: {
				question: "Qu'est-ce qu'une application éducative anti-addictive ?",
				answer:
					"Une application éducative anti-addictive est conçue pour aider les enfants à apprendre sans utiliser de techniques manipulatrices qui maximisent le temps d'écran. Contrairement à la plupart des applications qui utilisent des points, séries, classements et notifications pour accrocher les utilisateurs, les applications anti-addictives comme Lumi respectent le bien-être des enfants en fixant des limites quotidiennes, en évitant les systèmes de récompenses et en encourageant les pauses."
			},
			noStreaksRewards: {
				question:
					"Quelles applications de maths pour enfants n'utilisent pas de séries ou de récompenses ?",
				answer:
					"Lumi est une application éducative gratuite et open source pour les enfants qui évite délibérément les mécaniques addictives. Il n'y a pas de points, pièces, séries, classements ou notifications push. À la place, elle utilise des limites quotidiennes d'aventures et encourage le jeu en plein air quand la limite est atteinte. Lumi se concentre sur l'efficacité de l'apprentissage plutôt que sur les métriques d'engagement."
			},
			reallyFree: {
				question: 'Lumi est-il vraiment gratuit ? Y a-t-il des coûts cachés ?',
				answer:
					"Oui, Lumi est entièrement gratuit sans coûts cachés. Il n'y a pas de publicités, pas d'achats intégrés, pas d'abonnements premium et pas de collecte de données à monétiser. Lumi est un logiciel open source publié sous licence MIT, ce qui signifie que le code est disponible publiquement et peut être inspecté par n'importe qui."
			},
			ages: {
				question: 'Pour quels âges Lumi est-il conçu ?',
				answer:
					"Lumi est conçu pour les enfants de 4 à 7 ans. L'application dispose d'une difficulté adaptative qui s'ajuste automatiquement au niveau de votre enfant, la rendant appropriée aussi bien pour les débutants qui apprennent à compter que pour les enfants qui travaillent sur l'addition et la soustraction."
			},
			offline: {
				question: 'Lumi fonctionne-t-il hors ligne ?',
				answer:
					"Oui, Lumi fonctionne entièrement hors ligne. Toutes les données sont stockées localement sur votre appareil. Aucune connexion internet n'est requise après le chargement initial de la page, et aucune donnée n'est jamais envoyée à un serveur."
			},
			subjects: {
				question: 'Quelles matières Lumi enseigne-t-il ?',
				answer:
					"Lumi enseigne les mathématiques, la grammaire, la logique et les compétences socio-émotionnelles. Les sujets de mathématiques incluent le comptage, l'addition, la soustraction et la comparaison. Les activités socio-émotionnelles aident les enfants à reconnaître les émotions, comprendre les sentiments dans différentes situations et apprendre la gentillesse. Chaque sujet utilise une difficulté adaptative pour correspondre au niveau actuel de votre enfant."
			},
			dailyLimit: {
				question: 'Comment fonctionne la limite quotidienne ?',
				answer:
					"Les parents peuvent fixer une limite quotidienne d'aventures dans l'Espace Parents (par défaut 3 aventures par jour). Chaque aventure comprend 5 problèmes. Quand la limite quotidienne est atteinte, Lumi affiche un message amical encourageant l'enfant à jouer dehors ou lire un livre au lieu de continuer avec plus de temps d'écran."
			},
			privacy: {
				question: 'Les données de mon enfant sont-elles privées ?',
				answer:
					"Absolument. Lumi ne collecte aucune donnée. Toute la progression et les paramètres sont stockés uniquement dans le stockage local de votre appareil. Il n'y a pas de comptes utilisateurs, pas d'analyses, pas de suivi, et rien n'est jamais transmis à un serveur. Les données d'apprentissage de votre enfant restent entièrement privées."
			},
			languages: {
				question: 'Quelles langues Lumi supporte-t-il ?',
				answer:
					"Lumi supporte actuellement l'anglais, le portugais (brésilien), l'allemand, le français et l'espagnol. L'application détecte automatiquement la langue de votre navigateur mais vous pouvez sélectionner manuellement une langue différente en utilisant le sélecteur de langue."
			},
			voice: {
				question: 'Lumi peut-il lire les problèmes à haute voix ?',
				answer:
					"Oui, Lumi supporte la synthèse vocale. Vous pouvez activer la lecture automatique dans les paramètres de l'Espace Parents, ou appuyer sur le bouton haut-parleur sur chaque problème pour l'entendre lu à haute voix. Les paramètres vocaux peuvent être personnalisés pour utiliser différentes voix disponibles sur votre appareil."
			},
			leaderboard: {
				question: "Pourquoi Lumi n'a-t-il pas de classement ?",
				answer:
					"Les classements créent une comparaison sociale malsaine et de la compétition, ce qui peut causer de l'anxiété et réduire la motivation intrinsèque à apprendre. La recherche montre que comparer les enfants à leurs pairs peut être nuisible pour leur estime de soi et leur relation avec l'apprentissage. Lumi se concentre sur le progrès individuel à la place."
			},
			comparison: {
				question:
					"En quoi Lumi est-il différent de Khan Academy Kids, Duolingo ou d'autres applications d'apprentissage ?",
				answer:
					"Alors que beaucoup d'applications éducatives utilisent des techniques de gamification comme les séries, points et récompenses pour maximiser l'engagement, Lumi prend l'approche opposée. Lumi est conçu autour des principes de la technologie humaine, évitant intentionnellement les mécaniques addictives. L'objectif est un apprentissage efficace avec des habitudes saines de temps d'écran, pas maximiser le temps passé dans l'application."
			},
			openSource: {
				question: 'Lumi est-il open source ?',
				answer:
					"Oui, Lumi est entièrement open source sous licence MIT. Le code source complet est disponible sur GitHub à github.com/matheusml/lumi. N'importe qui peut inspecter le code, signaler des problèmes, suggérer des améliorations ou créer sa propre version."
			},
			adaptiveDifficulty: {
				question: 'Comment fonctionne la difficulté adaptative ?',
				answer:
					'Lumi suit la performance de votre enfant sur chaque type de problème. Après 3 bonnes réponses consécutives, la difficulté augmente. Après 2 mauvaises réponses, la difficulté diminue. Cela garantit que les problèmes sont toujours appropriément stimulants sans être frustrants.'
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
		socialEmotional: 'Émotions',
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
		wordCompletion: 'Compléter les mots',
		emotionRecognition: 'Émotions',
		emotionScenario: 'Scénarios',
		kindnessChoices: 'Gentillesse'
	}
}
