import { useRef, useState, type FormEvent } from 'react'
import { hasSupportedExtension, SUPPORTED_TAB_EXTENSIONS } from '../../services/tabFileStore'

const inputClass =
  'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-500/50 focus:border-ember-500 focus:outline-none'

function stripExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot > 0 ? fileName.slice(0, dot) : fileName
}

export default function ImportTabForm({
  onCancel,
  onImport,
}: {
  onCancel: () => void
  onImport: (input: { title: string; artist: string; fileName: string; data: ArrayBuffer }) => Promise<void>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)

  const handleFileChange = (f: File | undefined) => {
    if (!f) {
      setFile(null)
      return
    }
    if (!hasSupportedExtension(f.name)) {
      setError(`"${f.name}" doesn't look like a supported tab file (${SUPPORTED_TAB_EXTENSIONS.join(', ')}).`)
      setFile(null)
      return
    }
    setError(null)
    setFile(f)
    if (!title) setTitle(stripExtension(f.name))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Choose a tab file first.')
      return
    }
    setImporting(true)
    setError(null)
    try {
      const data = await file.arrayBuffer()
      await onImport({ title, artist, fileName: file.name, data })
    } catch {
      setError('Something went wrong reading that file — try again, or a different file.')
      setImporting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section className="panel flex flex-col gap-4 p-5">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Tab file
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept={SUPPORTED_TAB_EXTENSIONS.join(',')}
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            className="block w-full text-sm text-parchment-300 file:mr-3 file:rounded-lg file:border-0 file:bg-ember-500/20 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ember-300 hover:file:bg-ember-500/30"
          />
          <p className="mt-1.5 text-xs text-parchment-400/60">
            Guitar Pro (.gp, .gpx, .gp3–.gp7) or MusicXML (.musicxml, .xml). Bring your own file — from
            MuseScore, a purchased Guitar Pro download, or one you wrote yourself. This stays on your
            device; nothing is uploaded anywhere.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Title
          </label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Song title"
            maxLength={100}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Artist (optional)
          </label>
          <input
            className={inputClass}
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist"
            maxLength={80}
          />
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-ember-600/50 bg-ember-500/10 px-4 py-3">
          <p className="text-sm text-ember-300">{error}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary" disabled={importing}>
          {importing ? 'Importing…' : '+ Import tab'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={importing}>
          Cancel
        </button>
      </div>
    </form>
  )
}
