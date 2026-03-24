package com.example.android.viewmodel.shopper

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import java.util.UUID

data class CatalogProduct(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val unitSize: String,
    val price: Double,
    val store: String,
    val upc: String
)

data class GroceryListItemUi(
    val id: String = UUID.randomUUID().toString(),
    val upc: String,
    val name: String,
    val unitSize: String,
    val store: String,
    val price: Double,
    val quantity: Int = 1
)

enum class OptimizationPriority(val label: String) {
    LowestCost("Lowest Cost"),
    ShortestRoute("Shortest Route"),
    FastestTrip("Fastest Trip")
}

enum class TransportMode(val label: String) {
    Walking("Walking"),
    PublicTransit("Public Transit"),
    Car("Driving");

    val emoji: String
        get() = when (this) {
            Walking -> "\uD83D\uDEB6"
            PublicTransit -> "\uD83D\uDE8C"
            Car -> "\uD83D\uDE97"
        }
}

data class PreferenceState(
    val priority: OptimizationPriority = OptimizationPriority.LowestCost,
    val enabledModes: Set<TransportMode> = setOf(
        TransportMode.Walking,
        TransportMode.PublicTransit,
        TransportMode.Car
    ),
    val maxTravelDistanceMiles: Float = 5f,
    val maxStops: Float = 5f,
    val wellnessEnabled: Boolean = true,
    val cholesterolLimit: String = "",
    val sodiumLimit: String = "",
    val sugarLimit: String = "",
    val dietVegan: Boolean = false,
    val dietGlutenFree: Boolean = true,
    val dietLowCarb: Boolean = false,
    val dietKosher: Boolean = false,
    val dietHalal: Boolean = false,
    val dietKeto: Boolean = false,
    val avoidDairy: Boolean = false,
    val avoidPeanuts: Boolean = true,
    val avoidShellfish: Boolean = false,
    val avoidWheat: Boolean = false
)

data class ShopperUiState(
    val catalog: List<CatalogProduct> = sampleCatalog,
    val groceryList: List<GroceryListItemUi> = emptyList(),
    val searchQuery: String = "",
    val preferences: PreferenceState = PreferenceState()
) {
    val filteredCatalog: List<CatalogProduct>
        get() {
            val query = searchQuery.trim().lowercase()
            if (query.isBlank()) return emptyList()
            return catalog.filter { it.name.lowercase().contains(query) }.take(10)
        }
}

class ShopperViewModel : ViewModel() {
    var uiState by mutableStateOf(ShopperUiState())
        private set

    fun updateSearchQuery(value: String) {
        uiState = uiState.copy(searchQuery = value)
    }

    fun clearSearch() {
        uiState = uiState.copy(searchQuery = "")
    }

    fun addProduct(product: CatalogProduct) {
        val existing = uiState.groceryList.firstOrNull { it.upc == product.upc }
        uiState = uiState.copy(
            groceryList = if (existing == null) {
                uiState.groceryList + GroceryListItemUi(
                    upc = product.upc,
                    name = product.name,
                    unitSize = product.unitSize,
                    store = product.store,
                    price = product.price
                )
            } else {
                uiState.groceryList.map {
                    if (it.upc == product.upc) it.copy(quantity = it.quantity + 1) else it
                }
            },
            searchQuery = ""
        )
    }

    fun incrementItem(id: String) {
        uiState = uiState.copy(
            groceryList = uiState.groceryList.map {
                if (it.id == id) it.copy(quantity = it.quantity + 1) else it
            }
        )
    }

    fun decrementItem(id: String) {
        uiState = uiState.copy(
            groceryList = uiState.groceryList.mapNotNull {
                when {
                    it.id != id -> it
                    it.quantity > 1 -> it.copy(quantity = it.quantity - 1)
                    else -> null
                }
            }
        )
    }

    fun updatePriority(priority: OptimizationPriority) {
        uiState = uiState.copy(preferences = uiState.preferences.copy(priority = priority))
    }

