//
//  PracticeAllocationEngineTests.swift
//  GuitarCoachTests
//
//  Add this file to a "GuitarCoachTests" unit test target in Xcode
//  (File > New > Target > Unit Testing Bundle, then add this file to it,
//  and add PracticeAllocationEngine.swift to that target's "Compile
//  Sources" too since it's a plain Swift file with no UI dependency).
//
//  Covers M2's acceptance test: the Step 6 worked example, plus the edge
//  cases called out in the implementation plan (never practiced, tied
//  scores, a single-exercise library).
//

import XCTest
@testable import GuitarCoach

final class PracticeAllocationEngineTests: XCTestCase {

    // MARK: - The design doc's worked example

    func testWorkedExampleMatchesDesignDoc() {
        let alternatePicking = ExerciseScoringInput(
            id: UUID(), importance: 5, difficulty: 4, proficiency: 2,
            daysSinceLastPracticed: 3
        )
        let minorPentatonic = ExerciseScoringInput(
            id: UUID(), importance: 3, difficulty: 3, proficiency: 3,
            daysSinceLastPracticed: 2
        )
        let stringBending = ExerciseScoringInput(
            id: UUID(), importance: 2, difficulty: 1, proficiency: 4,
            daysSinceLastPracticed: 1
        )

        let allocated = PracticeAllocationEngine.allocate(
            inputs: [alternatePicking, minorPentatonic, stringBending],
            sessionMinutes: 60,
            preferredCount: 3
        )

        XCTAssertEqual(allocated.count, 3)
        XCTAssertEqual(allocated.reduce(0) { $0 + $1.minutes }, 60)

        let minutesByID = Dictionary(uniqueKeysWithValues: allocated.map { ($0.id, $0.minutes) })
        XCTAssertEqual(minutesByID[alternatePicking.id], 30)
        XCTAssertEqual(minutesByID[minorPentatonic.id], 20)
        XCTAssertEqual(minutesByID[stringBending.id], 10)

        // Highest-scored exercise should always be first (used to attribute
        // any rounding residual, and to sort the Today list).
        XCTAssertEqual(allocated.first?.id, alternatePicking.id)
    }

    // MARK: - Edge cases

    func testEmptyLibraryReturnsEmptyPlan() {
        let allocated = PracticeAllocationEngine.allocate(inputs: [])
        XCTAssertTrue(allocated.isEmpty)
    }

    func testSingleExerciseLibraryGetsTheWholeSession() {
        let only = ExerciseScoringInput(
            id: UUID(), importance: 3, difficulty: 3, proficiency: 3,
            daysSinceLastPracticed: 0
        )
        let allocated = PracticeAllocationEngine.allocate(inputs: [only], sessionMinutes: 60)
        XCTAssertEqual(allocated.count, 1)
        XCTAssertEqual(allocated.first?.minutes, 60)
    }

    func testTiedScoresSplitTheSessionEvenly() {
        let a = ExerciseScoringInput(id: UUID(), importance: 3, difficulty: 3, proficiency: 3, daysSinceLastPracticed: 3)
        let b = ExerciseScoringInput(id: UUID(), importance: 3, difficulty: 3, proficiency: 3, daysSinceLastPracticed: 3)
        let c = ExerciseScoringInput(id: UUID(), importance: 3, difficulty: 3, proficiency: 3, daysSinceLastPracticed: 3)

        let allocated = PracticeAllocationEngine.allocate(inputs: [a, b, c], sessionMinutes: 60, preferredCount: 3)

        XCTAssertEqual(allocated.count, 3)
        XCTAssertEqual(allocated.reduce(0) { $0 + $1.minutes }, 60)
        for item in allocated {
            XCTAssertEqual(item.minutes, 20)
        }
    }

    func testNeverPracticedExerciseIsTreatedAsMaximallyOverdue() {
        let neverPracticed = ExerciseScoringInput(
            id: UUID(), importance: 3, difficulty: 3, proficiency: 3,
            daysSinceLastPracticed: nil
        )
        let practicedYesterday = ExerciseScoringInput(
            id: UUID(), importance: 3, difficulty: 3, proficiency: 3,
            daysSinceLastPracticed: 1
        )

        let scoreNever = PracticeAllocationEngine.score(for: neverPracticed)
        let scoreRecent = PracticeAllocationEngine.score(for: practicedYesterday)

        XCTAssertGreaterThan(scoreNever, scoreRecent)
    }

    func testRepetitionPenaltyReducesScoreForConsecutiveDays() {
        let base = ExerciseScoringInput(
            id: UUID(), importance: 4, difficulty: 3, proficiency: 3,
            daysSinceLastPracticed: 1, consecutiveDaysStreak: 0
        )
        let repeated = ExerciseScoringInput(
            id: UUID(), importance: 4, difficulty: 3, proficiency: 3,
            daysSinceLastPracticed: 1, consecutiveDaysStreak: 3
        )

        XCTAssertLessThan(
            PracticeAllocationEngine.score(for: repeated),
            PracticeAllocationEngine.score(for: base)
        )
    }

    func testAllocationNeverExceedsSessionMinutesEvenWithManyExercises() {
        let inputs = (0..<10).map { index in
            ExerciseScoringInput(
                id: UUID(),
                importance: (index % 5) + 1,
                difficulty: (index % 5) + 1,
                proficiency: (index % 5) + 1,
                daysSinceLastPracticed: index
            )
        }
        let allocated = PracticeAllocationEngine.allocate(inputs: inputs, sessionMinutes: 60)
        XCTAssertEqual(allocated.reduce(0) { $0 + $1.minutes }, 60)
        XCTAssertTrue(allocated.count >= 2 && allocated.count <= 4)
    }
}
