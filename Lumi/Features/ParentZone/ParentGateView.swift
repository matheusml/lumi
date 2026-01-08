import SwiftUI

/// A gate that requires holding 3 corners simultaneously for 2 seconds
/// This is designed to be too complex for young children to accidentally bypass
struct ParentGateView: View {
    @Binding var isPresented: Bool
    let onSuccess: () -> Void

    @State private var corner1Active = false
    @State private var corner2Active = false
    @State private var corner3Active = false
    @State private var holdProgress: Double = 0
    @State private var timer: Timer?

    private var allCornersHeld: Bool {
        corner1Active && corner2Active && corner3Active
    }

    var body: some View {
        ZStack {
            LumiColors.background
                .ignoresSafeArea()

            VStack {
                // Top corners
                HStack {
                    cornerButton(isActive: $corner1Active, position: .topLeading)
                    Spacer()
                    cornerButton(isActive: $corner2Active, position: .topTrailing)
                }

                Spacer()

                // Instructions
                VStack(spacing: LumiSpacing.lg) {
                    Image(systemName: "lock.fill")
                        .font(.system(size: 50))
                        .foregroundStyle(LumiColors.textSecondary)

                    Text("Área dos Pais")
                        .font(LumiTypography.headingLarge)
                        .foregroundStyle(LumiColors.textPrimary)

                    Text("Segure os 3 cantos marcados por 2 segundos")
                        .font(LumiTypography.bodyMedium)
                        .foregroundStyle(LumiColors.textSecondary)
                        .multilineTextAlignment(.center)

                    // Progress indicator
                    if allCornersHeld {
                        ProgressView(value: holdProgress)
                            .progressViewStyle(.linear)
                            .tint(LumiColors.success)
                            .frame(width: 200)
                    }
                }
                .padding(LumiSpacing.xl)

                Spacer()

                // Bottom corner
                HStack {
                    cornerButton(isActive: $corner3Active, position: .bottomLeading)
                    Spacer()

                    // Cancel button
                    Button("Cancelar") {
                        isPresented = false
                    }
                    .font(LumiTypography.bodyMedium)
                    .foregroundStyle(LumiColors.textSecondary)
                    .padding()
                }
            }
            .padding(LumiSpacing.md)
        }
        .onChange(of: allCornersHeld) { _, newValue in
            if newValue {
                startHoldTimer()
            } else {
                stopHoldTimer()
            }
        }
    }

    @ViewBuilder
    private func cornerButton(isActive: Binding<Bool>, position: Alignment) -> some View {
        Circle()
            .fill(isActive.wrappedValue ? LumiColors.success : LumiColors.secondary.opacity(0.3))
            .frame(width: 60, height: 60)
            .overlay(
                Circle()
                    .stroke(isActive.wrappedValue ? LumiColors.success : LumiColors.secondary, lineWidth: 3)
            )
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in
                        isActive.wrappedValue = true
                    }
                    .onEnded { _ in
                        isActive.wrappedValue = false
                    }
            )
    }

    private func startHoldTimer() {
        holdProgress = 0
        timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { _ in
            if allCornersHeld {
                holdProgress += 0.025 // 2 seconds total (0.05s * 40 = 2s)
                if holdProgress >= 1.0 {
                    stopHoldTimer()
                    isPresented = false
                    onSuccess()
                }
            } else {
                stopHoldTimer()
            }
        }
    }

    private func stopHoldTimer() {
        timer?.invalidate()
        timer = nil
        holdProgress = 0
    }
}

#Preview {
    ParentGateView(isPresented: .constant(true)) {
        print("Success!")
    }
}
