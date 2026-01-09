import AVFoundation

/// Service for text-to-speech functionality using iOS default voices
@MainActor
final class SpeechService: NSObject {
    static let shared = SpeechService()

    private let synthesizer = AVSpeechSynthesizer()
    private let voice: AVSpeechSynthesisVoice?

    private override init() {
        self.voice = AVSpeechSynthesisVoice(language: "pt-BR")
        super.init()
    }

    /// Speaks the given text aloud
    /// - Parameter text: The text to speak
    func speak(_ text: String) {
        // Stop any ongoing speech
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }

        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = voice
        utterance.rate = 0.45  // Slower rate for children
        utterance.pitchMultiplier = 1.1  // Slightly higher pitch for friendliness

        synthesizer.speak(utterance)
    }

    /// Stops any ongoing speech
    func stop() {
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
    }

    /// Speaks success feedback
    func speakSuccess() {
        speak("Isso mesmo!")
    }

    /// Speaks try again feedback
    func speakTryAgain() {
        speak("Tente de novo!")
    }
}
