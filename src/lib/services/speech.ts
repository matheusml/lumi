/**
 * Speech Service
 *
 * Text-to-speech for problem prompts using the Web Speech API.
 * Configured for child-friendly speech (slower rate, slightly higher pitch).
 */

export interface SpeechOptions {
	lang?: 'pt-BR' | 'en-US' | 'de-DE' | 'fr-FR'
	rate?: number
	pitch?: number
}

export interface VoiceInfo {
	name: string
	lang: string
	isCloud: boolean
}

const DEFAULT_OPTIONS: Required<SpeechOptions> = {
	lang: 'pt-BR',
	rate: 0.8, // Slower for children (0.1 to 10, 1 is normal)
	pitch: 1.1 // Slightly higher for friendliness (0 to 2)
}

const VOICE_STORAGE_KEY = 'lumi-voice-name'

// Known high-quality voice names for Portuguese
const PREFERRED_VOICE_KEYWORDS = ['google', 'luciana', 'microsoft online', 'natural']

class SpeechService {
	private synth: SpeechSynthesis | null = null
	private currentUtterance: SpeechSynthesisUtterance | null = null
	private voicesLoaded = false

	constructor() {
		if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
			this.synth = window.speechSynthesis
			// Voices may load asynchronously
			this.synth.onvoiceschanged = () => {
				this.voicesLoaded = true
			}
			// Try to load voices immediately (works in some browsers)
			if (this.synth.getVoices().length > 0) {
				this.voicesLoaded = true
			}
		}
	}

	/**
	 * Check if speech synthesis is available
	 */
	isAvailable(): boolean {
		return this.synth !== null
	}

	/**
	 * Preprocess text for better pronunciation
	 * - Converts math operators to words
	 */
	private preprocessText(text: string, lang: string): string {
		if (lang.startsWith('pt')) {
			return text
				.replace(/\+/g, ' mais ')
				.replace(/-/g, ' menos ')
				.replace(/=/g, ' igual a ')
				.replace(/\?/g, '')
		} else if (lang.startsWith('de')) {
			return text
				.replace(/\+/g, ' plus ')
				.replace(/-/g, ' minus ')
				.replace(/=/g, ' gleich ')
				.replace(/\?/g, '')
		} else if (lang.startsWith('fr')) {
			return text
				.replace(/\+/g, ' plus ')
				.replace(/-/g, ' moins ')
				.replace(/=/g, ' égale ')
				.replace(/\?/g, '')
		} else {
			return text
				.replace(/\+/g, ' plus ')
				.replace(/-/g, ' minus ')
				.replace(/=/g, ' equals ')
				.replace(/\?/g, '')
		}
	}

	/**
	 * Get all available voices for a language
	 */
	getVoicesForLanguage(lang: string = 'pt-BR'): VoiceInfo[] {
		if (!this.synth) return []

		const langPrefix = lang.split('-')[0]
		const voices = this.synth.getVoices()

		return voices
			.filter((v) => v.lang.startsWith(langPrefix))
			.map((v) => ({
				name: v.name,
				lang: v.lang,
				isCloud: !v.localService
			}))
	}

	/**
	 * Get the currently selected voice name
	 */
	getSelectedVoiceName(): string | null {
		if (typeof window === 'undefined') return null
		return localStorage.getItem(VOICE_STORAGE_KEY)
	}

	/**
	 * Set the preferred voice by name
	 */
	setVoiceName(name: string | null): void {
		if (typeof window === 'undefined') return
		if (name) {
			localStorage.setItem(VOICE_STORAGE_KEY, name)
		} else {
			localStorage.removeItem(VOICE_STORAGE_KEY)
		}
	}

	/**
	 * Find the best voice for a language
	 * Priority: 1) Saved preference, 2) Cloud/preferred voices, 3) Any matching voice
	 */
	private findBestVoice(lang: string): SpeechSynthesisVoice | null {
		if (!this.synth) return null

		const voices = this.synth.getVoices()
		const langPrefix = lang.split('-')[0]
		const matchingVoices = voices.filter((v) => v.lang.startsWith(langPrefix))

		if (matchingVoices.length === 0) return null

		// 1. Check for saved preference
		const savedName = this.getSelectedVoiceName()
		if (savedName) {
			const savedVoice = matchingVoices.find((v) => v.name === savedName)
			if (savedVoice) return savedVoice
		}

		// 2. Prefer cloud-based voices (usually higher quality)
		const cloudVoices = matchingVoices.filter((v) => !v.localService)
		if (cloudVoices.length > 0) {
			// Check for known high-quality voices first
			for (const keyword of PREFERRED_VOICE_KEYWORDS) {
				const preferred = cloudVoices.find((v) => v.name.toLowerCase().includes(keyword))
				if (preferred) return preferred
			}
			return cloudVoices[0]
		}

		// 3. Check local voices for known high-quality ones
		for (const keyword of PREFERRED_VOICE_KEYWORDS) {
			const preferred = matchingVoices.find((v) => v.name.toLowerCase().includes(keyword))
			if (preferred) return preferred
		}

		// 4. Fall back to first matching voice
		return matchingVoices[0]
	}

	/**
	 * Speak the given text
	 */
	speak(text: string, options: SpeechOptions = {}): void {
		if (!this.synth) {
			console.warn('Speech synthesis not available')
			return
		}

		// Cancel any ongoing speech
		this.stop()

		const opts = { ...DEFAULT_OPTIONS, ...options }
		const processedText = this.preprocessText(text, opts.lang)

		const utterance = new SpeechSynthesisUtterance(processedText)
		utterance.lang = opts.lang
		utterance.rate = opts.rate
		utterance.pitch = opts.pitch

		// Find the best available voice
		const voice = this.findBestVoice(opts.lang)
		if (voice) {
			utterance.voice = voice
		}

		this.currentUtterance = utterance
		this.synth.speak(utterance)
	}

	/**
	 * Stop any ongoing speech
	 */
	stop(): void {
		if (this.synth) {
			this.synth.cancel()
			this.currentUtterance = null
		}
	}

	/**
	 * Check if currently speaking
	 */
	isSpeaking(): boolean {
		return this.synth?.speaking ?? false
	}
}

// Singleton instance
export const speechService = new SpeechService()
