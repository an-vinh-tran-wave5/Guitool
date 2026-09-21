//
//  ProgressStatsCalculator.swift
//  GuitarCoach
//
//  Pure functions over [PracticeSession] for M5's streak/weekly/monthly
//  numbers. Kept separate from ProgressHomeView so the math is unit
//  testable without standing up a SwiftUI view.
//

import Foundation

enum ProgressStatsCalculator {

    /// Consecutive days (walking backward from `today`) with at least one
    /// completed session. If there's no completed session yet today, the
    /// streak is still counted through yesterday (so it doesn't reset to 0
    /// first thing in the morning before you've practiced).
    static func currentStreak(sessions: [PracticeSession], asOf today: Date = .now, calendar: Calendar = .current) -> Int {
        let completedDays = Set(sessions.filter { $0.isComplete }.map { calendar.startOfDay(for: $0.date) })
        guard !completedDays.isEmpty else { return 0 }

        var cursor = calendar.startOfDay(for: today)
        if !completedDays.contains(cursor) {
            guard let yesterday = calendar.date(byAdding: .day, value: -1, to: cursor) else { return 0 }
            cursor = yesterday
        }

        var streak = 0
        while completedDays.contains(cursor) {
            streak += 1
            guard let previous = calendar.date(byAdding: .day, value: -1, to: cursor) else { break }
            cursor = previous
        }
        return streak
    }

    /// Minutes practiced per day for the calendar week containing `date`,
    /// oldest first. Used for the weekly bar chart.
    static func weeklyMinutesByDay(
        sessions: [PracticeSession],
        weekContaining date: Date = .now,
        calendar: Calendar = .current
    ) -> [(day: Date, minutes: Int)] {
        guard let weekInterval = calendar.dateInterval(of: .weekOfYear, for: date) else { return [] }
        var result: [(day: Date, minutes: Int)] = []
        var day = weekInterval.start
        while day < weekInterval.end {
            let minutes = sessions
                .filter { $0.isComplete && calendar.isDate($0.date, inSameDayAs: day) }
                .reduce(0) { $0 + $1.actualDurationSeconds / 60 }
            result.append((day, minutes))
            guard let nextDay = calendar.date(byAdding: .day, value: 1, to: day) else { break }
            day = nextDay
        }
        return result
    }

    /// Total completed minutes since `startDate` (inclusive).
    static func totalMinutes(sessions: [PracticeSession], since startDate: Date) -> Int {
        sessions
            .filter { $0.isComplete && $0.date >= startDate }
            .reduce(0) { $0 + $1.actualDurationSeconds / 60 }
    }

    /// Total completed minutes for the calendar month containing `date`.
    static func monthlyMinutes(sessions: [PracticeSession], monthContaining date: Date = .now, calendar: Calendar = .current) -> Int {
        guard let monthInterval = calendar.dateInterval(of: .month, for: date) else { return 0 }
        return sessions
            .filter { $0.isComplete && monthInterval.contains($0.date) }
            .reduce(0) { $0 + $1.actualDurationSeconds / 60 }
    }
}
