import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTabFiles } from '../hooks/useTabFiles'
import { getTabFileData, type StoredTabFile } from '../services/tabFileStore'
import TabFileList from '../features/mytabs/TabFileList'
import ImportTabForm from '../features/mytabs/ImportTabForm'
import SharedTabLibrary from '../features/mytabs/SharedTabLibrary'
import TabPlayer from '../features/mytabs/TabPlayer'

/**
 * Songs → Tabs — real notation and playback for anyone who wants to play
 * solo, via alphaTab (see `features/mytabs/TabPlayer.tsx`). Files can come
 * from two places, both ending up in the same local library (IndexedDB —
 * see `services/tabFileStore.ts`):
 *
 *  - manually imported one at a time (`ImportTabForm`) — your own Guitar
 *    Pro / MusicXML files, wherever you legitimately got them;
 *  - pulled from a shared folder / file share (`SharedTabLibrary`), served
 *    by the small `tabs-server` Docker service (see `docker-compose.yml`
 *    and `docker/tabs-server/`) — a cheap-but-good-enough way to point this
 *    at a NAS share or a folder a whole household/band drops files into.
 *
 * This is the direct successor to the old standalone `/my-tabs` page (see
 * `pages/MyTabs.tsx`, now unused but left in place — files can't be deleted
 * from the linked machine) now nested under Songs → Tabs alongside the new
 * Songs → Chords page (`pages/SongsChords.tsx`). Nothing is fetched or
 * scraped automatically from anywhere — only files a person (or an
 * operator, via the shared folder) explicitly provided.
 */

type View = { mode: 'list' } | { mode: 'import' } | { mode: 'view'; file: StoredTabFile }

export default function SongsTabs() {
  const { files, loading, error, addFile, remove } = useTabFiles()
  const [view, setView] = useState<View>({ mode: 'list' })
  const [tabData, setTabData] = useState<ArrayBuffer | null>(null)
  const [tabDataError, setTabDataError] = useState<string | null>(null)

  useEffect(() => {
    if (view.mode !== 'view') {
      setTabData(null)
      setTabDataError(null)
      return
    }
    let cancelled = false
    setTabData(null)
    setTabDataError(null)
    getTabFileData(view.file.id)
      .then((data) => {
        if (cancelled) return
        if (!data) {
          setTabDataError('Could not find that file — it may have been deleted.')
          return
        }
        setTabData(data)
      })
      .catch(() => {
        if (!cancelled) setTabDataError('Could not load that file.')
      })
    return () => {
      cancelled = true
    }
  }, [view])

  const handleImport = async (input: { title: string; artist: string; fileName: string; data: ArrayBuffer }) => {
    const saved = await addFile(input)
    setView({ mode: 'view', file: saved })
  }

  const handleDelete = async (id: string) => {
    await remove(id)
    if (view.mode === 'view' && view.file.id === id) setView({ mode: 'list' })
  }

  if (view.mode === 'import') {
    return (
      <div className="flex flex-col gap-6">
        <button className="btn-ghost self-start" onClick={() => setView({ mode: 'list' })}>
          ‹ Back to Tabs
        </button>
        <div>
          <p className="label-eyebrow">Import a tab</p>
          <h1 className="mt-1 text-3xl font-semibold text-parchment-100">Bring in a file</h1>
        </div>
        <ImportTabForm onCancel={() => setView({ mode: 'list' })} onImport={handleImport} />
      </div>
    )
  }

  if (view.mode === 'view') {
    return (
      <div className="flex flex-col gap-6">
        <button className="btn-ghost self-start" onClick={() => setView({ mode: 'list' })}>
          ‹ Back to Tabs
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label-eyebrow">Songs · Tabs</p>
            <h1 className="mt-1 text-3xl font-semibold text-parchment-100">{view.file.title}</h1>
            {view.file.artist && <p className="text-sm text-parchment-400/70">{view.file.artist}</p>}
          </div>
          <button
            type="button"
            className="btn-ghost shrink-0 !text-ember-400"
            onClick={() => handleDelete(view.file.id)}
          >
            Delete
          </button>
        </div>

        {tabDataError && (
          <p className="rounded-xl border border-ember-600/50 bg-ember-500/10 px-4 py-3 text-sm text-ember-300">
            {tabDataError}
          </p>
        )}
        {!tabDataError && !tabData && <p className="text-sm text-parchment-400/70">Loading…</p>}
        {tabData && <TabPlayer data={tabData} fileName={view.file.fileName} />}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-eyebrow">Songs · Tabs</p>
          <h1 className="mt-1 text-3xl font-semibold text-parchment-100">Your tab library</h1>
        </div>
        <button className="btn-primary shrink-0" onClick={() => setView({ mode: 'import' })}>
          + Import Tab
        </button>
      </div>

      <p className="text-sm text-parchment-400/70">
        Real notation rendering and synced playback for playing solo — mute/solo tracks, a cursor that
        follows along. Everything stays on this device (stored in your browser, not uploaded anywhere).
        Looking to sing along instead? Try{' '}
        <Link to="/songs/chords" className="text-ember-400 hover:underline">
          Chords
        </Link>{' '}
        for chord charts and lyrics.
      </p>

      {error && (
        <p className="rounded-xl border border-ember-600/50 bg-ember-500/10 px-4 py-3 text-sm text-ember-300">
          {error}
        </p>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-brass-500">Your Tabs</h2>
        {loading ? (
          <p className="text-sm text-parchment-400/70">Loading your tabs…</p>
        ) : (
          <TabFileList files={files} onSelect={(file) => setView({ mode: 'view', file })} onDelete={handleDelete} />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-brass-500">Shared Library</h2>
        <SharedTabLibrary onImport={handleImport} />
      </section>
    </div>
  )
}
