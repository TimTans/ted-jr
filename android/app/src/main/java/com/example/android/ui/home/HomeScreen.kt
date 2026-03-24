package com.example.android.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.DropdownMenu
import androidx.compose.material.DropdownMenuItem
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.outlined.AccountBalance
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Inventory2
import androidx.compose.material.icons.outlined.Place
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.ShowChart
import androidx.compose.material.icons.rounded.Send
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.android.viewmodel.home.HomeUiState
import com.example.android.viewmodel.home.HomeViewModel
import com.example.android.viewmodel.home.RouteStop

private val NeighborlyBackground = Color(0xFFF7F3EC)
private val NeighborlyGreen = Color(0xFF0C6A4A)
private val NeighborlyGreenSoft = Color(0xFFE0F1E8)
private val NeighborlyOrange = Color(0xFFE67E22)
private val NeighborlyOrangeSoft = Color(0xFFFFF3E0)

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    displayName: String,
    initials: String,
    onOpenPreferences: () -> Unit,
    onSignOut: () -> Unit,
    modifier: Modifier = Modifier
) {
    val state = viewModel.uiState.copy(userName = displayName)

    Surface(
        modifier = modifier.fillMaxSize(),
        color = NeighborlyBackground
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.statusBars)
        ) {
            HomeTopBar(
                initials = initials,
                displayName = displayName,
                onOpenPreferences = onOpenPreferences,
                onSignOut = onSignOut
            )

            Column(
                modifier = Modifier
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                HeroCard(
                    name = state.userName,
                    savings = state.savingsThisTrip.removePrefix("$")
                )

                MetricsGrid(state = state)

                OptimizedRouteCard(
                    stopsLabel = state.optimizedStopsLabel,
                    routeStops = state.routeStops
                )
            }
        }
    }
}

@Composable
private fun HomeTopBar(
    initials: String,
    displayName: String,
    onOpenPreferences: () -> Unit,
    onSignOut: () -> Unit
) {
    var menuExpanded by remember { mutableStateOf(false) }

    Surface(color = NeighborlyBackground, shadowElevation = 0.dp) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(NeighborlyGreen),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "N",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = Color.White
                    )
                }
                Text(
                    text = "Neighborly",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                    color = Color(0xFF1A1A1A)
                )
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color.White),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Notifications,
                        contentDescription = "Notifications",
                        tint = Color(0xFF1A1A1A)
                    )
                }

                Box {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(NeighborlyOrange)
                            .clickable { menuExpanded = true },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = initials,
                            style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                            color = Color.White
                        )
                    }

                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false }
                    ) {
                        DropdownMenuItem(onClick = {
                            menuExpanded = false
                            onOpenPreferences()
                        }) {
                            Text("Preferences")
                        }
                        DropdownMenuItem(onClick = {
                            menuExpanded = false
                            onSignOut()
                        }) {
                            Text("Sign Out")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun HeroCard(name: String, savings: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = NeighborlyGreen)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text("Good morning,", style = MaterialTheme.typography.bodyMedium, color = Color(0xFFE0F1E8))
            Text(
                text = name,
                style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
                color = Color.White
            )
            Text(
                text = "Your optimized route is ready — 3 stores, 12 items, saving $$savings.",
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFFE0F1E8)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp)
                    .clip(RoundedCornerShape(999.dp))
                    .background(Color.White),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Start Trip →",
                    style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.SemiBold),
                    color = NeighborlyGreen
                )
            }
        }
    }
}

@Composable
private fun MetricsGrid(state: HomeUiState) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            BudgetMetricCard(modifier = Modifier.weight(1f), used = state.budgetUsed, total = state.totalBudget)
            SavedMetricCard(modifier = Modifier.weight(1f), amount = state.savedThisMonth, sublabel = state.savedThisMonthLabel)
        }

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            SmallMetricCard(modifier = Modifier.weight(1f), value = state.avgTripTime, label = "avg trip", icon = Icons.Outlined.Schedule, tint = Color(0xFF757575))
            SmallMetricCard(modifier = Modifier.weight(1f), value = state.milesSaved, label = "miles saved", icon = Icons.Outlined.Place, tint = Color(0xFF757575))
        }

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            SmallMetricCard(modifier = Modifier.weight(1f), value = state.itemsTracked, label = "tracked", icon = Icons.Outlined.Inventory2, tint = Color(0xFF757575))
            SmallMetricCard(modifier = Modifier.weight(1f), value = state.alertsCount, label = "alerts", icon = Icons.Outlined.Notifications, tint = Color(0xFF757575))
        }
    }
}

