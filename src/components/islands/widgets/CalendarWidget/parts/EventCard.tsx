import type { PropsWithChildren } from "react"

interface EventCardProps {
  eventColor: string
  isColorfull: boolean
}

const hexToRgba = (hex: string, alpha: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
    : `rgba(59, 130, 246, ${alpha})`
}

const getGradientStyle = (color: string, colorfull: boolean) => {
  if (colorfull) {
    return {
      borderLeftColor: color,
      background: `linear-gradient(to right, ${hexToRgba(color, 0.05)}, ${hexToRgba(color, 0)})`,
    }
  }

  return {
    borderLeftColor: color,
  }
}

const EventCard: React.FC<PropsWithChildren<EventCardProps>> = ({ eventColor, isColorfull = true, children }) => {
  return (
    <div className="relative pl-4 py-3 backdrop-blur-sm rounded-e-lg border-l-4 overflow-hidden" style={getGradientStyle(eventColor, isColorfull)}>
      {children}
    </div>
  )
}

export default EventCard
