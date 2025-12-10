import { getCalendarColor, getCalendars } from "./getCalendars";
import type { GoogleCalendarItem } from "./dtos/types";
import { getEventsFromCalendar } from "./external/getCalendarEvents";
import type { CalendarEvent } from "./dtos/CalendarEvent";
import moment from "moment";

export const prerender = false;

export const getEvents = async () => {
  const calendars = getCalendars();
  let events: GoogleCalendarItem[] = [];

  for (const calendarId of calendars) {
    const response = await getEventsFromCalendar(calendarId);
    events = [...events, ...response.items];
  }

  return events.map(mapToCalendarEvent);
}

const mapToCalendarEvent = (event: GoogleCalendarItem): CalendarEvent => {
  return {
    id: event.id,
    summary: event.summary,
    description: event.description,
    htmlLink: event.htmlLink,
    isAllDayEvent: isAllDayEvent(event),
    start: event.start.dateTime || event.start.date || moment().toISOString(),
    end: event.end.dateTime || event.end.date || moment().toISOString(),
    eventType: event.eventType,
    color: getCalendarColor(event.creator.email) || '#ef9f76',
  }
}

const isAllDayEvent = (event: GoogleCalendarItem): boolean => {
  return event.start.date !== undefined && event.end.date !== undefined;
}