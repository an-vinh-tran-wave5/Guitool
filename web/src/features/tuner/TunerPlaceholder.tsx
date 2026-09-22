import ComingSoon from '../../components/ui/ComingSoon'

/**
 * Placeholder for the Phase 2 tuner. The real implementation will use the
 * Web Audio API (AnalyserNode + autocorrelation pitch detection) against
 * the microphone, isolated behind this feature folder so the detection
 * algorithm can be swapped or improved without touching the rest of the app.
 */
export default function TunerPlaceholder() {
  return (
    <ComingSoon
      icon="🎵"
      phase="Phase 2 — Guitar Tools"
      title="Tuner"
      description="A microphone-based tuner for standard tuning (E A D G B E), showing the detected note, cents off pitch, and frequency."
      bullets={[
        'Live pitch detection from your microphone via the Web Audio API.',
        'Needle-style display with cents flat/sharp and the detected frequency.',
        'Falls back gracefully if the browser denies microphone access.',
      ]}
    />
  )
}
