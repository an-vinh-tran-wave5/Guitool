import type { FretPositionRole, FretShape, StringNumber } from '../types/musicConcept'
import { CHORD_FINGERS_RAW } from './chordFingersRaw'

/**
 * The Chord Library — sourced from the `chord-fingers.csv` dataset the user
 * supplied (see `chordFingersRaw.ts` for the raw `[root, type, frets]` data
 * and how it was cleaned up), grouped by root/tone first and chord type
 * second (e.g. "A" → A major, A minor, A7, Am7, A7(#9), …) rather than the
 * major/minor split this file used before.
 *
 * The CSV gives fret positions (`FINGER_POSITIONS`) directly, so those are
 * trusted as-is. It also has its own `NOTE_NAMES` and `CHORD_STRUCTURE`
 * (scale-degree) columns, but cross-checking those against the actual pitch
 * classes the fret positions produce showed they agree on only a small
 * fraction of rows — real chord voicings, especially the extended jazz
 * chords this dataset is full of, routinely omit or substitute textbook
 * degrees, so a strict "must match CHORD_STRUCTURE" check would reject a
 * lot of perfectly normal chords. Rather than depend on those two columns,
 * every note's role (root/third/fifth/other) below is derived independently
 * from the fret position itself, using the same pitch-class arithmetic as
 * the rest of this app's chord data: a fretted note's pitch class is
 * `(openStringPitchClass + fret) mod 12`, and its role relative to the
 * chord's root falls out of the interval between the two.
 */

// String numbering matches `FretShapeDiagram`'s STRING_LABELS: 1 = low E … 6 = high e.
const OPEN_STRING_PITCH_CLASS: Record<StringNumber, number> = { 1: 4, 2: 9, 3: 2, 4: 7, 5: 11, 6: 4 }

/** Every root the CSV uses, in the order the library displays them — alphabetical by letter, natural before sharp before flat. */
export const ROOT_ORDER = [
  'A',
  'A#',
  'Ab',
  'B',
  'Bb',
  'C',
  'C#',
  'Cb',
  'D',
  'D#',
  'Db',
  'E',
  'Eb',
  'F',
  'F#',
  'G',
  'G#',
  'Gb',
] as const
export type RootName = (typeof ROOT_ORDER)[number]

/** Every chord-type code the CSV uses, in a sensible browsing order (triads, then 6ths, 7ths, extensions, sus, altered dominants, diminished/augmented last). */
const TYPE_ORDER = [
  'maj',
  'm',
  '5',
  '6',
  'm6',
  '6/9',
  'm6/9',
  '6(#11)',
  'maj7',
  'm7',
  'm(maj7)',
  'maj9',
  'm9',
  'm(maj9)',
  'maj13',
  'add9',
  'sus2',
  'sus4',
  '7sus4',
  '7',
  '7b5',
  '7(#5)',
  '7(#9)',
  '7(b9)',
  '7(b13)',
  '7(#11)',
  '9',
  '9b5',
  '9(#5)',
  '9(#11)',
  '11',
  'm11',
  '13',
  'm13',
  '13(b9)',
  '13(#9)',
  '13(#11)',
  'dim',
  'dim7',
  'm7b5',
  'aug',
  '+(#11)',
] as const
export type ChordType = (typeof TYPE_ORDER)[number]

const TYPE_INDEX: Record<string, number> = Object.fromEntries(TYPE_ORDER.map((t, i) => [t, i]))

/** Human-readable name for each chord-type code, shown under the chord symbol in the UI. */
export const CHORD_TYPE_LABELS: Record<ChordType, string> = {
  maj: 'Major',
  m: 'Minor',
  '5': 'Power chord (5)',
  '6': '6th',
  m6: 'Minor 6th',
  '6/9': '6/9',
  'm6/9': 'Minor 6/9',
  '6(#11)': '6(♯11)',
  maj7: 'Major 7th',
  m7: 'Minor 7th',
  'm(maj7)': 'Minor (Major 7th)',
  maj9: 'Major 9th',
  m9: 'Minor 9th',
  'm(maj9)': 'Minor (Major 9th)',
  maj13: 'Major 13th',
  add9: 'Add 9',
  sus2: 'Suspended 2nd',
  sus4: 'Suspended 4th',
  '7sus4': '7sus4',
  '7': 'Dominant 7th',
  '7b5': '7(♭5)',
  '7(#5)': '7(♯5)',
  '7(#9)': '7(♯9)',
  '7(b9)': '7(♭9)',
  '7(b13)': '7(♭13)',
  '7(#11)': '7(♯11)',
  '9': '9th',
  '9b5': '9(♭5)',
  '9(#5)': '9(♯5)',
  '9(#11)': '9(♯11)',
  '11': '11th',
  m11: 'Minor 11th',
  '13': '13th',
  m13: 'Minor 13th',
  '13(b9)': '13(♭9)',
  '13(#9)': '13(♯9)',
  '13(#11)': '13(♯11)',
  dim: 'Diminished',
  dim7: 'Diminished 7th',
  m7b5: 'Minor 7(♭5) (half-diminished)',
  aug: 'Augmented',
  '+(#11)': 'Augmented (♯11)',
}

const NATURAL_PITCH_CLASS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

/** Pitch class (0–11) of any of the CSV's root spellings, naturals/sharps/flats alike — same accidental math used throughout this app. */
function rootPitchClass(root: string): number {
  const letter = root[0]
  const base = NATURAL_PITCH_CLASS[letter] ?? 0
  let adjust = 0
  for (const ch of root.slice(1)) {
    if (ch === '#') adjust += 1
    else if (ch === 'b') adjust -= 1
  }
  return (((base + adjust) % 12) + 12) % 12
}

