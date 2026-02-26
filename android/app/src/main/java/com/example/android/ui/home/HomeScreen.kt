package com.example.android.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.AccountBalance
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Inventory2
import androidx.compose.material.icons.outlined.List
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Place
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Send
import androidx.compose.material.icons.outlined.ShowChart
import androidx.compose.material.icons.rounded.Send
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
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
import com.example.android.viewmodel.home.HomeViewModel
import com.example.android.viewmodel.home.RouteStop

private val NeighborlyBackground = Color(0xFFF7F3EC)
private val NeighborlyGreen = Color(0xFF0C6A4A)
private val NeighborlyGreenSoft = Color(0xFFE0F1E8)
private val NeighborlyOrange = Color(0xFFE67E22)
private val NeighborlyOrangeSoft = Color(0xFFFFF3E0)

@Composable
fun HomeScreen(viewModel: HomeViewModel) {
    val state = viewModel.uiState

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = NeighborlyBackground
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.statusBars)
        ) {
            HomeTopBar()

            Column(
                modifier = Modifier
                    .weight(1f)
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

            NeighborlyBottomNav()
        }
    }
}

@Composable
private fun rememberScrollState() = androidx.compose.foundation.rememberScrollState()

@Composable
private fun HomeTopBar() {
    Surface(
        color = NeighborlyBackground,
        shadowElevation = 0.dp
    ) {
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
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold
                        ),
                        color = Color.White
                    )
                }
                Text(
                    text = "Neighborly",
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Bold
                    ),
                    color = Color(0xFF1A1A1A)
                )
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier,
                    contentAlignment = Alignment.TopEnd
                ) {
                    Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = "Notifications",
                        tint = Color(0xFF5A5A5A)
                    )
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .offset(x = 4.dp, y = (-2).dp)
                            .clip(CircleShape)
                            .background(Color.Red)
                    )
                }
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(NeighborlyOrange),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "JD",
                        style = MaterialTheme.typography.labelMedium.copy(
                            fontWeight = FontWeight.SemiBold
                        ),
                        color = Color.White
                    )
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
            Text(
                text = "Good morning,",
                style = MaterialTheme.typography.bodyMedium,
                color = Color(0xFFE0F1E8)
            )
            Text(
                text = name,
                style = MaterialTheme.typography.headlineSmall.copy(
                    fontWeight = FontWeight.Bold
                ),
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
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = NeighborlyGreen
                )
            }
        }
    }
}

@Composable
private fun MetricsGrid(state: com.example.android.viewmodel.home.HomeUiState) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            BudgetMetricCard(
                modifier = Modifier.weight(1f),
                used = state.budgetUsed,
                total = state.totalBudget
            )
            SavedMetricCard(
                modifier = Modifier.weight(1f),
                amount = state.savedThisMonth,
                sublabel = state.savedThisMonthLabel
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            SmallMetricCard(
                modifier = Modifier.weight(1f),
                value = state.avgTripTime,
                label = "avg trip",
                icon = Icons.Outlined.Schedule,
                tint = Color(0xFF757575)
            )
            SmallMetricCard(
                modifier = Modifier.weight(1f),
                value = state.milesSaved,
                label = "miles saved",
                icon = Icons.Outlined.Place,
                tint = Color(0xFF757575)
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            SmallMetricCard(
                modifier = Modifier.weight(1f),
                value = state.itemsTracked,
                label = "tracked",
                icon = Icons.Outlined.Inventory2,
                tint = Color(0xFF757575)
            )
            SmallMetricCard(
                modifier = Modifier.weight(1f),
                value = state.alertsCount,
                label = "alerts",
                icon = Icons.Outlined.Notifications,
                tint = Color(0xFF757575)
            )
        }
    }
}

