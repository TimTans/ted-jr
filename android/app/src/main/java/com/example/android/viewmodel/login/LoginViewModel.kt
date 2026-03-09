package com.example.android.viewmodel.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.android.data.supabase
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.gotrue.providers.builtin.Email
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class LoginUiState(
    val isSignUp: Boolean = false,
    val name: String = "",
    val email: String = "",
    val password: String = "",
    val isLoggedIn: Boolean = false,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class LoginViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            val session = supabase.auth.currentSessionOrNull()
            _uiState.update { it.copy(isLoggedIn = session != null) }
        }
    }

    fun onToggleMode(isSignUp: Boolean) {
        _uiState.update {
            it.copy(isSignUp = isSignUp, errorMessage = null)
        }
    }

    fun onNameChange(value: String) {
        _uiState.update { it.copy(name = value, errorMessage = null) }
    }

    fun onEmailChange(value: String) {
        _uiState.update { it.copy(email = value, errorMessage = null) }
    }

    fun onPasswordChange(value: String) {
        _uiState.update { it.copy(password = value, errorMessage = null) }
    }

    fun onSubmit() {
        val state = _uiState.value
        if (state.email.isBlank() || state.password.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Email and password are required") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            runCatching {
                if (state.isSignUp) {
                    supabase.auth.signUpWith(Email) {
                        email = state.email
                        password = state.password
                        data = buildMap {
                            if (state.name.isNotBlank()) put("full_name", state.name)
                        }
                    }
                } else {
                    supabase.auth.signInWith(Email) {
                        email = state.email
                        password = state.password
                    }
                }
            }.onSuccess {
                _uiState.update {
                    it.copy(isLoggedIn = true, isLoading = false, errorMessage = null)
                }
            }.onFailure { e ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = e.message ?: "Authentication failed"
                    )
                }
            }
        }
    }
}
