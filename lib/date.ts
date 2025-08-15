// ~/lib/date.ts

// Add n days to a date (DST-safe)
export function addDays(date: Date, amount: number): Date {
    const d = new Date(date)
    d.setDate(d.getDate() + amount)
    return d
}

export function startOfMonth(date: Date): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), 1)
    d.setHours(0, 0, 0, 0)
    return d
}

export function endOfMonth(date: Date): Date {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    d.setHours(23, 59, 59, 999)
    return d
}

// Week starts on Sunday (0)
export function startOfWeek(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay() // 0-6, 0 = Sun
    d.setDate(d.getDate() - day)
    d.setHours(0, 0, 0, 0)
    return d
}

export function endOfWeek(date: Date): Date {
    const s = startOfWeek(date)
    const e = new Date(s)
    e.setDate(e.getDate() + 6)
    e.setHours(23, 59, 59, 999)
    return e
}

export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

export function isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function isWithinInterval(day: Date, start: Date, end: Date): boolean {
    const t = day.getTime()
    return t >= start.getTime() && t <= end.getTime()
}

export function formatMonthYear(date: Date, locale?: string): string {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)
}
