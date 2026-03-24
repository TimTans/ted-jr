package com.example.android.ui.preferences

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.DropdownMenu
import androidx.compose.material.DropdownMenuItem
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.android.viewmodel.shopper.OptimizationPriority
import com.example.android.viewmodel.shopper.PreferenceState
import com.example.android.viewmodel.shopper.ShopperViewModel
import com.example.android.viewmodel.shopper.TransportMode

private val NeighborlyBackground = Color(0xFFF7F3EC)
private val NeighborlyGreen = Color(0xFF0C6A4A)
private val NeighborlyGreenSoft = Color(0xFFE0F1E8)
private val NeighborlyBlue = Color(0xFF1E63C6)
private val NeighborlyBlueSoft = Color(0xFFE7F0FF)

@Composable
fun PreferencesScreen(
    shopperViewModel: ShopperViewModel,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val prefs = shopperViewModel.uiState.preferences

    Surface(modifier = modifier.fillMaxSize(), color = NeighborlyBackground) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(onClick = onBack)
                    .padding(vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(
                    Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = NeighborlyBlue
                )
                Text("Back", style = MaterialTheme.typography.bodyLarge, color = NeighborlyBlue)
            }

            Text(
                text = "Your Preferences",
                style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
                modifier = Modifier.fillMaxWidth(),
                textAlign = TextAlign.Center
            )

            PreferenceCard(title = "Prioritize") {
                PriorityDropdown(
                    selectedPriority = prefs.priority,
                    onSelect = shopperViewModel::updatePriority
                )
            }

            PreferenceCard(title = "Modes of Transportation") {
                TransportationModeRow(
                    prefs = prefs,
                    onToggleMode = shopperViewModel::toggleTransportMode
                )
            }

            PreferenceCard(title = "Trip Limits") {
                Text("Max Travel Distance: ${prefs.maxTravelDistanceMiles.toInt()} miles")
                Slider(
                    value = prefs.maxTravelDistanceMiles,
                    onValueChange = shopperViewModel::updateMaxTravelDistance,
                    valueRange = 1f..10f,
                    steps = 8,
                    colors = SliderDefaults.colors(
                        thumbColor = NeighborlyBlue,
                        activeTrackColor = NeighborlyBlue,
                        inactiveTrackColor = NeighborlyBlueSoft
                    )
                )

                Text("Max Stops: ${prefs.maxStops.toInt()}")
                Slider(
                    value = prefs.maxStops,
                    onValueChange = shopperViewModel::updateMaxStops,
                    valueRange = 1f..10f,
                    steps = 8,
                    colors = SliderDefaults.colors(
                        thumbColor = NeighborlyGreen,
                        activeTrackColor = NeighborlyGreen,
                        inactiveTrackColor = NeighborlyGreenSoft
                    )
                )
            }

            PreferenceCard(title = "Wellness") {
                ToggleRow(
                    title = "Enable wellness filters",
                    checked = prefs.wellnessEnabled,
                    onToggle = { shopperViewModel.updateWellnessEnabled(!prefs.wellnessEnabled) }
                )

                if (prefs.wellnessEnabled) {
                    WellnessField(
                        title = "Cholesterol limit",
                        value = prefs.cholesterolLimit,
                        placeholder = "100mg",
                        onValueChange = shopperViewModel::updateCholesterolLimit
                    )
                    WellnessField(
                        title = "Sodium limit",
                        value = prefs.sodiumLimit,
                        placeholder = "1000 mg/Day",
                        onValueChange = shopperViewModel::updateSodiumLimit
                    )
                    WellnessField(
                        title = "Sugar limit",
                        value = prefs.sugarLimit,
                        placeholder = "20g/day",
                        onValueChange = shopperViewModel::updateSugarLimit
                    )
                }
            }

            PreferenceCard(title = "Dietary Filters") {
                DietaryToggleSection(prefs, shopperViewModel)
            }

            PreferenceCard(title = "Avoid") {
                ToggleRow("Dairy", prefs.avoidDairy, shopperViewModel::toggleAvoidDairy)
                ToggleRow("Peanuts", prefs.avoidPeanuts, shopperViewModel::toggleAvoidPeanuts)
                ToggleRow("Shellfish", prefs.avoidShellfish, shopperViewModel::toggleAvoidShellfish)
                ToggleRow("Wheat", prefs.avoidWheat, shopperViewModel::toggleAvoidWheat)
            }
        }
    }
}

