import { useCallback, useEffect, useState } from 'react'
import {
  deleteTabFile,
  listTabFiles,
  renameTabFile,
  saveTabFile,
  type StoredTabFile,
} from '../services/tabFileStore'

/**
 * Loads the "My Tabs" file list from IndexedDB and keeps it in memory,
 * separate from `useGuitool`'s localStorage-backed state — see the notes
 * in `services/tabFileStore.ts` for why imported tab files get their own
 * (async, binary-capable) storage instead of joining `GuitoolState`.
 */
export function useTabFiles() {
  const [files, setFiles] = useState<StoredTabFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setFiles(await listTabFiles())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your saved tabs.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addFile = useCallback(
    async (input: { title: string; artist: string; fileName: string; data: ArrayBuffer }) => {
      const saved = await saveTabFile(input)
      await refresh()
      return saved
    },
    [refresh],
  )

  const rename = useCallback(
    async (id: string, patch: { title?: string; artist?: string }) => {
      await renameTabFile(id, patch)
      await refresh()
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: string) => {
      await deleteTabFile(id)
      await refresh()
    },
    [refresh],
  )

  return { files, loading, error, addFile, rename, remove }
}
