//
//  SessionItem.swift
//  GuitarCoach
//
//  One exercise's slot within a single PracticeSession: how much time it was
//  allocated, how much was actually spent, and whether it was skipped.
//

import Foundation
import SwiftData

@Model
final class SessionItem {
    var id: UUID

    var session: PracticeSession?
    var exercise: Exercise?

    /// Minutes this exercise was given by the allocation engine (or the
    /// user's manual override) when the session started.
    var allocatedMinutes: Int
    /// Actual time spent, tracked continuously while the timer runs.
    var actualSeconds: Int
    var wasSkipped: Bool
    var orderIndex: Int

    /// Captures the exercise's currentBPM at the moment this item finished,
    /// so BPM progression can be charted later without a separate table.
    var bpmAtCompletion: Int?

    init(
        id: UUID = UUID(),
        session: PracticeSession? = nil,
        exercise: Exercise? = nil,
        allocatedMinutes: Int,
        orderIndex: Int,
        actualSeconds: Int = 0,
        wasSkipped: Bool = false,
        bpmAtCompletion: Int? = nil
    ) {
        self.id = id
        self.session = session
        self.exercise = exercise
        self.allocatedMinutes = allocatedMinutes
        self.orderIndex = orderIndex
        self.actualSeconds = actualSeconds
        self.wasSkipped = wasSkipped
        self.bpmAtCompletion = bpmAtCompletion
    }
}
