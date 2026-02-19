import SwiftUI

struct LoginView: View {
    @Binding var isLoggedIn: Bool

    @State private var isSignUp = false
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            Text("Neighborly")
                .font(.largeTitle)
                .fontWeight(.bold)

            // Toggle between Login and Sign Up
            Picker("Mode", selection: $isSignUp) {
                Text("Log In").tag(false)
                Text("Sign Up").tag(true)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)

            VStack(spacing: 16) {
                if isSignUp {
                    TextField("Name", text: $name)
                        .textFieldStyle(.roundedBorder)
                        .autocorrectionDisabled()
                }

                TextField("Email", text: $email)
                    .textFieldStyle(.roundedBorder)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .keyboardType(.emailAddress)

                SecureField("Password", text: $password)
                    .textFieldStyle(.roundedBorder)
            }
            .padding(.horizontal)

            Button(action: {
                // Hardcoded: any input logs the user in
                isLoggedIn = true
            }) {
                Text(isSignUp ? "Create Account" : "Log In")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
            .padding(.horizontal)

            Spacer()
        }
    }
}

#Preview {
    LoginView(isLoggedIn: .constant(false))
}
