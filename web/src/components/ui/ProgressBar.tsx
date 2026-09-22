interface ProgressBarProps {
  /** 0 to 1 */
  value: number
  className?: string
  tone?: 'ember' | 'brass'
}

export default function ProgressBar({ value, className = '', tone = 'ember' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value * 100))
  const gradient = tone === 'ember' ? 'from-ember-400 to-ember-600' : 'from-brass-300 to-brass-600'
  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full bg-ink-700/80 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-[width] duration-300 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
