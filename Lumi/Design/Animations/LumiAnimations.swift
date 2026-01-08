import SwiftUI

/// Lumi's animation system - gentle, calm animations
enum LumiAnimations {
    // MARK: - Timing

    /// Quick interaction feedback
    static let quick = Animation.easeInOut(duration: 0.15)

    /// Standard transitions
    static let standard = Animation.easeInOut(duration: 0.3)

    /// Gentle entrance animations
    static let gentle = Animation.easeOut(duration: 0.5)

    /// Celebration animations
    static let celebration = Animation.spring(response: 0.6, dampingFraction: 0.7)

    /// Bouncy feedback
    static let bouncy = Animation.spring(response: 0.4, dampingFraction: 0.6)

    // MARK: - View Modifiers

    /// Fade in from below
    static func slideUp<Content: View>(_ content: Content) -> some View {
        content
            .transition(.move(edge: .bottom).combined(with: .opacity))
    }

    /// Scale and fade in
    static func scaleIn<Content: View>(_ content: Content) -> some View {
        content
            .transition(.scale.combined(with: .opacity))
    }
}

// MARK: - Animated Appearance Modifier

struct AnimatedAppearance: ViewModifier {
    @State private var hasAppeared = false
    let delay: Double

    func body(content: Content) -> some View {
        content
            .opacity(hasAppeared ? 1 : 0)
            .scaleEffect(hasAppeared ? 1 : 0.8)
            .onAppear {
                withAnimation(LumiAnimations.gentle.delay(delay)) {
                    hasAppeared = true
                }
            }
    }
}

extension View {
    /// Animates the view's appearance with a fade and scale effect
    func animateAppearance(delay: Double = 0) -> some View {
        modifier(AnimatedAppearance(delay: delay))
    }
}

// MARK: - Pulse Animation

struct PulseAnimation: ViewModifier {
    @State private var isPulsing = false

    func body(content: Content) -> some View {
        content
            .scaleEffect(isPulsing ? 1.05 : 1.0)
            .onAppear {
                withAnimation(
                    Animation
                        .easeInOut(duration: 1.0)
                        .repeatForever(autoreverses: true)
                ) {
                    isPulsing = true
                }
            }
    }
}

extension View {
    /// Adds a gentle pulsing effect
    func pulse() -> some View {
        modifier(PulseAnimation())
    }
}

// MARK: - Shake Animation

struct ShakeAnimation: ViewModifier {
    @Binding var trigger: Bool

    func body(content: Content) -> some View {
        content
            .offset(x: trigger ? -5 : 0)
            .animation(
                trigger ?
                    Animation.easeInOut(duration: 0.1).repeatCount(3, autoreverses: true) :
                    .default,
                value: trigger
            )
            .onChange(of: trigger) { _, newValue in
                if newValue {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        trigger = false
                    }
                }
            }
    }
}

extension View {
    /// Shakes the view horizontally when triggered
    func shake(trigger: Binding<Bool>) -> some View {
        modifier(ShakeAnimation(trigger: trigger))
    }
}

// MARK: - Celebration Confetti (Simple Version)

struct CelebrationView: View {
    @State private var particles: [CelebrationParticle] = []

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                ForEach(particles) { particle in
                    Text(particle.emoji)
                        .font(.system(size: particle.size))
                        .position(particle.position)
                        .opacity(particle.opacity)
                }
            }
            .onAppear {
                createParticles(in: geometry.size)
                animateParticles()
            }
        }
        .allowsHitTesting(false)
    }

    private func createParticles(in size: CGSize) {
        let emojis = ["✨", "🌟", "⭐", "💫"]
        particles = (0..<15).map { _ in
            CelebrationParticle(
                emoji: emojis.randomElement() ?? "✨",
                position: CGPoint(
                    x: CGFloat.random(in: 0...size.width),
                    y: size.height + 50
                ),
                size: CGFloat.random(in: 20...40),
                opacity: 1.0
            )
        }
    }

    private func animateParticles() {
        for i in particles.indices {
            let delay = Double(i) * 0.05
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                withAnimation(.easeOut(duration: 1.5)) {
                    particles[i].position.y -= CGFloat.random(in: 300...500)
                    particles[i].position.x += CGFloat.random(in: -50...50)
                }
                withAnimation(.easeIn(duration: 1.0).delay(0.5)) {
                    particles[i].opacity = 0
                }
            }
        }
    }
}

struct CelebrationParticle: Identifiable {
    let id = UUID()
    let emoji: String
    var position: CGPoint
    let size: CGFloat
    var opacity: Double
}

#Preview("Animations") {
    VStack(spacing: 20) {
        Text("Hello")
            .font(.title)
            .animateAppearance(delay: 0.2)

        Text("Pulsing")
            .font(.title)
            .pulse()

        CelebrationView()
            .frame(height: 200)
    }
}
