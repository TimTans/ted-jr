package com.example.android.viewmodel.login

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

data class LoginUiState(
    val isSignUp: Boolean = false,
    val name: String = "",
    val email: String = "",
    val password: String = "",
    val isLoggedIn: Boolean = false
)

class LoginViewModel : ViewModel() {
    var uiState by mutableStateOf(LoginUiState())
        private set

    fun onToggleMode(isSignUp: Boolean) {
        uiState = uiState.copy(isSignUp = isSignUp)
    }

    fun onNameChange(value: String) {
        uiState = uiState.copy(name = value)
    }

    fun onEmailChange(value: String) {
        uiState = uiState.copy(email = value)
    }

    fun onPasswordChange(value: String) {
        uiState = uiState.copy(password = value)
    }

    fun onSubmit() {
        // In this prototype, any input logs the user in
        uiState = uiState.copy(isLoggedIn = true)
    }
}

