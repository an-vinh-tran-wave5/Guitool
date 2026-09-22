interface StatTileProps {
  label: string
  value: string
  sublabel?: string
  accent?: 'brass' | 'ember'
}

export default function StatTile({ label, value, sublabel, accent = 'brass' }: StatTileProps) {
  return (
    <div className="panel flex flex-col gap-1 px-4 py-3.5">
      <span className="label-eyebrow">{label}</span>
      <span
        className={
          'font-display text-2xl font-semibold tracking-wide ' +
          (accent === 'ember' ? 'text-ember-300' : 'text-parchment-100')
        }
      >
        {value}
      </span>
      {sublabel && <span className="text-xs text-parchment-400/70">{sublabel}</span>}
    </div>
  )
}
