import moment from "moment";
import type { CalendarEvent } from "./entities/CalendarEvent";
import { Day } from "./entities/Day";

interface CachedCalendarEvents {
  date: string;
  events: any[];
}

class CalendarEvents {
  private readonly CACHE_KEY = 'calendar-events-cache';
  private readonly CACHE_DURATION_MS = 1 * 60 * 60 * 1000; // 1 hours in milliseconds
  private readonly BASE_URI = '/api/calendar';

  async getCalendar(): Promise<Day[]> {
    const events = await this.getEvents();
    const calendarDays: Map<string, Day> = new Map();

    events?.forEach(event => {
      const date = moment(event.start).startOf('day').toISOString();
      let day = calendarDays.get(date);
      if (!day) {
        day = Day.fromEvent(event);
        calendarDays.set(date, day);
      } else {
        day.addEvent(event);
      }
    });

    return Array.from(calendarDays.entries())
      .sort((a, b) => {
        return moment(a[0]).isBefore(moment(b[0])) ? -1 : 1;
      })
      .map(([_, day]) => day);
  }

  private async getEvents() {
    const now = moment();
    const cached = await this.getCached();

    if (cached && now.diff(moment(cached.date), "hours") < this.CACHE_DURATION_MS) {
      console.info('Using cached calendar events');
      return cached.events;
    }

    const events = await this.fetchEvents();
    this.setCached({ date: now.format('YYYY-MM-DD'), events });
    return events;
  }

  private async fetchEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await fetch(this.BASE_URI);
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
      }

      const events = await response.json() as CalendarEvent[];
      return events;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  private async getCached(): Promise<CachedCalendarEvents | null> {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      return JSON.parse(cached);
    } catch (error) {
      console.error('Error reading calendar events cache:', error);
      return null;
    }
  }

  private async setCached(events: CachedCalendarEvents): Promise<void> {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving calendar events cache:', error);
    }
  }

  public clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
      console.info('Calendar events cache cleared');
    } catch (error) {
      console.error('Error clearing calendar events cache:', error);
    }
  }
}

export default new CalendarEvents();