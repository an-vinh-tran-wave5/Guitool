import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from '../i18n/languages'
import { TRANSLATIONS, type TranslationKey } from '../i18n/translations'

const STORAGE_KEY = 'guitool:language'

function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGES.some((l) => l.code === value)
}

function readStoredLanguage(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored && isLanguageCode(stored) ? stored : DEFAULT_LANGUAGE
}

interface LocaleContextValue {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  /** Translates a key against the active language, falling back to English for a key missing from a dictionary. */
  t: (key: TranslationKey) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * Language switcher. Scoped to the app's shell/nav chrome only (see the
 * doc comment in `i18n/translations.ts`) — this is the framework for that,
 * not a claim that the whole app is translated.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => readStoredLanguage())

  useEffect(() => {
    document.documentElement.lang = language
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Private browsing / storage disabled — language choice just won't persist across reloads.
    }
  }, [language])

  const setLanguage = useCallback((next: LanguageCode) => setLanguageState(next), [])

  const t = useMemo(() => {
    const dictionary = TRANSLATIONS[language]
    const fallback = TRANSLATIONS[DEFAULT_LANGUAGE]
    return (key: TranslationKey) => dictionary[key] ?? fallback[key] ?? key
  }, [language])

  return <LocaleContext.Provider value={{ language, setLanguage, t }}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}
