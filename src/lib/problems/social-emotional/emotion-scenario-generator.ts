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
	correctEmotion: Emotion
}

/** Available emotions for answer choices */
const allEmotions: Emotion[] = [
	{ id: 'happy', emoji: '😊' },
	{ id: 'sad', emoji: '😢' },
	{ id: 'angry', emoji: '😠' },
	{ id: 'scared', emoji: '😨' },
	{ id: 'surprised', emoji: '😲' },
	{ id: 'tired', emoji: '😴' },
	{ id: 'excited', emoji: '🤩' },
	{ id: 'worried', emoji: '😟' }
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
			correctEmotion: { id: 'happy', emoji: '😊' }
		},
		{
			id: 'ice-cream',
			emoji: '🍦',
			scenarioPtBR: 'Você ganha um sorvete',
			scenarioEn: 'You get ice cream',
			scenarioDe: 'Du bekommst ein Eis',
			scenarioFr: 'Tu reçois une glace',
			scenarioEs: 'Te dan un helado',
			correctEmotion: { id: 'happy', emoji: '😊' }
		},
		{
			id: 'balloon-pop',
			emoji: '🎈',
			scenarioPtBR: 'Seu balão estoura',
			scenarioEn: 'Your balloon pops',
			scenarioDe: 'Dein Ballon platzt',
			scenarioFr: 'Ton ballon éclate',
			scenarioEs: 'Tu globo se revienta',
			correctEmotion: { id: 'sad', emoji: '😢' }
		},
		{
			id: 'toy-broken',
			emoji: '🧸',
			scenarioPtBR: 'Seu brinquedo quebra',
			scenarioEn: 'Your toy breaks',
			scenarioDe: 'Dein Spielzeug geht kaputt',
			scenarioFr: 'Ton jouet se casse',
			scenarioEs: 'Tu juguete se rompe',
			correctEmotion: { id: 'sad', emoji: '😢' }
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
			correctEmotion: { id: 'happy', emoji: '😊' }
		},
		{
			id: 'pet-dog',
			emoji: '🐕',
			scenarioPtBR: 'Você brinca com um cachorro',
			scenarioEn: 'You play with a puppy',
			scenarioDe: 'Du spielst mit einem Hund',
			scenarioFr: 'Tu joues avec un chiot',
			scenarioEs: 'Juegas con un perrito',
			correctEmotion: { id: 'happy', emoji: '😊' }
		},
		{
			id: 'thunder',
			emoji: '⛈️',
			scenarioPtBR: 'Você ouve um trovão',
			scenarioEn: 'You hear thunder',
			scenarioDe: 'Du hörst Donner',
			scenarioFr: 'Tu entends le tonnerre',
			scenarioEs: 'Escuchas un trueno',
			correctEmotion: { id: 'scared', emoji: '😨' }
		},
		{
			id: 'lost-toy',
			emoji: '🔍',
			scenarioPtBR: 'Você perde seu brinquedo',
			scenarioEn: 'You lose your toy',
			scenarioDe: 'Du verlierst dein Spielzeug',
			scenarioFr: 'Tu perds ton jouet',
			scenarioEs: 'Pierdes tu juguete',
			correctEmotion: { id: 'sad', emoji: '😢' }
		},
		{
			id: 'someone-pushes',
			emoji: '😤',
			scenarioPtBR: 'Alguém te empurra',
			scenarioEn: 'Someone pushes you',
			scenarioDe: 'Jemand schubst dich',
			scenarioFr: "Quelqu'un te pousse",
			scenarioEs: 'Alguien te empuja',
			correctEmotion: { id: 'angry', emoji: '😠' }
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
			correctEmotion: { id: 'happy', emoji: '😊' }
		},
		{
			id: 'surprise-visit',
			emoji: '🚪',
			scenarioPtBR: 'A vovó aparece de surpresa',
			scenarioEn: 'Grandma visits by surprise',
			scenarioDe: 'Oma kommt überraschend',
			scenarioFr: 'Mamie arrive par surprise',
			scenarioEs: 'La abuela llega de sorpresa',
			correctEmotion: { id: 'surprised', emoji: '😲' }
		},
		{
			id: 'dark-room',
			emoji: '🌑',
			scenarioPtBR: 'O quarto fica escuro',
			scenarioEn: 'The room gets dark',
			scenarioDe: 'Das Zimmer wird dunkel',
			scenarioFr: 'La pièce devient sombre',
			scenarioEs: 'El cuarto se oscurece',
			correctEmotion: { id: 'scared', emoji: '😨' }
		},
		{
			id: 'long-day',
			emoji: '🌙',
			scenarioPtBR: 'É hora de dormir depois de um dia longo',
			scenarioEn: "It's bedtime after a long day",
			scenarioDe: 'Es ist Schlafenszeit nach einem langen Tag',
			scenarioFr: "C'est l'heure de dormir après une longue journée",
			scenarioEs: 'Es hora de dormir después de un día largo',
			correctEmotion: { id: 'tired', emoji: '😴' }
		},
		{
			id: 'no-share',
			emoji: '🚫',
			scenarioPtBR: 'Alguém não divide com você',
			scenarioEn: "Someone won't share with you",
			scenarioDe: 'Jemand teilt nicht mit dir',
			scenarioFr: "Quelqu'un ne veut pas partager",
			scenarioEs: 'Alguien no quiere compartir',
			correctEmotion: { id: 'angry', emoji: '😠' }
		},
		{
			id: 'friend-sad',
			emoji: '😿',
			scenarioPtBR: 'Seu amigo está triste',
			scenarioEn: 'Your friend is sad',
			scenarioDe: 'Dein Freund ist traurig',
			scenarioFr: 'Ton ami est triste',
			scenarioEs: 'Tu amigo está triste',
			correctEmotion: { id: 'worried', emoji: '😟' }
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
			correctEmotion: { id: 'happy', emoji: '😊' }
		},
		{
			id: 'theme-park',
			emoji: '🎢',
			scenarioPtBR: 'Você vai ao parque de diversões',
			scenarioEn: "You're going to a theme park",
			scenarioDe: 'Du gehst in einen Freizeitpark',
			scenarioFr: "Tu vas au parc d'attractions",
			scenarioEs: 'Vas a un parque de diversiones',
			correctEmotion: { id: 'excited', emoji: '🤩' }
		},
		{
			id: 'pet-sick',
			emoji: '🏥',
			scenarioPtBR: 'Seu pet está doente',
			scenarioEn: 'Your pet is sick',
			scenarioDe: 'Dein Haustier ist krank',
			scenarioFr: 'Ton animal est malade',
			scenarioEs: 'Tu mascota está enferma',
			correctEmotion: { id: 'worried', emoji: '😟' }
		},
		{
			id: 'broken-promise',
			emoji: '💔',
			scenarioPtBR: 'Alguém quebra uma promessa',
			scenarioEn: 'Someone breaks a promise',
			scenarioDe: 'Jemand bricht ein Versprechen',
			scenarioFr: "Quelqu'un rompt une promesse",
			scenarioEs: 'Alguien rompe una promesa',
			correctEmotion: { id: 'sad', emoji: '😢' }
		},
		{
			id: 'strange-noise',
			emoji: '👂',
			scenarioPtBR: 'Você ouve um barulho estranho',
			scenarioEn: 'You hear a strange noise',
			scenarioDe: 'Du hörst ein seltsames Geräusch',
			scenarioFr: 'Tu entends un bruit étrange',
			scenarioEs: 'Escuchas un ruido extraño',
			correctEmotion: { id: 'scared', emoji: '😨' }
		},
		{
			id: 'unfair-game',
			emoji: '🎮',
			scenarioPtBR: 'Alguém não joga justo',
			scenarioEn: "Someone doesn't play fair",
			scenarioDe: 'Jemand spielt nicht fair',
			scenarioFr: "Quelqu'un ne joue pas équitablement",
			scenarioEs: 'Alguien no juega limpio',
			correctEmotion: { id: 'angry', emoji: '😠' }
		},
		{
			id: 'surprise-cake',
			emoji: '🎂',
			scenarioPtBR: 'Você encontra um bolo surpresa',
			scenarioEn: 'You find a surprise cake',
			scenarioDe: 'Du findest einen Überraschungskuchen',
			scenarioFr: 'Tu trouves un gâteau surprise',
			scenarioEs: 'Encuentras un pastel sorpresa',
			correctEmotion: { id: 'surprised', emoji: '😲' }
		},
		{
			id: 'lots-of-play',
			emoji: '🏃',
			scenarioPtBR: 'Você brinca o dia todo',
			scenarioEn: 'You play all day long',
			scenarioDe: 'Du spielst den ganzen Tag',
			scenarioFr: 'Tu joues toute la journée',
			scenarioEs: 'Juegas todo el día',
			correctEmotion: { id: 'tired', emoji: '😴' }
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

		// Fewer choices for younger children
		const numChoices = age <= 4 ? 3 : 4

		// Get distractor emotions (excluding the correct one)
		const distractors = shuffle(
			availableEmotions.filter((e) => e.id !== scenario.correctEmotion.id)
		).slice(0, numChoices - 1)

		// Combine and shuffle all choices
		const allChoices = shuffle([scenario.correctEmotion, ...distractors])

		// Create visual elements (the scenario emoji)
		const elements = [
			{
				object: scenario.emoji,
				count: 1
			}
		]

		// Create answer choices
		const choices: AnswerValue[] = allChoices.map((emotion) => ({
			type: 'object' as const,
			value: emotion.emoji
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
			correctAnswer: { type: 'object', value: scenario.correctEmotion.emoji },
			answerChoices: choices,
			hint: {
				ptBR: `Pense em como você se sentiria. Seria ${scenario.correctEmotion.emoji}!`,
				en: `Think about how you would feel. It would be ${scenario.correctEmotion.emoji}!`,
				de: `Denk darüber nach, wie du dich fühlen würdest. Es wäre ${scenario.correctEmotion.emoji}!`,
				fr: `Réfléchis à comment tu te sentirais. Ce serait ${scenario.correctEmotion.emoji}!`,
				es: `Piensa en cómo te sentirías. ¡Sería ${scenario.correctEmotion.emoji}!`
			}
		}
	}
}