/** A fretted note's role relative to the chord's root, from the interval between their pitch classes — not from the CSV's own (frequently inconsistent) NOTE_NAMES/CHORD_STRUCTURE columns. */
function roleForInterval(interval: number): FretPositionRole {
  if (interval === 0) return 'root'
  if (interval === 3 || interval === 4) return 'third'
  if (interval === 6 || interval === 7 || interval === 8) return 'fifth'
  return 'note'
}

/** Every voicing in the dataset stays within the first four frets, so every diagram shows the nut and a fixed 4-fret window. */
const FRET_COUNT = 4

function buildShape(root: string, type: string, frets: string, voicingIndex: number): FretShape {
  const rootPc = rootPitchClass(root)
  const tokens = frets.split(',')
  const positions: FretShape['positions'] = []
  const mutedStrings: StringNumber[] = []

  tokens.forEach((raw, i) => {
    const string = (i + 1) as StringNumber
    const token = raw.trim()
    if (token === 'x') {
      mutedStrings.push(string)
      return
    }
    const fret = Number(token)
    if (fret === 0) return // open string — FretShapeDiagram auto-marks it "O" since startFret is always 1 here.
    const pitchClass = (OPEN_STRING_PITCH_CLASS[string] + fret) % 12
    const interval = ((pitchClass - rootPc) % 12 + 12) % 12
    positions.push({ string, fret, role: roleForInterval(interval) })
  })

  const typeIndex = TYPE_INDEX[type] ?? 0
  return {
    id: `csv-${root.replace('#', 'sharp')}-t${typeIndex}-${voicingIndex}`,
    label: `Voicing ${voicingIndex + 1}`,
    startFret: 1,
    fretCount: FRET_COUNT,
    positions,
    mutedStrings,
  }
}

export interface LibraryChord {
  id: string
  root: RootName
  type: ChordType
  typeLabel: string
  /** Chord symbol as it'd be written on a chart, e.g. "A", "Am7", "C#dim7". */
  name: string
  description: string
  shapes: FretShape[]
}

/** How a chord type reads right after the root letter — blank for a plain major triad, the raw CSV code otherwise. */
function symbolFor(type: string): string {
  return type === 'maj' ? '' : type
}

function buildLibrary(): LibraryChord[] {
  const grouped = new Map<string, { root: string; type: string; frets: string[] }>()
  for (const [root, type, frets] of CHORD_FINGERS_RAW) {
    const key = `${root}|${type}`
    const entry = grouped.get(key)
    if (entry) entry.frets.push(frets)
    else grouped.set(key, { root, type, frets: [frets] })
  }

  const chords: LibraryChord[] = []
  for (const { root, type, frets } of grouped.values()) {
    const shapes = frets.map((f, i) => buildShape(root, type, f, i))
    const typeLabel = CHORD_TYPE_LABELS[type as ChordType] ?? type
    const name = `${root}${symbolFor(type)}`
    chords.push({
      id: `${root.replace('#', 'sharp')}-t${TYPE_INDEX[type] ?? 0}`,
      root: root as RootName,
      type: type as ChordType,
      typeLabel,
      name,
      description: `${shapes.length} hand position${shapes.length === 1 ? '' : 's'} for ${name} (${typeLabel}), from the chord-fingers dataset.`,
      shapes,
    })
  }

  return chords
}

export const CHORD_LIBRARY: LibraryChord[] = buildLibrary()

export interface ChordRootGroup {
  root: RootName
  chords: LibraryChord[]
}

/** The library grouped by root/tone (the top-level browsing unit — see `ChordLibraryGrid.tsx`), each root's chords ordered by `TYPE_ORDER`. */
export const CHORD_LIBRARY_BY_ROOT: ChordRootGroup[] = ROOT_ORDER.map((root) => ({
  root,
  chords: CHORD_LIBRARY.filter((c) => c.root === root).sort((a, b) => TYPE_INDEX[a.type] - TYPE_INDEX[b.type]),
}))

export function findLibraryChord(id: string): LibraryChord | undefined {
  return CHORD_LIBRARY.find((c) => c.id === id)
}

function isRootName(value: string): value is RootName {
  return (ROOT_ORDER as readonly string[]).includes(value)
}

/**
 * Parses shorthand chord names as they appear in the Song Lyrics dataset —
 * `"C"`, `"Am"`, `"F#"`, `"F#m"`, `"Bb"` — into a root + chord-type code,
 * matching the CSV's own spellings directly (naturals/sharps/flats are all
 * distinct entries there, so no enharmonic conversion is needed). A bare
 * root with no suffix resolves to `"maj"`; anything else (`"m"`, `"7"`,
 * `"m7"`, …) is passed straight through as the type code, so it only
 * resolves when that exact type exists in the dataset for that root.
 */
export function parseChordShorthand(raw: string): { root: RootName; type: string } | undefined {
  const trimmed = raw.trim()
  const match = /^([A-Ga-g])([#b]?)(.*)$/.exec(trimmed)
  if (!match) return undefined
  const [, letter, accidental, rest] = match
  const rootGuess = `${letter.toUpperCase()}${accidental}`
  if (!isRootName(rootGuess)) return undefined
  const type = rest === '' ? 'maj' : rest
  return { root: rootGuess, type }
}

/** Resolves a shorthand chord name (see `parseChordShorthand`) straight to its `LibraryChord`, when recognized. */
export function findLibraryChordByName(name: string): LibraryChord | undefined {
  const parsed = parseChordShorthand(name)
  if (!parsed) return undefined
  return CHORD_LIBRARY.find((c) => c.root === parsed.root && c.type === parsed.type)
}

export { OPEN_STRING_PITCH_CLASS }
