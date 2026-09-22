import ComingSoon from '../../components/ui/ComingSoon'

/**
 * Placeholder for the Phase 3 song library. This app does not scrape or
 * reproduce copyrighted tab content. When this feature is built, it should
 * either integrate a licensed/legal tab provider behind this feature
 * folder, or use mock/local song data for demo purposes only.
 */
export default function SongsPlaceholder() {
  return (
    <ComingSoon
      icon="📜"
      phase="Phase 3 — Song Learning"
      title="Songs"
      description="A song-learning workspace: search for songs, break them into sections, and turn any section into a focused practice session."
      bullets={[
        'Song search with difficulty, tuning, capo and BPM at a glance.',
        'Section breakdown (intro, verse, solo…) feeding Song Practice Mode.',
        'Built to plug in a licensed tab/chord data source later — no copyrighted content is scraped or stored.',
      ]}
    />
  )
}
