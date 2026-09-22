import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'guitool:theme'

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  // No stored preference yet — respect the OS/browser preference once, but
  // Guitool's own default (and the only theme that existed before this
  // feature) is dark, so an "no preference either way" browser stays dark.
  if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Dark/light theme toggle. The actual color values live entirely in
 * `index.css` as CSS custom properties (`--color-ink-*` etc., see the
 * comment there) — this hook's only job is deciding which theme is active
 * and reflecting that as `data-theme="light"` (or removing it, for dark,
 * the default) on `<html>`, so every existing Tailwind color class in the
 * app picks up the right value with no per-component changes needed.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme())

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') root.setAttribute('data-theme', 'light')
    else root.removeAttribute('data-theme')
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Private browsing / storage disabled — theme just won't persist across reloads.
    }
  }, [theme])

  const setTheme = useCallback((next: Theme) => setThemeState(next), [])
  const toggleTheme = useCallback(() => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
