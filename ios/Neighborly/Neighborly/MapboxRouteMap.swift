import SwiftUI
import MapboxMaps
import CoreLocation

/// Displays store stops on a Mapbox map with numbered pins and a connecting route line.
struct MapboxRouteMap: View {
    let stops: [RouteStop]

    @State private var viewport: Viewport = .styleDefault
    private let locationManager = CLLocationManager()

    private var storeCoordinates: [CLLocationCoordinate2D] {
        stops.compactMap { stop in
            guard let lat = stop.store.lat, let lng = stop.store.lng else { return nil }
            return CLLocationCoordinate2D(latitude: lat, longitude: lng)
        }
    }

    var body: some View {
        Map(viewport: $viewport) {
            // User location puck
            Puck2D(bearing: .heading)

            // Route line connecting stops
            if storeCoordinates.count >= 2 {
                PolylineAnnotation(lineCoordinates: storeCoordinates)
                    .lineColor(StyleColor(NeighborlyTheme.green))
                    .lineWidth(3)
                    .lineOpacity(0.7)
            }

            // Numbered store pins
            ForEvery(Array(stops.enumerated()), id: \.element.id) { index, stop in
                if let lat = stop.store.lat, let lng = stop.store.lng {
                    MapViewAnnotation(coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lng)) {
                        storePinView(index: index + 1, name: stop.store.name)
                    }
                    .allowOverlap(true)
                }
            }
        }
        .mapStyle(.streets)
        .onAppear {
            locationManager.requestWhenInUseAuthorization()
            fitToStops()
        }
    }

    private func storePinView(index: Int, name: String) -> some View {
        VStack(spacing: 2) {
            ZStack {
                Circle()
                    .fill(NeighborlyTheme.green)
                    .frame(width: 30, height: 30)
                    .shadow(color: .black.opacity(0.2), radius: 2, y: 1)

                Text("\(index)")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.white)
            }

            // Small triangle pointer
            Triangle()
                .fill(NeighborlyTheme.green)
                .frame(width: 10, height: 6)
                .offset(y: -2)
        }
    }

    private func fitToStops() {
        // Include user location in the viewport if available
        var allCoords = storeCoordinates
        if let userLoc = locationManager.location?.coordinate {
            allCoords.append(userLoc)
        }

        guard allCoords.count >= 2 else {
            if let first = allCoords.first {
                viewport = .camera(center: first, zoom: 14)
            }
            return
        }

        let line = LineString(allCoords)
        viewport = .overview(
            geometry: line,
            bearing: 0,
            pitch: 0,
            geometryPadding: EdgeInsets(top: 40, leading: 40, bottom: 40, trailing: 40),
            maxZoom: 15
        )
    }
}

// Simple triangle shape for pin pointer
private struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        Path { p in
            p.move(to: CGPoint(x: rect.midX, y: rect.maxY))
            p.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
            p.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
            p.closeSubpath()
        }
    }
}
