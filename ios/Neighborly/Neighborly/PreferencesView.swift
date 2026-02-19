import SwiftUI

struct PreferencesView: View {
    var body: some View {
        Text("Prefs")
            .foregroundColor(.secondary)
            .navigationTitle("User Preferences")
    }
}

#Preview {
    NavigationStack {
        PreferencesView()
    }
}
