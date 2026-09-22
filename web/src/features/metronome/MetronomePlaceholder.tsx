import ComingSoon from '../../components/ui/ComingSoon'

/**
 * Placeholder for the Phase 2 metronome. `src/utils/sound.ts` already
 * exposes a `playClick` helper (Web Audio, no assets) that the real
 * metronome will schedule on a lookahead timer for tight, drift-free
 * timing — the same building block practice exercises use for their
 * completion chime.
 */
export default function MetronomePlaceholder() {
  return (
    <ComingSoon
      icon="🥁"
      phase="Phase 2 — Guitar Tools"
      title="Metronome"
      description="A dependable click track with tap tempo, accents, and time signatures — usable hands-free during a practice exercise."
      bullets={[
        'BPM control with tap tempo, plus start/pause and a volume slider.',
        'Accent on beat 1 and configurable time signatures.',
        'A visual beat indicator so you can follow it with the sound off.',
      ]}
    />
  )
}
