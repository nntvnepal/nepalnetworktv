"use client"

type Props = {
  total?: number
  declared?: number
  leading?: number
  remaining?: number
  majority?: number
}

export default function SeatMetrics({
  total = 0,
  declared = 0,
  leading = 0,
  remaining = 0,
  majority = 0
}: Props) {

  //////////////////////////////////////////////////////
  // SAFETY (NO NEGATIVE VALUES)
  //////////////////////////////////////////////////////

  const safe = (val: number) => Math.max(0, val)

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="seat-metrics">

      <Metric label="Total Seats" value={safe(total)} />

      <Metric label="Declared" value={safe(declared)} />

      <Metric label="Leading" value={safe(leading)} />

      <Metric label="Remaining" value={safe(remaining)} />

      <Metric
        label="Majority"
        value={safe(majority)}
        highlight
      />

    </div>

  )
}

//////////////////////////////////////////////////////
// REUSABLE METRIC COMPONENT
//////////////////////////////////////////////////////

function Metric({
  label,
  value,
  highlight = false
}: {
  label: string
  value: number
  highlight?: boolean
}) {

  return (

    <div className={`metric-card ${highlight ? "majority" : ""}`}>

      <div className="metric-value">
        {value}
      </div>

      <div className="metric-label">
        {label}
      </div>

    </div>

  )
}