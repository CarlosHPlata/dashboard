export type GoogleCalendarItem = {
  id: string
  summary: string
  description: string
  htmlLink: string
  kind: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  eventType: string
  creator: {
    email: string
    self: boolean
  }
}

export type GoogleCalendarResponse = {
  timeZone?: string
  items: GoogleCalendarItem[]
}