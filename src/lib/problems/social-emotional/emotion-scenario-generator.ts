/**
 * Emotion Scenario Generator
 *
 * Generates "How would you feel if...?" problems.
 * Shows a scenario and asks the child to identify the appropriate emotion.
 *
 * Signature format: social-emotional:emotion-scenario:d{difficulty}:{scenarioId}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from '../generator'
import { shuffle } from '../visual-objects'
import { ageService } from '$lib/services'

/** Emotion for answer choices */
interface Emotion {
	id: string
	emoji: string
	namePtBR: string
	nameEn: string
	nameDe: string
	nameFr: string
	nameEs: string
}

/** Scenario definition with the expected emotion response */
interface Scenario {
	id: string
	emoji: string // Visual representation of the scenario
	scenarioPtBR: string
	scenarioEn: string
	scenarioDe: string
	scenarioFr: string
	scenarioEs: string
	correctEmotionId: string // Reference to emotion by id
}

/** Get emotion by id from allEmotions array */
function getEmotionById(id: string): Emotion {
	return allEmotions.find((e) => e.id === id)!
}

/** Available emotions for answer choices */
const allEmotions: Emotion[] = [
	{
		id: 'happy',
		emoji: '😊',
		namePtBR: 'feliz',
		nameEn: 'happy',
		nameDe: 'glücklich',
		nameFr: 'content',
		nameEs: 'feliz'
	},
	{
		id: 'sad',
		emoji: '😢',
		namePtBR: 'triste',
		nameEn: 'sad',
		nameDe: 'traurig',
		nameFr: 'triste',
		nameEs: 'triste'
	},
	{
		id: 'angry',
		emoji: '😠',
		namePtBR: 'com raiva',
		nameEn: 'angry',
		nameDe: 'wütend',
		nameFr: 'en colère',
		nameEs: 'enfadado'
	},
	{
		id: 'scared',
		emoji: '😨',
		namePtBR: 'com medo',
		nameEn: 'scared',
		nameDe: 'ängstlich',
		nameFr: 'effrayé',
		nameEs: 'asustado'
	},
	{
		id: 'surprised',
		emoji: '😲',
		namePtBR: 'surpreso',
		nameEn: 'surprised',
		nameDe: 'überrascht',
		nameFr: 'surpris',
		nameEs: 'sorprendido'
	},
	{
		id: 'tired',
		emoji: '😴',
		namePtBR: 'cansado',
		nameEn: 'tired',
		nameDe: 'müde',
		nameFr: 'fatigué',
		nameEs: 'cansado'
	},
	{
		id: 'excited',
		emoji: '🤩',
		namePtBR: 'empolgado',
		nameEn: 'excited',
		nameDe: 'aufgeregt',
		nameFr: 'excité',
		nameEs: 'emocionado'
	},
	{
		id: 'worried',
		emoji: '😟',
		namePtBR: 'preocupado',
		nameEn: 'worried',
		nameDe: 'besorgt',
		nameFr: 'inquiet',
		nameEs: 'preocupado'
	}
]

/**
 * Scenarios organized by difficulty
 * D1: Simple, universal scenarios (gift, ice cream)
 * D2: More everyday scenarios
 * D3: Social situations
 * D4: More nuanced emotional scenarios
 */
