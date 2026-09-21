//
//  AppRouter.swift
//  GuitarCoach
//
//  A tiny shared observable that lets a tapped notification (handled in
//  NotificationDelegate, which has no view hierarchy of its own) switch
//  MainTabView to the Today tab — the "deep link into Today/Practice"
//  requirement from Step 7/M6 of the design doc.
//

import Observation

enum AppTab: Hashable {
    case today
    case exercises
    case tools
    case progress
}

@Observable
final class AppRouter {
    static let shared = AppRouter()

    var selectedTab: AppTab = .today

    private init() {}
}
