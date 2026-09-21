//
//  ProgressHomeView.swift
//  GuitarCoach
//
//  Streak, a weekly bar chart, and monthly total (M5 / Step 3 of the
//  design doc). Deliberately plain — no badges, points, or animation for
//  its own sake.
//

import SwiftUI
import SwiftData
import Charts

struct ProgressHomeView: View {
    @Query(sort: \PracticeSession.date, order: .reverse) private var sessions: [PracticeSession]
    @Query(sort: \Exercise.timesPracticed, order: .reverse) private var exercises: [Exercise]

    private var streak: Int {
        ProgressStatsCalculator.currentStreak(sessions: sessions)
    }

    private var weeklyMinutes: [(day: Date, minutes: Int)] {
        ProgressStatsCalculator.weeklyMinutesByDay(sessions: sessions)
    }

    private var monthlyMinutes: Int {
        ProgressStatsCalculator.monthlyMinutes(sessions: sessions)
    }

    private var mostPracticedExercises: [Exercise] {
        Array(exercises.filter { $0.timesPracticed > 0 }.prefix(5))
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    streakCard

                    VStack(alignment: .leading, spacing: 8) {
                        Text("This Week")
                            .font(.headline)
                        weeklyChart
                    }

                    HStack {
                        Text("This month")
                            .foregroundStyle(.secondary)
                        Spacer()
                        Text("\(monthlyMinutes) min")
                            .font(.body.weight(.semibold))
                    }

                    if !mostPracticedExercises.isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Most Practiced")
                                .font(.headline)
                            ForEach(mostPracticedExercises) { exercise in
                                HStack {
                                    Text(exercise.name)
                                    Spacer()
                                    Text("\(exercise.timesPracticed)×")
                                        .foregroundStyle(.secondary)
                                }
                                .font(.subheadline)
                            }
                        }
                    }

                    if sessions.isEmpty {
                        Text("Complete your first session to start tracking progress here.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }
                .padding()
            }
            .navigationTitle("Progress")
        }
    }

    private var streakCard: some View {
        HStack(spacing: 16) {
            Image(systemName: "flame.fill")
                .font(.system(size: 32))
                .foregroundStyle(.orange)
            VStack(alignment: .leading) {
                Text("\(streak) day\(streak == 1 ? "" : "s")")
                    .font(.title.bold())
                Text("Current streak")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 16))
    }

    private var weeklyChart: some View {
        Chart(weeklyMinutes, id: \.day) { entry in
            BarMark(
                x: .value("Day", entry.day, unit: .day),
                y: .value("Minutes", entry.minutes)
            )
            .foregroundStyle(Color.accentColor)
        }
        .frame(height: 160)
        .chartXAxis {
            AxisMarks(values: .stride(by: .day)) { value in
                AxisValueLabel(format: .dateTime.weekday(.abbreviated))
            }
        }
    }
}

#Preview {
    ProgressHomeView()
        .modelContainer(for: [PracticeSession.self, SessionItem.self, Exercise.self], inMemory: true)
}
