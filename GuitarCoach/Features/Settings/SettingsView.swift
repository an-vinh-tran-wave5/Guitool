//
//  SettingsView.swift
//  GuitarCoach
//
//  Practice schedule, daily reminder (M6), and data management. Reached
//  via the gear icon on Today, not its own tab (Step 3 of the design doc).
//

import SwiftUI
import SwiftData

struct SettingsView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var allSettings: [UserSettings]
    @State private var showResetConfirmation = false
    @State private var notificationPermissionDenied = false

    private static let weekdaySymbols = ["S", "M", "T", "W", "T", "F", "S"] // index 0 = Sunday, matching Calendar.weekday

    private var settings: UserSettings? { allSettings.first }

    var body: some View {
        Form {
            if let settings {
                Section("Practice Schedule") {
                    Stepper(value: Binding(
                        get: { settings.sessionDurationMinutes },
                        set: { settings.sessionDurationMinutes = $0 }
                    ), in: 15...120, step: 5) {
                        LabeledContent("Session length", value: "\(settings.sessionDurationMinutes) min")
                    }

                    Picker("Exercises per session", selection: exerciseCountBinding(settings)) {
                        Text("Let the app decide").tag(0)
                        ForEach(2...4, id: \.self) { count in
                            Text("\(count)").tag(count)
                        }
                    }
                }

                Section("Reminders") {
                    Toggle("Daily reminder", isOn: reminderEnabledBinding(settings))

                    if settings.reminderEnabled {
                        DatePicker("Time", selection: reminderTimeBinding(settings), displayedComponents: .hourAndMinute)
                        weekdayPicker(settings)
                    }

                    if notificationPermissionDenied {
                        Text("Notifications are turned off for GuitarCoach in iOS Settings. Enable them there for reminders to appear.")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Section("Data") {
                Button("Reset All Local Data", role: .destructive) {
                    showResetConfirmation = true
                }
            }
        }
        .navigationTitle("Settings")
        .confirmationDialog(
            "This deletes every exercise, session, and setting stored on this device and reseeds the built-in library. This cannot be undone.",
            isPresented: $showResetConfirmation,
            titleVisibility: .visible
        ) {
            Button("Reset Everything", role: .destructive, action: resetAllData)
            Button("Cancel", role: .cancel) {}
        }
    }

    private func exerciseCountBinding(_ settings: UserSettings) -> Binding<Int> {
        Binding(
            get: { settings.preferredExerciseCount ?? 0 },
            set: { settings.preferredExerciseCount = $0 == 0 ? nil : $0 }
        )
    }

    private func reminderEnabledBinding(_ settings: UserSettings) -> Binding<Bool> {
        Binding(
            get: { settings.reminderEnabled },
            set: { newValue in
                settings.reminderEnabled = newValue
                if newValue {
                    Task {
                        let granted = await ReminderScheduler.requestAuthorizationIfNeeded()
                        if granted {
                            notificationPermissionDenied = false
                            ReminderScheduler.reschedule(using: settings)
                        } else {
                            notificationPermissionDenied = true
                            settings.reminderEnabled = false
                        }
                    }
                } else {
                    ReminderScheduler.reschedule(using: settings)
                }
            }
        )
    }

    private func reminderTimeBinding(_ settings: UserSettings) -> Binding<Date> {
        Binding(
            get: {
                var components = DateComponents()
                components.hour = settings.reminderHour
                components.minute = settings.reminderMinute
                return Calendar.current.date(from: components) ?? .now
            },
            set: { newDate in
                let components = Calendar.current.dateComponents([.hour, .minute], from: newDate)
                settings.reminderHour = components.hour ?? settings.reminderHour
                settings.reminderMinute = components.minute ?? settings.reminderMinute
                ReminderScheduler.reschedule(using: settings)
            }
        )
    }

    private func weekdayPicker(_ settings: UserSettings) -> some View {
        HStack {
            ForEach(1...7, id: \.self) { weekday in
                let isSelected = settings.reminderWeekdays.contains(weekday)
                Button {
                    if isSelected {
                        settings.reminderWeekdays.removeAll { $0 == weekday }
                    } else {
                        settings.reminderWeekdays.append(weekday)
                    }
                    ReminderScheduler.reschedule(using: settings)
                } label: {
                    Text(Self.weekdaySymbols[weekday - 1])
                        .font(.caption.weight(.semibold))
                        .frame(width: 30, height: 30)
                        .background(isSelected ? Color.accentColor : Color.secondary.opacity(0.15), in: Circle())
                        .foregroundStyle(isSelected ? .white : .primary)
                }
                .buttonStyle(.plain)
                .accessibilityLabel(fullWeekdayName(weekday))
                .accessibilityAddTraits(isSelected ? [.isSelected] : [])
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 4)
    }

    private func fullWeekdayName(_ weekday: Int) -> String {
        let names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        return names[weekday - 1]
    }

    /// Deletes every row by fetching and removing individually rather than
    /// via a bulk `delete(model:)` call, so this works on the iOS 17.0
    /// minimum deployment target (the bulk delete API arrived later).
    private func resetAllData() {
        deleteAll(SessionItem.self)
        deleteAll(PracticeSession.self)
        deleteAll(Exercise.self)
        deleteAll(UserSettings.self)
        try? modelContext.save()
        ExerciseSeeder.seedIfNeeded(context: modelContext)
        let freshSettings = UserSettings.fetchOrCreate(in: modelContext)
        ReminderScheduler.reschedule(using: freshSettings)
    }

    private func deleteAll<T: PersistentModel>(_ type: T.Type) {
        guard let all = try? modelContext.fetch(FetchDescriptor<T>()) else { return }
        for object in all {
            modelContext.delete(object)
        }
    }
}

#Preview {
    NavigationStack {
        SettingsView()
    }
    .modelContainer(for: [UserSettings.self], inMemory: true)
}
