/**
 * Emotion Recognition Generator
 *
 * Generates "How does this person feel?" problems.
 * Shows an emoji face and asks the child to identify the emotion.
 *
 * Signature format: social-emotional:emotion-recognition:d{difficulty}:{emotionId}
 */

import type { Problem, DifficultyLevel, AnswerValue } from '$lib/types'
import type { ProblemGenerator, GeneratorResult } from '../generator'
import { shuffle } from '../visual-objects'
import { ageService } from '$lib/services'

/** Emotion definition */
interface Emotion {
	id: string
	emoji: string
	namePtBR: string
	nameEn: string
	nameDe: string
	nameFr: string
	nameEs: string
}

/**
 * Emotions organized by difficulty
 * D1: Basic emotions (happy, sad)
 * D2: Add angry, scared
 * D3: Add surprised, tired
 * D4: Add all emotions including more nuanced ones
 */
const emotions: Record<DifficultyLevel, Emotion[]> = {
	1: [
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
		}
	],
	2: [
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
		}
	],
	3: [
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
		}
	],
	4: [
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
}

export class EmotionRecognitionGenerator implements ProblemGenerator {
	readonly problemType = 'emotion-recognition' as const

	generate(difficulty: DifficultyLevel, excluding: Set<string>): GeneratorResult | null {
		const availableEmotions = emotions[difficulty]

		for (const emotion of shuffle(availableEmotions)) {
			const signature = this.makeSignature(difficulty, emotion.id)

			if (!excluding.has(signature)) {
				const problem = this.createProblem(emotion, difficulty)
				return { problem, signature }
			}
		}

		return null
	}

	allPossibleSignatures(difficulty: DifficultyLevel): string[] {
		return emotions[difficulty].map((e) => this.makeSignature(difficulty, e.id))
	}

	private makeSignature(difficulty: DifficultyLevel, emotionId: string): string {
		return `social-emotional:emotion-recognition:d${difficulty}:${emotionId}`
	}

	private createProblem(targetEmotion: Emotion, difficulty: DifficultyLevel): Problem {
		const age = ageService.getAge()
		const availableEmotions = emotions[difficulty]

		// Fewer choices for younger children
		const numChoices = age <= 4 ? 3 : 4

		// Get distractor emotions (excluding the target)
		const distractors = shuffle(availableEmotions.filter((e) => e.id !== targetEmotion.id)).slice(
			0,
			numChoices - 1
		)

		// Combine and shuffle all choices
		const allChoices = shuffle([targetEmotion, ...distractors])

		// Create visual elements (just the target emotion face)
		const elements = [
			{
				object: targetEmotion.emoji,
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
			type: 'emotion-recognition',
			difficulty,
			signature: this.makeSignature(difficulty, targetEmotion.id),
			visual: {
				type: 'emotion',
				elements
			},
			prompt: {
				ptBR: 'Como essa pessoa está se sentindo?',
				en: 'How does this person feel?',
				de: 'Wie fühlt sich diese Person?',
				fr: 'Comment se sent cette personne?',
				es: '¿Cómo se siente esta persona?'
			},
			correctAnswer: { type: 'object', value: targetEmotion.emoji },
			answerChoices: choices,
			hint: {
				ptBR: `Olhe para o rosto. Essa pessoa está ${targetEmotion.namePtBR}.`,
				en: `Look at the face. This person is ${targetEmotion.nameEn}.`,
				de: `Schau dir das Gesicht an. Diese Person ist ${targetEmotion.nameDe}.`,
				fr: `Regarde le visage. Cette personne est ${targetEmotion.nameFr}.`,
				es: `Mira la cara. Esta persona está ${targetEmotion.nameEs}.`
			}
		}
	}
}
