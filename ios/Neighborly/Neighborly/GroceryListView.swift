import SwiftUI
import SwiftData

// MARK: - Grocery List View

struct GroceryListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \GroceryListItem.dateAdded, order: .reverse) private var items: [GroceryListItem]

    @State private var searchText = ""
    @State private var isSearchFocused = false
    @State private var allProducts: [ShopRiteItem] = []
    @State private var selectedItem: GroceryListItem?

    private var filteredProducts: [ShopRiteItem] {
        guard !searchText.isEmpty else { return [] }
        let query = searchText.lowercased()
        return Array(
            allProducts
                .filter { $0.name.lowercased().contains(query) }
                .prefix(10)
        )
    }

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                NeighborlyTheme.background
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Search bar
                    searchBar
                        .zIndex(1)

                    if items.isEmpty && filteredProducts.isEmpty {
                        emptyState
                    } else if !filteredProducts.isEmpty {
                        // Search results as main content (not overlay)
                        searchResultsList
                    } else {
                        groceryList
                    }
                }
            }
            .navigationTitle("Grocery List")
            .navigationBarTitleDisplayMode(.inline)
            .sheet(item: $selectedItem) { item in
                ItemDetailSheet(item: item, allProducts: allProducts)
                    .presentationDetents([.medium])
            }
        }
        .onAppear {
            if allProducts.isEmpty {
                allProducts = ShopRiteData.loadProducts()
            }
        }
    }

    // MARK: - Search Bar

    private var searchBar: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(NeighborlyTheme.textMuted)

            TextField("Search products to add...", text: $searchText)
                .textFieldStyle(.plain)
                .autocorrectionDisabled()

            if !searchText.isEmpty {
                Button {
                    searchText = ""
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(NeighborlyTheme.textMuted)
                }
            }
        }
        .padding(12)
        .background(NeighborlyTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .shadow(color: .black.opacity(0.04), radius: 4, y: 2)
        .padding(.horizontal, 16)
        .padding(.top, 8)
        .padding(.bottom, 4)
    }

    // MARK: - Search Results

    private var searchResultsList: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(filteredProducts) { product in
                    Button {
                        addOrIncrement(product)
                        searchText = ""
                    } label: {
                        HStack(spacing: 12) {
                            Image(systemName: "plus.circle.fill")
                                .font(.title3)
                                .foregroundStyle(NeighborlyTheme.green)

                            VStack(alignment: .leading, spacing: 2) {
                                Text(product.name)
                                    .font(.subheadline)
                                    .foregroundStyle(NeighborlyTheme.textPrimary)
                                    .lineLimit(2)
                                    .multilineTextAlignment(.leading)
                                Text(product.unitSize)
                                    .font(.caption)
                                    .foregroundStyle(NeighborlyTheme.textMuted)
                            }

                            Spacer()

                            // Show ShopRite price as hint
                            VStack(alignment: .trailing, spacing: 2) {
                                Text(product.price, format: .currency(code: "USD"))
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundStyle(NeighborlyTheme.green)
                                Text("ShopRite")
                                    .font(.caption2)
                                    .foregroundStyle(NeighborlyTheme.textMuted)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                    }

                    if product.id != filteredProducts.last?.id {
                        Divider()
                            .padding(.leading, 52)
                    }
                }
            }
            .background(NeighborlyTheme.cardBackground)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .padding(.horizontal, 16)
            .padding(.top, 4)
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 12) {
            Spacer()
            Image(systemName: "cart")
                .font(.system(size: 48))
                .foregroundStyle(NeighborlyTheme.textMuted)
            Text("Your grocery list is empty")
                .font(.headline)
                .foregroundStyle(NeighborlyTheme.textPrimary)
            Text("Search above to add items")
                .font(.subheadline)
                .foregroundStyle(NeighborlyTheme.textSecondary)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Grocery List

    private var groceryList: some View {
        List {
            ForEach(items) { item in
                GroceryItemRow(item: item)
                    .listRowBackground(NeighborlyTheme.cardBackground)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        selectedItem = item
                    }
            }
            .onDelete(perform: deleteItems)

            // Item count footer
            HStack {
                Text("\(items.count) item\(items.count == 1 ? "" : "s")")
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(NeighborlyTheme.textSecondary)
                Spacer()
                Text("Tap item for prices")
                    .font(.caption)
                    .foregroundStyle(NeighborlyTheme.textMuted)
            }
            .padding(.vertical, 6)
            .listRowBackground(NeighborlyTheme.greenSoft)
        }
        .listStyle(.insetGrouped)
        .scrollContentBackground(.hidden)
    }

    // MARK: - Actions

    private func addOrIncrement(_ product: ShopRiteItem) {
        if let existing = items.first(where: { $0.upc == product.upc }) {
            existing.quantity += 1
        } else {
            let newItem = GroceryListItem(from: product)
            modelContext.insert(newItem)
        }
    }

    private func deleteItems(at offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(items[index])
        }
    }
}

