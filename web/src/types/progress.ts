import type { PracticeSession } from './session'

/** Rolling stats kept per exercise so the generator and dashboards can reason about history. */
export interface ExerciseStat {
  exerciseId: string
  timesPracticed: number
  totalSeconds: number
  timesSkipped: number
  lastPracticedDate?: string
  bestBpm?: number
  /** User's own "how hard is this for me right now" rating; feeds "Needs attention". */
  perceivedDifficulty?: number
  isFavorite: boolean
}

export interface StreakInfo {
  current: number
  longest: number
  lastSessionDate?: string
}

export interface UserProgress {
  streak: StreakInfo
  totalSessionsCompleted: number
  totalPracticeSeconds: number
  exerciseStats: Record<string, ExerciseStat>
  /** Most recent sessions, newest first. Trimmed to a reasonable cap by storage layer. */
  sessionHistory: PracticeSession[]
}

export interface ReminderSettings {
  enabled: boolean
  time: string // "HH:MM", 24h
  days: number[] // 0 (Sun) - 6 (Sat)
}

/** Self-reported skill level, used to shape the daily session generator. */
export type PlayerLevel = 'beginner' | 'intermediate' | 'advanced'

export const PLAYER_LEVEL_LABELS: Record<PlayerLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const PLAYER_LEVELS: { id: PlayerLevel; label: string; description: string }[] = [
  {
    id: 'beginner',
    label: PLAYER_LEVEL_LABELS.beginner,
    description:
      "New to guitar or still building basic technique. Daily sessions lean toward the easier end of the library and go lighter on high-difficulty exercises.",
  },
  {
    id: 'intermediate',
    label: PLAYER_LEVEL_LABELS.intermediate,
    description:
      'Comfortable with the basics and ready to stretch. Sessions mix solid fundamentals with more demanding material.',
  },
  {
    id: 'advanced',
    label: PLAYER_LEVEL_LABELS.advanced,
    description:
      'Confident player pushing technique and repertoire further. Sessions lean toward the harder, more demanding exercises in the library.',
  },
]

export interface UserSettings {
  dailyMinutesTarget: number
  exercisesPerSession: { min: number; max: number }
  focusCategories: string[]
  reminder: ReminderSettings
  level: PlayerLevel
}

export const DEFAULT_SETTINGS: UserSettings = {
  dailyMinutesTarget: 60,
  exercisesPerSession: { min: 2, max: 3 },
  focusCategories: [],
  reminder: {
    enabled: false,
    time: '19:00',
    days: [1, 2, 3, 4, 5],
  },
  level: 'beginner',
}
