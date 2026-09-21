//
//  PitchDetector.swift
//  GuitarCoach
//
//  Autocorrelation-based pitch estimation (M8). Deliberately simple — no
//  FFT, no ML model — which is plenty accurate for a single plucked guitar
//  string and cheap enough to run on every audio buffer in real time.
//

import Foundation

enum PitchDetector {
    /// Returns the estimated fundamental frequency in Hz, or nil if the
    /// buffer is too quiet to get a confident reading.
    static func detectPitch(samples: [Float], sampleRate: Double) -> Double? {
        let count = samples.count
        guard count > 1 else { return nil }

        let rms = sqrt(samples.reduce(Float(0)) { $0 + $1 * $1 } / Float(count))
        guard rms > 0.01 else { return nil }

        // A guitar's open strings span roughly E2 (~82 Hz) to the top of
        // normal fretted playing (~1000 Hz); searching only that lag range
        // keeps this fast and avoids locking onto sub-harmonics.
        let minLag = max(Int(sampleRate / 1000.0), 1)
        let maxLag = min(Int(sampleRate / 60.0), count - 1)
        guard maxLag > minLag else { return nil }

        var bestLag = -1
        var bestCorrelation: Float = 0

        for lag in minLag...maxLag {
            var correlation: Float = 0
            let limit = count - lag
            var i = 0
            while i < limit {
                correlation += samples[i] * samples[i + lag]
                i += 1
            }
            if correlation > bestCorrelation {
                bestCorrelation = correlation
                bestLag = lag
            }
        }

        guard bestLag > 0 else { return nil }
        return sampleRate / Double(bestLag)
    }
}
