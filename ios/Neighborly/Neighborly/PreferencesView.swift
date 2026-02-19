import SwiftUI

// MARK: - Model

import SwiftUI

// Added to fix some issue with destination in HomeView
struct PreferencesView: View {
    var body: some View {
        PreferencesOneScrollView()
    }
}

#Preview {
    PreferencesView()
}


enum TransportMode: String, CaseIterable, Identifiable {
    case walking = "Walking"
    case publicTransport = "Public Transport"
    case car = "Car"

    var id: String { rawValue }

    var systemImage: String {
        switch self {
        case .walking: return "figure.walk"
        case .publicTransport: return "tram.fill"
        case .car: return "car.fill"
        }
    }
}

struct Preferences: Equatable {
    var prioritizeLowestCost: Bool = true
    var prioritizeShortestRoute: Bool = false
    var prioritizeFastestTrip: Bool = false

    var enabledModes: Set<TransportMode> = [.walking, .publicTransport, .car]

    var maxTravelDistanceMiles: Double = 5
    var maxStops: Double = 5

    var wellnessEnabled: Bool = true

    var cholesterolLimit: String = "100 mg"
    var sodiumLimit: String = "1000 mg/Day"
    var sugarLimit: String = "20 g/Day"

    var dietVegan: Bool = false
    var dietGlutenFree: Bool = true
    var dietLowCarb: Bool = false
    var dietKosher: Bool = false
    var dietHalal: Bool = false
    var dietKeto: Bool = false

    var avoidDairy: Bool = false
    var avoidPeanuts: Bool = true
    var avoidShellfish: Bool = false
    var avoidWheat: Bool = false
}

// MARK: - Scroll Offset PreferenceKey

private struct ScrollOffsetKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// MARK: - Reusable UI

struct ToggleRow: View {
    let title: String
    @Binding var isOn: Bool

    var body: some View {
        HStack {
            Text(title).foregroundStyle(.secondary)
            Spacer()
            Toggle("", isOn: $isOn).labelsHidden()
        }
    }
}

struct LabeledTextField: View {
    let title: String
    let placeholder: String
    @Binding var text: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).foregroundStyle(.secondary)

            TextField(placeholder, text: $text)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled(true)
                .padding(14)
                .background(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(Color.gray.opacity(0.08))
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .stroke(Color.black.opacity(0.06), lineWidth: 1)
                )
        }
    }
}

struct CheckRow: View {
    let title: String
    @Binding var checked: Bool

    var body: some View {
        Button {
            checked.toggle()
        } label: {
            HStack(spacing: 10) {
                Image(systemName: checked ? "checkmark.square.fill" : "square")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(checked ? Color.blue : Color.secondary)
                Text(title).foregroundStyle(.secondary)
                Spacer()
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

struct PrimaryButton: View {
    let title: String
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    RoundedRectangle(cornerRadius: 22, style: .continuous)
                        .fill(Color.cyan)
                )
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Single Screen

struct PreferencesOneScrollView: View {
    @State private var prefs = Preferences()

    // When true, show the expanded wellness fields (your second screen content)
    @State private var wellnessExpanded: Bool = false

    // Controls how far user must scroll before expanding wellness
    private let expandThreshold: CGFloat = -120

    var body: some View {
        NavigationStack {
            ZStack {
                Color(.systemGroupedBackground).ignoresSafeArea()

                ScrollView {
                    // Track scroll offset
                    GeometryReader { geo in
                        Color.clear
                            .preference(key: ScrollOffsetKey.self,
                                        value: geo.frame(in: .named("scroll")).minY)
                    }
                    .frame(height: 0)

                    VStack(spacing: 16) {

                        // Priorities
                        VStack(spacing: 14) {
                            ToggleRow(title: "Prioritize Lowest Cost", isOn: $prefs.prioritizeLowestCost)
                            ToggleRow(title: "Prioritize Shortest Route", isOn: $prefs.prioritizeShortestRoute)
                            ToggleRow(title: "Prioritize Fastest Trip", isOn: $prefs.prioritizeFastestTrip)
                        }
                        .padding(14)
                        .background(cardBackground)

                        // Modes (simple version, you can plug your card UI back in)
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Modes of Transport").foregroundStyle(.secondary)
                            Text("⚙️ (Drop your transport cards here)")
                                .foregroundStyle(.secondary)
                                .font(.footnote)
                        }
                        .padding(14)
                        .background(cardBackground)

                        // Sliders (simple placeholder; plug your slider UI back in)
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Max Travel Distance").foregroundStyle(.secondary)
                            Slider(value: $prefs.maxTravelDistanceMiles, in: 1...10, step: 1)

                            Text("Max Number of Stops").foregroundStyle(.secondary)
                            Slider(value: $prefs.maxStops, in: 1...10, step: 1)
                        }
                        .padding(14)
                        .background(cardBackground)

                        // Wellness Section (collapses/expands based on scroll)
                        WellnessSection(
                            prefs: $prefs,
                            expanded: $wellnessExpanded
                        )
                        .padding(.top, 2)

                        PrimaryButton(title: "Save Preferences") {
                            print("Saved:", prefs)
                        }
                        .padding(.top, 8)

                        Spacer(minLength: 90)
                    }
                    .padding(.horizontal, 18)
                    .padding(.top, 12)
                }
                .coordinateSpace(name: "scroll")
                .onPreferenceChange(ScrollOffsetKey.self) { offset in
                    // If user has scrolled down enough, expand wellness automatically
                    if offset < expandThreshold, wellnessExpanded == false {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.9)) {
                            wellnessExpanded = true
                        }
                    }
                }

                // Bottom bar if you want it
                BottomTabBar()
            }
            .navigationTitle("Your Preferences")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Image(systemName: "chevron.left").foregroundStyle(.secondary)
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Circle()
                        .fill(Color.gray.opacity(0.2))
                        .frame(width: 34, height: 34)
                }
            }
        }
    }

    private var cardBackground: some View {
        RoundedRectangle(cornerRadius: 22, style: .continuous)
            .fill(Color.white)
            .shadow(color: .black.opacity(0.03), radius: 10, x: 0, y: 5)
    }
}

