//
//  SessionRunner.swift
//  GuitarCoach
//
//  Drives a single practice session (M4): pause/resume/skip/add-time and
//  auto-advance between exercises. Remaining time is always computed from
//  wall-clock timestamps rather than decremented in a loop, so backgrounding
//  the app mid-exercise never desyncs the countdown (Step 1/Step 5 of the
//  design doc).
//

import Foundation
import SwiftData
import Observation

enum SessionRunnerState {
    case running
    case paused
    case finished
}

@MainActor
@Observable
final class SessionRunner {
    private(set) var session: PracticeSession
    private(set) var orderedItems: [SessionItem]
    private(set) var currentItemIndex: Int = 0
    private(set) var state: SessionRunnerState = .running
    private(set) var secondsRemainingInCurrentItem: Int = 0

    private var currentItemStartDate: Date = .now
    private var accumulatedSecondsBeforePause: Int = 0
    private var ticker: Timer?
    private let modelContext: ModelContext
    private let onFinished: () -> Void

    init(session: PracticeSession, modelContext: ModelContext, onFinished: @escaping () -> Void) {
        self.session = session
        self.orderedItems = session.orderedItems
        self.modelContext = modelContext
        self.onFinished = onFinished
        updateRemainingDisplay()
        startTicker()
    }

    deinit {
        ticker?.invalidate()
    }

    var currentItem: SessionItem? {
        orderedItems.indices.contains(currentItemIndex) ? orderedItems[currentItemIndex] : nil
    }

    var isLastItem: Bool {
        currentItemIndex == orderedItems.count - 1
    }

    /// Fraction (0...1) of the *whole session's* allocated time completed so
    /// far, used for the slim progress strip in SessionRunnerView.
    var overallProgress: Double {
        let totalAllocatedSeconds = max(orderedItems.reduce(0) { $0 + $1.allocatedMinutes * 60 }, 1)
        let secondsBeforeCurrentItem = orderedItems.prefix(currentItemIndex).reduce(0) { $0 + $1.allocatedMinutes * 60 }
        let currentAllocated = currentItem.map { $0.allocatedMinutes * 60 } ?? 0
        let currentElapsed = min(elapsedSecondsForCurrentItem(), currentAllocated)
        return Double(secondsBeforeCurrentItem + currentElapsed) / Double(totalAllocatedSeconds)
    }

    // MARK: - Controls

    func pause() {
        guard state == .running else { return }
        accumulatedSecondsBeforePause += Int(Date().timeIntervalSince(currentItemStartDate))
        state = .paused
    }

    func resume() {
        guard state == .paused else { return }
        currentItemStartDate = .now
        state = .running
    }

    func skip() {
        advanceToNextItem(wasSkipped: true)
    }

    /// Adjusts the current exercise's allocated time by `deltaMinutes`
    /// (typically ±2), clamped so it can never drop to zero or below what's
    /// already elapsed.
    func addTime(deltaMinutes: Int) {
        guard let item = currentItem else { return }
        let elapsedMinutes = elapsedSecondsForCurrentItem() / 60
        item.allocatedMinutes = max(elapsedMinutes + 1, item.allocatedMinutes + deltaMinutes)
        updateRemainingDisplay()
    }

    // MARK: - Internal timing

    private func elapsedSecondsForCurrentItem() -> Int {
        let liveElapsed = state == .running ? Int(Date().timeIntervalSince(currentItemStartDate)) : 0
        return accumulatedSecondsBeforePause + liveElapsed
    }

    private func updateRemainingDisplay() {
        guard let item = currentItem else {
            secondsRemainingInCurrentItem = 0
            return
        }
        let remaining = (item.allocatedMinutes * 60) - elapsedSecondsForCurrentItem()
        secondsRemainingInCurrentItem = max(remaining, 0)
    }

    private func startTicker() {
        ticker = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in
                self?.tick()
            }
        }
    }

    private func tick() {
        guard state == .running else { return }
        updateRemainingDisplay()
        if secondsRemainingInCurrentItem <= 0 {
            advanceToNextItem(wasSkipped: false)
        }
    }

    private func advanceToNextItem(wasSkipped: Bool) {
        guard let item = currentItem else { return }

        item.actualSeconds = elapsedSecondsForCurrentItem()
        item.wasSkipped = wasSkipped
        item.bpmAtCompletion = item.exercise?.currentBPM

        if let exercise = item.exercise, !wasSkipped {
            exercise.lastPracticedAt = .now
            exercise.timesPracticed += 1
        }

        if currentItemIndex + 1 < orderedItems.count {
            currentItemIndex += 1
            accumulatedSecondsBeforePause = 0
            currentItemStartDate = .now
            updateRemainingDisplay()
        } else {
            finishSession()
        }
    }

    private func finishSession() {
        state = .finished
        ticker?.invalidate()
        ticker = nil
        session.isComplete = true
        session.actualDurationSeconds = orderedItems.reduce(0) { $0 + $1.actualSeconds }
        try? modelContext.save()
        onFinished()
    }
}
