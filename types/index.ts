export type CalendarRole = "OWNER" | "EDITOR"

export interface Member {
    id: string
    name: string
    email: string
    role: CalendarRole
}

export interface Calendar {
    id: string
    slug: string
    name: string
    role: CalendarRole
    createdAt: string
    updatedAt: string
    visibility: "PRIVATE" | "PUBLIC"
    CalendarUser: Member[]
}

export interface CalendarEvent {
    id: string
    title: string
    startISO: string
    endISO: string
    color: "violet" | "fuchsia" | "emerald" | "rose" | "amber"
}
