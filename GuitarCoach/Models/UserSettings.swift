//
//  UserSettings.swift
//  GuitarCoach
//
//  A single-row settings model. GuitarCoachApp guarantees exactly one
//  instance exists (see UserSettings.fetchOrCreate).
//

import Foundation
import SwiftData

@Model
final class UserSettings {
    var sessionDurationMinutes: Int
    var reminderEnabled: Bool
    var reminderHour: Int
    var reminderMinute: Int
    /// 1 = Sunday ... 7 = Saturday, matching Calendar.Component.weekday.
    var reminderWeekdays: [Int]
    /// nil = let the allocation engine decide (2-4 exercises); otherwise a
    /// fixed count the user has chosen to always see.
    var preferredExerciseCount: Int?

    init(
        sessionDurationMinutes: Int = 60,
        reminderEnabled: Bool = true,
        reminderHour: Int = 18,
        reminderMinute: Int = 0,
        reminderWeekdays: [Int] = [1, 2, 3, 4, 5, 6, 7],
        preferredExerciseCount: Int? = nil
    ) {
        self.sessionDurationMinutes = sessionDurationMinutes
        self.reminderEnabled = reminderEnabled
        self.reminderHour = reminderHour
        self.reminderMinute = reminderMinute
        self.reminderWeekdays = reminderWeekdays
        self.preferredExerciseCount = preferredExerciseCount
    }

    /// Ensures exactly one settings row exists and returns it. Call this
    /// once at launch (GuitarCoachApp) before any view reads settings.
    @MainActor
    static func fetchOrCreate(in context: ModelContext) -> UserSettings {
        let existing = try? context.fetch(FetchDescriptor<UserSettings>())
        if let settings = existing?.first {
            return settings
        }
        let created = UserSettings()
        context.insert(created)
        return created
    }
}
