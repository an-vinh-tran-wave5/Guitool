import { useCallback, useState } from 'react'

/**
 * Shared "which shape am I looking at" navigation logic for a concept's
 * `FretShape[]` — the same index/next/prev/select behavior `ConceptShapeBrowser`
 * used to own by itself, pulled out so `MiniMusicTab` and `ShapeViewer` can
 * both page through shapes without duplicating this bookkeeping or drifting
 * out of sync with each other.
 *
 * Deliberately just a `useState` wrapper, not a new state-management layer —
 * each `MiniMusicTab` instance gets its own independent index via its own
 * call to this hook.
 */
export function useShapeIndex(shapeCount: number, initialIndex = 0) {
  const clamp = useCallback((i: number) => Math.min(Math.max(i, 0), Math.max(shapeCount - 1, 0)), [shapeCount])
  const [index, setIndexRaw] = useState(() => clamp(initialIndex))

  const setIndex = useCallback((i: number) => setIndexRaw(clamp(i)), [clamp])
  const next = useCallback(() => setIndexRaw((i) => clamp(i + 1)), [clamp])
  const prev = useCallback(() => setIndexRaw((i) => clamp(i - 1)), [clamp])

  const safeIndex = clamp(index)

  return {
    index: safeIndex,
    setIndex,
    next,
    prev,
    hasNext: safeIndex < shapeCount - 1,
    hasPrev: safeIndex > 0,
  }
}
