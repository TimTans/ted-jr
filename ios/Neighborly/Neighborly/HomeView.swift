import SwiftUI
import Auth

struct HomeView: View {
    @Environment(AuthController.self) private var authController

    var userDisplayName: String {
        if let email = authController.currentUser?.email,
           let firstPart = email.split(separator: "@").first {
            return String(firstPart).capitalized
        }
        return "John Doe"
    }

    var body: some View {
        NavigationStack {
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 18) {
                    topHeader
                    heroCard
                    summaryCards
                    statsRow
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 24)
            }
            .background(Color(red: 0.97, green: 0.96, blue: 0.95).ignoresSafeArea())
            .toolbar(.hidden, for: .navigationBar)
        }
    }
}

// MARK: - Sections
private extension HomeView {
    var topHeader: some View {
        HStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(red: 0.18, green: 0.48, blue: 0.34),
                                Color(red: 0.33, green: 0.73, blue: 0.53)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 48, height: 48)

                Text("N")
                    .font(.system(size: 24, weight: .bold, design: .serif))
                    .foregroundStyle(.white)
            }

            Text("Neighborly")
                .font(.system(size: 24, weight: .heavy, design: .serif))
                .foregroundStyle(Color.black.opacity(0.9))
                .lineLimit(1)
                .minimumScaleFactor(0.8)

            Spacer()

            ZStack(alignment: .topTrailing) {
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color.white.opacity(0.65))
                    .frame(width: 48, height: 48)

                Image(systemName: "bell")
                    .font(.system(size: 20))
                    .foregroundStyle(Color.black.opacity(0.6))

                Circle()
                    .fill(Color.red)
                    .frame(width: 8, height: 8)
                    .offset(x: 3, y: -3)
            }

            ZStack {
                RoundedRectangle(cornerRadius: 14)
                    .fill(
                        LinearGradient(
                            colors: [Color.orange, Color.orange.opacity(0.8)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 48, height: 48)

                Text(initials(from: userDisplayName))
                    .font(.system(size: 18, weight: .bold))
                    .foregroundStyle(.white)
            }
        }
    }

    var heroCard: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 30)
                .fill(
                    LinearGradient(
                        colors: [
                            Color(red: 0.10, green: 0.33, blue: 0.24),
                            Color(red: 0.25, green: 0.64, blue: 0.45)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Circle()
                .fill(Color.white.opacity(0.05))
                .frame(width: 170, height: 170)
                .offset(x: 100, y: -45)

            Circle()
                .fill(Color.white.opacity(0.04))
                .frame(width: 140, height: 140)
                .offset(x: 60, y: 110)

            VStack(alignment: .leading, spacing: 14) {
                Text("Good morning")
                    .font(.system(size: 18, weight: .regular))
                    .foregroundStyle(.white.opacity(0.8))

                Text(userDisplayName)
                    .font(.system(size: 28, weight: .heavy, design: .serif))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)

                (
                    Text("Your optimized route is ready — ")
                        .foregroundStyle(.white.opacity(0.82))
                    + Text("3 stores")
                        .foregroundStyle(Color(red: 0.73, green: 0.88, blue: 0.67))
                        .fontWeight(.bold)
                    + Text(", 12 items, saving ")
                        .foregroundStyle(.white.opacity(0.82))
                    + Text("$6.70")
                        .foregroundStyle(Color(red: 0.73, green: 0.88, blue: 0.67))
                        .fontWeight(.bold)
                )
                .font(.system(size: 15))
                .fixedSize(horizontal: false, vertical: true)

                Button {
                    // action
                } label: {
                    HStack {
                        Spacer()
                        Text("Start Trip")
                            .font(.system(size: 18, weight: .bold))
                        Image(systemName: "arrow.right")
                            .font(.system(size: 18, weight: .semibold))
                        Spacer()
                    }
                    .foregroundStyle(Color(red: 0.17, green: 0.42, blue: 0.30))
                    .padding(.vertical, 18)
                    .background(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 22))
                }
                .padding(.top, 4)
            }
            .padding(22)
        }
        .frame(height: 300)
    }

    var summaryCards: some View {
        HStack(spacing: 12) {
            budgetCard
                .frame(maxWidth: .infinity * 0.75)

            savedCard
                .frame(maxWidth: .infinity)
        }
    }

    var budgetCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color.green.opacity(0.08))
                    .frame(width: 48, height: 48)
                    .overlay {
                        Text("💰")
                            .font(.title3)
                    }

                Text("BUDGET")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Color.gray)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
            }

            Text("$57.31")
                .font(.system(size: 26, weight: .heavy, design: .serif))
                .foregroundStyle(Color(red: 0.18, green: 0.47, blue: 0.35))
                .lineLimit(2)
                .minimumScaleFactor(0.7)

            Text("of $120.00")
                .font(.system(size: 16))
                .foregroundStyle(Color.gray)

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(Color.gray.opacity(0.18))
                        .frame(height: 10)

                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.25, green: 0.65, blue: 0.45),
                                    Color(red: 0.20, green: 0.48, blue: 0.34)
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geo.size.width * 0.48, height: 10)
                }
            }
            .frame(height: 10)

            Spacer(minLength: 0)
        }
        .padding(18)
        .frame(height: 210)
        .background(Color.white.opacity(0.72))
        .clipShape(RoundedRectangle(cornerRadius: 28))
    }

    var savedCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color.orange.opacity(0.12))
                    .frame(width: 48, height: 48)
                    .overlay {
                        Text("📈")
                            .font(.title3)
                    }

                Text("SAVED")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Color.gray)
            }

            Text("$42.80")
                .font(.system(size: 30, weight: .heavy, design: .serif))
                .foregroundStyle(Color(red: 0.83, green: 0.45, blue: 0.03))

            Text("this month")
                .font(.system(size: 16))
                .foregroundStyle(Color.gray)

            HStack(alignment: .bottom, spacing: 6) {
                miniBar(height: 16, active: false)
                miniBar(height: 24, active: false)
                miniBar(height: 18, active: false)
                miniBar(height: 30, active: false)
                miniBar(height: 22, active: false)
                miniBar(height: 34, active: false)
                miniBar(height: 20, active: false)
                miniBar(height: 28, active: true)
            }
            .padding(.top, 6)

            Spacer(minLength: 0)
        }
        .padding(18)
        .frame(height: 210)
        .background(Color.white.opacity(0.72))
        .clipShape(RoundedRectangle(cornerRadius: 28))
    }

    var statsRow: some View {
        HStack(spacing: 10) {
            smallStatCard(icon: "⏱️", value: "34m", label: "avg trip")
            smallStatCard(icon: "📍", value: "12.4", label: "miles\nsaved")
            smallStatCard(icon: "📦", value: "89", label: "tracked")
            smallStatCard(icon: "🔔", value: "3", label: "alerts")
        }
    }

    func smallStatCard(icon: String, value: String, label: String) -> some View {
        VStack(spacing: 8) {
            Text(icon)
                .font(.title3)

            Text(value)
                .font(.system(size: 18, weight: .bold))
                .foregroundStyle(Color.black.opacity(0.88))

            Text(label)
                .font(.system(size: 12))
                .multilineTextAlignment(.center)
                .foregroundStyle(Color.gray)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 120)
        .background(Color.white.opacity(0.72))
        .clipShape(RoundedRectangle(cornerRadius: 22))
    }

    func miniBar(height: CGFloat, active: Bool) -> some View {
        RoundedRectangle(cornerRadius: 5)
            .fill(
                active
                ? AnyShapeStyle(
                    LinearGradient(
                        colors: [
                            Color(red: 0.93, green: 0.64, blue: 0.29),
                            Color(red: 0.85, green: 0.48, blue: 0.08)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                : AnyShapeStyle(Color.orange.opacity(0.18))
            )
            .frame(width: 18, height: height)
    }

    func initials(from name: String) -> String {
        let parts = name.split(separator: " ")
        let initials = parts.prefix(2).compactMap { $0.first }.map(String.init).joined()
        return initials.isEmpty ? "JD" : initials.uppercased()
    }
}

#Preview {
    HomeView()
        .environment(AuthController())
}
