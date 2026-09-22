/**
 * Tiny Web Audio helpers — no audio assets needed. Every call creates a
 * short-lived AudioContext so this works without any global audio state
 * and never throws if the browser blocks autoplay (it simply no-ops).
 */

function withAudioContext(fn: (ctx: AudioContext) => void) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    fn(ctx)
    // Give the scheduled sound time to play, then release the context.
    setTimeout(() => ctx.close().catch(() => {}), 1500)
  } catch {
    /* audio not available — fail silently */
  }
}

function tone(ctx: AudioContext, freq: number, startTime: number, duration: number, gain = 0.18) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  g.gain.setValueAtTime(0, startTime)
  g.gain.linearRampToValueAtTime(gain, startTime + 0.01)
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.02)
}

/** Two-note ascending chime played when an exercise's timer completes. */
export function playExerciseCompleteChime() {
  withAudioContext((ctx) => {
    const now = ctx.currentTime
    tone(ctx, 523.25, now, 0.18) // C5
    tone(ctx, 783.99, now + 0.16, 0.28) // G5
  })
}

/** A slightly bigger flourish for finishing the whole session. */
export function playSessionCompleteChime() {
  withAudioContext((ctx) => {
    const now = ctx.currentTime
    tone(ctx, 523.25, now, 0.16)
    tone(ctx, 659.25, now + 0.14, 0.16)
    tone(ctx, 783.99, now + 0.28, 0.4)
  })
}

/** A single metronome-style click, used by the (future) Metronome feature and available for reuse. */
export function playClick(accent: boolean) {
  withAudioContext((ctx) => {
    const now = ctx.currentTime
    tone(ctx, accent ? 1500 : 1000, now, 0.05, accent ? 0.3 : 0.18)
  })
}