@Composable
private fun BudgetMetricCard(modifier: Modifier = Modifier, used: String, total: String) {
    val progress = (57.31 / 120.0).toFloat().coerceIn(0f, 1f)

    Card(modifier = modifier, shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Icon(imageVector = Icons.Outlined.AccountBalance, contentDescription = null, modifier = Modifier.size(18.dp), tint = NeighborlyGreen)
                Text("BUDGET", style = MaterialTheme.typography.labelSmall, color = Color(0xFF9E9E9E))
            }
            Text(used, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold), color = NeighborlyGreen)
            Text("of $total", style = MaterialTheme.typography.bodySmall, color = Color(0xFF9E9E9E))
            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = NeighborlyGreen,
                trackColor = NeighborlyGreenSoft
            )
        }
    }
}

@Composable
private fun SavedMetricCard(modifier: Modifier = Modifier, amount: String, sublabel: String) {
    Card(modifier = modifier, shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Icon(imageVector = Icons.Outlined.ShowChart, contentDescription = null, modifier = Modifier.size(18.dp), tint = NeighborlyOrange)
                Text("SAVED", style = MaterialTheme.typography.labelSmall, color = Color(0xFF9E9E9E))
            }
            Text(amount, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold), color = NeighborlyOrange)
            Text(sublabel, style = MaterialTheme.typography.bodySmall, color = Color(0xFF9E9E9E))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.Bottom) {
                listOf(0.4f, 0.7f, 0.5f, 0.9f, 0.6f).forEach { height ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(24.dp)
                            .padding(horizontal = 2.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(24.dp * height)
                                .clip(RoundedCornerShape(2.dp))
                                .background(NeighborlyOrange.copy(alpha = 0.6f))
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun SmallMetricCard(
    modifier: Modifier = Modifier,
    value: String,
    label: String,
    icon: ImageVector,
    tint: Color
) {
    Card(modifier = modifier, shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(18.dp), tint = tint)
            Text(value, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold), color = Color(0xFF424242))
            Text(label, style = MaterialTheme.typography.bodySmall, color = Color(0xFF9E9E9E))
        }
    }
}

@Composable
private fun OptimizedRouteCard(stopsLabel: String, routeStops: List<RouteStop>) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = NeighborlyGreenSoft)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Icon(Icons.Rounded.Send, contentDescription = null, modifier = Modifier.size(18.dp), tint = Color(0xFF9E9E9E))
                    Text("OPTIMIZED ROUTE", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.SemiBold), color = Color(0xFF9E9E9E))
                }
                Text(stopsLabel, style = MaterialTheme.typography.bodySmall, color = NeighborlyGreen)
            }

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(Brush.linearGradient(colors = listOf(Color(0xFFCCE7D9), NeighborlyGreenSoft))),
                contentAlignment = Alignment.Center
            ) {
                Text("Google Maps integration", style = MaterialTheme.typography.bodySmall, color = Color(0xFF4F7E6B))
            }

            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                routeStops.forEach { stop ->
                    RouteRow(
                        index = stop.index,
                        name = stop.name,
                        address = stop.address,
                        itemsLabel = stop.itemsLabel,
                        timeEstimate = stop.timeEstimate,
                        distance = stop.distance
                    )
                }
            }
        }
    }
}

@Composable
private fun RouteRow(
    index: Int,
    name: String,
    address: String,
    itemsLabel: String,
    timeEstimate: String,
    distance: String
) {
    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(NeighborlyGreen),
                contentAlignment = Alignment.Center
            ) {
                Text(index.toString(), style = MaterialTheme.typography.labelSmall, color = Color.White)
            }
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(name, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold), color = Color(0xFF333333))
                Text(address, style = MaterialTheme.typography.bodySmall, color = Color(0xFF777777))
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(NeighborlyGreenSoft)
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(itemsLabel, style = MaterialTheme.typography.labelSmall, color = NeighborlyGreen)
                    }
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(NeighborlyOrangeSoft)
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(timeEstimate, style = MaterialTheme.typography.labelSmall, color = NeighborlyOrange)
                    }
                }
            }
        }

        Text(distance, style = MaterialTheme.typography.bodySmall, color = Color(0xFF777777))
    }
}
