/**
 * Speech Service
 *
 * Text-to-speech for problem prompts using the Web Speech API.
 * Configured for child-friendly speech (slower rate, slightly higher pitch).
 */

export interface SpeechOptions {
	lang?: 'pt-BR' | 'en-US';
	rate?: number;
	pitch?: number;
}

const DEFAULT_OPTIONS: Required<SpeechOptions> = {
	lang: 'pt-BR',
	rate: 0.8,   // Slower for children (0.1 to 10, 1 is normal)
	pitch: 1.1,  // Slightly higher for friendliness (0 to 2)
};

class SpeechService {
	private synth: SpeechSynthesis | null = null;
	private currentUtterance: SpeechSynthesisUtterance | null = null;

	constructor() {
		if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
			this.synth = window.speechSynthesis;
		}
	}

	/**
	 * Check if speech synthesis is available
	 */
	isAvailable(): boolean {
		return this.synth !== null;
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
				.replace(/\?/g, '');
		} else {
			return text
				.replace(/\+/g, ' plus ')
				.replace(/-/g, ' minus ')
				.replace(/=/g, ' equals ')
				.replace(/\?/g, '');
		}
	}

	/**
	 * Speak the given text
	 */
	speak(text: string, options: SpeechOptions = {}): void {
		if (!this.synth) {
			console.warn('Speech synthesis not available');
			return;
		}

		// Cancel any ongoing speech
		this.stop();

		const opts = { ...DEFAULT_OPTIONS, ...options };
		const processedText = this.preprocessText(text, opts.lang);

		const utterance = new SpeechSynthesisUtterance(processedText);
		utterance.lang = opts.lang;
		utterance.rate = opts.rate;
		utterance.pitch = opts.pitch;

		// Try to find a voice for the language
		const voices = this.synth.getVoices();
		const voice = voices.find((v) => v.lang.startsWith(opts.lang.split('-')[0]));
		if (voice) {
			utterance.voice = voice;
		}

		this.currentUtterance = utterance;
		this.synth.speak(utterance);
	}

	/**
	 * Stop any ongoing speech
	 */
	stop(): void {
		if (this.synth) {
			this.synth.cancel();
			this.currentUtterance = null;
		}
	}

	/**
	 * Check if currently speaking
	 */
	isSpeaking(): boolean {
		return this.synth?.speaking ?? false;
	}
}

// Singleton instance
export const speechService = new SpeechService();
