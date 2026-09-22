import { useEffect, useState } from 'react'
import { listSharedTabs, downloadSharedTab, type SharedTabFile } from '../../services/tabShareApi'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function stripExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot > 0 ? fileName.slice(0, dot) : fileName
}

/**
 * Browses the shared folder served by the `tabs-server` Docker service (see
 * `docker-compose.yml` / `docker/tabs-server/`) and lets you pull a file
 * from it into your own local "My Tabs" library (IndexedDB, via `onImport`)
 * — a shared network drop-folder for Guitar Pro files, complementing the
 * one-file-at-a-time manual import `ImportTabForm` already offers.
 *
 * Running the tabs-server is optional: if it isn't reachable, this renders
 * a quiet explanation instead of an error, since plenty of setups (plain
 * `npm run dev`, no Docker) never run it at all.
 */
export default function SharedTabLibrary({
  onImport,
}: {
  onImport: (input: { title: string; artist: string; fileName: string; data: ArrayBuffer }) => Promise<void>
}) {
  const [files, setFiles] = useState<SharedTabFile[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'unreachable'>('loading')
  const [warning, setWarning] = useState<string | undefined>()
  const [importingName, setImportingName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listSharedTabs().then((result) => {
      if (cancelled) return
      setFiles(result.files)
      setWarning(result.warning)
      setStatus(result.unreachable ? 'unreachable' : 'ready')
    })
    return () => {
      cancelled = true
    }
  }, [])

  const handleImport = async (file: SharedTabFile) => {
    setImportingName(file.name)
    setError(null)
    try {
      const data = await downloadSharedTab(file.name)
      await onImport({ title: stripExtension(file.name), artist: '', fileName: file.name, data })
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not import "${file.name}".`)
    } finally {
      setImportingName(null)
    }
  }

  if (status === 'loading') {
    return <p className="text-sm text-parchment-400/70">Checking the shared library…</p>
  }

  if (status === 'unreachable') {
    return (
      <p className="panel px-4 py-4 text-sm text-parchment-400/70">
        No shared tabs server found. Start it with <code className="text-brass-400">docker compose up tabs-server</code>{' '}
        (see the README's "Shared Tabs Library" section) and drop <code className="text-brass-400">.gp</code>/
        <code className="text-brass-400">.gpx</code> files into <code className="text-brass-400">shared-tabs/</code> —
        or skip it and just import files manually below.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {warning && <p className="text-xs text-parchment-400/60">{warning}</p>}
      {error && (
        <p className="rounded-xl border border-ember-600/50 bg-ember-500/10 px-4 py-3 text-sm text-ember-300">{error}</p>
      )}
      {files.length === 0 ? (
        <p className="panel px-4 py-6 text-center text-sm text-parchment-400/70">
          The shared library is connected but empty — drop tab files into the <code className="text-brass-400">shared-tabs/</code>{' '}
          folder (or wherever the operator pointed <code className="text-brass-400">tabs-server</code> at).
        </p>
      ) : (
        files.map((file) => (
          <div key={file.name} className="panel flex items-center gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base font-medium tracking-wide text-parchment-100">
                {stripExtension(file.name)}
              </p>
              <p className="mt-1 text-xs text-parchment-400/50">
                {file.name} · {formatSize(file.sizeBytes)}
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary shrink-0"
              disabled={importingName === file.name}
              onClick={() => handleImport(file)}
            >
              {importingName === file.name ? 'Importing…' : 'Import'}
            </button>
          </div>
        ))
      )}
    </div>
  )
}
