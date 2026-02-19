import SwiftUI

struct HomeView: View {
    @Binding var isLoggedIn: Bool

    var body: some View {
        NavigationStack {
            List {
                NavigationLink(destination: PreferencesView()) {
                    Label("User Preferences", systemImage: "person.crop.circle")
                }

                Button(role: .destructive) {
                    isLoggedIn = false
                } label: {
                    Label("Log Out", systemImage: "rectangle.portrait.and.arrow.right")
                }
            }
            .navigationTitle("Home")
        }
    }
}

#Preview {
    HomeView(isLoggedIn: .constant(true))
}
