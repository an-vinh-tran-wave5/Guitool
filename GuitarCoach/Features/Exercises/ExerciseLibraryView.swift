//
//  ExerciseLibraryView.swift
//  GuitarCoach
//
//  Lists every seeded (and, from Phase 2, custom) exercise grouped by
//  category, per the design doc's Step 3. Satisfies M1's acceptance test.
//

import SwiftUI
import SwiftData

struct ExerciseLibraryView: View {
    @Query(sort: \Exercise.name) private var exercises: [Exercise]

    private var groupedByCategory: [(category: ExerciseCategory, exercises: [Exercise])] {
        ExerciseCategory.allCases.compactMap { category in
            let matches = exercises.filter { $0.category == category && !$0.isArchived }
            return matches.isEmpty ? nil : (category, matches)
        }
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(groupedByCategory, id: \.category) { group in
                    Section(group.category.displayName) {
                        ForEach(group.exercises) { exercise in
                            NavigationLink(value: exercise.id) {
                                ExerciseRow(exercise: exercise)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Exercises")
            .navigationDestination(for: UUID.self) { exerciseID in
                if let exercise = exercises.first(where: { $0.id == exerciseID }) {
                    ExerciseDetailView(exercise: exercise)
                }
            }
            .overlay {
                if exercises.isEmpty {
                    Text("No exercises yet.")
                        .foregroundStyle(.secondary)
                }
            }
        }
    }
}

private struct ExerciseRow: View {
    let exercise: Exercise

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(exercise.name)
                    .font(.body)
                if let bpm = exercise.recommendedBPM {
                    Text("\(bpm) BPM")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            Spacer()
            DifficultyDots(level: exercise.difficulty)
        }
    }
}

private struct DifficultyDots: View {
    let level: Int

    var body: some View {
        HStack(spacing: 3) {
            ForEach(1...5, id: \.self) { index in
                Circle()
                    .fill(index <= level ? Color.accentColor : Color.secondary.opacity(0.25))
                    .frame(width: 5, height: 5)
            }
        }
    }
}

#Preview {
    ExerciseLibraryView()
        .modelContainer(for: [Exercise.self], inMemory: true)
}
