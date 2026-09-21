//
//  TunerView.swift
//  GuitarCoach
//
//  Chromatic tuner: note name, cents offset, and a standard-tuning
//  reference row (M8 / Step 3 of the design doc).
//

import SwiftUI
import UIKit

struct TunerView: View {
    @State private var engine = TunerEngine()

    private let standardTuning: [(string: String, frequency: Double)] = [
        ("E2", 82.41), ("A2", 110.00), ("D3", 146.83), ("G3", 196.00), ("B3", 246.94), ("E4", 329.63)
    ]

    var body: some View {
        VStack(spacing: 24) {
            if engine.permissionDenied {
                permissionDeniedView
            } else {
                noteDisplay
                centsIndicator
                standardTuningRow
                Spacer()
                startStopButton
            }
        }
        .padding()
        .navigationTitle("Tuner")
        .navigationBarTitleDisplayMode(.inline)
        .onDisappear { engine.stop() }
    }

    private var noteDisplay: some View {
        VStack(spacing: 4) {
            Text(engine.note?.name ?? "—")
                .font(.system(size: 72, weight: .bold, design: .rounded))

            if let note = engine.note {
                Text("Octave \(note.octave) · \(String(format: "%.1f", note.frequency)) Hz")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            } else {
                Text(engine.isRunning ? "Play a note" : "Tap start to begin")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .accessibilityElement(children: .combine)
    }

    private var centsIndicator: some View {
        let cents = engine.note?.cents ?? 0
        let isInTune = engine.note != nil && abs(cents) < 5
        return VStack(spacing: 8) {
            GeometryReader { geo in
                let width = geo.size.width
                let clampedCents = min(max(cents, -50), 50)
                let needleX = (width / 2) + (CGFloat(clampedCents) / 50.0) * (width / 2 - 4)

                ZStack(alignment: .leading) {
                    Capsule().fill(Color.secondary.opacity(0.2)).frame(height: 8)
                    Capsule()
                        .fill(isInTune ? Color.green : Color.orange)
                        .frame(width: 6, height: 24)
                        .offset(x: min(max(needleX - 3, 0), width - 6))
                }
            }
            .frame(height: 24)

            Text(engine.note == nil ? " " : (cents >= 0 ? "+\(Int(cents)) cents (sharp)" : "\(Int(cents)) cents (flat)"))
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .frame(height: 48)
    }

    private var standardTuningRow: some View {
        HStack {
            ForEach(standardTuning, id: \.string) { entry in
                VStack {
                    Text(entry.string).font(.caption.bold())
                    Text("\(Int(entry.frequency)) Hz").font(.caption2).foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity)
            }
        }
    }

    private var startStopButton: some View {
        Button {
            if engine.isRunning {
                engine.stop()
            } else {
                engine.start()
            }
        } label: {
            Text(engine.isRunning ? "Stop" : "Start Tuner")
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
        }
        .buttonStyle(.borderedProminent)
        .accessibilityLabel(engine.isRunning ? "Stop tuner" : "Start tuner")
    }

    private var permissionDeniedView: some View {
        VStack(spacing: 12) {
            Image(systemName: "mic.slash")
                .font(.system(size: 40))
                .foregroundStyle(.secondary)
            Text("Microphone Access Needed")
                .font(.headline)
            Text("Enable microphone access in Settings to use the tuner.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
            Button("Open Settings") {
                if let url = URL(string: UIApplication.openSettingsURLString) {
                    UIApplication.shared.open(url)
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        TunerView()
    }
}
