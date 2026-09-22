import { useState } from 'react'
import ChordLibraryGrid from '../features/chords/ChordLibraryGrid'
import SongLyricsView from '../features/chords/SongLyricsView'

type Tab = 'library' | 'lyrics'

/**
 * Songs → Chords — for people who just want to play and sing, as two small
 * pages in one (per the feature request):
 *
 *  - "Chord Library": every chord on the guitar, many hand positions each
 *    (`features/chords/ChordLibraryGrid.tsx`, backed by `data/chordLibrary.ts`).
 *  - "Song Lyrics": pick a song, see its lyrics with chords over them
 *    (`features/chords/SongLyricsView.tsx`, backed by a small original demo
 *    dataset in `data/demoSongs.ts` — see that file's doc comment for why
 *    it's original content rather than a scraped/licensed lyrics dataset).
 */
export default function SongsChords() {
  const [tab, setTab] = useState<Tab>('library')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="label-eyebrow">Songs · Chords</p>
        <h1 className="mt-1 text-3xl font-semibold text-parchment-100">Chords &amp; lyrics</h1>
      </div>

      <div className="flex gap-1.5" role="tablist" aria-label="Chords section">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'library'}
          onClick={() => setTab('library')}
          className={tab === 'library' ? 'chip !border-ember-500/60 !bg-ember-500/15 !text-ember-300' : 'chip !text-parchment-400/70 hover:!text-parchment-200'}
        >
          Chord Library
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'lyrics'}
          onClick={() => setTab('lyrics')}
          className={tab === 'lyrics' ? 'chip !border-ember-500/60 !bg-ember-500/15 !text-ember-300' : 'chip !text-parchment-400/70 hover:!text-parchment-200'}
        >
          Song Lyrics
        </button>
      </div>

      {tab === 'library' ? (
        <>
          <p className="text-sm text-parchment-400/70">
            Pick a root to see every chord type we've got for it — major, minor, 7ths, 9ths, dim, aug and
            more — each with every hand position in the dataset.
          </p>
          <ChordLibraryGrid />
        </>
      ) : (
        <>
          <p className="text-sm text-parchment-400/70">
            Pick a song to see its lyrics with the chords laid out above them — tap a chord to see how to
            play it.
          </p>
          <SongLyricsView />
        </>
      )}
    </div>
  )
}
