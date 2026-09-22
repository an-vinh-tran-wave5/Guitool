import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * The metronome's timing engine.
 *
 * A plain `setInterval` click is not accurate enough for a metronome — the
 * browser's timer jitter (easily 10-20ms under any load) is audible as
 * wobble. Instead this uses the standard Web Audio "lookahead scheduler"
 * pattern: a cheap `setTimeout` loop wakes up every ~25ms and schedules any
 * clicks due in the next ~120ms using the AudioContext's own sample-accurate
 * clock (`ctx.currentTime`), so the actual sound timing never drifts even
 * though the JS loop that *queues* the sounds is imprecise.
 *
 * A separate `requestAnimationFrame` loop watches that same audio clock to
 * flip the on-screen "current beat" in sync with what's actually playing.
 *
 * Note subdivisions: each main beat can be split into 1-4 evenly-spaced
 * clicks (`subdivision`). The scheduler walks a flat tick counter across the
 * whole measure (`beatsPerMeasure * subdivision` ticks), derives which main
 * beat and which sub-tick within it each click belongs to, and spaces
 * consecutive ticks `(60 / bpm) / subdivision` seconds apart. Only the first
 * tick of a main beat (`subBeat === 0`) is a "beat" click; the rest are
 * quieter subdivision clicks in between.
 *
 * BPM/beats-per-measure/subdivision/volume/accent are mirrored into refs so
 * the scheduler (which runs outside React's render cycle) always reads the
 * latest value without needing to be torn down and restarted on every
 * change — changes take effect on the very next click.
 */

const LOOKAHEAD_MS = 25
const SCHEDULE_AHEAD_SECONDS = 0.12
const CLICK_DURATION = 0.035
const MIN_BPM = 30
const MAX_BPM = 240
const MIN_BEATS = 1
const MAX_BEATS = 16
const MIN_SUBDIVISION = 1
const MAX_SUBDIVISION = 4
const TAP_RESET_GAP_MS = 2000
const TAP_HISTORY = 6

interface QueuedNote {
  mainBeat: number
  subBeat: number
  time: number
}

export interface MetronomeEngine {
  isPlaying: boolean
  /** Index of the main beat currently sounding (-1 when stopped). */
  currentBeat: number
  /** Index of the sub-tick within the current main beat (-1 when stopped; 0 is always the beat itself). */
  currentSubBeat: number
  bpm: number
  beatsPerMeasure: number
  /** Clicks per main beat: 1 = quarter notes, 2 = eighths, 3 = triplets, 4 = sixteenths. */
  subdivision: number
  volume: number
  accentEnabled: boolean
  setBpm: (bpm: number) => void
  setBeatsPerMeasure: (n: number) => void
  setSubdivision: (n: number) => void
  setVolume: (v: number) => void
  setAccentEnabled: (v: boolean) => void
  start: () => void
  stop: () => void
  toggle: () => void
  registerTap: () => void
}

export function useMetronomeEngine(initialBpm = 100): MetronomeEngine {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(-1)
  const [currentSubBeat, setCurrentSubBeat] = useState(-1)
  const [bpm, setBpmState] = useState(initialBpm)
  const [beatsPerMeasure, setBeatsPerMeasureState] = useState(4)
  const [subdivision, setSubdivisionState] = useState(1)
  const [volume, setVolumeState] = useState(0.7)
  const [accentEnabled, setAccentEnabledState] = useState(true)

  // Mirrors of the above, read by the scheduler loop.
  const bpmRef = useRef(bpm)
  const beatsRef = useRef(beatsPerMeasure)
  const subdivisionRef = useRef(subdivision)
  const volumeRef = useRef(volume)
  const accentRef = useRef(accentEnabled)
  bpmRef.current = bpm
  beatsRef.current = beatsPerMeasure
  subdivisionRef.current = subdivision
  volumeRef.current = volume
  accentRef.current = accentEnabled

  const audioCtxRef = useRef<AudioContext | null>(null)
  const nextNoteTimeRef = useRef(0)
  /** Flat tick position within the measure, in sub-beat units. */
  const tickIndexRef = useRef(0)
  const schedulerTimerRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const noteQueueRef = useRef<QueuedNote[]>([])
  const tapTimesRef = useRef<number[]>([])

  const scheduleClick = useCallback((mainBeat: number, subBeat: number, time: number) => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    const isMainBeat = subBeat === 0
    const isAccent = isMainBeat && mainBeat === 0 && accentRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(isAccent ? 1600 : isMainBeat ? 950 : 700, time)
    const peak = (isAccent ? 0.9 : isMainBeat ? 0.5 : 0.28) * volumeRef.current
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.linearRampToValueAtTime(Math.max(0.0001, peak), time + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + CLICK_DURATION)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(time)
    osc.stop(time + CLICK_DURATION + 0.01)
    noteQueueRef.current.push({ mainBeat, subBeat, time })
  }, [])

  const schedulerTick = useCallback(() => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_SECONDS) {
      const beats = Math.max(1, beatsRef.current)
      const subdiv = Math.max(1, subdivisionRef.current)
      const totalTicks = beats * subdiv
      const mainBeat = Math.floor(tickIndexRef.current / subdiv) % beats
      const subBeat = tickIndexRef.current % subdiv
      scheduleClick(mainBeat, subBeat, nextNoteTimeRef.current)
      const secondsPerBeat = 60.0 / bpmRef.current
      nextNoteTimeRef.current += secondsPerBeat / subdiv
      tickIndexRef.current = (tickIndexRef.current + 1) % totalTicks
    }
    schedulerTimerRef.current = window.setTimeout(schedulerTick, LOOKAHEAD_MS)
  }, [scheduleClick])

  const drawTick = useCallback(() => {
    const ctx = audioCtxRef.current
    if (ctx) {
      const now = ctx.currentTime
      let lastDue: QueuedNote | undefined
      while (noteQueueRef.current.length && noteQueueRef.current[0].time <= now) {
        lastDue = noteQueueRef.current.shift()!
      }
      if (lastDue) {
        setCurrentBeat(lastDue.mainBeat)
        setCurrentSubBeat(lastDue.subBeat)
      }
    }
    rafRef.current = window.requestAnimationFrame(drawTick)
  }, [])

  const stop = useCallback(() => {
    if (schedulerTimerRef.current !== null) window.clearTimeout(schedulerTimerRef.current)
    if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
    schedulerTimerRef.current = null
    rafRef.current = null
    noteQueueRef.current = []
    const ctx = audioCtxRef.current
    audioCtxRef.current = null
    if (ctx) ctx.close().catch(() => {})
    setIsPlaying(false)
    setCurrentBeat(-1)
    setCurrentSubBeat(-1)
  }, [])

  const start = useCallback(() => {
    if (audioCtxRef.current) return
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    audioCtxRef.current = ctx
    tickIndexRef.current = 0
    nextNoteTimeRef.current = ctx.currentTime + 0.05
    noteQueueRef.current = []
    setIsPlaying(true)
    schedulerTick()
    rafRef.current = window.requestAnimationFrame(drawTick)
  }, [schedulerTick, drawTick])

  const toggle = useCallback(() => {
    if (audioCtxRef.current) stop()
    else start()
  }, [start, stop])

  // Stop the engine (and release the AudioContext) if this hook unmounts
  // while running, e.g. the user navigates away mid-click.
  useEffect(() => {
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setBpm = useCallback((next: number) => {
    if (Number.isNaN(next)) return
    setBpmState(Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(next))))
  }, [])

  const setBeatsPerMeasure = useCallback((n: number) => {
    setBeatsPerMeasureState(Math.min(MAX_BEATS, Math.max(MIN_BEATS, Math.round(n))))
  }, [])

  const setSubdivision = useCallback((n: number) => {
    setSubdivisionState(Math.min(MAX_SUBDIVISION, Math.max(MIN_SUBDIVISION, Math.round(n))))
  }, [])

  const setVolume = useCallback((v: number) => setVolumeState(Math.min(1, Math.max(0, v))), [])
  const setAccentEnabled = useCallback((v: boolean) => setAccentEnabledState(v), [])

  const registerTap = useCallback(() => {
    const now = performance.now()
    const taps = tapTimesRef.current
    if (taps.length > 0 && now - taps[taps.length - 1] > TAP_RESET_GAP_MS) {
      taps.length = 0
    }
    taps.push(now)
    if (taps.length > TAP_HISTORY) taps.shift()
    if (taps.length >= 2) {
      const intervals: number[] = []
      for (let i = 1; i < taps.length; i++) intervals.push(taps[i] - taps[i - 1])
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length
      setBpm(60000 / avgMs)
    }
  }, [setBpm])

  return {
    isPlaying,
    currentBeat,
    currentSubBeat,
    bpm,
    beatsPerMeasure,
    subdivision,
    volume,
    accentEnabled,
    setBpm,
    setBeatsPerMeasure,
    setSubdivision,
    setVolume,
    setAccentEnabled,
    start,
    stop,
    toggle,
    registerTap,
  }
}