@Composable
private fun BudgetMetricCard(
    modifier: Modifier = Modifier,
    used: String,
    total: String
) {
    val usedNum = 57.31
    val totalNum = 120.0
    val progress = (usedNum / totalNum).toFloat().coerceIn(0f, 1f)

    Card(
        modifier = modifier,
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Icon(
                    imageVector = Icons.Outlined.AccountBalance,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp),
                    tint = NeighborlyGreen
                )
                Text(
                    text = "BUDGET",
                    style = MaterialTheme.typography.labelSmall,
                    color = Color(0xFF9E9E9E)
                )
            }
            Text(
                text = used,
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = NeighborlyGreen
            )
            Text(
                text = "of $total",
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFF9E9E9E)
            )
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
private fun SavedMetricCard(
    modifier: Modifier = Modifier,
    amount: String,
    sublabel: String
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Icon(
                    imageVector = Icons.Outlined.ShowChart,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp),
                    tint = NeighborlyOrange
                )
                Text(
                    text = "SAVED",
                    style = MaterialTheme.typography.labelSmall,
                    color = Color(0xFF9E9E9E)
                )
            }
            Text(
                text = amount,
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = NeighborlyOrange
            )
            Text(
                text = sublabel,
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFF9E9E9E)
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.Bottom
            ) {
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
                                .fillMaxHeight(height)
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
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(18.dp),
                tint = tint
            )
            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = Color(0xFF424242)
            )
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall,
                color = Color(0xFF9E9E9E)
            )
        }
    }
}

@Composable
private fun OptimizedRouteCard(
    stopsLabel: String,
    routeStops: List<RouteStop>
) {
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
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Send,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp),
                        tint = Color(0xFF9E9E9E)
                    )
                    Text(
                        text = "OPTIMIZED ROUTE",
                        style = MaterialTheme.typography.labelMedium.copy(
                            fontWeight = FontWeight.SemiBold
                        ),
                        color = Color(0xFF9E9E9E)
                    )
                }
                Text(
                    text = stopsLabel,
                    style = MaterialTheme.typography.bodySmall,
                    color = NeighborlyGreen
                )
            }

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(
                                Color(0xFFCCE7D9),
                                NeighborlyGreenSoft
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Google Maps integration",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF4F7E6B)
                )
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
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(NeighborlyGreen),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = index.toString(),
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.White
                )
            }
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    text = name,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = Color(0xFF333333)
                )
                Text(
                    text = address,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF777777)
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(NeighborlyGreenSoft)
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = itemsLabel,
                            style = MaterialTheme.typography.labelSmall,
                            color = NeighborlyGreen
                        )
                    }
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(NeighborlyOrangeSoft)
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = timeEstimate,
                            style = MaterialTheme.typography.labelSmall,
                            color = NeighborlyOrange
                        )
                    }
                }
            }
        }

        Text(
            text = distance,
            style = MaterialTheme.typography.bodySmall,
            color = Color(0xFF777777)
        )
    }
}

@Composable
private fun NeighborlyBottomNav() {
    var selectedIndex by remember { mutableIntStateOf(0) }

    val items = listOf(
        "Home" to (Icons.Filled.Home to Icons.Outlined.Home),
        "Search" to (Icons.Filled.Search to Icons.Outlined.Search),
        "Lists" to (Icons.Filled.List to Icons.Outlined.List),
        "Route" to (Icons.Rounded.Send to Icons.Outlined.Send),
        "Profile" to (Icons.Filled.Person to Icons.Outlined.Person)
    )

    NavigationBar(
        containerColor = Color.White,
        tonalElevation = 12.dp
    ) {
        items.forEachIndexed { index, (label, icons) ->
            val (selectedIcon, unselectedIcon) = icons
            NavigationBarItem(
                selected = selectedIndex == index,
                onClick = { selectedIndex = index },
                icon = {
                    Icon(
                        imageVector = if (selectedIndex == index) selectedIcon else unselectedIcon,
                        contentDescription = label
                    )
                },
                label = { Text(text = label) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = NeighborlyGreen,
                    selectedTextColor = NeighborlyGreen,
                    unselectedIconColor = Color(0xFF9E9E9E),
                    unselectedTextColor = Color(0xFF9E9E9E),
                    indicatorColor = NeighborlyGreenSoft
                )
            )
        }
    }
}
