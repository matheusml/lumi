import AVFoundation

/// Service for text-to-speech functionality using iOS default voices
@MainActor
final class SpeechService: NSObject {
    static let shared = SpeechService()

    private let synthesizer = AVSpeechSynthesizer()
    private let voice: AVSpeechSynthesisVoice?
    private let languageCode = "pt-BR"

    /// Math operator words by language for speech synthesis
    private let mathOperatorWords: [String: [String: String]] = [
        "pt-BR": [
            " - ": " menos ",
            " + ": " mais ",
            " = ?": ", igual a?"
        ],
        "en": [
            " - ": " minus ",
            " + ": " plus ",
            " = ?": ", equals?"
        ]
    ]

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

        let processedText = preprocessForSpeech(text)

        let utterance = AVSpeechUtterance(string: processedText)
        utterance.voice = voice
        utterance.rate = 0.45  // Slower rate for children
        utterance.pitchMultiplier = 1.1  // Slightly higher pitch for friendliness

        synthesizer.speak(utterance)
    }

    /// Preprocesses text for better speech synthesis of math expressions
    private func preprocessForSpeech(_ text: String) -> String {
        guard let operators = mathOperatorWords[languageCode] else {
            return text
        }

        var result = text
        for (symbol, word) in operators {
            result = result.replacingOccurrences(of: symbol, with: word)
        }
        return result
    }

    /// Stops any ongoing speech
    func stop() {
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
    }

    /// Speaks success feedback
    func speakSuccess() {
        speak("Muito bem!")
    }

    /// Speaks try again feedback
    func speakTryAgain() {
        speak("Tente de novo!")
    }
}