// MARK: - Grocery Item Row (no price, just name + quantity)

struct GroceryItemRow: View {
    @Environment(\.modelContext) private var modelContext
    @Bindable var item: GroceryListItem

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text(item.name)
                    .font(.subheadline)
                    .foregroundStyle(NeighborlyTheme.textPrimary)
                    .lineLimit(2)
                Text(item.unitSize)
                    .font(.caption)
                    .foregroundStyle(NeighborlyTheme.textMuted)
            }

            Spacer()

            // Quantity stepper
            HStack(spacing: 8) {
                Button {
                    if item.quantity > 1 {
                        item.quantity -= 1
                    } else {
                        withAnimation {
                            modelContext.delete(item)
                        }
                    }
                } label: {
                    Image(systemName: item.quantity > 1 ? "minus.circle" : "trash.circle")
                        .font(.title3)
                        .foregroundStyle(item.quantity > 1 ? NeighborlyTheme.orange : .red.opacity(0.7))
                }
                .buttonStyle(.plain)

                Text("\(item.quantity)")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(NeighborlyTheme.textPrimary)
                    .frame(minWidth: 20, alignment: .center)

                Button {
                    item.quantity += 1
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.title3)
                        .foregroundStyle(NeighborlyTheme.orange)
                }
                .buttonStyle(.plain)
            }

            // Chevron hint for tap
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(NeighborlyTheme.textMuted)
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Item Detail Sheet (price comparison)

struct ItemDetailSheet: View {
    let item: GroceryListItem
    let allProducts: [ShopRiteItem]

    private var shopRitePrice: Double? {
        allProducts.first(where: { $0.upc == item.upc })?.price
    }

    // Placeholder stores for demo — only ShopRite has real data
    private var storePrices: [(store: String, price: Double?, isReal: Bool)] {
        [
            ("ShopRite", shopRitePrice, true),
            ("Aldi", shopRitePrice.map { $0 * 0.92 }, false),       // simulated
            ("Trader Joe's", shopRitePrice.map { $0 * 1.05 }, false) // simulated
        ]
    }

    var body: some View {
        VStack(spacing: 0) {
            // Handle
            Capsule()
                .fill(Color.gray.opacity(0.3))
                .frame(width: 36, height: 5)
                .padding(.top, 10)

            VStack(alignment: .leading, spacing: 16) {
                // Item header
                VStack(alignment: .leading, spacing: 4) {
                    Text(item.name)
                        .font(.title3.weight(.bold))
                        .foregroundStyle(NeighborlyTheme.textPrimary)
                    Text(item.unitSize)
                        .font(.subheadline)
                        .foregroundStyle(NeighborlyTheme.textMuted)
                    Text("Qty: \(item.quantity)")
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(NeighborlyTheme.textSecondary)
                }

                Divider()

                // Store prices
                Text("PRICES BY STORE")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(NeighborlyTheme.textMuted)
                    .tracking(0.5)

                VStack(spacing: 10) {
                    ForEach(storePrices, id: \.store) { entry in
                        HStack {
                            Circle()
                                .fill(entry.store == "ShopRite" ? NeighborlyTheme.green : NeighborlyTheme.orange)
                                .frame(width: 8, height: 8)

                            Text(entry.store)
                                .font(.subheadline.weight(.medium))
                                .foregroundStyle(NeighborlyTheme.textPrimary)

                            if !entry.isReal {
                                Text("est.")
                                    .font(.caption2)
                                    .foregroundStyle(NeighborlyTheme.textMuted)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(NeighborlyTheme.background)
                                    .clipShape(Capsule())
                            }

                            Spacer()

                            if let price = entry.price {
                                Text(price, format: .currency(code: "USD"))
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundStyle(entry.isReal ? NeighborlyTheme.green : NeighborlyTheme.textSecondary)
                            } else {
                                Text("—")
                                    .font(.subheadline)
                                    .foregroundStyle(NeighborlyTheme.textMuted)
                            }
                        }
                        .padding(.vertical, 10)
                        .padding(.horizontal, 14)
                        .background(NeighborlyTheme.cardBackground)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                }

                Text("Real prices from ShopRite. Other stores coming soon.")
                    .font(.caption)
                    .foregroundStyle(NeighborlyTheme.textMuted)
                    .frame(maxWidth: .infinity, alignment: .center)
            }
            .padding(20)

            Spacer()
        }
        .background(NeighborlyTheme.background)
    }
}

// MARK: - Preview

#Preview {
    GroceryListView()
        .modelContainer(for: GroceryListItem.self, inMemory: true)
}
