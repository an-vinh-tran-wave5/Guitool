import type { TranslationKey } from '../../i18n/translations'

export interface NavItem {
  to: string
  labelKey: TranslationKey
  icon: string
  /** Shown as a small "soon" badge for not-yet-built phases. */
  soon?: boolean
  /** A dropdown of sub-pages (e.g. Songs → Tabs / Chords) instead of navigating directly. */
  children?: NavItem[]
}

export const PRIMARY_NAV: NavItem[] = [
  { to: '/', labelKey: 'nav.home', icon: '🎸' },
  { to: '/level', labelKey: 'nav.level', icon: '🎚️' },
  { to: '/practice', labelKey: 'nav.practice', icon: '⏱️' },
  { to: '/tuner', labelKey: 'nav.tuner', icon: '🎵', soon: true },
  { to: '/metronome', labelKey: 'nav.metronome', icon: '🥁' },
  { to: '/progress', labelKey: 'nav.progress', icon: '📊' },
]

export const SECONDARY_NAV: NavItem[] = [
  { to: '/library', labelKey: 'nav.library', icon: '📚' },
  {
    to: '/songs',
    labelKey: 'nav.songs',
    icon: '📜',
    children: [
      { to: '/songs/tabs', labelKey: 'nav.tabs', icon: '🎼' },
      { to: '/songs/chords', labelKey: 'nav.chords', icon: '🎶' },
    ],
  },
  { to: '/amp-tones', labelKey: 'nav.ampTones', icon: '🔊', soon: true },
]