// MARK: - Wellness Section (Collapsed -> Expanded)

struct WellnessSection: View {
    @Binding var prefs: Preferences
    @Binding var expanded: Bool

    var body: some View {
        VStack(spacing: 14) {
            // Header row (tap to expand/collapse)
            Button {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.9)) {
                    expanded.toggle()
                }
            } label: {
                HStack {
                    Text("Wellness/Dietary Preferences")
                        .foregroundStyle(.secondary)

                    Spacer()

                    Toggle("", isOn: $prefs.wellnessEnabled)
                        .labelsHidden()
                        .allowsHitTesting(false) // keep tap on header consistent

                    Image(systemName: expanded ? "chevron.up" : "chevron.down")
                        .foregroundStyle(.secondary)
                        .padding(.leading, 6)
                }
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)

            // Always show cholesterol field (matches your first screen)
            LabeledTextField(
                title: "Cholesterol Limit",
                placeholder: "100 mg",
                text: $prefs.cholesterolLimit
            )

            // Expanded portion = your second screen content
            if expanded {
                Divider().opacity(0.15)

                LabeledTextField(
                    title: "Sodium Limit",
                    placeholder: "1000 mg/Day",
                    text: $prefs.sodiumLimit
                )

                LabeledTextField(
                    title: "Sugar Limit",
                    placeholder: "20 g/Day",
                    text: $prefs.sugarLimit
                )

                VStack(alignment: .leading, spacing: 14) {
                    Text("Diet Type").foregroundStyle(.secondary)

                    HStack(alignment: .top, spacing: 24) {
                        VStack(alignment: .leading, spacing: 12) {
                            CheckRow(title: "Vegan", checked: $prefs.dietVegan)
                            CheckRow(title: "Gluten-Free", checked: $prefs.dietGlutenFree)
                            CheckRow(title: "Low Carb", checked: $prefs.dietLowCarb)
                        }
                        VStack(alignment: .leading, spacing: 12) {
                            CheckRow(title: "Kosher", checked: $prefs.dietKosher)
                            CheckRow(title: "Halal", checked: $prefs.dietHalal)
                            CheckRow(title: "Keto", checked: $prefs.dietKeto)
                        }
                    }
                }
                .padding(.top, 6)

                VStack(alignment: .leading, spacing: 14) {
                    Text("Allergens to Avoid").foregroundStyle(.secondary)
                    VStack(alignment: .leading, spacing: 12) {
                        CheckRow(title: "Dairy", checked: $prefs.avoidDairy)
                        CheckRow(title: "Peanuts", checked: $prefs.avoidPeanuts)
                        CheckRow(title: "Shellfish", checked: $prefs.avoidShellfish)
                        CheckRow(title: "Wheat", checked: $prefs.avoidWheat)
                    }
                }
                .padding(.top, 6)
            }
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.03), radius: 10, x: 0, y: 5)
        )
    }
}

// MARK: - Bottom Tab Bar (same as before)

struct BottomTabBar: View {
    var body: some View {
        VStack {
            Spacer()

            ZStack {
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .fill(Color.white)
                    .shadow(color: .black.opacity(0.06), radius: 16, x: 0, y: -2)
                    .frame(height: 74)
                    .padding(.horizontal, 18)

                HStack {
                    Spacer()
                    Image(systemName: "house")
                        .font(.system(size: 22, weight: .semibold))
                        .foregroundStyle(.secondary)

                    Spacer()

                    Circle()
                        .fill(Color.gray.opacity(0.25))
                        .frame(width: 56, height: 56)
                        .overlay(
                            Image(systemName: "plus")
                                .font(.system(size: 22, weight: .bold))
                                .foregroundStyle(.secondary)
                        )
                        .offset(y: -8)

                    Spacer()

                    Image(systemName: "person")
                        .font(.system(size: 22, weight: .semibold))
                        .foregroundStyle(.secondary)
                    Spacer()
                }
                .padding(.horizontal, 34)
                .frame(height: 74)
            }
            .padding(.bottom, 12)
        }
        .ignoresSafeArea(edges: .bottom)
    }
}

// MARK: - Preview

#Preview {
    PreferencesOneScrollView()
}

