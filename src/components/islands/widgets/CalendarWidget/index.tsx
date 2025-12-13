import CalendarContainer from "./CalendarContainer"
import { useCalendar } from "./hooks/useCalendar"

const CalendarWidget = () => {
  const { calendar, loading, error, refreshCalendar } = useCalendar()

  return (
    <div
      className="card bg-base-100/50 backdrop-blur-sm p-6 shadow-lg h-full flex flex-col"
    >
      <button
        id="refresh-calendar-btn"
        className="absolute bottom-2 right-2 p-2 rounded-full bg-base-100/30 hover:bg-base-100/50 backdrop-blur-sm transition-all opacity-50 hover:opacity-100"
        aria-label="Refresh calendar"
        title="Refresh calendar events"
        onClick={refreshCalendar}
        disabled={loading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-base-content"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </button>

      <div
        className="calendar-container space-y-4 overflow-y-auto overflow-x-hidden flex-1 pr-2"
      >
        <CalendarContainer calendar={calendar} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default CalendarWidget
