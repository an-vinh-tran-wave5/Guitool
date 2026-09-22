import type { ChordConcept } from '../../types/musicConcept'

/**
 * Chord concepts. Every shape's fret/string/role data below was verified
 * programmatically — for the open chords, directly from each chord's root/
 * third/fifth pitch classes; for the CAGED shapes, two independent ways
 * (hand-derived from standard barre-chord theory, then re-derived by
 * transposing each open-chord shape's own fret pattern by the semitone
 * offset needed to land on G) and cross-checked against each other before
 * being written here. See the README's "Notes & known limitations" for why
 * that matters for content like this.
 */

const OPEN_CHORDS: ChordConcept[] = [
  {
    id: 'chord-open-e-major',
    type: 'chord',
    name: 'E major (open)',
    category: 'open',
    description: 'One of the first chords most guitarists learn — full, ringing, and used everywhere in rock.',
    shapes: [
      {
        id: 'open',
        label: 'Open',
        startFret: 1,
        fretCount: 3,
        positions: [
          { string: 4, fret: 1, finger: 1, role: 'third' },
          { string: 2, fret: 2, finger: 2, role: 'fifth' },
          { string: 3, fret: 2, finger: 3, role: 'root' },
        ],
      },
    ],
  },
  {
    id: 'chord-open-a-major',
    type: 'chord',
    name: 'A major (open)',
    category: 'open',
    description: 'A bright open chord built on a simple three-finger shape across three strings.',
    shapes: [
      {
        id: 'open',
        label: 'Open',
        startFret: 1,
        fretCount: 3,
        positions: [
          { string: 3, fret: 2, finger: 1, role: 'fifth' },
          { string: 4, fret: 2, finger: 2, role: 'root' },
          { string: 5, fret: 2, finger: 3, role: 'third' },
        ],
        mutedStrings: [1],
      },
    ],
  },
  {
    id: 'chord-open-d-major',
    type: 'chord',
    name: 'D major (open)',
    category: 'open',
    description: 'A compact triangular shape on the top three strings, root on the open D string.',
    shapes: [
      {
        id: 'open',
        label: 'Open',
        startFret: 1,
        fretCount: 3,
        positions: [
          { string: 4, fret: 2, finger: 1, role: 'fifth' },
          { string: 6, fret: 2, finger: 2, role: 'third' },
          { string: 5, fret: 3, finger: 3, role: 'root' },
        ],
        mutedStrings: [1, 2],
      },
    ],
  },
  {
    id: 'chord-open-g-major',
    type: 'chord',
    name: 'G major (open)',
    category: 'open',
    description: "One of the five chords this app's Open Chord Changes exercise cycles through — root on both outer strings.",
    shapes: [
      {
        id: 'open',
        label: 'Open',
        startFret: 1,
        fretCount: 3,
        positions: [
          { string: 1, fret: 3, finger: 2, role: 'root' },
          { string: 2, fret: 2, finger: 1, role: 'third' },
          { string: 6, fret: 3, finger: 3, role: 'root' },
        ],
      },
    ],
  },
  {
    id: 'chord-open-c-major',
    type: 'chord',
    name: 'C major',
    category: 'open',
    description:
      'A staple open chord — root on the A string, with a light stretch to the D string. Shown here in three voicings: the familiar open shape, a movable barre shape (A-shape, same fingering pattern anywhere on the neck), and a compact top-string alternative.',
    shapes: [
      {
        id: 'open',
        label: 'Open',
        startFret: 1,
        fretCount: 3,
        positions: [
          { string: 5, fret: 1, finger: 1, role: 'root' },
          { string: 3, fret: 2, finger: 2, role: 'third' },
          { string: 2, fret: 3, finger: 3, role: 'root' },
        ],
        mutedStrings: [1],
      },
      {
        id: 'barre',
        label: 'Barre',
        startFret: 3,
        fretCount: 3,
        positions: [
          { string: 2, fret: 3, role: 'root' },
          { string: 3, fret: 5, role: 'fifth' },
          { string: 4, fret: 5, role: 'root' },
          { string: 5, fret: 5, role: 'third' },
          { string: 6, fret: 3, role: 'fifth' },
        ],
        mutedStrings: [1],
        caption: 'The open A-shape moved up and barred at fret 3 — a genuine stretch, so fingering is left open here since it varies by hand size.',
      },
      {
        id: 'alternative',
        label: 'Alternative',
        startFret: 1,
        fretCount: 3,
        positions: [{ string: 5, fret: 1, finger: 1, role: 'root' }],
        mutedStrings: [1, 2, 3],
        caption:
          'A compact top-three-string voicing — just one fretted note (the G and e strings ring open), handy when you need C fast without the full shape.',
      },
    ],
  },
  {
    id: 'chord-open-e-minor',
    type: 'chord',
    name: 'E minor (open)',
    category: 'open',
    description: 'Often the very first chord a beginner plays — just two fingers, full and dark-sounding.',
    shapes: [
      {
        id: 'open',
        label: 'Open',
        startFret: 1,
        fretCount: 3,
        positions: [
          { string: 2, fret: 2, finger: 2, role: 'fifth' },
          { string: 3, fret: 2, finger: 3, role: 'root' },
        ],
      },
    ],
  },
  {
    id: 'chord-open-a-minor',
    type: 'chord',
    name: 'A minor',
    category: 'open',
    description:
      'The relative minor of C major — swap freely between the two using mostly the same fingers. Shown here in three voicings: the familiar open shape, a movable barre shape (E-minor-shape, same fingering pattern anywhere on the neck), and a compact mid-neck alternative.',
    shapes: [
      {
        id: 'open',
        label: 'Open',
        startFret: 1,
        fretCount: 3,
        positions: [
          { string: 5, fret: 1, finger: 1, role: 'third' },
          { string: 3, fret: 2, finger: 2, role: 'fifth' },
          { string: 4, fret: 2, finger: 3, role: 'root' },
        ],
        mutedStrings: [1],
      },
      {
        id: 'barre',
        label: 'Barre',
        startFret: 5,
        fretCount: 3,
        positions: [
          { string: 1, fret: 5, finger: 1, role: 'root' },
          { string: 2, fret: 7, finger: 3, role: 'fifth' },
          { string: 3, fret: 7, finger: 4, role: 'root' },
          { string: 4, fret: 5, finger: 1, role: 'third' },
          { string: 5, fret: 5, finger: 1, role: 'fifth' },
          { string: 6, fret: 5, finger: 1, role: 'root' },
        ],
        caption: 'The open E-minor shape moved up and barred at fret 5 with finger 1 — the ring and pinky fingers add the notes on the D and A strings.',
      },
      {
        id: 'alternative',
        label: 'Alternative',
        startFret: 5,
        fretCount: 3,
        positions: [
          { string: 3, fret: 7, finger: 4, role: 'root' },
          { string: 4, fret: 5, finger: 1, role: 'third' },
          { string: 5, fret: 5, finger: 2, role: 'fifth' },
        ],
        mutedStrings: [1, 2, 6],
        caption: 'A compact mid-neck triad on the D, G and B strings — no barre needed.',
      },
    ],
  },
]

