package com.example.android.viewmodel.home

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

data class HomeMetric(
    val label: String,
    val value: String,
    val sublabel: String
)

data class RouteStop(
    val index: Int,
    val name: String,
    val address: String,
    val distance: String,
    val timeEstimate: String,
    val itemsLabel: String
)

data class HomeUiState(
    val userName: String = "John Doe",
    val savingsThisTrip: String = "$6.70",
    val totalBudget: String = "$120.00",
    val budgetUsed: String = "$57.31",
    val savedThisMonth: String = "$42.80",
    val savedThisMonthLabel: String = "this month",
    val avgTripTime: String = "34m",
    val milesSaved: String = "12.4",
    val itemsTracked: String = "89",
    val alertsCount: String = "3",
    val optimizedStopsLabel: String = "3 stops",
    val metrics: List<HomeMetric> = emptyList(),
    val routeStops: List<RouteStop> = emptyList()
)

class HomeViewModel : ViewModel() {
    var uiState by mutableStateOf(
        HomeUiState(
            metrics = listOf(
                HomeMetric("Budget", "$57.31", "of $120.00"),
                HomeMetric("Saved", "$42.80", "this month"),
                HomeMetric("Avg trip", "34m", ""),
                HomeMetric("Miles saved", "12.4", "miles saved"),
                HomeMetric("Items", "89", "tracked"),
                HomeMetric("Alerts", "3", "alerts")
            ),
            routeStops = listOf(
                RouteStop(1, "Aldi", "142 Atlantic Ave", "0.8 mi", "12 min", "3 items"),
                RouteStop(2, "Trader Joe's", "130 Court St", "1.2 mi", "8 min", "4 items"),
                RouteStop(3, "Costco", "976 3rd Ave", "2.4 mi", "15 min", "2 items")
            )
        )
    )
        private set
}

