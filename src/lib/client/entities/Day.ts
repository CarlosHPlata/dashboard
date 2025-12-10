import moment from "moment";
import type { CalendarEvent } from "./CalendarEvent";

export class Day {

  private events: CalendarEvent[];
  private fullDayEvents: CalendarEvent[];

  constructor(
    private readonly date: string,
  ) {
    this.events = [];
    this.fullDayEvents = [];
  }

  public addEvent(event: CalendarEvent): void {
    if (event.isAllDayEvent) {
      this.fullDayEvents.push(event);
    } else {
      this.events.push(event);
    }
  }

  public getEvents(): CalendarEvent[] {
    const allEvents = [...this.fullDayEvents];

    return [
      ...allEvents,
      ...this.events.sort((a, b) => {
        return moment(a.start).isBefore(moment(b.start)) ? -1 : 1;
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

  static fromEvent(event: CalendarEvent): Day {
    const day = new Day(moment(event.start).toISOString());
    day.addEvent(event);
    return day;
  }
}