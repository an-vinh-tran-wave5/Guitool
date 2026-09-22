/**
 * A single exercise slot within a generated practice session. Durations are
 * stored in seconds once a session exists, since the active-practice timer
 * needs second-level precision (minutes are only used while planning).
 */
export interface SessionExercise {
  exerciseId: string
  plannedSeconds: number
  /** Actual time spent, accumulated as the user practices (pause-aware). */
  elapsedSeconds: number
  completed: boolean
  skipped: boolean
  /** Extra time added via "+5 min" during the session, in seconds. */
  extraSecondsAdded: number
  /** BPM the user reports reaching for this exercise today, if applicable. */
  bpmAchieved?: number
}

export type SessionStatus = 'planned' | 'in-progress' | 'paused' | 'completed' | 'abandoned'

export interface PracticeSession {
  id: string
  /** Local calendar date the session belongs to, YYYY-MM-DD. */
  date: string
  generatedAt: string
  totalPlannedMinutes: number
  exercises: SessionExercise[]
  status: SessionStatus
  currentExerciseIndex: number
  startedAt?: string
  completedAt?: string
}
