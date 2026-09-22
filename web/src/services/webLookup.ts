/**
 * Nothing here fetches anything — Guitool has no backend and does not call
 * out to any search API. These just build ordinary search-engine URLs that
 * open in a new browser tab, so the user can research a technique before
 * writing their own exercise description. (This app doesn't scrape or
 * store anything from these pages.)
 */
export interface LookupLink {
  label: string
  url: string
}

export function buildLookupLinks(query: string): LookupLink[] {
  const q = query.trim()
  if (!q) return []
  const guitarQuery = `${q} guitar`
  return [
    { label: 'Search Google', url: `https://www.google.com/search?q=${encodeURIComponent(`${guitarQuery} exercise how to`)}` },
    { label: 'Search YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${guitarQuery} lesson`)}` },
    { label: 'Search JustinGuitar', url: `https://www.justinguitar.com/search?query=${encodeURIComponent(q)}` },
  ]
}

/**
 * Search links for an actual song's tab/chords. Deliberately links out to
 * Songsterr / Ultimate Guitar / etc. rather than fetching or embedding
 * anything — their tab databases are copyrighted and their terms don't
 * allow scraping or reproducing tabs into another app, so Guitool never
 * stores or displays that content itself. This just builds public
 * search-page URLs (or, where a site's search URL couldn't be confirmed —
 * see the note below — a plain link to the site to search from there).
 *
 * The extra free-tab sources (911Tabs, MuseScore free-download filter,
 * GProTab) were requested for their downloadable *.gp / MusicXML files in
 * particular — a tab you download from one of these can be brought straight
 * into "My Tabs" (`src/pages/MyTabs.tsx`) for real notation + playback,
 * which the Songsterr/Ultimate Guitar view-in-browser links can't do.
 *
 * Confidence note: Songsterr, Ultimate Guitar, YouTube, and MuseScore's
 * `text=` search parameter are all well-established, stable URL patterns.
 * 911Tabs and GProTab's search forms could not be confirmed in this
 * environment (their search pages returned 404s for a few different guessed
 * URL patterns, and this sandbox has no way to inspect their raw HTML form
 * markup) — rather than ship a guessed link that might silently 404, those
 * two link to the site itself so you can search from there.
 */
export function buildSongLookupLinks(title: string, artist: string): LookupLink[] {
  const q = [title, artist].filter((s) => s.trim()).join(' ').trim()
  if (!q) return []
  return [
    { label: 'Open in Songsterr', url: `https://www.songsterr.com/?pattern=${encodeURIComponent(q)}` },
    {
      label: 'Open in Ultimate Guitar',
      url: `https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(q)}`,
    },
    {
      label: 'Search MuseScore (free downloads)',
      url: `https://musescore.com/sheetmusic?text=${encodeURIComponent(q)}&instrument=72%2C73&recording_type=free-download`,
    },
    { label: 'Browse 911Tabs', url: 'https://www.911tabs.com/' },
    { label: 'Browse GProTab', url: 'https://gprotab.net/en' },
    {
      label: 'Search YouTube',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${q} guitar tutorial`)}`,
    },
  ]
}
