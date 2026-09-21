//
//  ExerciseDetailView.swift
//  GuitarCoach
//
//  Detail/edit screen for one exercise: description, BPM fields, a
//  proficiency slider, and notes, per the design doc's Step 3 and Step 5
//  (Exercise Library section).
//

import SwiftUI
import SwiftData

struct ExerciseDetailView: View {
    @Bindable var exercise: Exercise

    var body: some View {
        Form {
            Section {
                Text(exercise.descriptionText)
                    .foregroundStyle(.secondary)
            }

            Section("Proficiency") {
                Stepper(value: $exercise.proficiency, in: 1...5) {
                    HStack {
                        Text("Proficiency")
                        Spacer()
                        Text("\(exercise.proficiency)/5")
                            .foregroundStyle(.secondary)
                    }
                }
            }

            if let recommendedBPM = exercise.recommendedBPM {
                Section("Tempo") {
                    LabeledContent("Recommended", value: bpmText(exercise.recommendedBPM))
                    Stepper(value: currentBPMBinding, in: 20...260, step: 2) {
                        LabeledContent("Current", value: bpmText(exercise.currentBPM))
                    }
                    Stepper(value: targetBPMBinding, in: 20...260, step: 2) {
                        LabeledContent("Target", value: bpmText(exercise.targetBPM))
                    }
                    NavigationLink {
                        MetronomeView(initialBPM: Double(recommendedBPM))
                    } label: {
                        Label("Practice at \(recommendedBPM) BPM", systemImage: "metronome")
                    }
                }
            }

            Section("Priority") {
                Stepper(value: $exercise.priority, in: 0.5...1.5, step: 0.1) {
                    LabeledContent("Manual priority", value: String(format: "%.1f×", exercise.priority))
                }
                Text("Above 1.0× pushes this exercise up the daily plan; below 1.0× holds it back, even if its score is high.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Section("Notes") {
                TextEditor(text: $exercise.notes)
                    .frame(minHeight: 80)
            }

            if let lastPracticedAt = exercise.lastPracticedAt {
                Section("History") {
                    LabeledContent("Last practiced", value: lastPracticedAt.formatted(date: .abbreviated, time: .omitted))
                    LabeledContent("Times practiced", value: "\(exercise.timesPracticed)")
                }
            }
        }
        .navigationTitle(exercise.name)
        .navigationBarTitleDisplayMode(.inline)
    }

    private func bpmText(_ bpm: Int?) -> String {
        bpm.map { "\($0)" } ?? "—"
    }

    private var currentBPMBinding: Binding<Int> {
        Binding(
            get: { exercise.currentBPM ?? exercise.recommendedBPM ?? 100 },
            set: { exercise.currentBPM = $0 }
        )
    }

    private var targetBPMBinding: Binding<Int> {
        Binding(
            get: { exercise.targetBPM ?? exercise.recommendedBPM ?? 100 },
            set: { exercise.targetBPM = $0 }
        )
    }
}
