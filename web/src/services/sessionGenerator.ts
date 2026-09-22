import type { Exercise, ExerciseCategory } from '../types/exercise'
import type { PracticeSession, SessionExercise } from '../types/session'
import type { UserProgress, UserSettings } from '../types/progress'
import { todayKey } from '../utils/date'
import { generateId, hashString, seededRandom } from '../utils/id'
import { minutesToSeconds } from '../utils/time'

/**
 * Today's Practice — the session generator.
 *
 * This is a deliberately simple, deterministic *scoring* system rather than
 * anything ML-flavored: every exercise gets a numeric score built from a
 * handful of interpretable factors, the highest-scoring exercises are
 * picked (with light category diversity + repeat-avoidance rules layered
 * on top), and the day's time budget is distributed across them roughly in
 * proportion to their score. It's intentionally easy to reason about and
 * to tune later.
 *
 * Factors, in order of weight:
 *   1. Importance & usefulness (the exercise's own metadata)          — biggest weight
 *   2. Recency — exercises not practiced in a while (or ever) score higher
 *   3. Weak areas — low repetition count and/or high difficulty score higher
 *   4. Variety — exercises used in the last couple of sessions are penalized
 *   5. Focus categories — an optional user preference boost
 *   6. Level fit — how close the exercise's difficulty is to the target
 *      difficulty for the user's stated skill level (settings.level); this
 *      is what makes a Beginner's sessions lean easier and an Advanced
 *      player's sessions lean harder, without excluding anything outright —
 *      a high-importance exercise can still outscore it on factor 1.
 *   7. A small seeded-random jitter, so ties don't always break the same way
 *      and different days naturally produce different sessions.
 */

/** Target difficulty (1-5 scale) each skill level's sessions are pulled toward. */
const LEVEL_TARGET_DIFFICULTY: Record<UserSettings['level'], number> = {
  beginner: 2,
  intermediate: 3.2,
  advanced: 4.3,
}

const SKILL_CATEGORIES: ExerciseCategory[] = [
  'technique',
  'scales',
  'rhythm',
  'chords',
  'fretboard',
  'improvisation',
]

interface ScoredExercise {
  exercise: Exercise
  score: number
}

