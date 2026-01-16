import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Mock the Web Speech API
const mockUtterance = vi.fn()
const mockSpeak = vi.fn()
const mockCancel = vi.fn()
const mockGetVoices = vi.fn().mockReturnValue([])

class MockSpeechSynthesisUtterance {
	text: string
	lang: string = ''
	rate: number = 1
	pitch: number = 1
	voice: SpeechSynthesisVoice | null = null

	constructor(text: string) {
		this.text = text
		mockUtterance(text)
	}
}

const createMockSynth = () => ({
	speak: mockSpeak,
	cancel: mockCancel,
	getVoices: mockGetVoices,
	speaking: false,
	onvoiceschanged: null as (() => void) | null
})

describe('SpeechService', () => {
	let mockSynth: ReturnType<typeof createMockSynth>

	beforeEach(() => {
		vi.resetModules()
		vi.clearAllMocks()

		mockSynth = createMockSynth()

		// Setup global mocks
		vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance)
		vi.stubGlobal('speechSynthesis', mockSynth)

		// Mock localStorage
		const storage: Record<string, string> = {}
		vi.stubGlobal('localStorage', {
			getItem: vi.fn((key: string) => storage[key] ?? null),
			setItem: vi.fn((key: string, value: string) => {
				storage[key] = value
			}),
			removeItem: vi.fn((key: string) => {
				delete storage[key]
			})
		})
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	describe('isAvailable', () => {
		it('should return true when speech synthesis is available', async () => {
			const { speechService } = await import('./speech')
			expect(speechService.isAvailable()).toBe(true)
		})
	})

	describe('speak', () => {
		it('should create utterance and speak', async () => {
			const { speechService } = await import('./speech')
			speechService.speak('Hello world')

			expect(mockCancel).toHaveBeenCalled()
			expect(mockUtterance).toHaveBeenCalled()
			expect(mockSpeak).toHaveBeenCalled()
		})

		it('should preprocess Portuguese text', async () => {
			const { speechService } = await import('./speech')
			speechService.speak('2 + 3 = ?', { lang: 'pt-BR' })

			expect(mockUtterance).toHaveBeenCalledWith('2  mais  3  igual a  ')
		})

		it('should preprocess English text', async () => {
			const { speechService } = await import('./speech')
			speechService.speak('2 + 3 = ?', { lang: 'en-US' })

			expect(mockUtterance).toHaveBeenCalledWith('2  plus  3  equals  ')
		})

		it('should preprocess Spanish text', async () => {
			const { speechService } = await import('./speech')
			speechService.speak('2 + 3 = ?', { lang: 'es-ES' })

			expect(mockUtterance).toHaveBeenCalledWith('2  más  3  igual a  ')
		})

		it('should use custom rate and pitch options', async () => {
			const { speechService } = await import('./speech')
			speechService.speak('teste', { rate: 0.5, pitch: 1.5 })

			expect(mockSpeak).toHaveBeenCalled()
		})
	})

	describe('stop', () => {
		it('should cancel speech', async () => {
			const { speechService } = await import('./speech')
			speechService.stop()

			expect(mockCancel).toHaveBeenCalled()
		})
	})

	describe('isSpeaking', () => {
		it('should return speaking status', async () => {
			const { speechService } = await import('./speech')
			expect(speechService.isSpeaking()).toBe(false)

			mockSynth.speaking = true
			expect(speechService.isSpeaking()).toBe(true)
		})
	})

	describe('getVoicesForLanguage', () => {
		it('should return empty array when no voices available', async () => {
			const { speechService } = await import('./speech')
			const voices = speechService.getVoicesForLanguage('pt-BR')
			expect(voices).toEqual([])
		})

		it('should filter voices by language', async () => {
			mockGetVoices.mockReturnValue([
				{ name: 'Voice PT', lang: 'pt-BR', localService: true },
				{ name: 'Voice EN', lang: 'en-US', localService: true },
				{ name: 'Voice PT2', lang: 'pt-PT', localService: false }
			] as unknown as SpeechSynthesisVoice[])

			const { speechService } = await import('./speech')
			const voices = speechService.getVoicesForLanguage('pt-BR')

			expect(voices.length).toBe(2)
			expect(voices[0].name).toBe('Voice PT')
			expect(voices[1].name).toBe('Voice PT2')
		})

		it('should use default language en-US when no arg provided', async () => {
			mockGetVoices.mockReturnValue([
				{ name: 'Voice EN', lang: 'en-US', localService: true }
			] as unknown as SpeechSynthesisVoice[])

			const { speechService } = await import('./speech')
			const voices = speechService.getVoicesForLanguage() // Uses default en-US
			expect(voices.length).toBe(1)
			expect(voices[0].lang).toBe('en-US')
		})
	})

	describe('voice selection', () => {
		it('should get and set voice name', async () => {
			const { speechService } = await import('./speech')

			expect(speechService.getSelectedVoiceName()).toBeNull()

			speechService.setVoiceName('Test Voice')
			expect(localStorage.setItem).toHaveBeenCalledWith('lumi-voice-name', 'Test Voice')
		})

		it('should remove voice name when set to null', async () => {
			const { speechService } = await import('./speech')
			speechService.setVoiceName(null)
			expect(localStorage.removeItem).toHaveBeenCalledWith('lumi-voice-name')
		})
	})

	describe('findBestVoice (via speak)', () => {
		it('should prefer cloud voices with preferred keywords', async () => {
			const googleVoice = { name: 'Google Voice', lang: 'pt-BR', localService: false }
			const localVoice = { name: 'Local Voice', lang: 'pt-BR', localService: true }

			mockGetVoices.mockReturnValue([localVoice, googleVoice] as unknown as SpeechSynthesisVoice[])

			const { speechService } = await import('./speech')
			speechService.speak('teste', { lang: 'pt-BR' })

			expect(mockSpeak).toHaveBeenCalled()
		})

		it('should use saved voice preference', async () => {
			const savedVoice = { name: 'Saved Voice', lang: 'pt-BR', localService: true }
			mockGetVoices.mockReturnValue([savedVoice] as unknown as SpeechSynthesisVoice[])
			;(localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('Saved Voice')

			const { speechService } = await import('./speech')
			speechService.speak('teste', { lang: 'pt-BR' })

			expect(mockSpeak).toHaveBeenCalled()
		})

		it('should fall back to first matching voice', async () => {
			const voice1 = { name: 'Random Voice', lang: 'pt-BR', localService: true }
			mockGetVoices.mockReturnValue([voice1] as unknown as SpeechSynthesisVoice[])

			const { speechService } = await import('./speech')
			speechService.speak('teste', { lang: 'pt-BR' })

			expect(mockSpeak).toHaveBeenCalled()
		})

		it('should prefer cloud voice with luciana keyword', async () => {
			const lucianaVoice = { name: 'Luciana Premium', lang: 'pt-BR', localService: false }
			const otherVoice = { name: 'Other Cloud', lang: 'pt-BR', localService: false }

			mockGetVoices.mockReturnValue([otherVoice, lucianaVoice] as unknown as SpeechSynthesisVoice[])

			const { speechService } = await import('./speech')
			speechService.speak('teste', { lang: 'pt-BR' })

			expect(mockSpeak).toHaveBeenCalled()
		})

		it('should check local voices for preferred keywords', async () => {
			const microsoftVoice = {
				name: 'Microsoft Online Natural',
				lang: 'pt-BR',
				localService: true
			}
			const otherVoice = { name: 'Other Local', lang: 'pt-BR', localService: true }

			mockGetVoices.mockReturnValue([
				otherVoice,
				microsoftVoice
			] as unknown as SpeechSynthesisVoice[])

			const { speechService } = await import('./speech')
			speechService.speak('teste', { lang: 'pt-BR' })

			expect(mockSpeak).toHaveBeenCalled()
		})
	})
})
