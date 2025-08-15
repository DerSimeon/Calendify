export type CalendarRole = "OWNER" | "EDITOR" | "VIEWER"
export type CalendarVisibility = "PRIVATE" | "PUBLIC"

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
    CalendarEvent?: CalendarEvent[]
}

export interface CalendarEvent {
    id: string
    title: string
    description?: string
    startTime: string
    endTime: string
    color: "violet" | "fuchsia" | "emerald" | "rose" | "amber"
}
