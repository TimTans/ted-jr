import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Image(systemName: selectedTab == 0 ? "house.fill" : "house")
                    Text("Home")
                }
                .tag(0)

            GroceryListView()
                .tabItem {
                    Image(systemName: selectedTab == 1 ? "list.clipboard.fill" : "list.clipboard")
                    Text("Lists")
                }
                .tag(1)

            RouteView()
                .tabItem {
                    Image(systemName: selectedTab == 2 ? "paperplane.fill" : "paperplane")
                    Text("Route")
                }
                .tag(2)
        }
        .tint(NeighborlyTheme.green)
    }
}

#Preview {
    MainTabView()
}
