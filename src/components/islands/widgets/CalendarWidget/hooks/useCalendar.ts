import { useCallback, useEffect, useState } from "react"
import calendarEvents from "../../../../../lib/client/calendarEvents"
import { Calendar } from "../../../../../lib/client/entities/Calendar"

export const useCalendar = () => {
  const [calendar, setCalendar] = useState<Calendar | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    calendarEvents.getCalendar()
      .then((calendar) => {
        setCalendar(calendar)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      console.info('Refreshing calendar')
      calendarEvents.getCalendar()
        .then((calendar) => {
          setCalendar(calendar)
        })
        .catch((error) => {
          console.error(error)
        })
    }, 16 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const refreshCalendar = useCallback(() => {
    setLoading(true)
    Promise.resolve(calendarEvents.clearCache())
      .then(() => calendarEvents.getCalendar())
      .then((calendar) => {
        setCalendar(calendar)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return { calendar, loading, error, refreshCalendar }
}