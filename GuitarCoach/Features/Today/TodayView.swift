//
//  TodayView.swift
//  GuitarCoach
//
//  The app's main screen: today's generated plan, editable in place, with
//  "Start Today's Practice" as the one unmissable action (Step 3 / Step 12
//  of the design doc). Starting a session (M4) persists a PracticeSession
//  and presents SessionRunnerView full-screen.
//

import SwiftUI
import SwiftData

struct TodayView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var viewModel: TodayViewModel?
    @State private var swapTarget: PlannedItem?
    @State private var activeSession: PracticeSession?

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Today")
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        NavigationLink(destination: SettingsView()) {
                            Image(systemName: "gearshape")
                        }
                    }
                }
        }
        .onAppear {
            if viewModel == nil {
                viewModel = TodayViewModel(modelContext: modelContext)
            }
        }
    }

    @ViewBuilder
    private var content: some View {
        if let viewModel {
            if viewModel.isEmpty {
                emptyState
            } else {
                planList(viewModel: viewModel)
            }
        } else {
            ProgressView()
        }
    }

    private func planList(viewModel: TodayViewModel) -> some View {
        List {
            Section {
                HStack {
                    Text("Today's Practice")
                        .font(.title2.bold())
                    Spacer()
                    Text("\(viewModel.totalMinutes) min")
                        .font(.title3.monospacedDigit())
                        .foregroundStyle(.secondary)
                }
                .listRowSeparator(.hidden)
            }

            Section {
                ForEach(viewModel.plannedItems) { item in
                    PlannedItemRow(
                        item: item,
                        onIncrease: { viewModel.adjustMinutes(for: item, by: 5) },
                        onDecrease: { viewModel.adjustMinutes(for: item, by: -5) },
                        onSwapTapped: { swapTarget = item }
                    )
                }
            }

            Section {
                Button {
                    activeSession = viewModel.startSession()
                } label: {
                    Text("Start Today's Practice")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                }
                .buttonStyle(.borderedProminent)
                .disabled(viewModel.plannedItems.isEmpty)
                .listRowSeparator(.hidden)
                .accessibilityHint("Starts a \(viewModel.totalMinutes)-minute guided practice session")
            }
        }
        .listStyle(.insetGrouped)
        .refreshable { viewModel.refresh() }
        .sheet(item: $swapTarget) { item in
            ExercisePickerSheet(
                candidates: viewModel.swapCandidates(),
                onPick: { exercise in
                    viewModel.swap(item, with: exercise)
                    swapTarget = nil
                },
                onCancel: { swapTarget = nil }
            )
        }
        .fullScreenCover(item: $activeSession) { session in
            SessionRunnerView(session: session) {
                activeSession = nil
                viewModel.refresh()
            }
        }
    }

    private var emptyState: some View {
        ContentUnavailableViewCompat(
            title: "No Exercises Yet",
            message: "The built-in exercise library couldn't be loaded. Try restarting the app.",
            systemImage: "guitars"
        )
    }
}

private struct PlannedItemRow: View {
    let item: PlannedItem
    let onIncrease: () -> Void
    let onDecrease: () -> Void
    let onSwapTapped: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: item.exercise.category.symbolName)
                .foregroundStyle(.tint)
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 2) {
                Text(item.exercise.name)
                    .font(.body.weight(.medium))
                Text(item.reason)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            HStack(spacing: 6) {
                Button(action: onDecrease) {
                    Image(systemName: "minus.circle")
                }
                .disabled(item.minutes <= 5)

                Text("\(item.minutes)m")
                    .font(.body.monospacedDigit())
                    .frame(minWidth: 36)

                Button(action: onIncrease) {
                    Image(systemName: "plus.circle")
                }
                .disabled(item.minutes >= 45)
            }
            .buttonStyle(.plain)
            .foregroundStyle(.tint)
        }
        .contentShape(Rectangle())
        .swipeActions(edge: .trailing) {
            Button("Swap", systemImage: "arrow.triangle.2.circlepath", action: onSwapTapped)
                .tint(.orange)
        }
    }
}

private struct ExercisePickerSheet: View {
    let candidates: [Exercise]
    let onPick: (Exercise) -> Void
    let onCancel: () -> Void

    var body: some View {
        NavigationStack {
            List(candidates) { exercise in
                Button {
                    onPick(exercise)
                } label: {
                    VStack(alignment: .leading) {
                        Text(exercise.name)
                        Text(exercise.category.displayName)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
                .foregroundStyle(.primary)
            }
            .navigationTitle("Swap Exercise")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel", action: onCancel)
                }
            }
        }
    }
}

/// A tiny stand-in for `ContentUnavailableView` so this file has no
/// dependency on iOS-version-specific availability beyond the app's own
/// deployment target.
private struct ContentUnavailableViewCompat: View {
    let title: String
    let message: String
    let systemImage: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: systemImage)
                .font(.system(size: 40))
                .foregroundStyle(.secondary)
            Text(title)
                .font(.headline)
            Text(message)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
    }
}

#Preview {
    TodayView()
        .modelContainer(for: [Exercise.self, PracticeSession.self, SessionItem.self, UserSettings.self], inMemory: true)
}