const scenarios: Record<DifficultyLevel, Scenario[]> = {
	1: [
		{
			id: 'gift',
			emoji: '🎁',
			scenarioPtBR: 'Você ganha um presente',
			scenarioEn: 'You get a gift',
			scenarioDe: 'Du bekommst ein Geschenk',
			scenarioFr: 'Tu reçois un cadeau',
			scenarioEs: 'Recibes un regalo',
			correctEmotionId: 'happy'
		},
		{
			id: 'ice-cream',
			emoji: '🍦',
			scenarioPtBR: 'Você ganha um sorvete',
			scenarioEn: 'You get ice cream',
			scenarioDe: 'Du bekommst ein Eis',
			scenarioFr: 'Tu reçois une glace',
			scenarioEs: 'Te dan un helado',
			correctEmotionId: 'happy'
		},
		{
			id: 'balloon-pop',
			emoji: '🎈',
			scenarioPtBR: 'Seu balão estoura',
			scenarioEn: 'Your balloon pops',
			scenarioDe: 'Dein Ballon platzt',
			scenarioFr: 'Ton ballon éclate',
			scenarioEs: 'Tu globo se revienta',
			correctEmotionId: 'sad'
		},
		{
			id: 'toy-broken',
			emoji: '🧸',
			scenarioPtBR: 'Seu brinquedo quebra',
			scenarioEn: 'Your toy breaks',
			scenarioDe: 'Dein Spielzeug geht kaputt',
			scenarioFr: 'Ton jouet se casse',
			scenarioEs: 'Tu juguete se rompe',
			correctEmotionId: 'sad'
		}
	],
	2: [
		{
			id: 'birthday-party',
			emoji: '🎂',
			scenarioPtBR: 'É seu aniversário',
			scenarioEn: "It's your birthday",
			scenarioDe: 'Es ist dein Geburtstag',
			scenarioFr: "C'est ton anniversaire",
			scenarioEs: 'Es tu cumpleaños',
			correctEmotionId: 'happy'
		},
		{
			id: 'pet-dog',
			emoji: '🐕',
			scenarioPtBR: 'Você brinca com um cachorro',
			scenarioEn: 'You play with a puppy',
			scenarioDe: 'Du spielst mit einem Hund',
			scenarioFr: 'Tu joues avec un chiot',
			scenarioEs: 'Juegas con un perrito',
			correctEmotionId: 'happy'
		},
		{
			id: 'thunder',
			emoji: '⛈️',
			scenarioPtBR: 'Você ouve um trovão',
			scenarioEn: 'You hear thunder',
			scenarioDe: 'Du hörst Donner',
			scenarioFr: 'Tu entends le tonnerre',
			scenarioEs: 'Escuchas un trueno',
			correctEmotionId: 'scared'
		},
		{
			id: 'lost-toy',
			emoji: '🔍',
			scenarioPtBR: 'Você perde seu brinquedo',
			scenarioEn: 'You lose your toy',
			scenarioDe: 'Du verlierst dein Spielzeug',
			scenarioFr: 'Tu perds ton jouet',
			scenarioEs: 'Pierdes tu juguete',
			correctEmotionId: 'sad'
		},
		{
			id: 'someone-pushes',
			emoji: '😤',
			scenarioPtBR: 'Alguém te empurra',
			scenarioEn: 'Someone pushes you',
			scenarioDe: 'Jemand schubst dich',
			scenarioFr: "Quelqu'un te pousse",
			scenarioEs: 'Alguien te empuja',
			correctEmotionId: 'angry'
		}
	],
	3: [
		{
			id: 'friend-visit',
			emoji: '👋',
			scenarioPtBR: 'Seu amigo vem brincar',
			scenarioEn: 'Your friend comes to play',
			scenarioDe: 'Dein Freund kommt zum Spielen',
			scenarioFr: 'Ton ami vient jouer',
			scenarioEs: 'Tu amigo viene a jugar',
			correctEmotionId: 'happy'
		},
		{
			id: 'surprise-visit',
			emoji: '🚪',
			scenarioPtBR: 'A vovó aparece de surpresa',
			scenarioEn: 'Grandma visits by surprise',
			scenarioDe: 'Oma kommt überraschend',
			scenarioFr: 'Mamie arrive par surprise',
			scenarioEs: 'La abuela llega de sorpresa',
			correctEmotionId: 'surprised'
		},
		{
			id: 'dark-room',
			emoji: '🌑',
			scenarioPtBR: 'O quarto fica escuro',
			scenarioEn: 'The room gets dark',
			scenarioDe: 'Das Zimmer wird dunkel',
			scenarioFr: 'La pièce devient sombre',
			scenarioEs: 'El cuarto se oscurece',
			correctEmotionId: 'scared'
		},
		{
			id: 'long-day',
			emoji: '🌙',
			scenarioPtBR: 'É hora de dormir depois de um dia longo',
			scenarioEn: "It's bedtime after a long day",
			scenarioDe: 'Es ist Schlafenszeit nach einem langen Tag',
			scenarioFr: "C'est l'heure de dormir après une longue journée",
			scenarioEs: 'Es hora de dormir después de un día largo',
			correctEmotionId: 'tired'
		},
		{
			id: 'no-share',
			emoji: '🚫',
			scenarioPtBR: 'Alguém não divide com você',
			scenarioEn: "Someone won't share with you",
			scenarioDe: 'Jemand teilt nicht mit dir',
			scenarioFr: "Quelqu'un ne veut pas partager",
			scenarioEs: 'Alguien no quiere compartir',
			correctEmotionId: 'angry'
		},
		{
			id: 'friend-sad',
			emoji: '😿',
			scenarioPtBR: 'Seu amigo está triste',
			scenarioEn: 'Your friend is sad',
			scenarioDe: 'Dein Freund ist traurig',
			scenarioFr: 'Ton ami est triste',
			scenarioEs: 'Tu amigo está triste',
			correctEmotionId: 'worried'
		}
	],
	4: [
		{
			id: 'good-grade',
			emoji: '⭐',
			scenarioPtBR: 'Você vai bem na escola',
			scenarioEn: 'You do well at school',
			scenarioDe: 'Du machst das gut in der Schule',
			scenarioFr: "Tu réussis bien à l'école",
			scenarioEs: 'Te va bien en la escuela',
			correctEmotionId: 'happy'
		},
		{
			id: 'theme-park',
			emoji: '🎢',
			scenarioPtBR: 'Você vai ao parque de diversões',
			scenarioEn: "You're going to a theme park",
			scenarioDe: 'Du gehst in einen Freizeitpark',
			scenarioFr: "Tu vas au parc d'attractions",
			scenarioEs: 'Vas a un parque de diversiones',
			correctEmotionId: 'excited'
		},
		{
			id: 'pet-sick',
			emoji: '🏥',
			scenarioPtBR: 'Seu pet está doente',
			scenarioEn: 'Your pet is sick',
			scenarioDe: 'Dein Haustier ist krank',
			scenarioFr: 'Ton animal est malade',
			scenarioEs: 'Tu mascota está enferma',
			correctEmotionId: 'worried'
		},
		{
			id: 'broken-promise',
			emoji: '💔',
			scenarioPtBR: 'Alguém quebra uma promessa',
			scenarioEn: 'Someone breaks a promise',
			scenarioDe: 'Jemand bricht ein Versprechen',
			scenarioFr: "Quelqu'un rompt une promesse",
			scenarioEs: 'Alguien rompe una promesa',
			correctEmotionId: 'sad'
		},
		{
			id: 'strange-noise',
			emoji: '👂',
			scenarioPtBR: 'Você ouve um barulho estranho',
			scenarioEn: 'You hear a strange noise',
			scenarioDe: 'Du hörst ein seltsames Geräusch',
			scenarioFr: 'Tu entends un bruit étrange',
			scenarioEs: 'Escuchas un ruido extraño',
			correctEmotionId: 'scared'
		},
		{
			id: 'unfair-game',
			emoji: '🎮',
			scenarioPtBR: 'Alguém não joga justo',
			scenarioEn: "Someone doesn't play fair",
			scenarioDe: 'Jemand spielt nicht fair',
			scenarioFr: "Quelqu'un ne joue pas équitablement",
			scenarioEs: 'Alguien no juega limpio',
			correctEmotionId: 'angry'
		},
		{
			id: 'surprise-cake',
			emoji: '🎂',
			scenarioPtBR: 'Você encontra um bolo surpresa',
			scenarioEn: 'You find a surprise cake',
			scenarioDe: 'Du findest einen Überraschungskuchen',
			scenarioFr: 'Tu trouves un gâteau surprise',
			scenarioEs: 'Encuentras un pastel sorpresa',
			correctEmotionId: 'surprised'
		},
		{
			id: 'lots-of-play',
			emoji: '🏃',
			scenarioPtBR: 'Você brinca o dia todo',
			scenarioEn: 'You play all day long',
			scenarioDe: 'Du spielst den ganzen Tag',
			scenarioFr: 'Tu joues toute la journée',
			scenarioEs: 'Juegas todo el día',
			correctEmotionId: 'tired'
		}
	]
}

