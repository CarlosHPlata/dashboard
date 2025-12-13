import moment from "moment";
import { CalendarEventImpl, type CalendarEvent } from "./entities/CalendarEvent";
import { Calendar } from "./entities/Calendar";

interface CachedCalendarEvents {
  date: string;
  events: any[];
}

class CalendarEvents {
  private readonly CACHE_KEY = 'calendar-events-cache';
  private readonly CACHE_DURATION_MS = 15; // 15 minutes in milliseconds
  private readonly BASE_URI = '/api/calendar';

  async getCalendar(): Promise<Calendar> {
    const events = await this.getEvents();
    return Calendar.fromEvents(events);
  }

  private async getEvents() {
    const now = moment();
    const cached = await this.getCached();

    if (cached && now.diff(moment(cached.date), "minutes") < this.CACHE_DURATION_MS) {
      console.info('Using cached calendar events');
      return cached.events.map((event: CalendarEvent) => new CalendarEventImpl(event));
    }

    const events = await this.fetchEvents();
    this.setCached({ date: now.toISOString(), events });
    return events.map((event: CalendarEvent) => new CalendarEventImpl(event));
  }

  private async fetchEvents(): Promise<CalendarEvent[]> {
    try {
      const start = moment().toISOString();
      const response = await fetch(`${this.BASE_URI}?start=${encodeURIComponent(start)}`);
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