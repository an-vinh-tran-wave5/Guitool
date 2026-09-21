//
//  TunerEngine.swift
//  GuitarCoach
//
//  Mic input → PitchDetector → NoteNamer, published to the UI (M8).
//  Requires "Privacy - Microphone Usage Description" to be set in the
//  Xcode project's Info settings (see the project README) or `start()`
//  will simply fail silently at the OS level.
//

import AVFoundation
import Observation

@MainActor
@Observable
final class TunerEngine {
    private(set) var isRunning = false
    private(set) var note: NoteNamer.NoteResult?
    private(set) var permissionDenied = false

    private let engine = AVAudioEngine()

    func start() {
        guard !isRunning else { return }
        Task {
            let granted = await Self.requestMicrophonePermission()
            if granted {
                beginTap()
            } else {
                permissionDenied = true
            }
        }
    }

    func stop() {
        guard isRunning else { return }
        isRunning = false
        engine.inputNode.removeTap(onBus: 0)
        if engine.isRunning {
            engine.stop()
        }
        note = nil
    }

    private func beginTap() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playAndRecord, options: [.defaultToSpeaker, .allowBluetooth])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("TunerEngine: failed to configure audio session: \(error)")
            return
        }

        let input = engine.inputNode
        let format = input.outputFormat(forBus: 0)
        input.removeTap(onBus: 0)
        input.installTap(onBus: 0, bufferSize: 4096, format: format) { [weak self] buffer, _ in
            guard let channelData = buffer.floatChannelData?[0] else { return }
            let frameLength = Int(buffer.frameLength)
            guard frameLength > 0 else { return }
            let samples = Array(UnsafeBufferPointer(start: channelData, count: frameLength))
            let frequency = PitchDetector.detectPitch(samples: samples, sampleRate: format.sampleRate)

            Task { @MainActor [weak self] in
                self?.note = frequency.flatMap { NoteNamer.nearestNote(frequency: $0) }
            }
        }

        do {
            try engine.start()
            isRunning = true
        } catch {
            print("TunerEngine: failed to start audio engine: \(error)")
        }
    }

    private static func requestMicrophonePermission() async -> Bool {
        await withCheckedContinuation { continuation in
            switch AVAudioApplication.shared.recordPermission {
            case .granted:
                continuation.resume(returning: true)
            case .denied:
                continuation.resume(returning: false)
            case .undetermined:
                AVAudioApplication.requestRecordPermission { granted in
                    continuation.resume(returning: granted)
                }
            @unknown default:
                continuation.resume(returning: false)
            }
        }
    }
}
