//
//  AllocationInputBuilder.swift
//  GuitarCoach
//
//  Bridges SwiftData (`Exercise`, `PracticeSession`) to the pure
//  `PracticeAllocationEngine`. Kept separate from the engine itself so the
//  engine's unit tests never need a ModelContext.
//

import Foundation
import SwiftData

enum AllocationInputBuilder {
    /// How many of the most recent sessions to look back through when
    /// computing each exercise's `consecutiveDaysStreak` for the
    /// repetition-penalty term.
    static let lookbackSessionCount = 7

    /// Builds one `ExerciseScoringInput` per eligible exercise.
    ///
    /// - Parameters:
    ///   - exercises: all exercises (the caller filters archived ones out
    ///     beforehand via the `@Query` predicate).
    ///   - recentSessions: the most recent `PracticeSession`s, newest first,
    ///     used only to compute the anti-repetition streak.
    ///   - today: injectable for testability; defaults to now.
    static func makeInputs(
        from exercises: [Exercise],
        recentSessions: [PracticeSession],
        today: Date = .now
    ) -> [ExerciseScoringInput] {
        let recent = recentSessions
            .sorted { $0.date > $1.date }
            .prefix(lookbackSessionCount)

        return exercises.map { exercise in
            ExerciseScoringInput(
                id: exercise.id,
                importance: exercise.importance,
                difficulty: exercise.difficulty,
                proficiency: exercise.proficiency,
                daysSinceLastPracticed: exercise.daysSincePracticed(asOf: today),
                priorityMultiplier: exercise.priority,
                consecutiveDaysStreak: consecutiveStreak(for: exercise, in: Array(recent))
            )
        }
    }

    /// Counts how many of the most recent sessions, walking back from the
    /// newest, included this exercise without a gap. A gap of even one
    /// session resets the count to 0 for that exercise.
    private static func consecutiveStreak(for exercise: Exercise, in recentSessions: [PracticeSession]) -> Int {
        var streak = 0
        for session in recentSessions {
            let included = session.items.contains { $0.exercise?.id == exercise.id && !$0.wasSkipped }
            if included {
                streak += 1
            } else {
                break
            }
        }
        return streak
    }
}