const CAGED_MAJOR_G: ChordConcept = {
  id: 'chord-caged-major-g',
  type: 'chord',
  name: 'CAGED Major Chord Shapes',
  category: 'barre',
  aliases: ['CAGED system', 'CAGED shapes'],
  description:
    'The same major chord (shown here as G) fretted five different ways up the neck — the C, A, G, E and D open-chord shapes, four of them moved up and barred. This is what "the complete set of shapes for a concept" means: one chord, everywhere on the neck.',
  shapes: [
    {
      id: 'shape-g',
      label: 'G-shape',
      startFret: 1,
      fretCount: 3,
      positions: [
        { string: 1, fret: 3, finger: 2, role: 'root' },
        { string: 2, fret: 2, finger: 1, role: 'third' },
        { string: 6, fret: 3, finger: 3, role: 'root' },
      ],
      caption: 'This is just the open G chord — the starting point CAGED cycles out from.',
    },
    {
      id: 'shape-e',
      label: 'E-shape',
      startFret: 3,
      fretCount: 3,
      positions: [
        { string: 1, fret: 3, finger: 1, role: 'root' },
        { string: 5, fret: 3, finger: 1, role: 'fifth' },
        { string: 6, fret: 3, finger: 1, role: 'root' },
        { string: 4, fret: 4, finger: 2, role: 'third' },
        { string: 2, fret: 5, finger: 3, role: 'fifth' },
        { string: 3, fret: 5, finger: 4, role: 'root' },
      ],
      caption: 'The open E shape, barred at fret 3 — the classic first barre chord most players learn.',
    },
    {
      id: 'shape-d',
      label: 'D-shape',
      startFret: 5,
      fretCount: 4,
      positions: [
        { string: 3, fret: 5, role: 'root' },
        { string: 4, fret: 7, role: 'fifth' },
        { string: 5, fret: 8, role: 'root' },
        { string: 6, fret: 7, role: 'third' },
      ],
      mutedStrings: [1, 2],
      caption: 'The open D shape moved up. Low E and A strings are skipped entirely — a genuine barre and stretch, so fingering is left open here since it varies by hand size.',
    },
    {
      id: 'shape-c',
      label: 'C-shape',
      startFret: 7,
      fretCount: 4,
      positions: [
        { string: 2, fret: 10, role: 'root' },
        { string: 3, fret: 9, role: 'third' },
        { string: 4, fret: 7, role: 'fifth' },
        { string: 5, fret: 8, role: 'root' },
        { string: 6, fret: 7, role: 'third' },
      ],
      mutedStrings: [1],
      caption: 'The open C shape moved up — low E string skipped. Fingering varies by hand; often a partial barre.',
    },
    {
      id: 'shape-a',
      label: 'A-shape',
      startFret: 10,
      fretCount: 3,
      positions: [
        { string: 2, fret: 10, role: 'root' },
        { string: 3, fret: 12, role: 'fifth' },
        { string: 4, fret: 12, role: 'root' },
        { string: 5, fret: 12, role: 'third' },
        { string: 6, fret: 10, role: 'fifth' },
      ],
      mutedStrings: [1],
      caption: 'The open A shape moved up, near the octave — the last of the five before the pattern repeats.',
    },
  ],
}

export const CHORD_CONCEPTS: ChordConcept[] = [...OPEN_CHORDS, CAGED_MAJOR_G]

export function getChordConcept(id: string): ChordConcept | undefined {
  return CHORD_CONCEPTS.find((c) => c.id === id)
}
