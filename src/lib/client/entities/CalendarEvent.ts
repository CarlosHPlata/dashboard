import moment from "moment";

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

export class CalendarEventImpl {
  private readonly calendarEvent: CalendarEvent;

  constructor(event: CalendarEvent) {
    this.calendarEvent = event;
  }

  getId(): string {
    return this.calendarEvent.id;
  }

  isAllDay(): boolean {
    return this.calendarEvent.isAllDayEvent;
  }

  getTitle(): string {
    return this.calendarEvent.summary;
  }

  getStart(): string {
    return this.calendarEvent.start;
  }

  getEnd(): string {
    return this.calendarEvent.end;
  }

  getStartTime(): string {
    return moment(this.calendarEvent.start).format('HH:mm');
  }

  getEndTime(): string {
    return moment(this.calendarEvent.end).format('HH:mm');
  }

  getLocation(): string | undefined {
    return this.calendarEvent.location;
  }

  getColor(): string {
    return this.calendarEvent.color;
  }

  getEventType(): string {
    return this.calendarEvent.eventType;
  }

  cloneToSeries(serie: number) {
    const start = moment(this.calendarEvent.start).add(serie, 'day')

    return new CalendarEventImpl({
      ...this.calendarEvent,
      id: `${this.calendarEvent.id}-${serie}`,
      start: start.format('YYYY-MM-DD'),
      end: start.format('YYYY-MM-DD'),
    })
  }
}