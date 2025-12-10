export type CalendarEvent = {
  id: string;
  summary: string;
  description: string;
  htmlLink: string;
  isAllDayEvent: boolean;
  start: string;
  end: string;
  eventType: string;
  color: string;
  location?: string
}