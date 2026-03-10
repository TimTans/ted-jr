import Foundation
import Observation
import Supabase

@Observable
final class AuthController {
    var session: Session?
    var isLoading = true
    var errorMessage: String?

    var isAuthenticated: Bool { session != nil }
    var currentUser: User? { session?.user }

    func listenForAuthChanges() async {
        for await (event, session) in supabase.auth.authStateChanges {
            switch event {
            case .initialSession:
                self.session = session
                self.isLoading = false
            case .signedIn:
                self.session = session
                self.errorMessage = nil
            case .signedOut:
                self.session = nil
            case .tokenRefreshed, .userUpdated:
                self.session = session
            default:
                break
            }
        }
    }

    func signIn(email: String, password: String) async {
        errorMessage = nil
        do {
            let session = try await supabase.auth.signIn(
                email: email,
                password: password
            )
            self.session = session
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func signUp(email: String, password: String, firstName: String, lastName: String) async -> Bool {
        errorMessage = nil
        do {
            let response = try await supabase.auth.signUp(
                email: email,
                password: password,
                data: [
                    "first_name": .string(firstName),
                    "last_name": .string(lastName),
                ]
            )
            if response.session != nil {
                return true
            } else {
                return false
            }
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }

    func signOut() async {
        do {
            try await supabase.auth.signOut()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
