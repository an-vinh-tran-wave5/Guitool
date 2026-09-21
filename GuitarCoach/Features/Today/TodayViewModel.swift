//
//  TodayViewModel.swift
//  GuitarCoach
//
//  Generates today's plan via PracticeAllocationEngine and holds the
//  in-memory manual overrides (minute adjustments, exercise swaps) described
//  in the design doc's Step 3 and Step 6.
//
//  Scope note (M3): the plan here is ephemeral and regenerated on refresh.
//  Turning it into a persisted PracticeSession/SessionItem set, and running
//  the actual countdown timer, is M4 and lands in the next milestone.
//

import Foundation
import SwiftData
import Observation

/// One row of today's plan, after allocation and any manual overrides.
struct PlannedItem: Identifiable, Equatable {
    let id: UUID // the underlying Exercise's id
    var exercise: Exercise
    var minutes: Int
    var reason: String
    var isManuallyOverridden: Bool
}

@MainActor
final class TodayViewModel {
    private(set) var plannedItems: [PlannedItem] = []
    private(set) var isEmpty: Bool = false

    private let modelContext: ModelContext

    init(modelContext: ModelContext) {
        self.modelContext = modelContext
        refresh()
    }

    var totalMinutes: Int {
        plannedItems.reduce(0) { $0 + $1.minutes }
    }

    /// Regenerates the plan from scratch, discarding any manual overrides.
    /// Called on first appearance and when the user pulls to refresh.
    func refresh() {
        let exercises = fetchEligibleExercises()
        guard !exercises.isEmpty else {
            plannedItems = []
            isEmpty = true
            return
        }
        isEmpty = false

        let settings = UserSettings.fetchOrCreate(in: modelContext)
        let recentSessions = fetchRecentSessions()
        let inputs = AllocationInputBuilder.makeInputs(from: exercises, recentSessions: recentSessions)

        let allocated = PracticeAllocationEngine.allocate(
            inputs: inputs,
            sessionMinutes: settings.sessionDurationMinutes,
            preferredCount: settings.preferredExerciseCount
        )

        let exercisesByID = Dictionary(uniqueKeysWithValues: exercises.map { ($0.id, $0) })
        plannedItems = allocated.compactMap { allocation in
            guard let exercise = exercisesByID[allocation.id] else { return nil }
            return PlannedItem(
                id: allocation.id,
                exercise: exercise,
                minutes: allocation.minutes,
                reason: allocation.reason,
                isManuallyOverridden: false
            )
        }
    }

    /// Nudges one exercise's minutes by `delta` (typically ±5), clamped to a
    /// sane single-exercise range. The total is allowed to drift from the
    /// session default here; that's expected once the user is hand-editing.
    func adjustMinutes(for item: PlannedItem, by delta: Int) {
        guard let index = plannedItems.firstIndex(where: { $0.id == item.id }) else { return }
        let newValue = plannedItems[index].minutes + delta
        plannedItems[index].minutes = min(max(newValue, 5), 45)
        plannedItems[index].isManuallyOverridden = true
    }

    /// Replaces the exercise in one slot, keeping the slot's minutes.
    func swap(_ item: PlannedItem, with newExercise: Exercise) {
        guard let index = plannedItems.firstIndex(where: { $0.id == item.id }) else { return }
        plannedItems[index] = PlannedItem(
            id: newExercise.id,
            exercise: newExercise,
            minutes: plannedItems[index].minutes,
            reason: "Manually selected",
            isManuallyOverridden: true
        )
    }

    /// Exercises available to swap in: everything eligible that isn't
    /// already part of today's plan.
    func swapCandidates() -> [Exercise] {
        let plannedIDs = Set(plannedItems.map(\.id))
        return fetchEligibleExercises().filter { !plannedIDs.contains($0.id) }
    }

    /// Turns the current (possibly manually-overridden) plan into a real,
    /// persisted `PracticeSession` + `SessionItem`s (M4). Called once, when
    /// the user taps "Start Today's Practice".
    func startSession() -> PracticeSession {
        let session = PracticeSession(plannedDurationMinutes: totalMinutes)
        modelContext.insert(session)

        for (index, planned) in plannedItems.enumerated() {
            let item = SessionItem(
                session: session,
                exercise: planned.exercise,
                allocatedMinutes: planned.minutes,
                orderIndex: index
            )
            modelContext.insert(item)
        }

        try? modelContext.save()
        return session
    }

    private func fetchEligibleExercises() -> [Exercise] {
        let predicate = #Predicate<Exercise> { !$0.isArchived }
        let descriptor = FetchDescriptor<Exercise>(predicate: predicate, sortBy: [SortDescriptor(\.name)])
        return (try? modelContext.fetch(descriptor)) ?? []
    }

    private func fetchRecentSessions() -> [PracticeSession] {
        var descriptor = FetchDescriptor<PracticeSession>(sortBy: [SortDescriptor(\.date, order: .reverse)])
        descriptor.fetchLimit = AllocationInputBuilder.lookbackSessionCount
        return (try? modelContext.fetch(descriptor)) ?? []
    }
}
