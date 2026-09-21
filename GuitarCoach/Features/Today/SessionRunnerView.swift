//
//  SessionRunnerView.swift
//  GuitarCoach
//
//  Full-screen countdown timer for a running practice session (M4 / Step 3
//  of the design doc).
//

import SwiftUI
import SwiftData

struct SessionRunnerView: View {
    let session: PracticeSession
    let onFinished: () -> Void

    @Environment(\.modelContext) private var modelContext
    @State private var runner: SessionRunner?
    @State private var showMetronomeSheet = false

    var body: some View {
        Group {
            if let runner {
                if runner.state == .finished {
                    SessionCompleteView(session: session, onDone: onFinished)
                } else {
                    runningContent(runner: runner)
                }
            } else {
                ProgressView()
            }
        }
        .onAppear {
            if runner == nil {
                runner = SessionRunner(session: session, modelContext: modelContext, onFinished: {})
            }
        }
    }

    private func runningContent(runner: SessionRunner) -> some View {
        VStack(spacing: 28) {
            ProgressView(value: runner.overallProgress)
                .tint(.accentColor)
                .padding(.horizontal)

            if let item = runner.currentItem, let exercise = item.exercise {
                VStack(spacing: 6) {
                    Text(exercise.name)
                        .font(.title2.bold())
                        .multilineTextAlignment(.center)

                    if let bpm = exercise.recommendedBPM {
                        Button {
                            showMetronomeSheet = true
                        } label: {
                            Label("\(bpm) BPM", systemImage: "metronome")
                                .font(.subheadline)
                        }
                        .accessibilityLabel("Open metronome at \(bpm) beats per minute")
                    }
                }
                .padding(.top, 12)

                Text(formattedTime(runner.secondsRemainingInCurrentItem))
                    .font(.system(size: 72, weight: .bold, design: .rounded))
                    .monospacedDigit()
                    .accessibilityLabel("\(runner.secondsRemainingInCurrentItem / 60) minutes \(runner.secondsRemainingInCurrentItem % 60) seconds remaining")

                Text("Exercise \(runner.currentItemIndex + 1) of \(runner.orderedItems.count)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            timeAdjustRow(runner: runner)
            transportRow(runner: runner)
        }
        .padding()
        .sheet(isPresented: $showMetronomeSheet) {
            NavigationStack {
                MetronomeView(initialBPM: runner.currentItem?.exercise?.recommendedBPM.map(Double.init))
            }
        }
    }

    private func timeAdjustRow(runner: SessionRunner) -> some View {
        HStack(spacing: 24) {
            Button {
                runner.addTime(deltaMinutes: -2)
            } label: {
                Label("2 min", systemImage: "minus")
            }
            .accessibilityLabel("Reduce time by 2 minutes")

            Button {
                runner.addTime(deltaMinutes: 2)
            } label: {
                Label("2 min", systemImage: "plus")
            }
            .accessibilityLabel("Add 2 minutes")
        }
        .buttonStyle(.bordered)
        .font(.caption)
    }

    private func transportRow(runner: SessionRunner) -> some View {
        HStack(spacing: 20) {
            Button {
                runner.skip()
            } label: {
                Image(systemName: "forward.end.fill")
                    .font(.title2)
                    .frame(width: 56, height: 56)
            }
            .buttonStyle(.bordered)
            .accessibilityLabel("Skip exercise")

            Button {
                runner.state == .running ? runner.pause() : runner.resume()
            } label: {
                Image(systemName: runner.state == .running ? "pause.fill" : "play.fill")
                    .font(.title)
                    .frame(width: 84, height: 84)
                    .background(Circle().fill(Color.accentColor))
                    .foregroundStyle(.white)
            }
            .accessibilityLabel(runner.state == .running ? "Pause" : "Resume")
        }
    }

    private func formattedTime(_ totalSeconds: Int) -> String {
        let minutes = totalSeconds / 60
        let seconds = totalSeconds % 60
        return String(format: "%d:%02d", minutes, seconds)
    }
}
