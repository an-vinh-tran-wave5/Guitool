import type { PracticeSession } from '../types/session'
import type { UserProgress, UserSettings } from '../types/progress'
import type { Exercise } from '../types/exercise'
import type { Song, SongProgressEntry } from '../types/song'
import { DEFAULT_SETTINGS } from '../types/progress'

const STORAGE_KEY = 'guitool:v1'
const SCHEMA_VERSION = 1
/** Keep session history from growing forever in localStorage. */
const MAX_HISTORY_SESSIONS = 120

export interface GuitoolState {
  version: number
  progress: UserProgress
  settings: UserSettings
  todaySession?: PracticeSession
  /** User-added exercises. Merged with the built-in library at read time — see services/exerciseLibrary.ts. */
  customExercises: Exercise[]
  /** User-added songs. Merged with the built-in catalog at read time — see services/songLibrary.ts. */
  customSongs: Song[]
  /** Per-song status ("want to learn" / "learning" / "learned") and favorite flag, keyed by song id. */
  songProgress: Record<string, SongProgressEntry>
}

function emptyProgress(): UserProgress {
  return {
    streak: { current: 0, longest: 0 },
    totalSessionsCompleted: 0,
    totalPracticeSeconds: 0,
    exerciseStats: {},
    sessionHistory: [],
  }
}

function defaultState(): GuitoolState {
  return {
    version: SCHEMA_VERSION,
    progress: emptyProgress(),
    settings: { ...DEFAULT_SETTINGS },
    customExercises: [],
    customSongs: [],
    songProgress: {},
  }
}

function isStorageAvailable(): boolean {
  try {
    const test = '__guitool_test__'
    window.localStorage.setItem(test, '1')
    window.localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

export const storageAvailable = isStorageAvailable()

/**
 * Loads state from localStorage, migrating/repairing as needed. Never
 * throws — a corrupted or missing entry just falls back to a fresh state so
 * the app always renders.
 */
export function loadState(): GuitoolState {
  if (!storageAvailable) return defaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<GuitoolState>
    const base = defaultState()
    return {
      version: SCHEMA_VERSION,
      progress: { ...base.progress, ...parsed.progress },
      settings: { ...base.settings, ...parsed.settings },
      todaySession: parsed.todaySession,
      customExercises: Array.isArray(parsed.customExercises) ? parsed.customExercises : [],
      customSongs: Array.isArray(parsed.customSongs) ? parsed.customSongs : [],
      songProgress: parsed.songProgress && typeof parsed.songProgress === 'object' ? parsed.songProgress : {},
    }
  } catch {
    return defaultState()
  }
}

export function saveState(state: GuitoolState): void {
  if (!storageAvailable) return
  try {
    // Trim history defensively so storage never grows unbounded.
    const trimmed: GuitoolState = {
      ...state,
      progress: {
        ...state.progress,
        sessionHistory: state.progress.sessionHistory.slice(0, MAX_HISTORY_SESSIONS),
      },
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // Storage full or unavailable mid-session — fail silently, the UI still
    // works for the rest of the session, just without persistence.
  }
}

export function clearAllData(): void {
  if (!storageAvailable) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
