import type { Translations } from '../types'

export const es: Translations = {
	agePicker: {
		label: 'Edad',
		ariaLabel: 'Seleccionar edad',
		years: 'años',
		yearsOld: 'años'
	},
	common: {
		back: 'Volver',
		next: 'Siguiente',
		finish: 'Terminar',
		loading: 'Cargando...',
		or: 'o'
	},
	home: {
		title: 'Lumi',
		tagline: 'Una aplicación educativa anti-adictiva para niños.',
		philosophy:
			'La mayoría de las aplicaciones educativas para niños usan patrones oscuros—puntos, rachas, tablas de clasificación, notificaciones—para maximizar el tiempo de pantalla. Lumi es lo opuesto: respetamos el bienestar de los niños mientras hacemos el aprendizaje efectivo.',
		whatWeDont: 'Lo que NO hacemos',
		whatWeDo: 'Lo que hacemos',
		dontList: {
			noPoints: 'Sin puntos, monedas o recompensas',
			noStreaks: 'Sin rachas ni presión por mantenerlas',
			noLeaderboards: 'Sin tablas de clasificación ni comparaciones',
			noTimedChallenges: 'Sin desafíos cronometrados',
			noNotifications: 'Sin notificaciones pidiendo que vuelvas',
			noFlashyAnimations: 'Sin animaciones llamativas e hiperactivas'
		},
		doList: {
			shortAdventures: 'Aventuras cortas (5 problemas)',
			dailyLimits: 'Límites diarios respetados',
			celebrateCompletion: 'Celebramos completar, no la velocidad',
			calmAnimations: 'Animaciones suaves y tranquilas',
			encourageOutdoor: 'Fomentamos jugar al aire libre',
			adaptiveDifficulty: 'Dificultad adaptativa',
			freeNoAds: 'Gratis para siempre, sin anuncios'
		},
		openSource: 'GitHub',
		about: 'Acerca de',
		faq: 'FAQ',
		startAdventure: 'Comenzar una aventura',
		math: 'Matemáticas',
		grammar: 'Gramática',
		logic: 'Lógica',
		adventuresRemaining: 'aventuras restantes hoy',
		adventureRemaining: 'aventura restante hoy',
		limitReached: '¡Completaste todas las aventuras de hoy!',
		encourageOutdoor: '¿Qué tal jugar afuera o leer un libro?',
		parentZone: 'Padres'
	},
	adventure: {
		backToHome: 'Volver al inicio',
		preparing: 'Preparando aventura...',
		correct: '¡Muy bien!',
		tryAgain: '¡Casi!',
		tryAgainButton: 'Intentar de nuevo'
	},
	complete: {
		title: '¡Felicitaciones!',
		congratulations: '¡Felicitaciones!',
		message: '¡Completaste la aventura!',
		youGot: 'Acertaste',
		of: 'de',
		problems: 'problemas',
		perfect: '¡Increíble! ¡Los acertaste todos!',
		great: '¡Excelente trabajo! ¡Sigue así!',
		goodJob: '¡Buen trabajo! ¡La práctica hace al maestro!',
		backToStart: 'Volver al inicio',
		chooseNext: 'Elige tu próxima aventura',
		continueIfYouWant: '¿Quieres seguir aprendiendo? ¡Prueba otra!',
		orTakeABreak: '¡O toma un descanso y juega afuera!'
	},
	parents: {
		title: 'Zona de Padres',
		gateDescription: 'Resuelve el problema para entrar:',
		answer: 'Respuesta',
		enter: 'Entrar',
		back: 'Volver',
		wrongAnswer: 'Respuesta incorrecta. Intenta de nuevo.',
		// Tabs
		configTab: 'Configuración',
		analyticsTab: 'Estadísticas',
		// Analytics
		today: 'Hoy',
		adventuresCompleted: 'aventuras completadas',
		resetToday: 'Reiniciar contador de hoy',
		progressByActivity: 'Progreso por Actividad',
		level: 'Nivel',
		accuracy: 'Precisión',
		// Settings
		settings: 'Configuración',
		dailyLimitEnabled: 'Límite diario activado',
		adventuresPerDay: 'Aventuras por día',
		voice: 'Voz',
		voiceDescription: 'Elige la voz para las instrucciones habladas.',
		automatic: 'Automática (mejor disponible)',
		testVoice: 'Probar voz',
		autoPlayVoice: 'Reproducir voz automáticamente',
		autoPlayDescription: 'Leer los problemas en voz alta automáticamente.',
		// Activity names
		counting: 'Contar',
		addition: 'Suma',
		subtraction: 'Resta',
		comparison: 'Comparación',
		patterns: 'Patrones',
		oddOneOut: 'El diferente',
		matching: 'Emparejar',
		sequence: 'Secuencias',
		sorting: 'Ordenar',
		shapeRecognition: 'Formas',
		colorRecognition: 'Colores',
		letterRecognition: 'Letras',
		alphabetOrder: 'Alfabeto',
		initialLetter: 'Letra inicial',
		wordCompletion: 'Completar palabras'
	}
}
