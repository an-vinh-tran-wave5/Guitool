import type { StoredTabFile } from '../../services/tabFileStore'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function TabFileList({
  files,
  onSelect,
  onDelete,
}: {
  files: StoredTabFile[]
  onSelect: (file: StoredTabFile) => void
  onDelete: (id: string) => void
}) {
  if (files.length === 0) {
    return (
      <p className="panel px-4 py-6 text-center text-sm text-parchment-400/70">
        No tabs imported yet — bring in a Guitar Pro or MusicXML file to get started.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {files.map((file) => (
        <div key={file.id} className="panel flex items-center gap-3 px-4 py-3.5">
          <button type="button" onClick={() => onSelect(file)} className="min-w-0 flex-1 text-left">
            <p className="truncate font-display text-base font-medium tracking-wide text-parchment-100">
              {file.title}
            </p>
            {file.artist && <p className="truncate text-xs text-parchment-400/70">{file.artist}</p>}
            <p className="mt-1 text-xs text-parchment-400/50">
              {file.fileName} · {formatSize(file.sizeBytes)}
            </p>
          </button>
          <button
            type="button"
            onClick={() => onDelete(file.id)}
            className="btn-ghost shrink-0 !text-ember-400"
            aria-label={`Delete ${file.title}`}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