/** Get emotions that are appropriate for the difficulty level */
function getEmotionsForDifficulty(difficulty: DifficultyLevel): Emotion[] {
	const emotionCounts: Record<DifficultyLevel, number> = {
		1: 2, // happy, sad
		2: 4, // + angry, scared
		3: 6, // + surprised, tired
		4: 8 // + excited, worried
	}
	return allEmotions.slice(0, emotionCounts[difficulty])
}

export class EmotionScenarioGenerator implements ProblemGenerator {
	readonly problemType = 'emotion-scenario' as const

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const availableScenarios = scenarios[difficulty]

		for (const scenario of shuffle(availableScenarios)) {
			const signature = this.makeSignature(difficulty, scenario.id)

			if (!excluding.has(signature)) {
				const problem = this.createProblem(scenario, difficulty)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		return scenarios[difficulty].map((s) => this.makeSignature(difficulty, s.id))
	}

	private makeSignature(difficulty: DifficultyLevel, scenarioId: string): string {
		return `social-emotional:emotion-scenario:d${difficulty}:${scenarioId}`
	}

	private createProblem(scenario: Scenario, difficulty: DifficultyLevel): Problem {
		const age = ageService.getAge()
		const availableEmotions = getEmotionsForDifficulty(difficulty)

		// Get the correct emotion from the id
		const correctEmotion = getEmotionById(scenario.correctEmotionId)

		// Fewer choices for younger children
		const numChoices = age <= 4 ? 3 : 4

		// Get distractor emotions (excluding the correct one)
		const distractors = shuffle(availableEmotions.filter((e) => e.id !== correctEmotion.id)).slice(
			0,
			numChoices - 1
		)

		// Combine and shuffle all choices
		const allChoices = shuffle([correctEmotion, ...distractors])

		// Create visual elements (the scenario emoji)
		const elements = [
			{
				object: scenario.emoji,
				count: 1
			}
		]

		// Create answer choices with labels
		const choices: AnswerValue[] = allChoices.map((emotion) => ({
			type: 'object' as const,
			value: emotion.emoji,
			label: {
				ptBR: emotion.namePtBR,
				en: emotion.nameEn,
				de: emotion.nameDe,
				fr: emotion.nameFr,
				es: emotion.nameEs
			}
		}))

		return {
			id: crypto.randomUUID(),
			type: 'emotion-scenario',
			difficulty,
			signature: this.makeSignature(difficulty, scenario.id),
			visual: {
				type: 'scenario',
				elements,
				displayText: scenario.scenarioEn // Fallback display
			},
			prompt: {
				ptBR: `${scenario.scenarioPtBR}. Como você se sentiria?`,
				en: `${scenario.scenarioEn}. How would you feel?`,
				de: `${scenario.scenarioDe}. Wie würdest du dich fühlen?`,
				fr: `${scenario.scenarioFr}. Comment te sentirais-tu?`,
				es: `${scenario.scenarioEs}. ¿Cómo te sentirías?`
			},
			correctAnswer: {
				type: 'object',
				value: correctEmotion.emoji,
				label: {
					ptBR: correctEmotion.namePtBR,
					en: correctEmotion.nameEn,
					de: correctEmotion.nameDe,
					fr: correctEmotion.nameFr,
					es: correctEmotion.nameEs
				}
			},
			answerChoices: choices,
			hint: {
				ptBR: `Pense em como você se sentiria. Seria ${correctEmotion.emoji}!`,
				en: `Think about how you would feel. It would be ${correctEmotion.emoji}!`,
				de: `Denk darüber nach, wie du dich fühlen würdest. Es wäre ${correctEmotion.emoji}!`,
				fr: `Réfléchis à comment tu te sentirais. Ce serait ${correctEmotion.emoji}!`,
				es: `Piensa en cómo te sentirías. ¡Sería ${correctEmotion.emoji}!`
			}
		}
	}
}
