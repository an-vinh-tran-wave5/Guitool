import type { UserProgress } from '../types/progress'
import type { Exercise } from '../types/exercise'
import { lastNDayKeys, startOfMonthKey, startOfWeekKey, todayKey } from '../utils/date'
import { sessionMeaningfulSeconds } from './progressService'
import { findExercise } from './exerciseLibrary'

function secondsOnDate(progress: UserProgress, dateKey: string): number {
  return progress.sessionHistory
    .filter((s) => s.date === dateKey)
    .reduce((sum, s) => sum + sessionMeaningfulSeconds(s), 0)
}

export function secondsSince(progress: UserProgress, sinceKey: string): number {
  return progress.sessionHistory
    .filter((s) => s.date >= sinceKey)
    .reduce((sum, s) => sum + sessionMeaningfulSeconds(s), 0)
}

export function thisWeekSeconds(progress: UserProgress, now: Date = new Date()): number {
  return secondsSince(progress, startOfWeekKey(now))
}

export function thisMonthSeconds(progress: UserProgress, now: Date = new Date()): number {
  return secondsSince(progress, startOfMonthKey(now))
}

export interface DayMinutes {
  dateKey: string
  minutes: number
}

export function last7DaysMinutes(progress: UserProgress, now: Date = new Date()): DayMinutes[] {
  return lastNDayKeys(7, now).map((dateKey) => ({
    dateKey,
    minutes: Math.round(secondsOnDate(progress, dateKey) / 60),
  }))
}

export interface RankedExercise {
  exercise: Exercise
  totalSeconds: number
  timesPracticed: number
}

export function mostPracticedExercise(library: Exercise[], progress: UserProgress): RankedExercise | undefined {
  const stats = Object.values(progress.exerciseStats).filter((s) => s.totalSeconds > 0)
  if (stats.length === 0) return undefined
  const top = stats.reduce((best, s) => (s.totalSeconds > best.totalSeconds ? s : best))
  const exercise = findExercise(library, top.exerciseId)
  if (!exercise) return undefined
  return { exercise, totalSeconds: top.totalSeconds, timesPracticed: top.timesPracticed }
}

/**
 * A single exercise worth flagging as "needs attention": important/hard
 * exercises that have been practiced little or not recently. Mirrors the
 * weakness signal used by the session generator so the dashboard and the
 * generator agree on what counts as a weak spot.
 */
export function needsAttention(
  library: Exercise[],
  progress: UserProgress,
  referenceKey: string = todayKey(),
): RankedExercise | undefined {
  let best: { exercise: Exercise; score: number; stat: RankedExercise } | undefined

  for (const exercise of library) {
    const stat = progress.exerciseStats[exercise.id]
    const timesPracticed = stat?.timesPracticed ?? 0
    if (timesPracticed === 0) continue // "never tried" isn't the same as "struggling"

    const daysSince = stat?.lastPracticedDate
      ? Math.max(0, Math.round((new Date(referenceKey).getTime() - new Date(stat.lastPracticedDate).getTime()) / 86_400_000))
      : 999

    const score =
      exercise.difficulty * 2 +
      (timesPracticed < 3 ? 4 : 0) +
      Math.min(daysSince, 21) * 0.5 +
      (stat?.perceivedDifficulty ? stat.perceivedDifficulty * 2 : 0)

    if (!best || score > best.score) {
      best = {
        exercise,
        score,
        stat: { exercise, totalSeconds: stat?.totalSeconds ?? 0, timesPracticed },
      }
    }
  }

  return best?.stat
}

export function favoriteExercises(library: Exercise[], progress: UserProgress): Exercise[] {
  return Object.values(progress.exerciseStats)
    .filter((s) => s.isFavorite)
    .map((s) => findExercise(library, s.exerciseId))
    .filter((e): e is Exercise => Boolean(e))
}
