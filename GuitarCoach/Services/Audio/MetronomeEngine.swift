//
//  MetronomeEngine.swift
//  GuitarCoach
//
//  Sample-accurate click scheduling on AVAudioEngine (M7). Clicks are
//  scheduled ~2 seconds ahead of the engine's own sample clock so the audio
//  never drifts from tempo over a long practice session, even though the
//  visual beat indicator (driven by a plain wall-clock Timer, restarted
//  whenever bpm changes) is a simpler approximation — accurate enough to
//  look in sync without threading UI updates through the audio render
//  callback.
//

import AVFoundation
import Observation

@MainActor
@Observable
final class MetronomeEngine {
    private(set) var isPlaying = false
    private(set) var currentBeat = 0 // 0-indexed position within the bar

    var bpm: Double = 100 {
        didSet {
            bpm = min(max(bpm, 40), 240)
            if isPlaying { restartVisualPulse() }
        }
    }
    var beatsPerBar: Int = 4
    var accentFirstBeat: Bool = true

    private let engine = AVAudioEngine()
    private let player = AVAudioPlayerNode()
    private var normalBuffer: AVAudioPCMBuffer?
    private var accentBuffer: AVAudioPCMBuffer?

    private var sampleRate: Double = 44100
    private var nextSampleTime: AVAudioFramePosition = 0
    private var beatCounterForScheduling = 0
    private var audioScheduleTimer: Timer?
    private var visualBeatTimer: Timer?
    private var tapTimestamps: [Date] = []

    private var secondsPerBeat: Double { 60.0 / max(bpm, 1) }

    init() {
        engine.attach(player)
        let mixerFormat = engine.mainMixerNode.outputFormat(forBus: 0)
        engine.connect(player, to: engine.mainMixerNode, format: mixerFormat)
        sampleRate = mixerFormat.sampleRate > 0 ? mixerFormat.sampleRate : 44100
        normalBuffer = ClickSoundFactory.makeClick(sampleRate: sampleRate, frequency: 1000, accent: false)
        accentBuffer = ClickSoundFactory.makeClick(sampleRate: sampleRate, frequency: 1600, accent: true)
    }

    func start() {
        guard !isPlaying else { return }
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
            try AVAudioSession.sharedInstance().setActive(true)
            try engine.start()
        } catch {
            print("MetronomeEngine: failed to start audio engine: \(error)")
            return
        }

        isPlaying = true
        beatCounterForScheduling = 0
        currentBeat = 0
        player.play()
        nextSampleTime = player.lastRenderTime?.sampleTime ?? 0
        scheduleAheadBuffers()

        audioScheduleTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in self?.scheduleAheadBuffers() }
        }
        restartVisualPulse()
    }

    func stop() {
        guard isPlaying else { return }
        isPlaying = false
        audioScheduleTimer?.invalidate()
        audioScheduleTimer = nil
        visualBeatTimer?.invalidate()
        visualBeatTimer = nil
        player.stop()
        engine.stop()
        currentBeat = 0
    }

    /// Call once per user tap. After two or more taps within a few seconds
    /// of each other, `bpm` is set to their average interval.
    func registerTap() {
        let now = Date()
        tapTimestamps = tapTimestamps.filter { now.timeIntervalSince($0) < 2.5 }
        tapTimestamps.append(now)
        if tapTimestamps.count > 6 {
            tapTimestamps.removeFirst(tapTimestamps.count - 6)
        }
        guard tapTimestamps.count >= 2 else { return }

        let intervals = zip(tapTimestamps, tapTimestamps.dropFirst()).map { $1.timeIntervalSince($0) }
        let averageInterval = intervals.reduce(0, +) / Double(intervals.count)
        guard averageInterval > 0 else { return }
        bpm = 60.0 / averageInterval
    }

    private func scheduleAheadBuffers() {
        guard isPlaying else { return }
        let framesPerBeat = AVAudioFramePosition(secondsPerBeat * sampleRate)
        guard framesPerBeat > 0 else { return }

        let currentSampleTime = player.lastRenderTime?.sampleTime ?? nextSampleTime
        let horizon = currentSampleTime + AVAudioFramePosition(2.0 * sampleRate)

        while nextSampleTime < horizon {
            let isAccent = accentFirstBeat && (beatCounterForScheduling % beatsPerBar == 0)
            if let buffer = isAccent ? accentBuffer : normalBuffer {
                let time = AVAudioTime(sampleTime: nextSampleTime, atRate: sampleRate)
                player.scheduleBuffer(buffer, at: time, options: [])
            }
            nextSampleTime += framesPerBeat
            beatCounterForScheduling += 1
        }
    }

    private func restartVisualPulse() {
        visualBeatTimer?.invalidate()
        visualBeatTimer = Timer.scheduledTimer(withTimeInterval: secondsPerBeat, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in
                guard let self else { return }
                self.currentBeat = (self.currentBeat + 1) % max(self.beatsPerBar, 1)
            }
        }
    }
}
