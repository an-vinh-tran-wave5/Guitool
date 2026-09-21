//
//  ClickSoundFactory.swift
//  GuitarCoach
//
//  Synthesizes the metronome's click sounds at runtime (a short,
//  exponentially-decaying sine burst) instead of shipping bundled audio
//  files. This keeps the metronome fully self-contained and avoids
//  depending on any particular audio asset being added to the Xcode
//  project correctly.
//

import AVFoundation

enum ClickSoundFactory {
    /// - Parameters:
    ///   - frequency: tone pitch in Hz. Normal beats and the accented first
    ///     beat use different frequencies so they're audibly distinct.
    ///   - accent: slightly louder and brighter when true.
    static func makeClick(sampleRate: Double, frequency: Double, accent: Bool) -> AVAudioPCMBuffer? {
        let duration = 0.05
        let frameCount = AVAudioFrameCount(sampleRate * duration)
        guard
            frameCount > 0,
            let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1),
            let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: frameCount)
        else { return nil }

        buffer.frameLength = frameCount
        guard let channelData = buffer.floatChannelData?[0] else { return nil }

        let amplitude: Float = accent ? 0.9 : 0.55
        let decayRate = 55.0

        for frame in 0..<Int(frameCount) {
            let t = Double(frame) / sampleRate
            let decay = exp(-t * decayRate)
            let sample = sin(2.0 * Double.pi * frequency * t) * decay
            channelData[frame] = Float(sample) * amplitude
        }

        return buffer
    }
}
