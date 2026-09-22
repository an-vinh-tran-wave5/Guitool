import { useEffect, useRef, useState } from 'react'
import { AlphaTabApi } from '@coderline/alphatab'

/**
 * Renders one imported Guitar Pro / MusicXML file with alphaTab: notation +
 * tab display, a following cursor, and playback with per-track mute/solo.
 *
 * This is the one piece of Guitool built against a real third-party
 * library rather than hand-written from scratch. It was originally written
 * without npm registry access to compile against the real types (only a
 * manual TypeScript stub-check, which can't validate calls into a package
 * that was never installed), and `npm run build` against the real
 * `@coderline/alphatab` types did catch one mistake: there is no
 * `core.soundFontDirectory` setting — the soundfont is configured via
 * `player.soundFont` as a direct file URL instead (see below), not a
 * directory the way the web font is. That's now fixed and the file
 * compiles clean against the real types.
 *
 * `enableCursor: true` below turns on alphaTab's built-in playback cursor
 * *and* current-note highlighting, but alphaTab ships no default CSS for
 * either (confirmed by reading the installed package's source) — it just
 * adds/positions plain `<div>`s and toggles class names, expecting the
 * embedding app to style them. That styling (the moving playhead, the bar
 * highlight, the currently-sounding note turning color, and forcing the
 * notation surface to a fixed light "paper" background so it stays legible
 * in dark mode) lives in `src/index.css` under the "alphaTab" section,
 * since these are global class names alphaTab injects directly into the
 * DOM, not React-scoped ones.
 */

interface TrackInfo {
  index: number
  name: string
  isMuted: boolean
  isSolo: boolean
}

export default function TabPlayer({ data, fileName }: { data: ArrayBuffer; fileName: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<AlphaTabApi | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [scoreTitle, setScoreTitle] = useState<string | null>(null)
  const [tracks, setTracks] = useState<TrackInfo[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    setScoreTitle(null)
    setTracks([])
    setLoadError(null)
    setIsPlaying(false)

    const api = new AlphaTabApi(container, {
      core: {
        // The @coderline/alphatab-vite plugin (see vite.config.ts) copies
        // alphaTab's bundled web font to this path at build/dev time.
        fontDirectory: '/font/',
      },
      player: {
        enablePlayer: true,
        enableCursor: true,
        enableUserInteraction: true,
        // There's no `core.soundFontDirectory` setting (that was wrong —
        // see the file-level note above); the player takes a direct URL
        // to one soundfont file via `player.soundFont` instead. The Vite
        // plugin copies the whole soundfont/ folder, so both sonivox.sf2
        // and the smaller sonivox.sf3 are available here — sf3 for the
        // faster download.
        soundFont: '/soundfont/sonivox.sf3',
      },
    })
    apiRef.current = api

    api.scoreLoaded.on((score: { title?: string; tracks: { name?: string }[] }) => {
      setScoreTitle(score.title?.trim() || fileName)
      setTracks(
        score.tracks.map((t, i: number) => ({
          index: i,
          name: t.name?.trim() || `Track ${i + 1}`,
          isMuted: false,
          isSolo: false,
        })),
      )
    })

    api.error.on(() => {
      setLoadError(
        "Couldn't read this file — it may not be a supported Guitar Pro / MusicXML file, or the file may be corrupted.",
      )
    })

    try {
      api.load(data)
    } catch {
      setLoadError("Couldn't read this file — it may not be a supported Guitar Pro / MusicXML file.")
    }

    return () => {
      api.destroy()
      apiRef.current = null
    }
  }, [data, fileName])

  const handlePlay = () => {
    apiRef.current?.play()
    setIsPlaying(true)
  }

  const handlePause = () => {
    apiRef.current?.pause()
    setIsPlaying(false)
  }

  const handleStop = () => {
    apiRef.current?.stop()
    setIsPlaying(false)
  }

  const handleToggleMute = (index: number) => {
    const api = apiRef.current
    const track = api?.score?.tracks?.[index]
    if (!api || !track) return
    setTracks((prev) => {
      const next = prev.map((t) => (t.index === index ? { ...t, isMuted: !t.isMuted } : t))
      const updated = next.find((t) => t.index === index)
      if (updated) api.changeTrackMute([track], updated.isMuted)
      return next
    })
  }

  const handleToggleSolo = (index: number) => {
    const api = apiRef.current
    const track = api?.score?.tracks?.[index]
    if (!api || !track) return
    setTracks((prev) => {
      const next = prev.map((t) => (t.index === index ? { ...t, isSolo: !t.isSolo } : t))
      const updated = next.find((t) => t.index === index)
      if (updated) api.changeTrackSolo([track], updated.isSolo)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {loadError && (
        <p className="rounded-xl border border-ember-600/50 bg-ember-500/10 px-4 py-3 text-sm text-ember-300">
          {loadError}
        </p>
      )}

      {!loadError && (
        <section className="panel flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-base font-medium tracking-wide text-parchment-100">
              {scoreTitle ?? 'Loading…'}
            </p>
            <div className="flex items-center gap-2">
              {isPlaying ? (
                <button type="button" className="btn-secondary" onClick={handlePause}>
                  ⏸ Pause
                </button>
              ) : (
                <button type="button" className="btn-primary" onClick={handlePlay}>
                  ▶ Play
                </button>
              )}
              <button type="button" className="btn-secondary" onClick={handleStop}>
                ■ Stop
              </button>
            </div>
          </div>

          {tracks.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {tracks.map((t) => (
                <div
                  key={t.index}
                  className="flex items-center justify-between gap-3 rounded-lg bg-ink-800/60 px-3 py-2"
                >
                  <span className="truncate text-sm text-parchment-200">{t.name}</span>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleMute(t.index)}
                      className={
                        t.isMuted
                          ? 'chip !border-ember-500/60 !bg-ember-500/15 !text-ember-300'
                          : 'chip !text-parchment-400/70 hover:!text-parchment-200'
                      }
                    >
                      Mute
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSolo(t.index)}
                      className={
                        t.isSolo
                          ? 'chip !border-brass-500/50 !bg-brass-500/15 !text-brass-300'
                          : 'chip !text-parchment-400/70 hover:!text-parchment-200'
                      }
                    >
                      Solo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <div ref={containerRef} className="panel overflow-x-auto p-4" style={{ minHeight: 320 }} />
    </div>
  )
}