    fun toggleTransportMode(mode: TransportMode) {
        val updatedModes = uiState.preferences.enabledModes.toMutableSet().apply {
            if (contains(mode)) remove(mode) else add(mode)
        }
        uiState = uiState.copy(preferences = uiState.preferences.copy(enabledModes = updatedModes))
    }

    fun updateMaxTravelDistance(value: Float) {
        uiState = uiState.copy(
            preferences = uiState.preferences.copy(maxTravelDistanceMiles = value)
        )
    }

    fun updateMaxStops(value: Float) {
        uiState = uiState.copy(preferences = uiState.preferences.copy(maxStops = value))
    }

    fun updateWellnessEnabled(enabled: Boolean) {
        uiState = uiState.copy(preferences = uiState.preferences.copy(wellnessEnabled = enabled))
    }

    fun updateSodiumLimit(value: String) {
        uiState = uiState.copy(preferences = uiState.preferences.copy(sodiumLimit = value))
    }

    fun updateCholesterolLimit(value: String) {
        uiState = uiState.copy(preferences = uiState.preferences.copy(cholesterolLimit = value))
    }

    fun updateSugarLimit(value: String) {
        uiState = uiState.copy(preferences = uiState.preferences.copy(sugarLimit = value))
    }

    fun toggleDietVegan() {
        uiState = uiState.copy(preferences = uiState.preferences.copy(dietVegan = !uiState.preferences.dietVegan))
    }

    fun toggleDietGlutenFree() {
        uiState = uiState.copy(preferences = uiState.preferences.copy(dietGlutenFree = !uiState.preferences.dietGlutenFree))
    }

    fun toggleDietLowCarb() {
        uiState = uiState.copy(preferences = uiState.preferences.copy(dietLowCarb = !uiState.preferences.dietLowCarb))
    }

    fun toggleDietKosher() {
        uiState = uiState.copy(preferences = uiState.preferences.copy(dietKosher = !uiState.preferences.dietKosher))
    }

    fun toggleDietHalal() {
        uiState = uiState.copy(preferences = uiState.preferences.copy(dietHalal = !uiState.preferences.dietHalal))
    }

    fun toggleDietKeto() {
        uiState = uiState.copy(preferences = uiState.preferences.copy(dietKeto = !uiState.preferences.dietKeto))
    }

    fun toggleAvoidDairy() {
        uiState = uiState.copy(preferences = uiState.preferences.copy(avoidDairy = !uiState.preferences.avoidDairy))
    }

    fun toggleAvoidPeanuts() {
        uiState = uiState.copy(preferences = uiState.preferences.copy(avoidPeanuts = !uiState.preferences.avoidPeanuts))
    }

    fun toggleAvoidShellfish() {
        uiState = uiState.copy(preferences = uiState.preferences.copy(avoidShellfish = !uiState.preferences.avoidShellfish))
    }

    fun toggleAvoidWheat() {
        uiState = uiState.copy(preferences = uiState.preferences.copy(avoidWheat = !uiState.preferences.avoidWheat))
    }
}

private val sampleCatalog = listOf(
    CatalogProduct(name = "Organic Bananas", unitSize = "1 bunch", price = 1.29, store = "Trader Joe's", upc = "0001"),
    CatalogProduct(name = "Whole Milk 1 Gal", unitSize = "1 gal", price = 3.49, store = "Aldi", upc = "0002"),
    CatalogProduct(name = "Chicken Breast", unitSize = "2 lbs", price = 5.99, store = "Costco", upc = "0003"),
    CatalogProduct(name = "Sourdough Bread", unitSize = "1 loaf", price = 3.99, store = "Trader Joe's", upc = "0004"),
    CatalogProduct(name = "Baby Spinach", unitSize = "5 oz", price = 2.49, store = "Aldi", upc = "0005"),
    CatalogProduct(name = "Greek Yogurt", unitSize = "32 oz", price = 4.29, store = "Walmart", upc = "0006"),
    CatalogProduct(name = "Avocados (4 pk)", unitSize = "1 pack", price = 2.99, store = "Aldi", upc = "0007"),
    CatalogProduct(name = "Olive Oil", unitSize = "500 ml", price = 5.49, store = "Trader Joe's", upc = "0008")
)
