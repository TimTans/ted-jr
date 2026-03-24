package com.example.android.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.List
import androidx.compose.material.icons.outlined.Send
import androidx.compose.material.icons.rounded.Send
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import com.example.android.ui.home.HomeScreen
import com.example.android.ui.lists.GroceryListScreen
import com.example.android.ui.preferences.PreferencesScreen
import com.example.android.ui.route.RouteScreen
import com.example.android.viewmodel.home.HomeViewModel
import com.example.android.viewmodel.login.LoginViewModel
import com.example.android.viewmodel.shopper.ShopperViewModel

private val NeighborlyGreen = Color(0xFF0C6A4A)
private val NeighborlyGreenSoft = Color(0xFFE0F1E8)

private enum class MainTab(
    val label: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    Home("Home", Icons.Filled.Home, Icons.Outlined.Home),
    Lists("Lists", Icons.Filled.List, Icons.Outlined.List),
    Route("Route", Icons.Rounded.Send, Icons.Outlined.Send)
}

private enum class AppDestination {
    Home,
    Lists,
    Route,
    Preferences
}

@Composable
fun AppScaffold(
    loginViewModel: LoginViewModel,
    homeViewModel: HomeViewModel,
    shopperViewModel: ShopperViewModel
) {
    var destination by rememberSaveable { mutableStateOf(AppDestination.Home) }

    val currentTab = when (destination) {
        AppDestination.Home -> MainTab.Home
        AppDestination.Lists -> MainTab.Lists
        AppDestination.Route -> MainTab.Route
        AppDestination.Preferences -> MainTab.Home
    }

    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = Color.White) {
                MainTab.entries.forEach { tab ->
                    NavigationBarItem(
                        selected = currentTab == tab && destination != AppDestination.Preferences,
                        onClick = {
                            destination = when (tab) {
                                MainTab.Home -> AppDestination.Home
                                MainTab.Lists -> AppDestination.Lists
                                MainTab.Route -> AppDestination.Route
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = if (currentTab == tab && destination != AppDestination.Preferences) {
                                    tab.selectedIcon
                                } else {
                                    tab.unselectedIcon
                                },
                                contentDescription = tab.label
                            )
                        },
                        label = { Text(tab.label) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = NeighborlyGreen,
                            selectedTextColor = NeighborlyGreen,
                            unselectedIconColor = Color(0xFF8E8E8E),
                            unselectedTextColor = Color(0xFF8E8E8E),
                            indicatorColor = NeighborlyGreenSoft
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        when (destination) {
            AppDestination.Home -> HomeScreen(
                viewModel = homeViewModel,
                displayName = loginViewModel.uiState.value.displayName,
                initials = loginViewModel.uiState.value.initials,
                onOpenPreferences = { destination = AppDestination.Preferences },
                onSignOut = loginViewModel::signOut,
                modifier = Modifier.padding(innerPadding)
            )

            AppDestination.Lists -> GroceryListScreen(
                shopperViewModel = shopperViewModel,
                modifier = Modifier.padding(innerPadding)
            )

            AppDestination.Route -> RouteScreen(
                homeViewModel = homeViewModel,
                modifier = Modifier.padding(innerPadding)
            )

            AppDestination.Preferences -> PreferencesScreen(
                shopperViewModel = shopperViewModel,
                onBack = { destination = AppDestination.Home },
                modifier = Modifier.padding(innerPadding)
            )
        }
    }
}
