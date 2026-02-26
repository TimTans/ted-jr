package com.example.android.ui.login

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.example.android.viewmodel.login.LoginUiState
import com.example.android.viewmodel.login.LoginViewModel

private val NeighborlyBackground = Color(0xFFF7F3EC)
private val NeighborlyGreen = Color(0xFF0C6A4A)
private val NeighborlyGreenSoft = Color(0xFFE0F1E8)

@Composable
fun LoginScreen(viewModel: LoginViewModel) {
    val state = viewModel.uiState

    LoginContent(
        state = state,
        onModeChange = viewModel::onToggleMode,
        onNameChange = viewModel::onNameChange,
        onEmailChange = viewModel::onEmailChange,
        onPasswordChange = viewModel::onPasswordChange,
        onSubmit = viewModel::onSubmit
    )
}

@Composable
private fun LoginContent(
    state: LoginUiState,
    onModeChange: (Boolean) -> Unit,
    onNameChange: (String) -> Unit,
    onEmailChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onSubmit: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .windowInsetsPadding(WindowInsets.statusBars)
            .background(NeighborlyBackground)
            .padding(horizontal = 24.dp, vertical = 32.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(
                containerColor = Color.White
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 10.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 32.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(
                        text = "Neighborly",
                        style = MaterialTheme.typography.headlineSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = NeighborlyGreen
                        )
                    )

                    Text(
                        text = "Smart grocery trips, made easy.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF7C7C7C)
                    )
                }

                SingleChoiceSegmentedButtonRow(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    val items = listOf("Log In", "Sign Up")
                    val selectedIndex = if (state.isSignUp) 1 else 0

                    items.forEachIndexed { index, label ->
                        SegmentedButton(
                            shape = SegmentedButtonDefaults.itemShape(
                                index = index,
                                count = items.size
                            ),
                            onClick = { onModeChange(index == 1) },
                            selected = index == selectedIndex,
                            colors = SegmentedButtonDefaults.colors(
                                activeContainerColor = NeighborlyGreen,
                                activeContentColor = Color.White,
                                inactiveContainerColor = NeighborlyGreenSoft,
                                inactiveContentColor = NeighborlyGreen
                            )
                        ) {
                            Text(text = label)
                        }
                    }
                }

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    if (state.isSignUp) {
                        OutlinedTextField(
                            value = state.name,
                            onValueChange = onNameChange,
                            modifier = Modifier.fillMaxWidth(),
                            label = { Text("Name") },
                            singleLine = true
                        )
                    }

                    OutlinedTextField(
                        value = state.email,
                        onValueChange = onEmailChange,
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("Email") },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
                    )

                    OutlinedTextField(
                        value = state.password,
                        onValueChange = onPasswordChange,
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("Password") },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation()
                    )
                }

                Button(
                    onClick = onSubmit,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = NeighborlyGreen,
                        contentColor = Color.White
                    )
                ) {
                    Text(text = if (state.isSignUp) "Create Account" else "Log In")
                }

                Spacer(modifier = Modifier.height(4.dp))
            }
        }
    }
}

