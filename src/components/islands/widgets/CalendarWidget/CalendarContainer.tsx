import type { Calendar } from "../../../../lib/client/entities/Calendar"
import DayContainer from "./DayContainer"

interface CalendarContainerProps {
  calendar: Calendar | null
  loading: boolean
  error: string | null
}

const CalendarContainer = ({ calendar, loading, error }: CalendarContainerProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-base-content/50">
        Loading calendar events...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-error">
        {error}
      </div>
    )
  }

  return (
    <div>
      {calendar?.getDays().map((day) => (
        <DayContainer key={day.getDate()} day={day} />
      ))}
    </div>
  )
}

export default CalendarContainer
