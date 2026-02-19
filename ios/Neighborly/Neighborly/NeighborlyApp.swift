//
//  NeighborlyApp.swift
//  Neighborly
//
//  Created by Jawad Chowdhury on 2/10/26.
//

import SwiftUI

@main
struct NeighborlyApp: App {
    @State private var isLoggedIn = false

    var body: some Scene {
        WindowGroup {
            if isLoggedIn {
                HomeView(isLoggedIn: $isLoggedIn)
            } else {
                LoginView(isLoggedIn: $isLoggedIn)
            }
        }
    }
}
