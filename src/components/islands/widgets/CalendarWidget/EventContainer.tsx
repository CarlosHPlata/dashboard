import type { CalendarEventImpl } from "../../../../lib/client/entities/CalendarEvent"
import EventCard from "./parts/EventCard"

interface EventContainerProps {
  event: CalendarEventImpl
}

const IS_COLORFULL = true

const EventContainer = ({ event }: EventContainerProps) => {

  if (event.getEventType() === 'empty') {
    return (
      <EventCard eventColor={event.getColor()} isColorfull={IS_COLORFULL}>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="text-xs font-semibold text-gray-500 break-words">
            No events
          </h3>
        </div>
      </EventCard>
    )
  }

  return (
    <EventCard eventColor={event.getColor()} isColorfull={IS_COLORFULL}>
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <h3 className={`${event.isAllDay() ? 'text-base' : 'text-lg'} font-semibold text-base-content break-words`}>
          {event.getTitle()}
        </h3>
        {event.isAllDay() && <span className="text-sm px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium whitespace-nowrap">All Day</span>}
      </div>
      <div className="flex items-center gap-2 text-base text-base-content/70">
        {!event.isAllDay() && <span>{event.getStartTime()} - {event.getEndTime()}</span>}
      </div>
      {event.getLocation() && (
        <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="break-words">{event.getLocation()}</span>
        </div>
      )}
    </EventCard>
  )
}

export default EventContainer