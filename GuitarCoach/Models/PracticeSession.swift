//
//  PracticeSession.swift
//  GuitarCoach
//
//  One day's practice session: the generated (or overridden) plan, and the
//  outcome once it's run.
//

import Foundation
import SwiftData

@Model
final class PracticeSession {
    var id: UUID
    var date: Date
    var plannedDurationMinutes: Int
    var actualDurationSeconds: Int
    var isComplete: Bool

    @Relationship(deleteRule: .cascade, inverse: \SessionItem.session)
    var items: [SessionItem] = []

    init(
        id: UUID = UUID(),
        date: Date = .now,
        plannedDurationMinutes: Int = 60,
        actualDurationSeconds: Int = 0,
        isComplete: Bool = false
    ) {
        self.id = id
        self.date = date
        self.plannedDurationMinutes = plannedDurationMinutes
        self.actualDurationSeconds = actualDurationSeconds
        self.isComplete = isComplete
    }

    var orderedItems: [SessionItem] {
        items.sorted { $0.orderIndex < $1.orderIndex }
    }
}
