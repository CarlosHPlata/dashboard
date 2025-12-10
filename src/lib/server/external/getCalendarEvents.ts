import moment from "moment";
import { JWT } from "google-auth-library";
import { google } from "googleapis";
import type { GoogleCalendarResponse } from "../dtos/types";

export const prerender = false;

export const getEventsFromCalendar = async (calendarId: string, startStr?: string) => {
  const credentials = JSON.parse(import.meta.env.GOOGLE_CALENDAR_CREDENTIALS!);
  const startDate = startStr ? moment(startStr) : moment();
  const start = startDate.startOf('day').toISOString();
  const end = startDate.add(31, "days").endOf('day').toISOString();

  const authClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
  const calendar = google.calendar({ version: "v3", auth: authClient });

  const response = await calendar.events.list({
    calendarId: calendarId,
    singleEvents: true,
    orderBy: "startTime",
    timeMin: start,
    timeMax: end,
  })

  return response.data as GoogleCalendarResponse;
}