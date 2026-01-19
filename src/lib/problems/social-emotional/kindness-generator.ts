/**
 * Kindness Choices Generator
 *
 * Generates "What would be a kind thing to do?" problems.
 * Shows a scenario and asks the child to choose the kind action.
 *
 * Signature format: social-emotional:kindness-choices:d{difficulty}:{scenarioId}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from '../generator'
import { shuffle } from '../visual-objects'
import { ageService } from '$lib/services'

/** Action choice */
interface ActionChoice {
	emoji: string
	textPtBR: string
	textEn: string
	textDe: string
	textFr: string
	textEs: string
	isKind: boolean
}

/** Kindness scenario */
interface KindnessScenario {
	id: string
	emoji: string
	scenarioPtBR: string
	scenarioEn: string
	scenarioDe: string
	scenarioFr: string
	scenarioEs: string
	choices: ActionChoice[]
}

/**
 * Kindness scenarios organized by difficulty
 * D1: Very simple scenarios (sharing, helping)
 * D2: Everyday kindness situations
 * D3: Social situations requiring empathy
 * D4: More nuanced kindness decisions
 */
const kindnessScenarios: Record<DifficultyLevel, KindnessScenario[]> = {
	1: [
		{
			id: 'friend-no-toy',
			emoji: '🧸',
			scenarioPtBR: 'Seu amigo não tem brinquedo',
			scenarioEn: "Your friend doesn't have a toy",
			scenarioDe: 'Dein Freund hat kein Spielzeug',
			scenarioFr: "Ton ami n'a pas de jouet",
			scenarioEs: 'Tu amigo no tiene juguete',
			choices: [
				{
					emoji: '🤝',
					textPtBR: 'Dividir seu brinquedo',
					textEn: 'Share your toy',
					textDe: 'Dein Spielzeug teilen',
					textFr: 'Partager ton jouet',
					textEs: 'Compartir tu juguete',
					isKind: true
				},
				{
					emoji: '🚫',
					textPtBR: 'Esconder seu brinquedo',
					textEn: 'Hide your toy',
					textDe: 'Dein Spielzeug verstecken',
					textFr: 'Cacher ton jouet',
					textEs: 'Esconder tu juguete',
					isKind: false
				},
				{
					emoji: '😶',
					textPtBR: 'Ignorar seu amigo',
					textEn: 'Ignore your friend',
					textDe: 'Deinen Freund ignorieren',
					textFr: 'Ignorer ton ami',
					textEs: 'Ignorar a tu amigo',
					isKind: false
				}
			]
		},
		{
			id: 'someone-falls',
			emoji: '🤕',
			scenarioPtBR: 'Alguém cai no chão',
			scenarioEn: 'Someone falls down',
			scenarioDe: 'Jemand fällt hin',
			scenarioFr: "Quelqu'un tombe",
			scenarioEs: 'Alguien se cae',
			choices: [
				{
					emoji: '🤗',
					textPtBR: 'Ajudar a levantar',
					textEn: 'Help them up',
					textDe: 'Helfen aufzustehen',
					textFr: "L'aider à se relever",
					textEs: 'Ayudarle a levantarse',
					isKind: true
				},
				{
					emoji: '😆',
					textPtBR: 'Rir da pessoa',
					textEn: 'Laugh at them',
					textDe: 'Über sie lachen',
					textFr: 'Rire de lui',
					textEs: 'Reírse de él',
					isKind: false
				},
				{
					emoji: '🚶',
					textPtBR: 'Ir embora',
					textEn: 'Walk away',
					textDe: 'Weggehen',
					textFr: "S'en aller",
					textEs: 'Irse',
					isKind: false
				}
			]
		},
		{
			id: 'friend-crying',
			emoji: '😢',
			scenarioPtBR: 'Seu amigo está chorando',
			scenarioEn: 'Your friend is crying',
			scenarioDe: 'Dein Freund weint',
			scenarioFr: 'Ton ami pleure',
			scenarioEs: 'Tu amigo está llorando',
			choices: [
				{
					emoji: '💝',
					textPtBR: 'Perguntar o que houve',
					textEn: 'Ask what happened',
					textDe: 'Fragen was passiert ist',
					textFr: "Demander ce qui s'est passé",
					textEs: 'Preguntar qué pasó',
					isKind: true
				},
				{
					emoji: '🙄',
					textPtBR: 'Dizer para parar',
					textEn: 'Tell them to stop',
					textDe: 'Sagen sie sollen aufhören',
					textFr: "Dire d'arrêter",
					textEs: 'Decirle que pare',
					isKind: false
				},
				{
					emoji: '🏃',
					textPtBR: 'Sair correndo',
					textEn: 'Run away',
					textDe: 'Wegrennen',
					textFr: "S'enfuir",
					textEs: 'Salir corriendo',
					isKind: false
				}
			]
		}
	],
	2: [
		{
			id: 'new-kid',
			emoji: '👶',
			scenarioPtBR: 'Uma criança nova está sozinha',
			scenarioEn: 'A new kid is alone',
			scenarioDe: 'Ein neues Kind ist allein',
			scenarioFr: 'Un nouvel enfant est seul',
			scenarioEs: 'Un niño nuevo está solo',
			choices: [
				{
					emoji: '👋',
					textPtBR: 'Convidar para brincar',
					textEn: 'Invite them to play',
					textDe: 'Zum Spielen einladen',
					textFr: "L'inviter à jouer",
					textEs: 'Invitarle a jugar',
					isKind: true
				},
				{
					emoji: '🚫',
					textPtBR: 'Não falar com ela',
					textEn: "Don't talk to them",
					textDe: 'Nicht mit ihnen reden',
					textFr: 'Ne pas lui parler',
					textEs: 'No hablarle',
					isKind: false
				},
				{
					emoji: '😤',
					textPtBR: 'Mandar ir embora',
					textEn: 'Tell them to go away',
					textDe: 'Sagen sie sollen weggehen',
					textFr: 'Dire de partir',
					textEs: 'Decirle que se vaya',
					isKind: false
				}
			]
		},
		{
			id: 'dropped-books',
			emoji: '📚',
			scenarioPtBR: 'Alguém derruba os livros',
			scenarioEn: 'Someone drops their books',
			scenarioDe: 'Jemand lässt seine Bücher fallen',
			scenarioFr: "Quelqu'un fait tomber ses livres",
			scenarioEs: 'Alguien se le caen los libros',
			choices: [
				{
					emoji: '🤲',
					textPtBR: 'Ajudar a pegar',
					textEn: 'Help pick them up',
					textDe: 'Helfen sie aufzuheben',
					textFr: 'Aider à les ramasser',
					textEs: 'Ayudar a recogerlos',
					isKind: true
				},
				{
					emoji: '👀',
					textPtBR: 'Só olhar',
					textEn: 'Just watch',
					textDe: 'Nur zuschauen',
					textFr: 'Juste regarder',
					textEs: 'Solo mirar',
					isKind: false
				},
				{
					emoji: '🏃',
					textPtBR: 'Passar por cima',
					textEn: 'Walk over them',
					textDe: 'Darüber steigen',
					textFr: 'Passer par dessus',
					textEs: 'Pasar por encima',
					isKind: false
				}
			]
		},
		{
			id: 'friend-scared',
			emoji: '😨',
			scenarioPtBR: 'Seu amigo está com medo',
			scenarioEn: 'Your friend is scared',
			scenarioDe: 'Dein Freund hat Angst',
			scenarioFr: 'Ton ami a peur',
			scenarioEs: 'Tu amigo tiene miedo',
			choices: [
				{
					emoji: '🫂',
					textPtBR: 'Ficar do lado dele',
					textEn: 'Stay with them',
					textDe: 'Bei ihnen bleiben',
					textFr: 'Rester avec lui',
					textEs: 'Quedarse con él',
					isKind: true
				},
				{
					emoji: '😏',
					textPtBR: 'Dizer que é bobagem',
					textEn: "Say it's silly",
					textDe: 'Sagen es ist albern',
					textFr: "Dire que c'est bête",
					textEs: 'Decir que es tonto',
					isKind: false
				},
				{
					emoji: '😈',
					textPtBR: 'Assustar mais',
					textEn: 'Scare them more',
					textDe: 'Noch mehr erschrecken',
					textFr: 'Lui faire plus peur',
					textEs: 'Asustarlo más',
					isKind: false
				}
			]
		},
		{
			id: 'no-snack',
			emoji: '🍎',
			scenarioPtBR: 'Seu amigo esqueceu o lanche',
			scenarioEn: 'Your friend forgot their snack',
			scenarioDe: 'Dein Freund hat seinen Snack vergessen',
			scenarioFr: 'Ton ami a oublié son goûter',
			scenarioEs: 'Tu amigo olvidó su merienda',
			choices: [
				{
					emoji: '🤝',
					textPtBR: 'Dividir o seu lanche',
					textEn: 'Share your snack',
					textDe: 'Deinen Snack teilen',
					textFr: 'Partager ton goûter',
					textEs: 'Compartir tu merienda',
					isKind: true
				},
				{
					emoji: '😋',
					textPtBR: 'Comer na frente dele',
					textEn: 'Eat in front of them',
					textDe: 'Vor ihnen essen',
					textFr: 'Manger devant lui',
					textEs: 'Comer frente a él',
					isKind: false
				},
				{
					emoji: '🤷',
					textPtBR: 'Dizer que não é problema seu',
					textEn: "Say it's not your problem",
					textDe: 'Sagen das ist nicht dein Problem',
					textFr: "Dire que ce n'est pas ton problème",
					textEs: 'Decir que no es tu problema',
					isKind: false
				}
			]
		}
	],
	3: [
		{
			id: 'someone-teased',
			emoji: '😞',
			scenarioPtBR: 'Alguém está sendo provocado',
			scenarioEn: 'Someone is being teased',
			scenarioDe: 'Jemand wird geärgert',
			scenarioFr: "Quelqu'un se fait embêter",
			scenarioEs: 'Alguien está siendo molestado',
			choices: [
				{
					emoji: '🛡️',
					textPtBR: 'Defender a pessoa',
					textEn: 'Stand up for them',
					textDe: 'Für sie eintreten',
					textFr: 'Prendre sa défense',
					textEs: 'Defenderle',
					isKind: true
				},
				{
					emoji: '👀',
					textPtBR: 'Só assistir',
					textEn: 'Just watch',
					textDe: 'Nur zuschauen',
					textFr: 'Juste regarder',
					textEs: 'Solo mirar',
					isKind: false
				},
				{
					emoji: '😂',
					textPtBR: 'Rir junto',
					textEn: 'Laugh along',
					textDe: 'Mitlachen',
					textFr: 'Rire avec eux',
					textEs: 'Reírse también',
					isKind: false
				}
			]
		},
		{
			id: 'wrong-answer',
			emoji: '❌',
			scenarioPtBR: 'Alguém erra a resposta',
			scenarioEn: 'Someone gives a wrong answer',
			scenarioDe: 'Jemand gibt eine falsche Antwort',
			scenarioFr: "Quelqu'un donne une mauvaise réponse",
			scenarioEs: 'Alguien da una respuesta equivocada',
			choices: [
				{
					emoji: '💪',
					textPtBR: 'Dizer "tenta de novo!"',
					textEn: 'Say "try again!"',
					textDe: 'Sagen "versuch es nochmal!"',
					textFr: 'Dire "réessaie!"',
					textEs: 'Decir "¡inténtalo de nuevo!"',
					isKind: true
				},
				{
					emoji: '😆',
					textPtBR: 'Rir do erro',
					textEn: 'Laugh at the mistake',
					textDe: 'Über den Fehler lachen',
					textFr: "Rire de l'erreur",
					textEs: 'Reírse del error',
					isKind: false
				},
				{
					emoji: '🙄',
					textPtBR: 'Dizer que é fácil',
					textEn: "Say it's easy",
					textDe: 'Sagen es ist einfach',
					textFr: "Dire que c'est facile",
					textEs: 'Decir que es fácil',
					isKind: false
				}
			]
		},
		{
			id: 'wants-to-play',
			emoji: '🎮',
			scenarioPtBR: 'Alguém quer jogar com você',
			scenarioEn: 'Someone wants to play with you',
			scenarioDe: 'Jemand möchte mit dir spielen',
			scenarioFr: "Quelqu'un veut jouer avec toi",
			scenarioEs: 'Alguien quiere jugar contigo',
			choices: [
				{
					emoji: '😊',
					textPtBR: 'Deixar participar',
					textEn: 'Let them join',
					textDe: 'Sie mitspielen lassen',
					textFr: 'Le laisser participer',
					textEs: 'Dejarle participar',
					isKind: true
				},
				{
					emoji: '🚫',
					textPtBR: 'Dizer que não pode',
					textEn: "Say they can't",
					textDe: 'Sagen sie können nicht',
					textFr: "Dire qu'il ne peut pas",
					textEs: 'Decir que no puede',
					isKind: false
				},
				{
					emoji: '😤',
					textPtBR: 'Ignorar',
					textEn: 'Ignore them',
					textDe: 'Ignorieren',
					textFr: "L'ignorer",
					textEs: 'Ignorarle',
					isKind: false
				}
			]
		}
	],
	4: [
		{
			id: 'different-opinion',
			emoji: '💭',
			scenarioPtBR: 'Alguém pensa diferente de você',
			scenarioEn: 'Someone thinks differently than you',
			scenarioDe: 'Jemand denkt anders als du',
			scenarioFr: "Quelqu'un pense différemment de toi",
			scenarioEs: 'Alguien piensa diferente que tú',
			choices: [
				{
					emoji: '👂',
					textPtBR: 'Ouvir a opinião',
					textEn: 'Listen to their opinion',
					textDe: 'Ihre Meinung anhören',
					textFr: 'Écouter son opinion',
					textEs: 'Escuchar su opinión',
					isKind: true
				},
				{
					emoji: '😤',
					textPtBR: 'Dizer que está errado',
					textEn: "Say they're wrong",
					textDe: 'Sagen sie haben unrecht',
					textFr: "Dire qu'il a tort",
					textEs: 'Decir que está equivocado',
					isKind: false
				},
				{
					emoji: '🙉',
					textPtBR: 'Não deixar falar',
					textEn: "Don't let them speak",
					textDe: 'Nicht sprechen lassen',
					textFr: 'Ne pas le laisser parler',
					textEs: 'No dejarle hablar',
					isKind: false
				}
			]
		},
		{
			id: 'made-mistake',
			emoji: '😅',
			scenarioPtBR: 'Você fez algo errado',
			scenarioEn: 'You made a mistake',
			scenarioDe: 'Du hast einen Fehler gemacht',
			scenarioFr: 'Tu as fait une erreur',
			scenarioEs: 'Cometiste un error',
			choices: [
				{
					emoji: '🙏',
					textPtBR: 'Pedir desculpas',
					textEn: 'Say sorry',
					textDe: 'Sich entschuldigen',
					textFr: "S'excuser",
					textEs: 'Pedir disculpas',
					isKind: true
				},
				{
					emoji: '🤥',
					textPtBR: 'Culpar outra pessoa',
					textEn: 'Blame someone else',
					textDe: 'Jemand anderem die Schuld geben',
					textFr: "Accuser quelqu'un d'autre",
					textEs: 'Culpar a otra persona',
					isKind: false
				},
				{
					emoji: '🏃',
					textPtBR: 'Fingir que não foi você',
					textEn: "Pretend it wasn't you",
					textDe: 'So tun als wärst du es nicht gewesen',
					textFr: "Faire semblant que ce n'était pas toi",
					textEs: 'Fingir que no fuiste tú',
					isKind: false
				}
			]
		},
		{
			id: 'friend-failed',
			emoji: '📝',
			scenarioPtBR: 'Seu amigo não conseguiu fazer algo',
			scenarioEn: "Your friend couldn't do something",
			scenarioDe: 'Dein Freund konnte etwas nicht',
			scenarioFr: "Ton ami n'a pas réussi à faire quelque chose",
			scenarioEs: 'Tu amigo no pudo hacer algo',
			choices: [
				{
					emoji: '🌟',
					textPtBR: 'Encorajar a tentar de novo',
					textEn: 'Encourage them to try again',
					textDe: 'Ermutigen es nochmal zu versuchen',
					textFr: "L'encourager à réessayer",
					textEs: 'Animarle a intentarlo de nuevo',
					isKind: true
				},
				{
					emoji: '😏',
					textPtBR: 'Dizer que você consegue',
					textEn: 'Say you can do it',
					textDe: 'Sagen du kannst es',
					textFr: 'Dire que toi tu peux',
					textEs: 'Decir que tú sí puedes',
					isKind: false
				},
				{
					emoji: '🙄',
					textPtBR: 'Dizer que é fácil',
					textEn: "Say it's easy",
					textDe: 'Sagen es ist einfach',
					textFr: "Dire que c'est facile",
					textEs: 'Decir que es fácil',
					isKind: false
				}
			]
		},
		{
			id: 'sharing-credit',
			emoji: '🏆',
			scenarioPtBR: 'Você e seu amigo fizeram algo juntos',
			scenarioEn: 'You and your friend did something together',
			scenarioDe: 'Du und dein Freund habt etwas zusammen gemacht',
			scenarioFr: 'Toi et ton ami avez fait quelque chose ensemble',
			scenarioEs: 'Tú y tu amigo hicieron algo juntos',
			choices: [
				{
					emoji: '🤝',
					textPtBR: 'Dar crédito ao amigo também',
					textEn: 'Give credit to your friend too',
					textDe: 'Deinem Freund auch Anerkennung geben',
					textFr: 'Donner du crédit à ton ami aussi',
					textEs: 'Dar crédito a tu amigo también',
					isKind: true
				},
				{
					emoji: '🙋',
					textPtBR: 'Dizer que foi só você',
					textEn: 'Say it was just you',
					textDe: 'Sagen du warst es allein',
					textFr: "Dire que c'était juste toi",
					textEs: 'Decir que fuiste solo tú',
					isKind: false
				},
				{
					emoji: '🤷',
					textPtBR: 'Não mencionar o amigo',
					textEn: 'Not mention your friend',
					textDe: 'Deinen Freund nicht erwähnen',
					textFr: 'Ne pas mentionner ton ami',
					textEs: 'No mencionar a tu amigo',
					isKind: false
				}
			]
		}
	]
}

