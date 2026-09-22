import { EXERCISES } from '../data/exercises'
import type { Exercise, ExerciseCategory } from '../types/exercise'
import { generateId } from '../utils/id'

/**
 * The "library" the rest of the app works with is the built-in exercises
 * (`data/exercises.ts`, fixed at build time) plus whatever the user has
 * added themselves (stored in localStorage, part of `UserProgress`'s
 * sibling state — see `storage/localStorage.ts`). Nothing else in the app
 * should import `EXERCISES` directly except this file and `data/exercises.ts`
 * itself — everyone else takes a `library: Exercise[]` and looks things up
 * with the helpers below, so custom exercises behave identically to
 * built-in ones everywhere (the session generator, progress stats, etc.).
 */
export function buildLibrary(customExercises: Exercise[]): Exercise[] {
  return [...EXERCISES, ...customExercises]
}

export function findExercise(library: Exercise[], id: string): Exercise | undefined {
  return library.find((e) => e.id === id)
}

export interface CustomExerciseInput {
  name: string
  category: ExerciseCategory
  description: string
  difficulty: number
  importance: number
  usefulness: number
  recommendedDuration: number
  minDuration: number
  maxDuration: number
  skillTags: string[]
  instructions: string[]
  tips: string[]
  commonMistakes: string[]
  bpmMin?: number
  bpmMax?: number
}

function clampRating(n: number): 1 | 2 | 3 | 4 | 5 {
  return Math.min(5, Math.max(1, Math.round(n))) as 1 | 2 | 3 | 4 | 5
}

/** Turns a validated form input into a full `Exercise`, ready to be saved. */
export function createCustomExercise(input: CustomExerciseInput): Exercise {
  const recommended = Math.max(5, Math.round(input.recommendedDuration))
  const min = Math.max(5, Math.min(recommended, Math.round(input.minDuration || recommended)))
  const max = Math.max(recommended, Math.round(input.maxDuration || recommended))

  return {
    id: generateId('custom'),
    name: input.name.trim(),
    category: input.category,
    description: input.description.trim(),
    difficulty: clampRating(input.difficulty),
    importance: clampRating(input.importance),
    usefulness: clampRating(input.usefulness),
    recommendedDuration: recommended,
    minDuration: min,
    maxDuration: max,
    skillTags: input.skillTags.map((t) => t.trim()).filter(Boolean),
    instructions: input.instructions.map((s) => s.trim()).filter(Boolean),
    tips: input.tips.map((s) => s.trim()).filter(Boolean),
    commonMistakes: input.commonMistakes.map((s) => s.trim()).filter(Boolean),
    recommendedBpm:
      input.bpmMin && input.bpmMax ? { min: input.bpmMin, max: input.bpmMax } : undefined,
    isCustom: true,
  }
}

export function validateCustomExerciseInput(input: CustomExerciseInput): string[] {
  const errors: string[] = []
  if (!input.name.trim()) errors.push('Give the exercise a name.')
  if (!input.description.trim()) errors.push('Add a short description.')
  if (input.instructions.filter((s) => s.trim()).length === 0) {
    errors.push('Add at least one instruction step.')
  }
  if (input.recommendedDuration < 5) errors.push('Recommended duration should be at least 5 minutes.')
  if (input.bpmMin !== undefined && input.bpmMax !== undefined && input.bpmMin > input.bpmMax) {
    errors.push('Minimum BPM should not be greater than maximum BPM.')
  }
  return errors
}
