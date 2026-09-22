import type { MusicConcept } from '../../types/musicConcept'
import { CHORD_CONCEPTS } from './chords'
import { SCALE_CONCEPTS } from './scales'

/**
 * All music concepts in one place. Arpeggio and technique concepts aren't
 * populated yet (this is a pilot — see the README) but the types are fully
 * built out in `types/musicConcept.ts` and ready for content.
 */
export const MUSIC_CONCEPTS: MusicConcept[] = [...CHORD_CONCEPTS, ...SCALE_CONCEPTS]

export function getConcept(id: string): MusicConcept | undefined {
  return MUSIC_CONCEPTS.find((c) => c.id === id)
}

export function getConcepts(ids: string[]): MusicConcept[] {
  return ids.map(getConcept).filter((c): c is MusicConcept => c !== undefined)
}

export { CHORD_CONCEPTS, SCALE_CONCEPTS }
export { getChordConcept } from './chords'
export { getScaleConcept } from './scales'
