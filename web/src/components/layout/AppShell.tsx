import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { PRIMARY_NAV, SECONDARY_NAV, type NavItem } from './nav'
import GlobalControls from './GlobalControls'
import { useLocale } from '../../hooks/useLocale'

function NavRow({ item }: { item: NavItem }) {
  const { t } = useLocale()
  const location = useLocation()
  const childActive = item.children?.some((c) => location.pathname.startsWith(c.to)) ?? false
  const [expanded, setExpanded] = useState(childActive)

  // Keep the group open if navigation (e.g. a link elsewhere in the app)
  // lands on one of its children, even if the user never clicked to expand it.
  useEffect(() => {
    if (childActive) setExpanded(true)
  }, [childActive])

  if (item.children && item.children.length > 0) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className={
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-display text-sm uppercase tracking-wide transition ' +
            (childActive
              ? 'bg-ember-600/20 text-ember-300 ring-1 ring-ember-500/40'
              : 'text-parchment-300/70 hover:bg-ink-700/60 hover:text-parchment-100')
          }
        >
          <span className="text-lg leading-none" aria-hidden>
            {item.icon}
          </span>
          <span className="flex-1 text-left">{t(item.labelKey)}</span>
          <span className={'text-xs transition-transform ' + (expanded ? 'rotate-180' : '')} aria-hidden>
            ▾
          </span>
        </button>
        {expanded && (
          <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-ink-700/60 pl-3">
            {item.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 rounded-lg px-3 py-2 font-display text-xs uppercase tracking-wide transition',
                    isActive
                      ? 'bg-ember-600/20 text-ember-300'
                      : 'text-parchment-300/70 hover:bg-ink-700/60 hover:text-parchment-100',
                  ].join(' ')
                }
              >
                <span className="text-base leading-none" aria-hidden>
                  {child.icon}
                </span>
                <span>{t(child.labelKey)}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-sm uppercase tracking-wide transition',
          isActive
            ? 'bg-ember-600/20 text-ember-300 ring-1 ring-ember-500/40'
            : 'text-parchment-300/70 hover:bg-ink-700/60 hover:text-parchment-100',
        ].join(' ')
      }
    >
      <span className="text-lg leading-none" aria-hidden>
        {item.icon}
      </span>
      <span className="flex-1">{t(item.labelKey)}</span>
      {item.soon && <span className="chip !py-0 !text-[10px]">{t('nav.soon')}</span>}
    </NavLink>
  )
}

function MobileTab({ item }: { item: NavItem }) {
  const { t } = useLocale()
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        [
          'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] font-display uppercase tracking-wide transition',
          isActive ? 'text-ember-300' : 'text-parchment-400/70',
        ].join(' ')
      }
    >
      <span className="text-xl leading-none" aria-hidden>
        {item.icon}
      </span>
      {t(item.labelKey)}
    </NavLink>
  )
}

/**
 * Bottom-sheet for `SECONDARY_NAV` on mobile (Library, Songs → Tabs/Chords,
 * Amp & Tone) — before this, those pages had no mobile nav entry point at
 * all (the bottom tab bar only ever rendered `PRIMARY_NAV`); this fixes
 * that gap rather than widening it further now that Songs gains two more
 * sub-pages. Deliberately simpler than `ShapeViewer` (no swipe/label-mode
 * concerns here) but reuses the same overlay/transition conventions.
 */
function MobileMoreSheet({ onClose }: { onClose: () => void }) {
  const { t } = useLocale()
  const location = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className={
        'fixed inset-0 z-30 flex items-end bg-ink-950/70 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none md:hidden ' +
        (visible ? 'opacity-100' : 'opacity-0')
      }
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.more')}
        onClick={(e) => e.stopPropagation()}
        className={
          'panel-raised flex w-full flex-col gap-1 rounded-b-none rounded-t-2xl p-4 pb-6 transition-transform duration-200 motion-reduce:transition-none ' +
          (visible ? 'translate-y-0' : 'translate-y-6')
        }
      >
        {SECONDARY_NAV.flatMap((item) =>
          item.children && item.children.length > 0
            ? [
                <p key={item.to} className="label-eyebrow px-3 pt-2">
                  {t(item.labelKey)}
                </p>,
                ...item.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-sm uppercase tracking-wide transition',
                        isActive
                          ? 'bg-ember-600/20 text-ember-300'
                          : 'text-parchment-300/70 hover:bg-ink-700/60 hover:text-parchment-100',
                      ].join(' ')
                    }
                  >
                    <span className="text-lg leading-none" aria-hidden>
                      {child.icon}
                    </span>
                    {t(child.labelKey)}
                  </NavLink>
                )),
              ]
            : [
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-sm uppercase tracking-wide transition',
                      isActive
                        ? 'bg-ember-600/20 text-ember-300'
                        : 'text-parchment-300/70 hover:bg-ink-700/60 hover:text-parchment-100',
                    ].join(' ')
                  }
                >
                  <span className="text-lg leading-none" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="flex-1">{t(item.labelKey)}</span>
                  {item.soon && <span className="chip !py-0 !text-[10px]">{t('nav.soon')}</span>}
                </NavLink>,
              ],
        )}
      </div>
    </div>
  )
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLocale()
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const secondaryActive = SECONDARY_NAV.some(
    (item) => location.pathname.startsWith(item.to) || item.children?.some((c) => location.pathname.startsWith(c.to)),
  )

  // Close the sheet automatically if navigation happens some other way
  // (e.g. a link inside a page) while it's open.
  useEffect(() => {
    setMoreOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-dvh md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-ink-700/60 bg-ink-900/60 p-4 md:flex md:flex-col">
        <div className="mb-6 flex items-center gap-2 px-1">
          <span className="text-2xl" aria-hidden>
            🎸
          </span>
          <div>
            <p className="font-display text-lg font-semibold tracking-wide text-parchment-100">{t('app.title')}</p>
            <p className="text-[11px] uppercase tracking-widest2 text-brass-500">{t('app.tagline')}</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {PRIMARY_NAV.map((item) => (
            <NavRow key={item.to} item={item} />
          ))}
          <div className="my-3 h-px bg-ink-700" />
          {SECONDARY_NAV.map((item) => (
            <NavRow key={item.to} item={item} />
          ))}
        </nav>
        <p className="px-1 text-[11px] text-parchment-400/50">{t('app.savedNotice')}</p>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-ink-700/60 bg-ink-900/70 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            🎸
          </span>
          <span className="font-display text-base font-semibold tracking-wide text-parchment-100">
            {t('app.title')}
          </span>
        </div>
        <GlobalControls />
      </header>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Desktop top strip — global controls only; page content keeps its own heading below */}
        <div className="hidden items-center justify-end border-b border-ink-700/60 bg-ink-900/40 px-6 py-2.5 md:flex">
          <GlobalControls />
        </div>

        <main className="flex-1 pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">{children}</div>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch gap-1 border-t border-ink-700/70 bg-ink-900/95 px-2 py-1.5 backdrop-blur md:hidden">
        {PRIMARY_NAV.map((item) => (
          <MobileTab key={item.to} item={item} />
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          className={
            'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] font-display uppercase tracking-wide transition ' +
            (secondaryActive ? 'text-ember-300' : 'text-parchment-400/70')
          }
        >
          <span className="text-xl leading-none" aria-hidden>
            ⋯
          </span>
          {t('nav.more')}
        </button>
      </nav>

      {moreOpen && <MobileMoreSheet onClose={() => setMoreOpen(false)} />}
    </div>
  )
}
