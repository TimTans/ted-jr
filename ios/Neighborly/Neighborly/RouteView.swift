import SwiftUI

struct RouteView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // MARK: - Map Placeholder
                    RoundedRectangle(cornerRadius: 20)
                        .fill(
                            LinearGradient(
                                colors: [
                                    NeighborlyTheme.greenSoft.opacity(0.5),
                                    NeighborlyTheme.greenSoft
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(height: 220)
                        .overlay(
                            VStack(spacing: 10) {
                                Image(systemName: "map.fill")
                                    .font(.system(size: 36))
                                    .foregroundColor(NeighborlyTheme.green)
                                Text("Google Maps integration")
                                    .font(.subheadline)
                                    .foregroundColor(NeighborlyTheme.textSecondary)
                            }
                        )

                    // MARK: - Route Stops Card
                    VStack(spacing: 16) {
                        // Header row
                        HStack {
                            Image(systemName: "paperplane.fill")
                                .font(.caption)
                                .foregroundColor(NeighborlyTheme.textMuted)
                            Text("OPTIMIZED ROUTE")
                                .font(.caption.weight(.semibold))
                                .foregroundColor(NeighborlyTheme.textMuted)
                            Spacer()
                            Text("3 stops")
                                .font(.caption)
                                .foregroundColor(NeighborlyTheme.green)
                        }

                        // Route stops
                        RouteStopRow(
                            index: 1,
                            name: "Aldi",
                            address: "142 Atlantic Ave",
                            distance: "0.8 mi",
                            time: "12 min",
                            items: 3
                        )
                        RouteStopRow(
                            index: 2,
                            name: "Trader Joe's",
                            address: "130 Court St",
                            distance: "1.2 mi",
                            time: "8 min",
                            items: 4
                        )
                        RouteStopRow(
                            index: 3,
                            name: "Costco",
                            address: "976 3rd Ave",
                            distance: "2.4 mi",
                            time: "15 min",
                            items: 2
                        )
                    }
                    .padding(16)
                    .background(NeighborlyTheme.greenSoft)
                    .clipShape(RoundedRectangle(cornerRadius: 24))

                    // MARK: - Optimize Route Button
                    Button(action: {}) {
                        Text("Optimize Route")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(NeighborlyTheme.green)
                            .clipShape(RoundedRectangle(cornerRadius: 22))
                    }
                }
                .padding(16)
            }
            .background(NeighborlyTheme.background)
            .navigationTitle("Route")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Route Stop Row

private struct RouteStopRow: View {
    let index: Int
    let name: String
    let address: String
    let distance: String
    let time: String
    let items: Int

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // Green circle with index number
            Circle()
                .fill(NeighborlyTheme.green)
                .frame(width: 28, height: 28)
                .overlay(
                    Text("\(index)")
                        .font(.caption.weight(.bold))
                        .foregroundColor(.white)
                )

            // Name, address, badges
            VStack(alignment: .leading, spacing: 6) {
                Text(name)
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(NeighborlyTheme.textPrimary)
                Text(address)
                    .font(.caption)
                    .foregroundColor(NeighborlyTheme.textMuted)

                HStack(spacing: 8) {
                    // Items badge
                    Text("\(items) items")
                        .font(.caption2)
                        .foregroundColor(NeighborlyTheme.green)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(NeighborlyTheme.greenSoft)
                        .clipShape(Capsule())

                    // Time badge
                    Text(time)
                        .font(.caption2)
                        .foregroundColor(NeighborlyTheme.orange)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(NeighborlyTheme.orangeSoft)
                        .clipShape(Capsule())
                }
            }

            Spacer()

            // Distance
            Text(distance)
                .font(.caption)
                .foregroundColor(NeighborlyTheme.textMuted)
        }
    }
}

#Preview {
    RouteView()
}
