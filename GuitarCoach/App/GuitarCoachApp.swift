//
//  GuitarCoachApp.swift
//  GuitarCoach
//
//  App entry point: sets up the SwiftData container, seeds the built-in
//  exercise library on first launch, ensures a single UserSettings row
//  exists before any view reads it, and registers NotificationDelegate so
//  a tapped reminder (M6) can deep-link into the Today tab.
//

import SwiftUI
import SwiftData
import UserNotifications

@main
struct GuitarCoachApp: App {
    let container: ModelContainer

    init() {
        do {
            let schema = Schema(GuitarCoachSchemaV1.models)
            let configuration = ModelConfiguration(schema: schema)
            container = try ModelContainer(
                for: schema,
                migrationPlan: GuitarCoachMigrationPlan.self,
                configurations: [configuration]
            )
        } catch {
            // A local-only store failing to open is unrecoverable for this
            // app (there is no server fallback), so this is one of the few
            // places a fatalError is appropriate rather than papering over
            // corrupted on-disk state.
            fatalError("Could not create SwiftData ModelContainer: \(error)")
        }

        UNUserNotificationCenter.current().delegate = NotificationDelegate.shared
    }

    var body: some Scene {
        WindowGroup {
            MainTabView()
                .task {
                    let context = container.mainContext
                    ExerciseSeeder.seedIfNeeded(context: context)
                    let settings = UserSettings.fetchOrCreate(in: context)
                    ReminderScheduler.reschedule(using: settings)
                }
        }
        .modelContainer(container)
    }
}
