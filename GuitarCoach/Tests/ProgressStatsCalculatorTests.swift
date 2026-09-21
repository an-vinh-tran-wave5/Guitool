//
//  ProgressStatsCalculatorTests.swift
//  GuitarCoachTests
//
//  Add to the same GuitarCoachTests target as PracticeAllocationEngineTests
//  (see the top-level README for target setup).
//

import XCTest
@testable import GuitarCoach

final class ProgressStatsCalculatorTests: XCTestCase {
    private let calendar = Calendar.current

    private func session(daysAgo: Int, complete: Bool = true, minutes: Int = 30) -> PracticeSession {
        let date = calendar.date(byAdding: .day, value: -daysAgo, to: .now) ?? .now
        return PracticeSession(date: date, plannedDurationMinutes: 60, actualDurationSeconds: minutes * 60, isComplete: complete)
    }

    func testStreakCountsConsecutiveCompletedDays() {
        let sessions = [session(daysAgo: 0), session(daysAgo: 1), session(daysAgo: 2)]
        XCTAssertEqual(ProgressStatsCalculator.currentStreak(sessions: sessions), 3)
    }

    func testStreakStillCountsThroughYesterdayIfTodayNotYetDone() {
        let sessions = [session(daysAgo: 1), session(daysAgo: 2)]
        XCTAssertEqual(ProgressStatsCalculator.currentStreak(sessions: sessions), 2)
    }

    func testStreakBreaksOnAGap() {
        let sessions = [session(daysAgo: 0), session(daysAgo: 2)] // missing daysAgo: 1
        XCTAssertEqual(ProgressStatsCalculator.currentStreak(sessions: sessions), 1)
    }

    func testIncompleteSessionsDoNotCountTowardStreak() {
        let sessions = [session(daysAgo: 0, complete: false)]
        XCTAssertEqual(ProgressStatsCalculator.currentStreak(sessions: sessions), 0)
    }

    func testTotalMinutesSumsOnlyCompletedSessionsSinceDate() {
        let weekAgo = calendar.date(byAdding: .day, value: -7, to: .now) ?? .now
        let sessions = [session(daysAgo: 0, minutes: 30), session(daysAgo: 1, minutes: 20), session(daysAgo: 10, minutes: 45)]
        XCTAssertEqual(ProgressStatsCalculator.totalMinutes(sessions: sessions, since: weekAgo), 50)
    }
}
