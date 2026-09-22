import type { ExerciseCategory } from '../../types/exercise'
import { EXERCISE_CATEGORY_LABELS } from '../../types/exercise'

const CATEGORY_ICON: Record<ExerciseCategory, string> = {
  technique: '🤘',
  scales: '🪜',
  rhythm: '🥁',
  chords: '🎼',
  fretboard: '🗺️',
  improvisation: '💭',
  song: '🎶',
}

export default function CategoryBadge({ category }: { category: ExerciseCategory }) {
  return (
    <span className="chip gap-1">
      <span aria-hidden>{CATEGORY_ICON[category]}</span>
      {EXERCISE_CATEGORY_LABELS[category]}
    </span>
  )
}
