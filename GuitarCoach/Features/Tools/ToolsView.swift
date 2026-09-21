//
//  ToolsView.swift
//  GuitarCoach
//
//  Two full-screen tools reachable in one tap, per Step 3 of the design
//  doc: Metronome (M7) and Tuner (M8).
//

import SwiftUI

struct ToolsView: View {
    var body: some View {
        NavigationStack {
            List {
                NavigationLink {
                    MetronomeView()
                } label: {
                    ToolRow(title: "Metronome", subtitle: "BPM, tap tempo, and time signatures.", systemImage: "metronome")
                }
                NavigationLink {
                    TunerView()
                } label: {
                    ToolRow(title: "Tuner", subtitle: "Chromatic pitch detection.", systemImage: "tuningfork")
                }
            }
            .navigationTitle("Tools")
        }
    }
}

private struct ToolRow: View {
    let title: String
    let subtitle: String
    let systemImage: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: systemImage)
                .font(.title2)
                .foregroundStyle(.tint)
                .frame(width: 32)
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.body.weight(.medium))
                Text(subtitle).font(.caption).foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    ToolsView()
}
