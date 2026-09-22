/**
 * Guitool Tabs Server — a tiny, cheap, read-only file-server for a shared
 * folder of Guitar Pro tab files.
 *
 * Why this instead of something heavier: the "Tabs" feature just needs to
 * list and download files an operator drops into one folder (a NAS share,
 * a bind-mounted host directory, a Docker volume) — a full object-storage
 * service (S3/MinIO) or a database would be massive overkill for that.
 * This is ~100 lines of Express with no dependencies beyond Express itself
 * and no persistent state of its own; the folder on disk *is* the state.
 *
 * Security model: this is meant for a trusted home/LAN network behind the
 * rest of the docker-compose stack, not the public internet. It only ever
 * reads files (never writes/deletes), only serves files directly inside
 * TABS_DIR (path traversal is rejected), and only serves recognized tab
 * file extensions.
 */
const path = require('node:path')
const fs = require('node:fs/promises')
const express = require('express')

const TABS_DIR = process.env.TABS_DIR || '/data/tabs'
const PORT = Number(process.env.PORT) || 4001
const SUPPORTED_EXTENSIONS = ['.gp', '.gp3', '.gp4', '.gp5', '.gp7', '.gpx']

const app = express()

// Permissive CORS: this server has no auth and no write endpoints, and is
// expected to sit behind a home/LAN network rather than the open internet
// (see the file-level doc comment) — so allowing any origin to *read* the
// tab list/files is an acceptable tradeoff for staying a one-file server.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }
  next()
})

function hasSupportedExtension(fileName) {
  const lower = fileName.toLowerCase()
  return SUPPORTED_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

/** Rejects anything that isn't a bare file name inside TABS_DIR (no `..`, no path separators). */
function isSafeFileName(name) {
  return typeof name === 'string' && name.length > 0 && !name.includes('/') && !name.includes('\\') && name !== '.' && name !== '..'
}

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/tabs', async (req, res) => {
  try {
    const entries = await fs.readdir(TABS_DIR, { withFileTypes: true })
    const files = []
    for (const entry of entries) {
      if (!entry.isFile() || !hasSupportedExtension(entry.name)) continue
      const stat = await fs.stat(path.join(TABS_DIR, entry.name))
      files.push({
        name: entry.name,
        sizeBytes: stat.size,
        modifiedAt: stat.mtime.toISOString(),
      })
    }
    files.sort((a, b) => a.name.localeCompare(b.name))
    res.json({ files })
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      // The shared folder hasn't been created / mounted yet — that's a
      // config issue for the operator, not a server crash.
      res.json({ files: [], warning: `Shared tabs folder not found at ${TABS_DIR}.` })
      return
    }
    console.error('Failed to list tabs:', err)
    res.status(500).json({ error: 'Failed to list shared tabs.' })
  }
})

app.get('/api/tabs/:name', async (req, res) => {
  const { name } = req.params
  if (!isSafeFileName(name) || !hasSupportedExtension(name)) {
    res.status(400).json({ error: 'Not a recognized tab file name.' })
    return
  }
  const filePath = path.join(TABS_DIR, name)
  try {
    await fs.access(filePath)
  } catch {
    res.status(404).json({ error: 'File not found.' })
    return
  }
  res.download(filePath, name, (err) => {
    if (err) console.error(`Failed to send ${name}:`, err)
  })
})

app.listen(PORT, () => {
  console.log(`Guitool tabs-server listening on :${PORT}, serving ${TABS_DIR}`)
})
