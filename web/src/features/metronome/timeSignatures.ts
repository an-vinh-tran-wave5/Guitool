export interface TimeSignaturePreset {
  label: string
  beats: number
}

/**
 * Click model: each preset just sets how many clicks make up one measure
 * (and therefore where the accent falls). We don't subdivide compound
 * meters (6/8 clicks 6 times rather than 2 dotted-quarter pulses) — that
 * keeps the engine simple while still covering the common practice cases.
 * A couple of presets intentionally share a beat count with a different
 * label (2/4 vs 2/2, 3/4 vs 3/8) — the click pattern is identical, the
 * label is just what you'd call it on the page.
 */
export const TIME_SIGNATURES: TimeSignaturePreset[] = [
  { label: '2/4', beats: 2 },
  { label: '2/2', beats: 2 },
  { label: '3/4', beats: 3 },
  { label: '3/8', beats: 3 },
  { label: '4/4', beats: 4 },
  { label: '5/4', beats: 5 },
  { label: '6/4', beats: 6 },
  { label: '6/8', beats: 6 },
  { label: '7/8', beats: 7 },
  { label: '9/8', beats: 9 },
  { label: '12/8', beats: 12 },
]

export const DEFAULT_TIME_SIGNATURE = TIME_SIGNATURES.find((t) => t.label === '4/4')!
