package com.example.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import com.example.android.ui.home.HomeScreen
import com.example.android.ui.login.LoginScreen
import com.example.android.viewmodel.home.HomeViewModel
import com.example.android.viewmodel.login.LoginViewModel

class MainActivity : ComponentActivity() {
    private val loginViewModel: LoginViewModel by viewModels()
    private val homeViewModel: HomeViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface {
                    val loginState = loginViewModel.uiState
                    if (loginState.isLoggedIn) {
                        HomeScreen(viewModel = homeViewModel)
                    } else {
                        LoginScreen(viewModel = loginViewModel)
                    }
                }
            }
        }
    }
}

