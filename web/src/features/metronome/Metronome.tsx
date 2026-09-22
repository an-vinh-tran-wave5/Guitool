import { useEffect, useRef, useState } from 'react'
import { useMetronomeEngine } from './useMetronomeEngine'
import { DEFAULT_TIME_SIGNATURE, TIME_SIGNATURES } from './timeSignatures'
import { NOTE_SUBDIVISIONS } from './noteSubdivisions'

const BPM_STEP_SMALL = 1
const BPM_STEP_LARGE = 5
const MIN_BPM = 30
const MAX_BPM = 240

function BeatDots({
  beats,
  subdivision,
  currentBeat,
  currentSubBeat,
  accentEnabled,
}: {
  beats: number
  subdivision: number
  currentBeat: number
  currentSubBeat: number
  accentEnabled: boolean
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3"
      role="img"
      aria-label={`Beat ${currentBeat + 1} of ${beats}`}
    >
      {Array.from({ length: beats }).map((_, i) => (
        <div key={i} className="flex items-center gap-1">
          {Array.from({ length: subdivision }).map((_, j) => {
            const isMain = j === 0
            const isAccentBeat = isMain && i === 0 && accentEnabled
            const isCurrent = i === currentBeat && j === currentSubBeat
            return (
              <span
                key={j}
                className={[
                  'rounded-full transition-all duration-100',
                  isMain ? (isAccentBeat ? 'h-4 w-4' : 'h-3 w-3') : 'h-1.5 w-1.5',
                  isCurrent
                    ? isAccentBeat
                      ? 'scale-125 bg-ember-400 shadow-[0_0_12px_rgba(227,92,63,0.7)]'
                      : 'scale-125 bg-brass-300'
                    : isAccentBeat
                      ? 'bg-brass-600/60'
                      : isMain
                        ? 'bg-ink-600'
                        : 'bg-ink-700',
                ].join(' ')}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function Metronome() {
  const engine = useMetronomeEngine(100)
  const [signatureLabel, setSignatureLabel] = useState(DEFAULT_TIME_SIGNATURE.label)
  const [tapHint, setTapHint] = useState('Tap a few times to set the tempo')
  const tapHintTimeout = useRef<number | null>(null)

  // Manual BPM entry. Kept as its own string state (rather than reading
  // engine.bpm directly) so the field can hold an intermediate value like
  // "" or "9" while typing, without the engine clamping it on every
  // keystroke. It only re-syncs from the engine while the field isn't
  // focused, so it doesn't fight the user mid-edit.
  const [bpmInput, setBpmInput] = useState(String(engine.bpm))
  const bpmInputFocused = useRef(false)

  useEffect(() => {
    if (!bpmInputFocused.current) setBpmInput(String(engine.bpm))
  }, [engine.bpm])

  const commitBpmInput = () => {
    bpmInputFocused.current = false
    const parsed = Number(bpmInput)
    if (bpmInput.trim() !== '' && Number.isFinite(parsed)) {
      engine.setBpm(parsed)
    } else {
      setBpmInput(String(engine.bpm))
    }
  }

  // Keep beatsPerMeasure in sync with the chosen time signature preset.
  useEffect(() => {
    const preset = TIME_SIGNATURES.find((t) => t.label === signatureLabel)
    if (preset) engine.setBeatsPerMeasure(preset.beats)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatureLabel])

  // Keyboard shortcuts: space toggles, arrows nudge BPM, T taps tempo.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if (typing) return

      if (e.code === 'Space') {
        e.preventDefault()
        engine.toggle()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        engine.setBpm(engine.bpm + (e.shiftKey ? BPM_STEP_LARGE : BPM_STEP_SMALL))
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        engine.setBpm(engine.bpm - (e.shiftKey ? BPM_STEP_LARGE : BPM_STEP_SMALL))
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault()
        handleTap()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.bpm, engine.toggle, engine.setBpm])

  const handleTap = () => {
    engine.registerTap()
    setTapHint('Tap again to refine, or keep playing')
    if (tapHintTimeout.current) window.clearTimeout(tapHintTimeout.current)
    tapHintTimeout.current = window.setTimeout(() => setTapHint('Tap a few times to set the tempo'), 3000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="label-eyebrow">Phase 2 — Guitar Tools</p>
        <h1 className="mt-1 flex items-center gap-2 text-3xl font-semibold text-parchment-100">
          <span aria-hidden>🥁</span> Metronome
        </h1>
      </div>

      {/* Time signature */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] uppercase tracking-widest2 text-parchment-400/50">Time signature</p>
        <div className="flex flex-wrap gap-2">
          {TIME_SIGNATURES.map((sig) => (
            <button
              key={sig.label}
              type="button"
              onClick={() => setSignatureLabel(sig.label)}
              className={
                signatureLabel === sig.label
                  ? 'chip !border-ember-500/60 !bg-ember-500/15 !text-ember-300'
                  : 'chip !text-parchment-400/70 hover:!text-parchment-200'
              }
            >
              {sig.label}
            </button>
          ))}
        </div>
      </div>

      {/* Note value / subdivision */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] uppercase tracking-widest2 text-parchment-400/50">Note value</p>
        <div className="flex flex-wrap gap-2">
          {NOTE_SUBDIVISIONS.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => engine.setSubdivision(note.subdivisions)}
              className={
                engine.subdivision === note.subdivisions
                  ? 'chip gap-1.5 !border-ember-500/60 !bg-ember-500/15 !text-ember-300'
                  : 'chip gap-1.5 !text-parchment-400/70 hover:!text-parchment-200'
              }
            >
              <span aria-hidden className="text-sm">
                {note.shortLabel}
              </span>
              {note.label}
            </button>
          ))}
        </div>
      </div>

      <section className="panel-raised flex flex-col items-center gap-6 px-5 py-8 text-center">
        <div>
          <p className="font-mono text-6xl font-semibold tabular-nums text-parchment-100 sm:text-7xl">
            {engine.bpm}
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-parchment-400/60">BPM</p>
        </div>

        <BeatDots
          beats={engine.beatsPerMeasure}
          subdivision={engine.subdivision}
          currentBeat={engine.currentBeat}
          currentSubBeat={engine.currentSubBeat}
          accentEnabled={engine.accentEnabled}
        />

        <div className="flex w-full max-w-sm items-center gap-3">
          <button
            type="button"
            className="btn-secondary !px-3"
            onClick={() => engine.setBpm(engine.bpm - BPM_STEP_SMALL)}
            aria-label="Decrease tempo"
          >
            −
          </button>
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            value={engine.bpm}
            onChange={(e) => engine.setBpm(Number(e.target.value))}
            className="flex-1 accent-ember-500"
            aria-label="Tempo in beats per minute"
          />
          <button
            type="button"
            className="btn-secondary !px-3"
            onClick={() => engine.setBpm(engine.bpm + BPM_STEP_SMALL)}
            aria-label="Increase tempo"
          >
            +
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="bpm-input" className="text-xs uppercase tracking-wide text-parchment-400/60">
            Set BPM
          </label>
          <input
            id="bpm-input"
            type="number"
            inputMode="numeric"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpmInput}
            onFocus={() => {
              bpmInputFocused.current = true
            }}
            onChange={(e) => setBpmInput(e.target.value)}
            onBlur={commitBpmInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className="w-20 rounded-lg border border-ink-600 bg-ink-900/60 px-2 py-1.5 text-center font-mono text-sm text-parchment-100 focus:border-ember-500 focus:outline-none"
          />
        </div>

        <button type="button" className="btn-primary w-full max-w-sm text-lg" onClick={engine.toggle}>
          {engine.isPlaying ? '■ Stop' : '▶ Start'}
        </button>

        <div className="flex flex-col items-center gap-1.5">
          <button type="button" className="btn-secondary" onClick={handleTap}>
            👆 Tap Tempo
          </button>
          <p className="text-xs text-parchment-400/60">{tapHint}</p>
        </div>
      </section>

      <section className="panel flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="volume" className="label-eyebrow shrink-0">
            Volume
          </label>
          <input
            id="volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={engine.volume}
            onChange={(e) => engine.setVolume(Number(e.target.value))}
            className="flex-1 accent-brass-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="accent" className="label-eyebrow">
            Accent beat 1
          </label>
          <button
            id="accent"
            type="button"
            role="switch"
            aria-checked={engine.accentEnabled}
            onClick={() => engine.setAccentEnabled(!engine.accentEnabled)}
            className={[
              'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-0 p-0 transition-colors',
              'duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-500/50',
              engine.accentEnabled ? 'bg-ember-500' : 'bg-ink-600',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className={[
                'inline-block h-4 w-4 transform rounded-full bg-parchment-100 shadow-knob transition-transform',
                'duration-200 ease-in-out',
                engine.accentEnabled ? 'translate-x-6' : 'translate-x-1',
              ].join(' ')}
            />
          </button>
        </div>
      </section>

      <p className="text-center text-xs text-parchment-400/50">
        Keyboard: <span className="text-parchment-300/70">Space</span> start/stop ·{' '}
        <span className="text-parchment-300/70">↑ / ↓</span> tempo (hold Shift for ±5) ·{' '}
        <span className="text-parchment-300/70">T</span> tap tempo
      </p>
    </div>
  )
}
