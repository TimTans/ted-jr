import SwiftUI

struct LoginView: View {
    @Environment(AuthController.self) private var authController

    @State private var isSignUp = false
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var isLoading = false
    @State private var showConfirmationAlert = false

    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            Text("Neighborly")
                .font(.largeTitle)
                .fontWeight(.bold)

            Picker("Mode", selection: $isSignUp) {
                Text("Log In").tag(false)
                Text("Sign Up").tag(true)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)

            VStack(spacing: 16) {
                if isSignUp {
                    TextField("First Name", text: $firstName)
                        .textFieldStyle(.roundedBorder)
                        .textContentType(.givenName)
                        .autocorrectionDisabled()

                    TextField("Last Name", text: $lastName)
                        .textFieldStyle(.roundedBorder)
                        .textContentType(.familyName)
                        .autocorrectionDisabled()
                }

                TextField("Email", text: $email)
                    .textFieldStyle(.roundedBorder)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .keyboardType(.emailAddress)
                    .textContentType(.emailAddress)

                SecureField("Password", text: $password)
                    .textFieldStyle(.roundedBorder)
                    .textContentType(isSignUp ? .newPassword : .password)

                if isSignUp {
                    SecureField("Confirm Password", text: $confirmPassword)
                        .textFieldStyle(.roundedBorder)
                        .textContentType(.newPassword)
                }
            }
            .padding(.horizontal)

            if let error = authController.errorMessage {
                Text(error)
                    .foregroundStyle(.red)
                    .font(.caption)
                    .padding(.horizontal)
            }

            Button(action: submit) {
                Group {
                    if isLoading {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Text(isSignUp ? "Create Account" : "Log In")
                    }
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(isFormValid ? Color.blue : Color.gray)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
            .disabled(!isFormValid || isLoading)
            .padding(.horizontal)

            Spacer()
        }
        .alert("Check Your Email", isPresented: $showConfirmationAlert) {
            Button("OK") {
                isSignUp = false
                clearForm()
            }
        } message: {
            Text("We sent a confirmation link to \(email). Please verify your email before signing in.")
        }
    }

    private var isFormValid: Bool {
        let hasEmail = !email.isEmpty
        let hasPassword = !password.isEmpty
        if isSignUp {
            return hasEmail && hasPassword
                && !firstName.isEmpty
                && password == confirmPassword
                && password.count >= 6
        }
        return hasEmail && hasPassword
    }

    private func submit() {
        isLoading = true
        Task {
            defer { isLoading = false }
            if isSignUp {
                let signedIn = await authController.signUp(
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName
                )
                if !signedIn && authController.errorMessage == nil {
                    showConfirmationAlert = true
                }
            } else {
                await authController.signIn(email: email, password: password)
            }
        }
    }

    private func clearForm() {
        firstName = ""
        lastName = ""
        email = ""
        password = ""
        confirmPassword = ""
    }
}

#Preview {
    LoginView()
        .environment(AuthController())
}
