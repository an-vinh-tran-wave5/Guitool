//
//  MetronomeView.swift
//  GuitarCoach
//
//  BPM, tap tempo, time signature, accent toggle, and a visual beat
//  indicator (M7 / Step 3 of the design doc). Can be launched standalone
//  from the Tools tab, or pre-filled with an exercise's recommended BPM
//  from SessionRunnerView / ExerciseDetailView.
//

import SwiftUI

struct MetronomeView: View {
    var initialBPM: Double?

    @State private var engine = MetronomeEngine()

    var body: some View {
        VStack(spacing: 24) {
            Text("\(Int(engine.bpm.rounded())) BPM")
                .font(.system(size: 56, weight: .bold, design: .rounded))
                .monospacedDigit()
                .accessibilityLabel("\(Int(engine.bpm.rounded())) beats per minute")

            BeatIndicator(beatsPerBar: engine.beatsPerBar, currentBeat: engine.currentBeat, isPlaying: engine.isPlaying)

            Slider(value: $engine.bpm, in: 40...240, step: 1)
                .padding(.horizontal)

            Button {
                engine.registerTap()
            } label: {
                Text("Tap Tempo")
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 6)
            }
            .buttonStyle(.bordered)
            .padding(.horizontal)

            Picker("Time Signature", selection: $engine.beatsPerBar) {
                Text("2/4").tag(2)
                Text("3/4").tag(3)
                Text("4/4").tag(4)
                Text("6/8").tag(6)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)

            Toggle("Accent first beat", isOn: $engine.accentFirstBeat)
                .padding(.horizontal)

            Spacer()

            Button {
                if engine.isPlaying {
                    engine.stop()
                } else {
                    engine.start()
                }
            } label: {
                Image(systemName: engine.isPlaying ? "stop.fill" : "play.fill")
                    .font(.system(size: 30))
                    .frame(width: 76, height: 76)
                    .background(Circle().fill(Color.accentColor))
                    .foregroundStyle(.white)
            }
            .accessibilityLabel(engine.isPlaying ? "Stop metronome" : "Start metronome")
            .padding(.bottom, 12)
        }
        .padding(.top)
        .navigationTitle("Metronome")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            if let initialBPM {
                engine.bpm = initialBPM
            }
        }
        .onDisappear {
            engine.stop()
        }
    }
}

private struct BeatIndicator: View {
    let beatsPerBar: Int
    let currentBeat: Int
    let isPlaying: Bool

    var body: some View {
        HStack(spacing: 10) {
            ForEach(0..<beatsPerBar, id: \.self) { beat in
                Circle()
                    .fill(isPlaying && beat == currentBeat ? Color.accentColor : Color.secondary.opacity(0.25))
                    .frame(width: 16, height: 16)
            }
        }
        .frame(height: 20)
        .animation(.easeOut(duration: 0.1), value: currentBeat)
    }
}

#Preview {
    NavigationStack {
        MetronomeView()
    }
}
