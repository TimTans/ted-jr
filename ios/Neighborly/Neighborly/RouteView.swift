import SwiftUI

struct RouteView: View {
    var routeState: RouteState

    var body: some View {
        NavigationStack {
            ZStack {
                NeighborlyTheme.background.ignoresSafeArea()

                if let route = routeState.optimizedRoute {
                    routeContent(route)
                } else {
                    emptyState
                }
            }
            .navigationTitle("Route")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "paperplane")
                .font(.system(size: 48))
                .foregroundStyle(NeighborlyTheme.textMuted)
            Text("No route yet")
                .font(.headline)
                .foregroundStyle(NeighborlyTheme.textPrimary)
            Text("Add items to your grocery list,\nthen tap Create Route")
                .font(.subheadline)
                .foregroundStyle(NeighborlyTheme.textSecondary)
                .multilineTextAlignment(.center)
        }
    }

    // MARK: - Route Content

    private func routeContent(_ route: OptimizedRoute) -> some View {
        ScrollView {
            VStack(spacing: 16) {
                // Map
                MapboxRouteMap(stops: route.stops)
                    .frame(height: 220)
                    .clipShape(RoundedRectangle(cornerRadius: 20))

                // Summary card
                summaryCard(route)

                // Store stops
                ForEach(Array(route.stops.enumerated()), id: \.element.id) { index, stop in
                    stopCard(stop, index: index + 1)
                }

                // Items not found
                if !route.itemsNotFound.isEmpty {
                    notFoundCard(count: route.itemsNotFound.count)
                }
            }
            .padding(16)
        }
    }

    // MARK: - Summary Card

    private func summaryCard(_ route: OptimizedRoute) -> some View {
        VStack(spacing: 12) {
            HStack {
                Image(systemName: "paperplane.fill")
                    .font(.caption)
                    .foregroundStyle(NeighborlyTheme.green)
                Text("LOWEST COST ROUTE")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(NeighborlyTheme.green)
                    .tracking(0.5)
                Spacer()
            }

            HStack(spacing: 20) {
                VStack(spacing: 2) {
                    Text(route.totalCost, format: .currency(code: "USD"))
                        .font(.title2.weight(.heavy))
                        .foregroundStyle(NeighborlyTheme.green)
                    Text("total")
                        .font(.caption)
                        .foregroundStyle(NeighborlyTheme.textMuted)
                }

                Divider().frame(height: 36)

                VStack(spacing: 2) {
                    let totalItems = route.stops.reduce(0) { $0 + $1.items.count }
                    Text("\(totalItems)")
                        .font(.title2.weight(.heavy))
                        .foregroundStyle(NeighborlyTheme.textPrimary)
                    Text("items")
                        .font(.caption)
                        .foregroundStyle(NeighborlyTheme.textMuted)
                }

                Divider().frame(height: 36)

                VStack(spacing: 2) {
                    Text("\(route.stops.count)")
                        .font(.title2.weight(.heavy))
                        .foregroundStyle(NeighborlyTheme.textPrimary)
                    Text(route.stops.count == 1 ? "store" : "stores")
                        .font(.caption)
                        .foregroundStyle(NeighborlyTheme.textMuted)
                }
            }
            .frame(maxWidth: .infinity)
        }
        .padding(20)
        .background(NeighborlyTheme.greenSoft)
        .clipShape(RoundedRectangle(cornerRadius: 20))
    }

    // MARK: - Stop Card

    private func stopCard(_ stop: RouteStop, index: Int) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            // Store header
            HStack(spacing: 10) {
                Circle()
                    .fill(NeighborlyTheme.green)
                    .frame(width: 28, height: 28)
                    .overlay(
                        Text("\(index)")
                            .font(.caption.weight(.bold))
                            .foregroundStyle(.white)
                    )

                VStack(alignment: .leading, spacing: 2) {
                    Text(stop.store.name)
                        .font(.subheadline.weight(.bold))
                        .foregroundStyle(NeighborlyTheme.textPrimary)
                    if let address = stop.store.address {
                        Text(address)
                            .font(.caption)
                            .foregroundStyle(NeighborlyTheme.textMuted)
                    }
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text(stop.subtotal, format: .currency(code: "USD"))
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(NeighborlyTheme.green)
                    Text("\(stop.items.count) item\(stop.items.count == 1 ? "" : "s")")
                        .font(.caption)
                        .foregroundStyle(NeighborlyTheme.textMuted)
                }
            }

            Divider()

            // Item rows
            ForEach(stop.items) { item in
                HStack(spacing: 10) {
                    // Category emoji
                    let emoji = categoryEmojiForSlug(item.categorySlug)
                    Text(emoji)
                        .font(.title3)
                        .frame(width: 32, height: 32)
                        .background(NeighborlyTheme.greenSoft)
                        .clipShape(RoundedRectangle(cornerRadius: 6))

                    VStack(alignment: .leading, spacing: 1) {
                        Text(item.name)
                            .font(.caption)
                            .foregroundStyle(NeighborlyTheme.textPrimary)
                            .lineLimit(1)
                        Text(item.unitSize)
                            .font(.caption2)
                            .foregroundStyle(NeighborlyTheme.textMuted)
                    }

                    Spacer()

                    if let sale = item.salePrice {
                        VStack(alignment: .trailing, spacing: 1) {
                            Text(sale, format: .currency(code: "USD"))
                                .font(.caption.weight(.semibold))
                                .foregroundStyle(NeighborlyTheme.green)
                            Text(item.price, format: .currency(code: "USD"))
                                .font(.caption2)
                                .foregroundStyle(NeighborlyTheme.textMuted)
                                .strikethrough()
                        }
                    } else {
                        Text(item.price, format: .currency(code: "USD"))
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(NeighborlyTheme.green)
                    }
                }
            }
        }
        .padding(16)
        .background(NeighborlyTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    // MARK: - Not Found Card

    private func notFoundCard(count: Int) -> some View {
        HStack(spacing: 8) {
            Image(systemName: "exclamationmark.triangle")
                .foregroundStyle(NeighborlyTheme.orange)
            Text("\(count) item\(count == 1 ? "" : "s") not available at any store")
                .font(.caption)
                .foregroundStyle(NeighborlyTheme.textSecondary)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(NeighborlyTheme.orangeSoft)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    // MARK: - Helpers

    private func categoryEmojiForSlug(_ slug: String?) -> String {
        guard let slug else { return "🛒" }
        switch slug {
        case "milk": return "🥛"
        case "water": return "💧"
        case "yogurt": return "🥄"
        case "bread": return "🍞"
        case "chicken": return "🍗"
        case "turkey": return "🦃"
        case "cereal": return "🥣"
        case "eggs": return "🥚"
        case "cheese": return "🧀"
        case "fresh-fruit": return "🍎"
        case "fresh-vegetables": return "🥬"
        case "pasta-rice-grains": return "🍝"
        case "chips": return "🍿"
        case "canned-packaged-foods": return "🥫"
        case "frozen-vegetables": return "🥦"
        case "bakery": return "🥐"
        case "beverages": return "🥤"
        case "breakfast": return "🥞"
        case "deli": return "🥪"
        case "frozen": return "❄️"
        case "international": return "🌍"
        case "meatandseafood": return "🥩"
        case "pantry": return "🫙"
        case "produce": return "🥕"
        case "refrigerated": return "🧊"
        case "snacks": return "🍿"
        default: return "🛒"
        }
    }
}

#Preview {
    RouteView(routeState: RouteState())
}
