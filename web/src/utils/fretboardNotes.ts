import type { StringNumber } from '../types/musicConcept'

/**
 * Note name for a given string/fret, computed the same way every fret
 * position in `data/concepts/` was verified: `(openStringPitchClass + fret)
 * mod 12`, looked up against the chromatic scale. Kept as one small shared
 * table/function rather than duplicating the pitch-class math anywhere a
 * diagram wants to show a note name.
 */
const OPEN_STRING_PITCH_CLASS: Record<StringNumber, number> = {
  1: 4, // low E
  2: 9, // A
  3: 2, // D
  4: 7, // G
  5: 11, // B
  6: 4, // high e
}

const CHROMATIC_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function noteNameAtPosition(string: StringNumber, fret: number): string {
  const pitchClass = (OPEN_STRING_PITCH_CLASS[string] + fret) % 12
  return CHROMATIC_NOTE_NAMES[pitchClass]
}