export class KindnessGenerator implements ProblemGenerator {
	readonly problemType = 'kindness-choices' as const

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const availableScenarios = kindnessScenarios[difficulty]

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
		return kindnessScenarios[difficulty].map((s) => this.makeSignature(difficulty, s.id))
	}

	private makeSignature(difficulty: DifficultyLevel, scenarioId: string): string {
		return `social-emotional:kindness-choices:d${difficulty}:${scenarioId}`
	}

	private createProblem(scenario: KindnessScenario, difficulty: DifficultyLevel): Problem {
		const age = ageService.getAge()

		// Shuffle choices but ensure kind option is included
		const shuffledChoices = shuffle(scenario.choices)

		// For younger children, only show 3 choices
		const numChoices = age <= 4 ? 3 : scenario.choices.length
		const selectedChoices = shuffledChoices.slice(0, numChoices)

		// Ensure kind option is always present
		const kindChoice = scenario.choices.find((c) => c.isKind)!
		if (!selectedChoices.some((c) => c.isKind)) {
			selectedChoices[0] = kindChoice
		}

		// Reshuffle to randomize position
		const finalChoices = shuffle(selectedChoices)

		// Create visual elements
		const elements = [
			{
				object: scenario.emoji,
				count: 1
			}
		]

		// Create answer choices using emojis with labels
		const choices: AnswerValue[] = finalChoices.map((choice) => ({
			type: 'object' as const,
			value: choice.emoji,
			label: {
				ptBR: choice.textPtBR,
				en: choice.textEn,
				de: choice.textDe,
				fr: choice.textFr,
				es: choice.textEs
			}
		}))

		// Find the kind answer
		const kindAnswer = finalChoices.find((c) => c.isKind)!

		return {
			id: crypto.randomUUID(),
			type: 'kindness-choices',
			difficulty,
			signature: this.makeSignature(difficulty, scenario.id),
			visual: {
				type: 'scenario',
				elements,
				displayText: scenario.scenarioEn
			},
			prompt: {
				ptBR: `${scenario.scenarioPtBR}. O que seria gentil fazer?`,
				en: `${scenario.scenarioEn}. What would be kind to do?`,
				de: `${scenario.scenarioDe}. Was wäre nett zu tun?`,
				fr: `${scenario.scenarioFr}. Que serait-il gentil de faire?`,
				es: `${scenario.scenarioEs}. ¿Qué sería amable hacer?`
			},
			correctAnswer: {
				type: 'object',
				value: kindAnswer.emoji,
				label: {
					ptBR: kindAnswer.textPtBR,
					en: kindAnswer.textEn,
					de: kindAnswer.textDe,
					fr: kindAnswer.textFr,
					es: kindAnswer.textEs
				}
			},
			answerChoices: choices,
			hint: {
				ptBR: `Pense no que faria a pessoa feliz. ${kindAnswer.textPtBR} seria gentil!`,
				en: `Think about what would make them happy. ${kindAnswer.textEn} would be kind!`,
				de: `Denk darüber nach, was sie glücklich machen würde. ${kindAnswer.textDe} wäre nett!`,
				fr: `Pense à ce qui les rendrait heureux. ${kindAnswer.textFr} serait gentil!`,
				es: `Piensa en qué les haría felices. ¡${kindAnswer.textEs} sería amable!`
			}
		}
	}
}
