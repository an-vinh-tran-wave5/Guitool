import type { PracticeSession } from '../types/session'
import type { ExerciseStat, UserProgress } from '../types/progress'
import { daysBetween, isToday, isYesterday, todayKey } from '../utils/date'

/** A session "counts" once the user has actually put in a meaningful chunk of the planned time. */
const COMPLETION_THRESHOLD_RATIO = 0.6

export function sessionMeaningfulSeconds(session: PracticeSession): number {
  return session.exercises.reduce((sum, e) => sum + e.elapsedSeconds, 0)
}

export function sessionPlannedSeconds(session: PracticeSession): number {
  return session.exercises.reduce((sum, e) => sum + e.plannedSeconds + e.extraSecondsAdded, 0)
}

export function sessionCountsTowardStreak(session: PracticeSession): boolean {
  const planned = sessionPlannedSeconds(session)
  if (planned <= 0) return false
  return sessionMeaningfulSeconds(session) / planned >= COMPLETION_THRESHOLD_RATIO
}

function nextStreak(progress: UserProgress, dateKey: string): UserProgress['streak'] {
  const { streak } = progress
  if (streak.lastSessionDate && isToday(streak.lastSessionDate, dateKey)) {
    // Already counted today (e.g. finishing a second session) — no change.
    return streak
  }
  const continuesStreak = streak.lastSessionDate ? isYesterday(streak.lastSessionDate, dateKey) : false
  const current = continuesStreak ? streak.current + 1 : 1
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastSessionDate: dateKey,
  }
}

/**
 * Folds a finished (or abandoned-but-partially-done) session into progress:
 * updates the streak, per-exercise stats, and session history. Pure
 * function — callers persist the result via the storage layer.
 */
export function recordSession(progress: UserProgress, session: PracticeSession): UserProgress {
  const exerciseStats: Record<string, ExerciseStat> = { ...progress.exerciseStats }

  for (const se of session.exercises) {
    const prior = exerciseStats[se.exerciseId]
    const practicedThisOne = se.elapsedSeconds > 0
    exerciseStats[se.exerciseId] = {
      exerciseId: se.exerciseId,
      timesPracticed: (prior?.timesPracticed ?? 0) + (practicedThisOne ? 1 : 0),
      totalSeconds: (prior?.totalSeconds ?? 0) + se.elapsedSeconds,
      timesSkipped: (prior?.timesSkipped ?? 0) + (se.skipped ? 1 : 0),
      lastPracticedDate: practicedThisOne ? session.date : prior?.lastPracticedDate,
      bestBpm:
        se.bpmAchieved !== undefined ? Math.max(se.bpmAchieved, prior?.bestBpm ?? 0) : prior?.bestBpm,
      perceivedDifficulty: prior?.perceivedDifficulty,
      isFavorite: prior?.isFavorite ?? false,
    }
  }

  const countsTowardStreak = sessionCountsTowardStreak(session)
  const streak = countsTowardStreak ? nextStreak(progress, session.date) : progress.streak

  return {
    streak,
    totalSessionsCompleted: progress.totalSessionsCompleted + (countsTowardStreak ? 1 : 0),
    totalPracticeSeconds: progress.totalPracticeSeconds + sessionMeaningfulSeconds(session),
    exerciseStats,
    sessionHistory: [{ ...session, status: 'completed', completedAt: new Date().toISOString() }, ...progress.sessionHistory],
  }
}

/** Streak is "at risk" once a day has passed since the last logged session, without breaking it yet. */
export function isStreakAtRisk(progress: UserProgress, referenceKey: string = todayKey()): boolean {
  if (!progress.streak.lastSessionDate || progress.streak.current === 0) return false
  const gap = daysBetween(progress.streak.lastSessionDate, referenceKey)
  return gap >= 1
}

export function toggleFavorite(progress: UserProgress, exerciseId: string): UserProgress {
  const existing = progress.exerciseStats[exerciseId]
  const stat: ExerciseStat = existing ?? {
    exerciseId,
    timesPracticed: 0,
    totalSeconds: 0,
    timesSkipped: 0,
    isFavorite: false,
  }
  return {
    ...progress,
    exerciseStats: {
      ...progress.exerciseStats,
      [exerciseId]: { ...stat, isFavorite: !stat.isFavorite },
    },
  }
}
