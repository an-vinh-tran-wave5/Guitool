//
//  PracticeAllocationEngine.swift
//  GuitarCoach
//
//  Pure, dependency-free implementation of the scoring/allocation algorithm
//  from the design doc's Step 6. Deliberately has no SwiftData, SwiftUI, or
//  Foundation-date dependency in its core so it stays trivially unit
//  testable; callers (TodayViewModel) are responsible for turning an
//  `Exercise` into an `ExerciseScoringInput`.
//

import Foundation

/// Everything the engine needs to score one exercise, decoupled from
/// SwiftData so the algorithm can be unit tested with plain values.
struct ExerciseScoringInput: Identifiable, Equatable {
    let id: UUID
    /// 1...5
    let importance: Int
    /// 1...5
    let difficulty: Int
    /// 1...5 (higher = more confident). weaknessGap = 5 - proficiency.
    let proficiency: Int
    /// nil = never practiced, treated as maximally overdue.
    let daysSinceLastPracticed: Int?
    /// 0.5...1.5 user override multiplier. 1.0 = neutral.
    let priorityMultiplier: Double
    /// How many of the last N sessions in a row included this exercise.
    /// Used only to gently discourage picking the same exercises every day.
    let consecutiveDaysStreak: Int

    init(
        id: UUID,
        importance: Int,
        difficulty: Int,
        proficiency: Int,
        daysSinceLastPracticed: Int?,
        priorityMultiplier: Double = 1.0,
        consecutiveDaysStreak: Int = 0
    ) {
        self.id = id
        self.importance = importance
        self.difficulty = difficulty
        self.proficiency = proficiency
        self.daysSinceLastPracticed = daysSinceLastPracticed
        self.priorityMultiplier = priorityMultiplier
        self.consecutiveDaysStreak = consecutiveDaysStreak
    }
}

struct AllocatedExercise: Identifiable, Equatable {
    let id: UUID
    let minutes: Int
    let score: Double
    /// A short, human-readable explanation shown under the exercise on the
    /// Today screen, e.g. "High importance + weak".
    let reason: String
}

enum PracticeAllocationEngine {
    static let defaultSessionMinutes = 60
    static let minMinutesPerExercise = 10
    static let maxMinutesPerExercise = 30
    static let minSelectedExercises = 2
    static let maxSelectedExercises = 4

    // MARK: - Scoring

    /// score = (0.30*importance + 0.15*difficulty + 0.30*weaknessGap + 0.25*recencyBoost)
    ///          * priorityMultiplier - repetitionPenalty
    static func score(for input: ExerciseScoringInput) -> Double {
        let weaknessGap = Double(5 - input.proficiency)
        let recencyBoost: Double
        if let days = input.daysSinceLastPracticed {
            recencyBoost = min(Double(days) / 7.0, 1.0) * 5.0
        } else {
            recencyBoost = 5.0
        }
        let repetitionPenalty = min(Double(max(input.consecutiveDaysStreak, 0)) * 0.4, 1.5)

        let base = 0.30 * Double(input.importance)
            + 0.15 * Double(input.difficulty)
            + 0.30 * weaknessGap
            + 0.25 * recencyBoost

        return base * input.priorityMultiplier - repetitionPenalty
    }

    // MARK: - Allocation

    /// Ranks every input by score, keeps the top few, and turns their scores
    /// directly into minutes that sum to `sessionMinutes`.
    ///
    /// - Parameters:
    ///   - inputs: every eligible (non-archived) exercise, already converted
    ///     to scoring inputs.
    ///   - sessionMinutes: total minutes to distribute (default 60).
    ///   - preferredCount: an explicit exercise count from UserSettings, or
    ///     nil to let the engine pick 2-4 based on library size.
    static func allocate(
        inputs: [ExerciseScoringInput],
        sessionMinutes: Int = defaultSessionMinutes,
        preferredCount: Int? = nil
    ) -> [AllocatedExercise] {
        guard !inputs.isEmpty else { return [] }

        let scored = inputs
            .map { (input: $0, score: score(for: $0)) }
            .sorted { $0.score > $1.score }

        let naturalCount = min(max(minSelectedExercises, min(3, scored.count)), maxSelectedExercises)
        let count = min(max(preferredCount ?? naturalCount, 1), scored.count)
        let selected = Array(scored.prefix(count))

        // The 10-30 minute clamp exists to keep a multi-exercise session
        // balanced; it doesn't make sense when there's only one exercise to
        // give the whole session to (a 1-exercise library, or
        // preferredCount == 1), so that case skips it entirely.
        guard selected.count > 1 else {
            let only = selected[0]
            return [AllocatedExercise(id: only.input.id, minutes: sessionMinutes, score: only.score, reason: reason(for: only.input))]
        }

        // Scores can be zero or negative in pathological inputs (e.g. every
        // exercise maxed on proficiency with no priority boost); floor each
        // at a small positive value so proportional allocation never divides
        // by zero and every selected exercise still gets some time.
        let flooredScores = selected.map { max($0.score, 0.05) }
        let totalScore = flooredScores.reduce(0, +)

        var minutes = flooredScores.map { raw -> Int in
            let exact = Double(sessionMinutes) * raw / totalScore
            let roundedToFive = Int((exact / 5.0).rounded()) * 5
            return min(max(roundedToFive, minMinutesPerExercise), maxMinutesPerExercise)
        }

        // Rounding to the nearest 5 (and the 10-30 clamp) can leave the total
        // a few minutes short of or over `sessionMinutes`. Push the
        // remainder onto the top-scored exercise, which is the one the
        // session cares most about getting right.
        let residual = sessionMinutes - minutes.reduce(0, +)
        if residual != 0, let first = minutes.first {
            minutes[0] = min(max(first + residual, minMinutesPerExercise), maxMinutesPerExercise)
        }

        return zip(selected, minutes).map { entry, mins in
            AllocatedExercise(id: entry.input.id, minutes: mins, score: entry.score, reason: reason(for: entry.input))
        }
    }

    // MARK: - Reasoning

    /// Builds the short "why" string shown on the Today screen.
    static func reason(for input: ExerciseScoringInput) -> String {
        var parts: [String] = []

        if input.importance >= 4 {
            parts.append("high importance")
        }
        if input.proficiency <= 2 {
            parts.append("weak")
        } else if input.proficiency == 3 {
            parts.append("needs work")
        }
        if input.daysSinceLastPracticed == nil {
            parts.append("never practiced")
        } else if let days = input.daysSinceLastPracticed, days >= 5 {
            parts.append("overdue")
        }

        if parts.isEmpty {
            parts.append("keeping this sharp")
        }

        let joined = parts.joined(separator: " + ")
        return joined.prefix(1).uppercased() + joined.dropFirst()
    }
}
