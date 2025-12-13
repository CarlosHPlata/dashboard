import moment from "moment";
import type { CalendarEvent, CalendarEventImpl } from "./CalendarEvent";

export class Day {

  private events: CalendarEventImpl[];
  private fullDayEvents: CalendarEventImpl[];

  constructor(
    private readonly date: string,
  ) {
    this.events = [];
    this.fullDayEvents = [];
  }

  public addEvent(event: CalendarEventImpl): void {
    if (event.isAllDay()) {
      this.fullDayEvents.push(event);
    } else {
      this.events.push(event);
    }
  }

  public getEvents(): CalendarEventImpl[] {
    const allEvents = [...this.fullDayEvents];

    return [
      ...allEvents,
      ...this.events.sort((a, b) => {
        return moment(a.getStart()).isBefore(moment(b.getStart())) ? -1 : 1;
      })
    ];
  }

  public getDate(): string {
    return this.date;
  }

  public getDayLabel(): string {
    return moment(this.date).format('ddd');
  }

  public getDayNumber(): number {
    return moment(this.date).date();
  }

  public getMonth(): string {
    return moment(this.date).format('MMM');
  }

  public isToday(): boolean {
    return moment(this.date).isSame(moment(), 'day');
  }

  static fromEvent(event: CalendarEventImpl): Day {
    const day = new Day(moment(event.getStart()).toISOString());
    day.addEvent(event);
    return day;
  }
}