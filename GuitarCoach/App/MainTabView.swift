//
//  MainTabView.swift
//  GuitarCoach
//
//  The four-tab structure from the design doc's UX section. Bound to
//  AppRouter.shared so a tapped reminder notification (M6) can switch to
//  the Today tab from outside the view hierarchy.
//

import SwiftUI

struct MainTabView: View {
    @State private var router = AppRouter.shared

    var body: some View {
        TabView(selection: $router.selectedTab) {
            TodayView()
                .tabItem { Label("Today", systemImage: "guitars.fill") }
                .tag(AppTab.today)

            ExerciseLibraryView()
                .tabItem { Label("Exercises", systemImage: "list.bullet") }
                .tag(AppTab.exercises)

            ToolsView()
                .tabItem { Label("Tools", systemImage: "tuningfork") }
                .tag(AppTab.tools)

            ProgressHomeView()
                .tabItem { Label("Progress", systemImage: "chart.bar.fill") }
                .tag(AppTab.progress)
        }
    }
}

#Preview {
    MainTabView()
}
