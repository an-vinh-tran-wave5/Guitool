export interface NoteSubdivisionPreset {
  id: string
  label: string
  shortLabel: string
  /** How many audible clicks make up one main beat. */
  subdivisions: number
}

/**
 * The "note type" the metronome subdivides each beat into. 1 is a plain
 * click on every beat (quarter notes at the current tempo); higher values
 * add extra, quieter clicks between beats so you can practice subdividing —
 * 2 for straight eighth notes, 3 for eighth-note triplets, 4 for sixteenth
 * notes. The main beat always plays louder/higher-pitched than the
 * subdivision clicks in between, and beat 1 keeps its own accent on top of
 * that when accent is enabled.
 */
export const NOTE_SUBDIVISIONS: NoteSubdivisionPreset[] = [
  { id: 'quarter', label: 'Quarter Notes', shortLabel: '♩', subdivisions: 1 },
  { id: 'eighth', label: 'Eighth Notes', shortLabel: '♫', subdivisions: 2 },
  { id: 'eighth-triplet', label: '8th Note Triplets', shortLabel: '♫³', subdivisions: 3 },
  { id: 'sixteenth', label: 'Sixteenth Notes', shortLabel: '♬', subdivisions: 4 },
]

export const DEFAULT_NOTE_SUBDIVISION = NOTE_SUBDIVISIONS[0]