@Composable
private fun PreferenceCard(title: String, content: @Composable ColumnScope.() -> Unit) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            content = {
                Text(
                    title,
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = NeighborlyGreen
                )
                content()
            }
        )
    }
}

@Composable
private fun PriorityDropdown(
    selectedPriority: OptimizationPriority,
    onSelect: (OptimizationPriority) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFF8F8F8), RoundedCornerShape(14.dp))
                .clickable { expanded = true }
                .padding(horizontal = 14.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(selectedPriority.label, style = MaterialTheme.typography.bodyLarge)
            Icon(
                Icons.Filled.ArrowDropDown,
                contentDescription = "Open prioritize menu",
                tint = NeighborlyBlue
            )
        }

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            OptimizationPriority.values().forEach { priority ->
                DropdownMenuItem(onClick = {
                    expanded = false
                    onSelect(priority)
                }) {
                    Text(priority.label)
                }
            }
        }
    }
}

@Composable
private fun TransportationModeRow(
    prefs: PreferenceState,
    onToggleMode: (TransportMode) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        TransportMode.values().forEach { mode ->
            Card(
                modifier = Modifier
                    .weight(1f)
                    .clickable { onToggleMode(mode) },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (prefs.enabledModes.contains(mode)) {
                        NeighborlyBlueSoft
                    } else {
                        Color(0xFFF8F8F8)
                    }
                )
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 16.dp, horizontal = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = mode.emoji,
                        style = MaterialTheme.typography.headlineSmall,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = mode.label,
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium),
                        textAlign = TextAlign.Center,
                        color = if (prefs.enabledModes.contains(mode)) NeighborlyBlue else Color(0xFF1A1A1A)
                    )
                    Switch(
                        checked = prefs.enabledModes.contains(mode),
                        onCheckedChange = { onToggleMode(mode) },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = NeighborlyBlue,
                            uncheckedThumbColor = Color.White,
                            uncheckedTrackColor = Color(0xFFD8D8D8)
                        )
                    )
                }
            }
        }
    }
}

@Composable
private fun ToggleRow(title: String, checked: Boolean, onToggle: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(title, style = MaterialTheme.typography.bodyLarge)
        Switch(
            checked = checked,
            onCheckedChange = { onToggle() },
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = NeighborlyGreen,
                uncheckedThumbColor = Color.White,
                uncheckedTrackColor = Color(0xFFD8D8D8)
            )
        )
    }
}

@Composable
private fun DietaryToggleSection(prefs: PreferenceState, shopperViewModel: ShopperViewModel) {
    ToggleRow("Vegan", prefs.dietVegan, shopperViewModel::toggleDietVegan)
    ToggleRow("Gluten Free", prefs.dietGlutenFree, shopperViewModel::toggleDietGlutenFree)
    ToggleRow("Low Carb", prefs.dietLowCarb, shopperViewModel::toggleDietLowCarb)
    ToggleRow("Kosher", prefs.dietKosher, shopperViewModel::toggleDietKosher)
    ToggleRow("Halal", prefs.dietHalal, shopperViewModel::toggleDietHalal)
    ToggleRow("Keto", prefs.dietKeto, shopperViewModel::toggleDietKeto)
}

@Composable
private fun WellnessField(
    title: String,
    value: String,
    placeholder: String,
    onValueChange: (String) -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(
            text = title,
            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium)
        )
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text(placeholder) },
            singleLine = true,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = NeighborlyBlue,
                unfocusedBorderColor = Color(0xFFD7D7D7),
                cursorColor = NeighborlyBlue,
                focusedLabelColor = NeighborlyBlue
            )
        )
    }
}
