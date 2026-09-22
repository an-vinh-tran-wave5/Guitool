/**
 * Local storage for imported Guitar Pro / MusicXML tab files.
 *
 * These are binary files, sometimes a few MB each — way past what
 * `localStorage` (a same-origin string store, `guitool:v1` in
 * `storage/localStorage.ts`) is meant to hold. So "My Tabs" gets its own
 * IndexedDB database instead: metadata (title, artist, file name, size,
 * added date) and the raw file bytes live in the same record, keyed by id.
 * Everything here is written by the user importing their own files — see
 * the note in `src/pages/MyTabs.tsx` about why this app doesn't fetch or
 * store anyone else's tabs.
 *
 * Deliberately hand-rolled rather than pulling in an IndexedDB helper
 * library — the raw API is small enough here (one store, four operations)
 * that a wrapper would be one more unverifiable dependency for little
 * benefit.
 */

const DB_NAME = 'guitool-tabs'
const DB_VERSION = 1
const STORE_NAME = 'tabFiles'

/** What callers get back from a listing — everything except the (potentially large) file bytes. */
export interface StoredTabFile {
  id: string
  title: string
  artist: string
  fileName: string
  sizeBytes: number
  addedAt: string
}

interface StoredTabFileRecord extends StoredTabFile {
  data: ArrayBuffer
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in this browser.'))
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error ?? new Error('Failed to open the tab file database.'))
    })
  }
  return dbPromise
}

function generateTabId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `tab_${crypto.randomUUID()}`
    : `tab_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function stripData(record: StoredTabFileRecord): StoredTabFile {
  const { data: _data, ...meta } = record
  return meta
}

export async function listTabFiles(): Promise<StoredTabFile[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => {
      const records = (request.result as StoredTabFileRecord[]) ?? []
      resolve(records.map(stripData).sort((a, b) => b.addedAt.localeCompare(a.addedAt)))
    }
    request.onerror = () => reject(request.error ?? new Error('Failed to list tab files.'))
  })
}

export async function getTabFileData(id: string): Promise<ArrayBuffer | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(id)
    request.onsuccess = () => resolve((request.result as StoredTabFileRecord | undefined)?.data)
    request.onerror = () => reject(request.error ?? new Error('Failed to read that tab file.'))
  })
}

export async function saveTabFile(input: {
  title: string
  artist: string
  fileName: string
  data: ArrayBuffer
}): Promise<StoredTabFile> {
  const db = await openDb()
  const record: StoredTabFileRecord = {
    id: generateTabId(),
    title: input.title.trim() || input.fileName,
    artist: input.artist.trim(),
    fileName: input.fileName,
    sizeBytes: input.data.byteLength,
    addedAt: new Date().toISOString(),
    data: input.data,
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(record)
    tx.oncomplete = () => resolve(stripData(record))
    tx.onerror = () => reject(tx.error ?? new Error('Failed to save that tab file.'))
  })
}

export async function renameTabFile(id: string, patch: { title?: string; artist?: string }): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const getRequest = store.get(id)
    getRequest.onsuccess = () => {
      const existing = getRequest.result as StoredTabFileRecord | undefined
      if (!existing) {
        resolve()
        return
      }
      store.put({
        ...existing,
        title: patch.title !== undefined ? patch.title.trim() || existing.title : existing.title,
        artist: patch.artist !== undefined ? patch.artist.trim() : existing.artist,
      })
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Failed to rename that tab file.'))
  })
}

export async function deleteTabFile(id: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Failed to delete that tab file.'))
  })
}

/** Recognized file extensions, for both the file-picker `accept` attribute and a friendly pre-check. */
export const SUPPORTED_TAB_EXTENSIONS = ['.gp', '.gpx', '.gp3', '.gp4', '.gp5', '.gp7', '.musicxml', '.xml', '.capx']

export function hasSupportedExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase()
  return SUPPORTED_TAB_EXTENSIONS.some((ext) => lower.endsWith(ext))
}
