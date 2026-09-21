//
//  ReminderScheduler.swift
//  GuitarCoach
//
//  Local-only daily reminder notifications (M6). Note: this is simpler than
//  the "rolling window" sketch in the design doc's Step 5 turned out to
//  need — a UNCalendarNotificationTrigger built from weekday+hour+minute
//  components with repeats:true recurs indefinitely on its own, so only one
//  request per selected weekday (at most 7) is ever pending, well under
//  iOS's 64-pending-notification cap. No foreground re-topping-up required.
//

import Foundation
import UserNotifications

enum ReminderScheduler {
    static let deepLinkUserInfoKey = "deepLink"
    static let deepLinkTodayValue = "today"

    /// Requests notification permission if not already determined. Returns
    /// whether the app is currently authorized to show notifications.
    static func requestAuthorizationIfNeeded() async -> Bool {
        let center = UNUserNotificationCenter.current()
        let settings = await center.notificationSettings()
        switch settings.authorizationStatus {
        case .authorized, .provisional:
            return true
        case .notDetermined:
            do {
                return try await center.requestAuthorization(options: [.alert, .sound, .badge])
            } catch {
                return false
            }
        default:
            return false
        }
    }

    /// Clears any existing reminder requests and, if enabled, schedules one
    /// recurring request per selected weekday. Safe to call every time a
    /// relevant setting changes.
    static func reschedule(using settings: UserSettings) {
        let center = UNUserNotificationCenter.current()
        center.removePendingNotificationRequests(withIdentifiers: allPossibleIdentifiers())

        guard settings.reminderEnabled, !settings.reminderWeekdays.isEmpty else { return }

        for weekday in settings.reminderWeekdays {
            var components = DateComponents()
            components.weekday = weekday
            components.hour = settings.reminderHour
            components.minute = settings.reminderMinute

            let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: true)

            let content = UNMutableNotificationContent()
            content.title = "Time to practice"
            content.body = "Your \(settings.sessionDurationMinutes)-minute session is ready."
            content.sound = .default
            content.userInfo = [deepLinkUserInfoKey: deepLinkTodayValue]

            let request = UNNotificationRequest(identifier: identifier(for: weekday), content: content, trigger: trigger)
            center.add(request)
        }
    }

    private static func identifier(for weekday: Int) -> String {
        "practice-reminder-weekday-\(weekday)"
    }

    private static func allPossibleIdentifiers() -> [String] {
        (1...7).map { identifier(for: $0) }
    }
}
