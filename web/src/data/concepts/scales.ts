import type { ScaleConcept } from '../../types/musicConcept'

/**
 * Scale concepts. Each shape's fret/string data was computed programmatically
 * from open-string pitch class + fret number (not typed from memory) before
 * being written here — see the note in the README under "Notes & known
 * limitations" for why that matters for content like this.
 *
 * Shape numbering follows the widely-taught 5-position system: shapes are
 * numbered in the order they sit up the neck for a given root, wrapping
 * back to shape 1 an octave higher. Shape 1 here matches the box shape
 * already used by `scales-minor-pentatonic` in `data/exercises.ts` before
 * this system existed, so migrating that exercise to reference this concept
 * doesn't change what a learner who already knows box 1 sees.
 *
 * Every `interval` label below was computed the same programmatic way as
 * the fret/string data itself: `(openStringPitchClass + fret - rootPitchClass)
 * mod 12`, mapped through the standard pentatonic-minor (1, b3, 4, 5, b7) or
 * pentatonic-major (1, 2, 3, 5, 6) degree formula — not typed from memory —
 * then cross-checked against which notes were already hand-marked `root`.
 */

export const SCALE_CONCEPTS: ScaleConcept[] = [
  {
    id: 'scale-minor-pentatonic',
    type: 'scale',
    name: 'Minor Pentatonic Scale',
    family: 'pentatonic',
    aliases: ['minor pentatonic', 'pentatonic minor'],
    description:
      'The five-note scale behind most rock, blues and pop lead playing. Shown here in all five positions (root shown is A) — the whole point of the neck, not just one box.',
    shapes: [
      {
        id: 'shape-1',
        label: 'Shape 1',
        startFret: 5,
        fretCount: 4,
        positions: [
          { string: 1, fret: 5, finger: 1, role: 'root', interval: '1' },
          { string: 1, fret: 8, finger: 4, role: 'note', interval: 'b3' },
          { string: 2, fret: 5, finger: 1, role: 'note', interval: '4' },
          { string: 2, fret: 7, finger: 3, role: 'note', interval: '5' },
          { string: 3, fret: 5, finger: 1, role: 'note', interval: 'b7' },
          { string: 3, fret: 7, finger: 3, role: 'root', interval: '1' },
          { string: 4, fret: 5, finger: 1, role: 'note', interval: 'b3' },
          { string: 4, fret: 7, finger: 3, role: 'note', interval: '4' },
          { string: 5, fret: 5, finger: 1, role: 'note', interval: '5' },
          { string: 5, fret: 8, finger: 4, role: 'note', interval: 'b7' },
          { string: 6, fret: 5, finger: 1, role: 'root', interval: '1' },
          { string: 6, fret: 8, finger: 4, role: 'note', interval: 'b3' },
        ],
        caption: 'The box shape most players learn first — root on the low E and high e strings under finger 1.',
      },
      {
        id: 'shape-2',
        label: 'Shape 2',
        startFret: 7,
        fretCount: 4,
        positions: [
          { string: 1, fret: 8, finger: 2, role: 'note', interval: 'b3' },
          { string: 1, fret: 10, finger: 4, role: 'note', interval: '4' },
          { string: 2, fret: 7, finger: 1, role: 'note', interval: '5' },
          { string: 2, fret: 10, finger: 4, role: 'note', interval: 'b7' },
          { string: 3, fret: 7, finger: 1, role: 'root', interval: '1' },
          { string: 3, fret: 10, finger: 4, role: 'note', interval: 'b3' },
          { string: 4, fret: 7, finger: 1, role: 'note', interval: '4' },
          { string: 4, fret: 9, finger: 3, role: 'note', interval: '5' },
          { string: 5, fret: 8, finger: 2, role: 'note', interval: 'b7' },
          { string: 5, fret: 10, finger: 4, role: 'root', interval: '1' },
          { string: 6, fret: 8, finger: 2, role: 'note', interval: 'b3' },
          { string: 6, fret: 10, finger: 4, role: 'note', interval: '4' },
        ],
        caption: 'Connects directly onto the top of shape 1 — root now falls on the D and B strings.',
      },
      {
        id: 'shape-3',
        label: 'Shape 3',
        startFret: 9,
        fretCount: 5,
        positions: [
          { string: 1, fret: 10, finger: 2, role: 'note', interval: '4' },
          { string: 1, fret: 12, finger: 4, role: 'note', interval: '5' },
          { string: 2, fret: 10, finger: 2, role: 'note', interval: 'b7' },
          { string: 2, fret: 12, finger: 4, role: 'root', interval: '1' },
          { string: 3, fret: 10, finger: 2, role: 'note', interval: 'b3' },
          { string: 3, fret: 12, finger: 4, role: 'note', interval: '4' },
          { string: 4, fret: 9, finger: 1, role: 'note', interval: '5' },
          { string: 4, fret: 12, finger: 4, role: 'note', interval: 'b7' },
          { string: 5, fret: 10, finger: 2, role: 'root', interval: '1' },
          { string: 5, fret: 13, finger: 4, role: 'note', interval: 'b3' },
          { string: 6, fret: 10, finger: 2, role: 'note', interval: '4' },
          { string: 6, fret: 12, finger: 4, role: 'note', interval: '5' },
        ],
        caption: 'A wider, 5-fret stretch shape — the finger numbers shown are one reasonable option, not the only one.',
      },
      {
        id: 'shape-4',
        label: 'Shape 4',
        startFret: 12,
        fretCount: 4,
        positions: [
          { string: 1, fret: 12, finger: 1, role: 'note', interval: '5' },
          { string: 1, fret: 15, finger: 4, role: 'note', interval: 'b7' },
          { string: 2, fret: 12, finger: 1, role: 'root', interval: '1' },
          { string: 2, fret: 15, finger: 4, role: 'note', interval: 'b3' },
          { string: 3, fret: 12, finger: 1, role: 'note', interval: '4' },
          { string: 3, fret: 14, finger: 3, role: 'note', interval: '5' },
          { string: 4, fret: 12, finger: 1, role: 'note', interval: 'b7' },
          { string: 4, fret: 14, finger: 3, role: 'root', interval: '1' },
          { string: 5, fret: 13, finger: 2, role: 'note', interval: 'b3' },
          { string: 5, fret: 15, finger: 4, role: 'note', interval: '4' },
          { string: 6, fret: 12, finger: 1, role: 'note', interval: '5' },
          { string: 6, fret: 15, finger: 4, role: 'note', interval: 'b7' },
        ],
        caption: 'Root on the A and G strings. One octave up from here (fret 17) is shape 1 again.',
      },
      {
        id: 'shape-5',
        label: 'Shape 5',
        startFret: 2,
        fretCount: 4,
        positions: [
          { string: 1, fret: 3, finger: 2, role: 'note', interval: 'b7' },
          { string: 1, fret: 5, finger: 4, role: 'root', interval: '1' },
          { string: 2, fret: 3, finger: 2, role: 'note', interval: 'b3' },
          { string: 2, fret: 5, finger: 4, role: 'note', interval: '4' },
          { string: 3, fret: 2, finger: 1, role: 'note', interval: '5' },
          { string: 3, fret: 5, finger: 4, role: 'note', interval: 'b7' },
          { string: 4, fret: 2, finger: 1, role: 'root', interval: '1' },
          { string: 4, fret: 5, finger: 4, role: 'note', interval: 'b3' },
          { string: 5, fret: 3, finger: 2, role: 'note', interval: '4' },
          { string: 5, fret: 5, finger: 4, role: 'note', interval: '5' },
          { string: 6, fret: 3, finger: 2, role: 'note', interval: 'b7' },
          { string: 6, fret: 5, finger: 4, role: 'root', interval: '1' },
        ],
        caption: 'Sits just below shape 1 — its top notes connect straight into shape 1\'s bottom notes.',
      },
    ],
  },
  {
    id: 'scale-major-pentatonic',
    type: 'scale',
    name: 'Major Pentatonic Scale',
    family: 'pentatonic',
    aliases: ['major pentatonic', 'pentatonic major'],
    description:
      'The bright, upbeat cousin of the minor pentatonic — same five-note-per-octave shape logic, different starting point. Shown here in all five positions (root shown is G).',
    shapes: [
      {
        id: 'shape-1',
        label: 'Shape 1',
        startFret: 0,
        fretCount: 4,
        positions: [
          { string: 1, fret: 0, role: 'note', interval: '6' },
          { string: 1, fret: 3, finger: 3, role: 'root', interval: '1' },
          { string: 2, fret: 0, role: 'note', interval: '2' },
          { string: 2, fret: 2, finger: 2, role: 'note', interval: '3' },
          { string: 3, fret: 0, role: 'note', interval: '5' },
          { string: 3, fret: 2, finger: 2, role: 'note', interval: '6' },
          { string: 4, fret: 0, role: 'root', interval: '1' },
          { string: 4, fret: 2, finger: 2, role: 'note', interval: '2' },
          { string: 5, fret: 0, role: 'note', interval: '3' },
          { string: 5, fret: 3, finger: 3, role: 'note', interval: '5' },
          { string: 6, fret: 0, role: 'note', interval: '6' },
          { string: 6, fret: 3, finger: 3, role: 'root', interval: '1' },
        ],
        caption: 'Open-position shape — mixes open strings with frets 2–3. Root on the open G string and fret 3 of the outer strings.',
      },
      {
        id: 'shape-2',
        label: 'Shape 2',
        startFret: 2,
        fretCount: 4,
        positions: [
          { string: 1, fret: 3, finger: 2, role: 'root', interval: '1' },
          { string: 1, fret: 5, finger: 4, role: 'note', interval: '2' },
          { string: 2, fret: 2, finger: 1, role: 'note', interval: '3' },
          { string: 2, fret: 5, finger: 4, role: 'note', interval: '5' },
          { string: 3, fret: 2, finger: 1, role: 'note', interval: '6' },
          { string: 3, fret: 5, finger: 4, role: 'root', interval: '1' },
          { string: 4, fret: 2, finger: 1, role: 'note', interval: '2' },
          { string: 4, fret: 4, finger: 3, role: 'note', interval: '3' },
          { string: 5, fret: 3, finger: 2, role: 'note', interval: '5' },
          { string: 5, fret: 5, finger: 4, role: 'note', interval: '6' },
          { string: 6, fret: 3, finger: 2, role: 'root', interval: '1' },
          { string: 6, fret: 5, finger: 4, role: 'note', interval: '2' },
        ],
        caption: 'Connects onto the top of shape 1 — this is the same box most players already know as minor-pentatonic shape 5, just re-rooted.',
      },
      {
        id: 'shape-3',
        label: 'Shape 3',
        startFret: 4,
        fretCount: 5,
        positions: [
          { string: 1, fret: 5, finger: 2, role: 'note', interval: '2' },
          { string: 1, fret: 7, finger: 4, role: 'note', interval: '3' },
          { string: 2, fret: 5, finger: 2, role: 'note', interval: '5' },
          { string: 2, fret: 7, finger: 4, role: 'note', interval: '6' },
          { string: 3, fret: 5, finger: 2, role: 'root', interval: '1' },
          { string: 3, fret: 7, finger: 4, role: 'note', interval: '2' },
          { string: 4, fret: 4, finger: 1, role: 'note', interval: '3' },
          { string: 4, fret: 7, finger: 4, role: 'note', interval: '5' },
          { string: 5, fret: 5, finger: 2, role: 'note', interval: '6' },
          { string: 5, fret: 8, finger: 4, role: 'root', interval: '1' },
          { string: 6, fret: 5, finger: 2, role: 'note', interval: '2' },
          { string: 6, fret: 7, finger: 4, role: 'note', interval: '3' },
        ],
        caption: 'A wider stretch shape, like minor-pentatonic shape 3 — finger numbers shown are one reasonable option.',
      },
      {
        id: 'shape-4',
        label: 'Shape 4',
        startFret: 7,
        fretCount: 4,
        positions: [
          { string: 1, fret: 7, finger: 1, role: 'note', interval: '3' },
          { string: 1, fret: 10, finger: 4, role: 'note', interval: '5' },
          { string: 2, fret: 7, finger: 1, role: 'note', interval: '6' },
          { string: 2, fret: 10, finger: 4, role: 'root', interval: '1' },
          { string: 3, fret: 7, finger: 1, role: 'note', interval: '2' },
          { string: 3, fret: 9, finger: 3, role: 'note', interval: '3' },
          { string: 4, fret: 7, finger: 1, role: 'note', interval: '5' },
          { string: 4, fret: 9, finger: 3, role: 'note', interval: '6' },
          { string: 5, fret: 8, finger: 2, role: 'root', interval: '1' },
          { string: 5, fret: 10, finger: 4, role: 'note', interval: '2' },
          { string: 6, fret: 7, finger: 1, role: 'note', interval: '3' },
          { string: 6, fret: 10, finger: 4, role: 'note', interval: '5' },
        ],
        caption: 'Root on the A and low/high E strings\' neighbor — this is the CAGED-G shape\'s open-string neighborhood, an octave and a bit up.',
      },
      {
        id: 'shape-5',
        label: 'Shape 5',
        startFret: 9,
        fretCount: 4,
        positions: [
          { string: 1, fret: 10, finger: 2, role: 'note', interval: '5' },
          { string: 1, fret: 12, finger: 4, role: 'note', interval: '6' },
          { string: 2, fret: 10, finger: 2, role: 'root', interval: '1' },
          { string: 2, fret: 12, finger: 4, role: 'note', interval: '2' },
          { string: 3, fret: 9, finger: 1, role: 'note', interval: '3' },
          { string: 3, fret: 12, finger: 4, role: 'note', interval: '5' },
          { string: 4, fret: 9, finger: 1, role: 'note', interval: '6' },
          { string: 4, fret: 12, finger: 4, role: 'root', interval: '1' },
          { string: 5, fret: 10, finger: 2, role: 'note', interval: '2' },
          { string: 5, fret: 12, finger: 4, role: 'note', interval: '3' },
          { string: 6, fret: 10, finger: 2, role: 'note', interval: '5' },
          { string: 6, fret: 12, finger: 4, role: 'note', interval: '6' },
        ],
        caption: 'Sits just below shape 1 an octave up (fret 12 = the octave). Its top notes connect straight into shape 1 again.',
      },
    ],
  },
]

export function getScaleConcept(id: string): ScaleConcept | undefined {
  return SCALE_CONCEPTS.find((c) => c.id === id)
}
