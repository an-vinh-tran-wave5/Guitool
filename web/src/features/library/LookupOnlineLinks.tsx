import type { LookupLink } from '../../services/webLookup'

/**
 * Convenience search links only — nothing is fetched or scraped by the app.
 * These just open ordinary search-engine (or, for songs, Songsterr/Ultimate
 * Guitar) results in a new tab so the user can research something before
 * writing their own notes in their own words (see the note this renders
 * below the links).
 *
 * Shared across features (the exercise Library and the Songs library both
 * use this) — it lives here rather than duplicated per-feature, so Songs
 * imports it from this path too.
 */
export default function LookupOnlineLinks({
  links,
  emptyHint = 'Type a name above to get quick research links here.',
}: {
  links: LookupLink[]
  emptyHint?: string
}) {
  if (links.length === 0) {
    return <p className="text-xs text-parchment-400/60">{emptyHint}</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="chip transition hover:!border-ember-500/60 hover:!bg-ember-500/10 hover:!text-ember-300"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
      <p className="text-xs text-parchment-400/60">
        Opens in a new tab. Use it for reference, then write your own notes below — don't paste
        copyrighted text in.
      </p>
    </div>
  )
}
