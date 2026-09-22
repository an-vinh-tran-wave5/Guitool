/**
 * Client for the `tabs-server` Docker service (see `docker/tabs-server/` and
 * `docker-compose.yml`) — a tiny read-only file-server exposing a shared
 * folder of Guitar Pro tab files. This is the "get files from a folder or
 * file share" half of the Tabs feature; `services/tabFileStore.ts` (the
 * existing per-device IndexedDB import) is the other half — see
 * `pages/SongsTabs.tsx` for how the two come together.
 *
 * The server address is baked in at build time via `VITE_TABS_SERVER_URL`
 * (see docker-compose.yml / Dockerfile) and defaults to the compose setup's
 * published port, so this works out of the box for anyone following the
 * README's Docker instructions without extra configuration. Running the
 * frontend without the tabs-server (e.g. plain `npm run dev`, no Docker) is
 * a fully supported case too — every function here fails soft (an empty
 * list / a clear error) rather than throwing, since a missing shared-tabs
 * server is an expected, non-fatal state.
 */

const BASE_URL = (import.meta.env.VITE_TABS_SERVER_URL as string | undefined) || 'http://localhost:4001'

export interface SharedTabFile {
  name: string
  sizeBytes: number
  modifiedAt: string
}

export interface SharedTabListResult {
  files: SharedTabFile[]
  /** Set when the server responded but flagged a config problem (e.g. the shared folder doesn't exist yet). */
  warning?: string
  /** Set when the server couldn't be reached at all — a different case from an empty, working list. */
  unreachable?: boolean
}

export async function listSharedTabs(): Promise<SharedTabListResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/tabs`)
    if (!res.ok) {
      return { files: [], unreachable: true }
    }
    const data = (await res.json()) as { files: SharedTabFile[]; warning?: string }
    return { files: data.files ?? [], warning: data.warning }
  } catch {
    // Server not running / not reachable from the browser — treat as "no
    // shared library configured" rather than a hard error, since running
    // the tabs-server is optional.
    return { files: [], unreachable: true }
  }
}

export async function downloadSharedTab(name: string): Promise<ArrayBuffer> {
  const res = await fetch(`${BASE_URL}/api/tabs/${encodeURIComponent(name)}`)
  if (!res.ok) {
    throw new Error(`Could not download "${name}" from the shared library (${res.status}).`)
  }
  return res.arrayBuffer()
}
