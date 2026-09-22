export function formatMinutesSeconds(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatHoursMinutes(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h <= 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function minutesToSeconds(min: number): number {
  return Math.round(min * 60)
}

export function secondsToMinutes(sec: number): number {
  return sec / 60
}
