package com.example.android.ui.route

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Map
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.android.viewmodel.home.HomeViewModel
import com.example.android.viewmodel.home.RouteStop

private val NeighborlyBackground = Color(0xFFF7F3EC)
private val NeighborlyGreen = Color(0xFF0C6A4A)
private val NeighborlyGreenSoft = Color(0xFFE0F1E8)
private val NeighborlyOrange = Color(0xFFE67E22)
private val NeighborlyOrangeSoft = Color(0xFFFFF3E0)

@Composable
fun RouteScreen(
    homeViewModel: HomeViewModel,
    modifier: Modifier = Modifier
) {
    val state = homeViewModel.uiState

    Surface(modifier = modifier.fillMaxSize(), color = NeighborlyBackground) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Route",
                style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold),
                color = Color(0xFF1A1A1A),
                modifier = Modifier.fillMaxWidth(),
                textAlign = TextAlign.Center
            )

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(NeighborlyGreenSoft.copy(alpha = 0.7f), NeighborlyGreenSoft)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Icon(Icons.Filled.Map, contentDescription = null, tint = NeighborlyGreen, modifier = Modifier.size(36.dp))
                    Text("Google Maps integration", style = MaterialTheme.typography.bodyLarge, color = Color(0xFF4F7E6B))
                }
            }

            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = NeighborlyGreenSoft),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "OPTIMIZED ROUTE",
                            style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                            color = Color(0xFF5A5A5A)
                        )
                        Text(state.optimizedStopsLabel, style = MaterialTheme.typography.bodySmall, color = NeighborlyGreen)
                    }

                    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        items(state.routeStops) { stop ->
                            RouteStopCard(stop = stop)
                        }
                    }
                }
            }

            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = NeighborlyGreen),
                shape = RoundedCornerShape(22.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Optimize Route")
            }
        }
    }
}

@Composable
private fun RouteStopCard(stop: RouteStop) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.Top
    ) {
        Box(
            modifier = Modifier
                .size(28.dp)
                .clip(CircleShape)
                .background(NeighborlyGreen),
            contentAlignment = Alignment.Center
        ) {
            Text(stop.index.toString(), style = MaterialTheme.typography.labelSmall, color = Color.White)
        }

        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(stop.name, style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.SemiBold))
            Text(stop.address, style = MaterialTheme.typography.bodySmall, color = Color(0xFF777777))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                RouteBadge(stop.itemsLabel, NeighborlyGreen, NeighborlyGreenSoft)
                RouteBadge(stop.timeEstimate, NeighborlyOrange, NeighborlyOrangeSoft)
            }
        }

        Text(stop.distance, style = MaterialTheme.typography.bodySmall, color = Color(0xFF777777))
    }
}

@Composable
private fun RouteBadge(label: String, textColor: Color, background: Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(999.dp))
            .background(background)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(label, style = MaterialTheme.typography.labelSmall, color = textColor)
    }
}
