import type { Exercise } from '../types/exercise'

export type ExerciseTag = 'must-learn' | 'easy' | 'medium' | 'hard'

export const EXERCISE_TAG_LABELS: Record<ExerciseTag, string> = {
  'must-learn': 'Must Learn',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

/**
 * Tag styling (Tailwind, `!`-prefixed to override the base `.chip` colors —
 * the same pattern used for active-state chips elsewhere in the app).
 */
export const EXERCISE_TAG_STYLES: Record<ExerciseTag, string> = {
  'must-learn': '!border-ember-500/50 !bg-ember-500/15 !text-ember-300',
  easy: '!border-brass-500/40 !bg-brass-500/10 !text-brass-300',
  medium: '!border-parchment-400/30 !bg-parchment-400/10 !text-parchment-300',
  hard: '!border-ink-500 !bg-ink-700/70 !text-parchment-400/80',
}

/**
 * A simple, explainable classification derived purely from an exercise's own
 * importance/difficulty ratings — there's no separate field to keep in sync,
 * so a custom exercise gets a sensible tag the moment it's created.
 *
 * "Must Learn" wins over the difficulty tiers whenever an exercise is rated
 * top importance (5/5), since those are worth prioritizing regardless of how
 * hard they are. Otherwise the tag is a straightforward difficulty tier.
 */
export function classifyByRatings(importance: number, difficulty: number): ExerciseTag {
  if (importance >= 5) return 'must-learn'
  if (difficulty <= 2) return 'easy'
  if (difficulty <= 3) return 'medium'
  return 'hard'
}

export function classifyExercise(exercise: Exercise): ExerciseTag {
  return classifyByRatings(exercise.importance, exercise.difficulty)
}
