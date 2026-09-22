/** Local-calendar-day helpers. Deliberately avoid UTC so "today" matches the user's wall clock. */

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function dateKeyToDate(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function daysBetween(fromKey: string, toKey: string): number {
  const from = dateKeyToDate(fromKey)
  const to = dateKeyToDate(toKey)
  const ms = to.getTime() - from.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function isYesterday(key: string, referenceKey: string = todayKey()): boolean {
  return daysBetween(key, referenceKey) === 1
}

export function isToday(key: string, referenceKey: string = todayKey()): boolean {
  return key === referenceKey
}

export function startOfWeekKey(d: Date = new Date()): string {
  const day = d.getDay() // 0 Sun - 6 Sat
  const diff = (day + 6) % 7 // days since Monday
  const monday = new Date(d)
  monday.setDate(d.getDate() - diff)
  return todayKey(monday)
}

export function startOfMonthKey(d: Date = new Date()): string {
  return todayKey(new Date(d.getFullYear(), d.getMonth(), 1))
}

export function lastNDayKeys(n: number, end: Date = new Date()): string[] {
  const keys: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(end.getDate() - i)
    keys.push(todayKey(d))
  }
  return keys
}

export function greetingForHour(hour: number = new Date().getHours()): string {
  if (hour < 5) return 'Burning the midnight oil'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function formatShortDay(key: string): string {
  return dateKeyToDate(key).toLocaleDateString(undefined, { weekday: 'short' })
}
