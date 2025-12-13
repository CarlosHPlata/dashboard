import moment from "moment"
import { CalendarEventImpl } from "./CalendarEvent"
import { Day } from "./Day"

export class Calendar {
  private calendarDays: Map<string, Day>

  private constructor() {
    this.calendarDays = new Map()
  }

  static fromEvents(events: CalendarEventImpl[]): Calendar {
    const calendar = new Calendar()
    calendar.addEvents(events)
    return calendar
  }

  addEvent(event: CalendarEventImpl): void {
    if (event.isAllDay()) {
      this.addAllDayEvent(event)
      return;
    }

    this.addEventToDay(event)
  }

  addEvents(events: CalendarEventImpl[]): void {
    events.forEach(event => {
      this.addEvent(event)
    })
  }


  addAllDayEvent(event: CalendarEventImpl): void {
    const start = moment(event.getStart())
    const end = moment(event.getEnd())

    let diff = end.diff(start, 'days')

    for (let i = 0; i < diff; i++) {
      this.addEventToDay(event.cloneToSeries(i))
    }
  }

  getDays(): Day[] {
    const days = Array.from(this.calendarDays.entries())
      .sort((a, b) => {
        return moment(a[0]).isBefore(moment(b[0])) ? -1 : 1;
      })
      .filter(([date]) => moment(date).isSameOrAfter(moment().startOf('day')))
      .map(([_, day]) => day);

    if (this.doesFirstDayHaveEvents()) {
      return days
    }

    return [this.createFirstDayEmpty(), ...days]
  }

  private addEventToDay(event: CalendarEventImpl): void {
    const date = moment(event.getStart()).startOf('day').toISOString()
    let day = this.calendarDays.get(date)

    if (!day) {
      day = Day.fromEvent(event)
      this.calendarDays.set(date, day)
    } else {
      day.addEvent(event)
    }
  }

  private doesFirstDayHaveEvents(): boolean {
    const firstDay = this.calendarDays.get(moment().startOf('day').toISOString())

    if (!firstDay) {
      return false
    }

    return firstDay.getEvents().length > 0
  }

  private createFirstDayEmpty(): Day {
    return Day.fromEvent(
      new CalendarEventImpl({
        id: 'empty',
        summary: 'No events',
        description: 'No events',
        htmlLink: '',
        isAllDayEvent: true,
        start: moment().startOf('day').toISOString(),
        end: moment().endOf('day').toISOString(),
        eventType: 'empty',
        color: '#4c4f69',
      })
    )
  }
}