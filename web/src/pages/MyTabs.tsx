import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTabFiles } from '../hooks/useTabFiles'
import { getTabFileData, type StoredTabFile } from '../services/tabFileStore'
import TabFileList from '../features/mytabs/TabFileList'
import ImportTabForm from '../features/mytabs/ImportTabForm'
import TabPlayer from '../features/mytabs/TabPlayer'

/**
 * "My Tabs" — a personal, self-hosted-in-your-browser tab library, modeled
 * on louislam/its-mytabs: you import your own Guitar Pro / MusicXML files
 * (from MuseScore, a purchased Guitar Pro download, your own compositions —
 * wherever you legitimately got them) and Guitool renders real notation and
 * plays it back with alphaTab. Nothing is fetched or scraped from Songsterr,
 * Ultimate Guitar, or anywhere else — see `src/services/tabFileStore.ts`.
 *
 * This is separate from the "Songs" page: Songs is a browsable catalog with
 * practice notes and links out to go find a tab; My Tabs is where the tab
 * itself lives and plays, once you have the file.
 */

type View = { mode: 'list' } | { mode: 'import' } | { mode: 'view'; file: StoredTabFile }

export default function MyTabs() {
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
          ‹ Back to My Tabs
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
          ‹ Back to My Tabs
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label-eyebrow">My Tabs</p>
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
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-eyebrow">Phase 3 — My Tabs</p>
          <h1 className="mt-1 text-3xl font-semibold text-parchment-100">Your tab library</h1>
        </div>
        <button className="btn-primary shrink-0" onClick={() => setView({ mode: 'import' })}>
          + Import Tab
        </button>
      </div>

      <p className="text-sm text-parchment-400/70">
        Import your own Guitar Pro or MusicXML files for real notation rendering and synced playback —
        mute/solo tracks, a cursor that follows along. Everything stays on this device (stored in your
        browser, not uploaded anywhere). Looking for a specific song instead? Try{' '}
        <Link to="/songs" className="text-ember-400 hover:underline">
          Songs
        </Link>{' '}
        for practice notes and links to go find a tab.
      </p>

      {error && (
        <p className="rounded-xl border border-ember-600/50 bg-ember-500/10 px-4 py-3 text-sm text-ember-300">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-parchment-400/70">Loading your tabs…</p>
      ) : (
        <TabFileList files={files} onSelect={(file) => setView({ mode: 'view', file })} onDelete={handleDelete} />
      )}
    </div>
  )
}
