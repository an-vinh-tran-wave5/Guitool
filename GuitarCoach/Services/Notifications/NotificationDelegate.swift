//
//  NotificationDelegate.swift
//  GuitarCoach
//
//  Handles a tapped reminder notification and routes it to the Today tab
//  via AppRouter. Registered as UNUserNotificationCenter's delegate in
//  GuitarCoachApp.init().
//

import UserNotifications

final class NotificationDelegate: NSObject, UNUserNotificationCenterDelegate {
    static let shared = NotificationDelegate()

    private override init() {}

    /// Notification tapped while the app was backgrounded or not running.
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo
        if userInfo[ReminderScheduler.deepLinkUserInfoKey] as? String == ReminderScheduler.deepLinkTodayValue {
            Task { @MainActor in
                AppRouter.shared.selectedTab = .today
            }
        }
        completionHandler()
    }

    /// Lets the reminder still show (banner + sound) if it fires while the
    /// app is open in the foreground, instead of being silently suppressed.
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.banner, .sound])
    }
}
