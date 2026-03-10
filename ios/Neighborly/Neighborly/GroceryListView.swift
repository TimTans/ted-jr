import SwiftUI
import SwiftData

// MARK: - Grocery List View

struct GroceryListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \GroceryListItem.dateAdded, order: .reverse) private var items: [GroceryListItem]

    @State private var searchText = ""
    @State private var allProducts: [ShopRiteItem] = []

    private var filteredProducts: [ShopRiteItem] {
        guard !searchText.isEmpty else { return [] }
        let query = searchText.lowercased()
        return Array(
            allProducts
                .filter { $0.name.lowercased().contains(query) }
                .prefix(10)
        )
    }

    private var total: Double {
        items.reduce(0) { $0 + $1.price * Double($1.quantity) }
    }

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                NeighborlyTheme.background
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    searchBar
                    searchResults

                    if items.isEmpty {
                        emptyState
                    } else {
                        groceryList
                    }
                }
            }
            .navigationTitle("Grocery List")
            .navigationBarTitleDisplayMode(.inline)
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

            TextField("Search ShopRite products...", text: $searchText)
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
        .padding(10)
        .background(NeighborlyTheme.cardBackground)
        .cornerRadius(10)
        .padding(.horizontal)
        .padding(.top, 8)
    }

    // MARK: - Search Results Dropdown

    private var searchResults: some View {
        Group {
            if !filteredProducts.isEmpty {
                VStack(spacing: 0) {
                    ForEach(filteredProducts) { product in
                        Button {
                            addOrIncrement(product)
                            searchText = ""
                        } label: {
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(product.name)
                                        .font(.subheadline)
                                        .foregroundStyle(NeighborlyTheme.textPrimary)
                                        .lineLimit(1)
                                    Text(product.unitSize)
                                        .font(.caption)
                                        .foregroundStyle(NeighborlyTheme.textMuted)
                                }
                                Spacer()
                                Text(product.price, format: .currency(code: "USD"))
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundStyle(NeighborlyTheme.green)
                            }
                            .padding(.horizontal)
                            .padding(.vertical, 10)
                        }
                        if product.id != filteredProducts.last?.id {
                            Divider()
                                .padding(.leading)
                        }
                    }
                }
                .background(NeighborlyTheme.cardBackground)
                .cornerRadius(10)
                .shadow(color: .black.opacity(0.1), radius: 4, y: 2)
                .padding(.horizontal)
                .padding(.top, 4)
            }
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
            }
            .onDelete(perform: deleteItems)

            // Total row
            HStack {
                Text("Total")
                    .font(.headline)
                    .foregroundStyle(NeighborlyTheme.textPrimary)
                Spacer()
                Text(total, format: .currency(code: "USD"))
                    .font(.headline)
                    .foregroundStyle(NeighborlyTheme.green)
            }
            .padding(.vertical, 8)
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

// MARK: - Grocery Item Row

struct GroceryItemRow: View {
    @Environment(\.modelContext) private var modelContext
    @Bindable var item: GroceryListItem

    private var lineTotal: Double {
        item.price * Double(item.quantity)
    }

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            // Item info
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

            // Line total
            Text(lineTotal, format: .currency(code: "USD"))
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(NeighborlyTheme.green)
                .frame(minWidth: 60, alignment: .trailing)
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Preview

#Preview {
    GroceryListView()
        .modelContainer(for: GroceryListItem.self, inMemory: true)
}
