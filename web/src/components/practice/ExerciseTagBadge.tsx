import { classifyExercise, EXERCISE_TAG_LABELS, EXERCISE_TAG_STYLES } from '../../services/exerciseTags'
import type { Exercise } from '../../types/exercise'

/** Small chip showing an exercise's auto-derived priority/difficulty tag (Must Learn / Easy / Medium / Hard). */
export default function ExerciseTagBadge({ exercise }: { exercise: Exercise }) {
  const tag = classifyExercise(exercise)
  return <span className={`chip ${EXERCISE_TAG_STYLES[tag]}`}>{EXERCISE_TAG_LABELS[tag]}</span>
}
