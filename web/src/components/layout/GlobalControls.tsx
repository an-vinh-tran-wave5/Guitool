import { useTheme } from '../../hooks/useTheme'
import { useLocale } from '../../hooks/useLocale'
import { LANGUAGES } from '../../i18n/languages'

/**
 * Theme toggle + language dropdown, shown top-right on every page (see
 * `AppShell.tsx`) — a native `<select>` for the language picker rather
 * than a custom dropdown: it's fully keyboard/screen-reader accessible for
 * free, and a 5-item list doesn't need anything fancier.
 */
export default function GlobalControls() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLocale()

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
        title={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-600/60 bg-ink-800/60 text-base transition hover:bg-ink-700/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass-400"
      >
        <span aria-hidden>{theme === 'dark' ? '☀️' : '🌙'}</span>
      </button>

      <label className="sr-only" htmlFor="guitool-language-select">
        {t('language.label')}
      </label>
      <select
        id="guitool-language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as (typeof LANGUAGES)[number]['code'])}
        aria-label={t('language.label')}
        title={t('language.label')}
        className="h-9 rounded-xl border border-ink-600/60 bg-ink-800/60 px-2 text-sm text-parchment-200 transition hover:bg-ink-700/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass-400"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}
