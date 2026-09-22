import ComingSoon from '../../components/ui/ComingSoon'

/**
 * Placeholder for the Phase 4 amp/tone feature. Amp controls should be
 * modeled dynamically per amp (not every amp has the same knobs), so the
 * eventual data model here is an array of { id, label, min, max } controls
 * per amp rather than a fixed Gain/Bass/Mid/Treble/Presence shape.
 */
export default function AmpTonesPlaceholder() {
  return (
    <ComingSoon
      icon="🔊"
      phase="Phase 4 — Tone"
      title="Amp & Tone"
      description="Look up a suggested tone for a song, or pick your own amp and get a starting-point tone template adapted to its actual controls."
      bullets={[
        'Song-to-tone suggestions: amp voicing, knob settings and effects.',
        'A small library of amp models (Fender, Marshall, Boss Katana, NUX, Yamaha…) that can grow over time.',
        'Amp controls modeled per amp, not a one-size-fits-all knob set.',
      ]}
    />
  )
}