function daysSincePracticed(exerciseId: string, progress: UserProgress, referenceKey: string): number {
  const stat = progress.exerciseStats[exerciseId]
  if (!stat?.lastPracticedDate) return 999 // never practiced — treat as "very stale"
  const from = new Date(stat.lastPracticedDate)
  const to = new Date(referenceKey)
  const diff = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

function recentExerciseIds(progress: UserProgress, lookback: number): Set<string>[] {
  return progress.sessionHistory
    .slice(0, lookback)
    .map((s) => new Set(s.exercises.map((e) => e.exerciseId)))
}

function scoreExercise(
  exercise: Exercise,
  progress: UserProgress,
  settings: UserSettings,
  referenceKey: string,
  recentSets: Set<string>[],
  rng: () => number,
): number {
  const stat = progress.exerciseStats[exercise.id]

  const base = exercise.importance * 3 + exercise.usefulness * 2

  const daysSince = daysSincePracticed(exercise.id, progress, referenceKey)
  const recencyBoost = Math.min(daysSince, 14) * 1.4 // caps out so "never practiced" doesn't dominate forever

  const timesPracticed = stat?.timesPracticed ?? 0
  const weaknessBoost =
    (exercise.difficulty >= 4 ? 3 : 0) +
    (timesPracticed === 0 ? 4 : timesPracticed < 3 ? 2 : 0) +
    (stat?.perceivedDifficulty && stat.perceivedDifficulty >= 4 ? 3 : 0)

  const focusBoost = settings.focusCategories.includes(exercise.category) ? 5 : 0

  const levelTarget = LEVEL_TARGET_DIFFICULTY[settings.level]
  const levelDistance = Math.abs(exercise.difficulty - levelTarget)
  const levelFitBoost = Math.max(0, 6 - levelDistance * 2) // full 6-point bonus at the target, tapering to 0 by distance 3

  let varietyPenalty = 0
  recentSets.forEach((set, idx) => {
    if (set.has(exercise.id)) varietyPenalty += idx === 0 ? 9 : 4
  })

  const jitter = rng() * 3

  return base + recencyBoost + weaknessBoost + focusBoost + levelFitBoost - varietyPenalty + jitter
}

function pickDiverseTrio(scored: ScoredExercise[], count: number): ScoredExercise[] {
  const sorted = [...scored].sort((a, b) => b.score - a.score)
  const chosen: ScoredExercise[] = []
  const usedCategories = new Set<ExerciseCategory>()

  // Pass 1: take the best exercise from a new category each time.
  for (const candidate of sorted) {
    if (chosen.length >= count) break
    if (!usedCategories.has(candidate.exercise.category)) {
      chosen.push(candidate)
      usedCategories.add(candidate.exercise.category)
    }
  }

  // Pass 2: if we still have slots (e.g. very small library), fill with the
  // next best remaining exercises regardless of category.
  if (chosen.length < count) {
    for (const candidate of sorted) {
      if (chosen.length >= count) break
      if (!chosen.includes(candidate)) chosen.push(candidate)
    }
  }

  // Prefer including one Song Practice exercise per session (matches the
  // "technique + scale/skill + song" shape used throughout the product
  // brief), swapping in the best-scoring song exercise if none made the cut
  // and one exists in the library.
  const hasSong = chosen.some((c) => c.exercise.category === 'song')
  if (!hasSong) {
    const bestSong = sorted.find((c) => c.exercise.category === 'song')
    if (bestSong) {
      // Replace the lowest-scoring non-song pick.
      let worstIdx = -1
      chosen.forEach((c, i) => {
        if (worstIdx === -1 || c.score < chosen[worstIdx].score) worstIdx = i
      })
      if (worstIdx !== -1) chosen[worstIdx] = bestSong
    }
  }

  return chosen.sort((a, b) => b.score - a.score)
}

function allocateMinutes(chosen: ScoredExercise[], totalMinutes: number): number[] {
  const totalScore = chosen.reduce((sum, c) => sum + Math.max(c.score, 1), 0)
  const raw = chosen.map((c) => (Math.max(c.score, 1) / totalScore) * totalMinutes)

  const clamped = chosen.map((c, i) => {
    const target = raw[i]
    return Math.min(c.exercise.maxDuration, Math.max(c.exercise.minDuration, target))
  })

  // Round each to the nearest 5 minutes for a clean, "planned session" feel.
  const rounded = clamped.map((m) => Math.max(5, Math.round(m / 5) * 5))

  // Fix rounding drift so the total lands on the requested budget (within
  // the constraints of each exercise's min/max), by nudging the largest
  // slot up or down in 5-minute steps.
  let diff = totalMinutes - rounded.reduce((a, b) => a + b, 0)
  let guard = 0
  while (diff !== 0 && guard < 40) {
    guard++
    // Find the exercise with the most room to move in the needed direction.
    let bestIdx = -1
    let bestRoom = -Infinity
    rounded.forEach((m, i) => {
      const room = diff > 0 ? chosen[i].exercise.maxDuration - m : m - chosen[i].exercise.minDuration
      if (room > bestRoom) {
        bestRoom = room
        bestIdx = i
      }
    })
    if (bestIdx === -1 || bestRoom <= 0) break
    const step = diff > 0 ? 5 : -5
    rounded[bestIdx] += step
    diff -= step
  }

  return rounded
}

export interface GenerateSessionOptions {
  /** Force a specific date key (mainly for testing); defaults to today. */
  dateKey?: string
  /** Bump this to force a different random draw for the same day ("regenerate"). */
  variationSeed?: number
}

export function generateSession(
  library: Exercise[],
  progress: UserProgress,
  settings: UserSettings,
  options: GenerateSessionOptions = {},
): PracticeSession {
  const dateKey = options.dateKey ?? todayKey()
  const seed = hashString(`${dateKey}::${options.variationSeed ?? 0}`)
  const rng = seededRandom(seed)

  const recentSets = recentExerciseIds(progress, 3)

  const scored: ScoredExercise[] = library.map((exercise) => ({
    exercise,
    score: scoreExercise(exercise, progress, settings, dateKey, recentSets, rng),
  }))

  const desiredCount = Math.min(
    settings.exercisesPerSession.max,
    Math.max(settings.exercisesPerSession.min, 3),
    scored.length,
  )

  const chosen = pickDiverseTrio(scored, desiredCount)
  const minutes = allocateMinutes(chosen, settings.dailyMinutesTarget)

  const exercises: SessionExercise[] = chosen.map((c, i) => ({
    exerciseId: c.exercise.id,
    plannedSeconds: minutesToSeconds(minutes[i]),
    elapsedSeconds: 0,
    completed: false,
    skipped: false,
    extraSecondsAdded: 0,
  }))

  return {
    id: generateId('session'),
    date: dateKey,
    generatedAt: new Date().toISOString(),
    totalPlannedMinutes: exercises.reduce((sum, e) => sum + e.plannedSeconds, 0) / 60,
    exercises,
    status: 'planned',
    currentExerciseIndex: 0,
  }
}

/** Convenience used by the "Skill categories" reference elsewhere (e.g. settings UI later). */
export { SKILL_CATEGORIES }
