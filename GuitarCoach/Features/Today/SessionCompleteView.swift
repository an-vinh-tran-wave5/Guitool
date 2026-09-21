//
//  SessionCompleteView.swift
//  GuitarCoach
//
//  One calm summary screen (M4 / Step 3 of the design doc): total time,
//  exercises completed, any BPM increases, and the current streak. No
//  points, no badges, no confetti.
//

import SwiftUI
import SwiftData

struct SessionCompleteView: View {
    let session: PracticeSession
    let onDone: () -> Void

    @Query private var allSessions: [PracticeSession]

    private var completedCount: Int {
        session.orderedItems.filter { !$0.wasSkipped }.count
    }

    private var bpmImprovements: [(name: String, from: Int, to: Int)] {
        session.orderedItems.compactMap { item -> (String, Int, Int)? in
            guard let exercise = item.exercise, let completedBPM = item.bpmAtCompletion else { return nil }
            let recommended = exercise.recommendedBPM ?? completedBPM
            guard completedBPM > recommended else { return nil }
            return (exercise.name, recommended, completedBPM)
        }
    }

    private var streak: Int {
        ProgressStatsCalculator.currentStreak(sessions: allSessions)
    }

    var body: some View {
        VStack(spacing: 20) {
            Spacer()

            Text("Session Complete \u{1F3B8}")
                .font(.title.bold())

            VStack(spacing: 14) {
                statRow(label: "Total time practiced", value: formattedDuration(session.actualDurationSeconds))
                statRow(label: "Exercises completed", value: "\(completedCount) of \(session.orderedItems.count)")
                statRow(label: "Current streak", value: "\(streak) day\(streak == 1 ? "" : "s")")
            }
            .padding()
            .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 16))
            .padding(.horizontal)

            if !bpmImprovements.isEmpty {
                VStack(alignment: .leading, spacing: 6) {
                    Text("BPM improvements")
                        .font(.subheadline.bold())
                    ForEach(bpmImprovements, id: \.name) { improvement in
                        Text("\(improvement.name): \(improvement.from) → \(improvement.to) BPM")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 32)
            }

            Spacer()

            Button(action: onDone) {
                Text("Done")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
            }
            .buttonStyle(.borderedProminent)
            .padding(.horizontal)
            .padding(.bottom)
        }
    }

    private func statRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .foregroundStyle(.secondary)
            Spacer()
            Text(value)
                .font(.body.weight(.semibold))
        }
    }

    private func formattedDuration(_ totalSeconds: Int) -> String {
        let minutes = totalSeconds / 60
        let seconds = totalSeconds % 60
        return minutes > 0 ? "\(minutes)m \(seconds)s" : "\(seconds)s"
    }
}
