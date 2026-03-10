import SwiftUI
import Auth

struct HomeView: View {
    @Environment(AuthController.self) private var authController

    var body: some View {
        NavigationStack {
            List {
                if let user = authController.currentUser {
                    Section {
                        Text(user.email ?? "No email")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    } header: {
                        Text("Signed in as")
                    }
                }

                NavigationLink(destination: PreferencesView()) {
                    Label("User Preferences", systemImage: "person.crop.circle")
                }

                Button(role: .destructive) {
                    Task {
                        await authController.signOut()
                    }
                } label: {
                    Label("Log Out", systemImage: "rectangle.portrait.and.arrow.right")
                }
            }
            .navigationTitle("Home")
        }
    }
}

#Preview {
    HomeView()
        .environment(AuthController())
}
