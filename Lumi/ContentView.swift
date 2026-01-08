import SwiftUI

struct ContentView: View {
    @State private var navigationPath = NavigationPath()

    var body: some View {
        NavigationStack(path: $navigationPath) {
            HomeView(navigationPath: $navigationPath)
                .navigationDestination(for: AppDestination.self) { destination in
                    switch destination {
                    case .adventure:
                        AdventureView(navigationPath: $navigationPath)
                    case .parentZone:
                        ParentDashboardView()
                    }
                }
        }
    }
}

enum AppDestination: Hashable {
    case adventure
    case parentZone
}

#Preview {
    ContentView()
}
