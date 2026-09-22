/**
 * A tiny parser for "ChordPro-lite" — bracket-notation lines like
 * `[G]Lyrics go [C]right here` — used by the demo Song Lyrics dataset (see
 * `data/demoSongs.ts`). This is a small hand-rolled parser, not the real
 * ChordPro format/library: no directives (`{title: ...}`), no over/under
 * alignment math, just "this chord applies to the text that follows it,
 * until the next chord or line end." That's enough to render lyrics with
 * chords floating above them, which is all this feature needs.
 */

export interface ChordProSegment {
  /** The chord that applies to `text` (shown above it), or undefined for text before the first chord on a line. */
  chord?: string
  text: string
}

const TOKEN_RE = /\[([^\]]+)\]|[^[]+/g

export function parseChordProLine(line: string): ChordProSegment[] {
  const segments: ChordProSegment[] = []
  let currentChord: string | undefined
  let match: RegExpExecArray | null
  TOKEN_RE.lastIndex = 0
  while ((match = TOKEN_RE.exec(line))) {
    if (match[1] !== undefined) {
      currentChord = match[1]
    } else {
      segments.push({ chord: currentChord, text: match[0] })
      currentChord = undefined
    }
  }
  if (currentChord !== undefined) segments.push({ chord: currentChord, text: '' })
  return segments
}

/** Every distinct chord name that appears anywhere in a ChordPro-lite line. */
export function chordsInLine(line: string): string[] {
  return [...line.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1])
}
