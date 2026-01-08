import SwiftUI
import SwiftData

@main
struct LumiApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [
            Child.self,
            Session.self,
            DailyAdventureCount.self
        ])
    }
}
