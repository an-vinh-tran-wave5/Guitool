//
//  NoteNamer.swift
//  GuitarCoach
//
//  Converts a frequency into the nearest chromatic note name, octave, and
//  cents offset (M8), using A4 = 440 Hz as the reference pitch.
//

import Foundation

enum NoteNamer {
    struct NoteResult: Equatable {
        let name: String
        let octave: Int
        /// -50...+50. Negative = flat, positive = sharp.
        let cents: Double
        let frequency: Double
    }

    private static let noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

    static func nearestNote(frequency: Double) -> NoteResult? {
        guard frequency > 0 else { return nil }

        let a4 = 440.0
        let semitoneOffset = 12.0 * log2(frequency / a4)
        let roundedSemitone = semitoneOffset.rounded()
        let cents = (semitoneOffset - roundedSemitone) * 100

        let midiNumber = Int(roundedSemitone) + 69 // MIDI note 69 = A4
        let noteIndex = ((midiNumber % 12) + 12) % 12
        let octave = (midiNumber / 12) - 1

        return NoteResult(name: noteNames[noteIndex], octave: octave, cents: cents, frequency: frequency)
    }
}
