import SwiftUI

@main
struct NeighborlyApp: App {
    @State private var authController = AuthController()

    var body: some Scene {
        WindowGroup {
            Group {
                if authController.isLoading {
                    ProgressView("Loading...")
                } else if authController.isAuthenticated {
                    HomeView()
                } else {
                    LoginView()
                }
            }
            .environment(authController)
            .task {
                await authController.listenForAuthChanges()
            }
        }
    }
}
