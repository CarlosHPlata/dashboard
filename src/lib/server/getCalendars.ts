export const prerender = false;

export const getCalendars = (): string[] => {
  const calendars = JSON.parse(import.meta.env.GOOGLE_CALENDARS || "[]")

  return calendars;
}

export const getCalendarColor = (calendarId: string): string => {
  const calendars = getCalendars()
  const colors = JSON.parse(import.meta.env.GOOGLE_CALENDARS_COLORS || "[]")
  if (calendars.length !== colors.length) {
    throw new Error(`Calendars and colors must have the same length: ${calendars.length} !== ${colors.length}`)
  }

  return colors[calendars.indexOf(calendarId)];
}