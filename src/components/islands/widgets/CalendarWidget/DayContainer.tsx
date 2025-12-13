import type { Day } from "../../../../lib/client/entities/Day"
import EventContainer from "./EventContainer"

interface DayContainerProps {
  day: Day
}

const DayContainer = ({ day }: DayContainerProps) => {
  return (
    <div className="flex gap-4 mb-8 items-center">
      <div className="flex flex-col items-center ml-1 justify-center min-w-[80px] text-center">
        <span className="text-lg font-medium text-base-content/70 uppercase">{day.getDayLabel()}</span>
        <span className={`text-6xl font-bold text-base-content`}>{day.getDayNumber()}</span>
        <span className="text-lg font-medium text-base-content/70 uppercase">{day.getMonth()}</span>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        {day.getEvents().map((event) => (
          <EventContainer key={event.getId()} event={event} />
        ))}
      </div>
    </div>
  )
}

export default DayContainer
