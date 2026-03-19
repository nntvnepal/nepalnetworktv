"use client"

type Props = {
  partySeats?: Record<string, number>
  totalSeats?: number
  declared?: number
  leading?: number
  remaining?: number
}

export default function SeatGrid({
  partySeats = {},
  totalSeats = 0,
  declared = 0,
  leading = 0,
  remaining = 0
}: Props) {

  //////////////////////////////////////////////////////
  // SAFETY
  //////////////////////////////////////////////////////

  const hasData = Object.keys(partySeats).length > 0

  //////////////////////////////////////////////////////
  // BUILD SEAT ARRAY (SAFE)
  //////////////////////////////////////////////////////

  const seats: string[] = []

  Object.entries(partySeats).forEach(([party, count]) => {
    for (let i = 0; i < count; i++) {
      seats.push(party)
    }
  })

  // Fill remaining seats safely
  while (seats.length < totalSeats) {
    seats.push("Undecided")
  }

  //////////////////////////////////////////////////////
  // PARTY COLORS (EXTENDABLE)
  //////////////////////////////////////////////////////

  const partyColor = (party: string) => {

    const colors: Record<string, string> = {
      "UML": "#2563eb",
      "Nepali Congress": "#16a34a",
      "Maoist": "#dc2626",
      "RSP": "#f59e0b",
      "Undecided": "#444"
    }

    return colors[party] || "#a855f7"
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="seat-visualization-card">

      <h3 className="card-title">
        Seat Visualization
      </h3>

      {!hasData ? (

        <div className="text-gray-400 text-sm">
          No seat data available
        </div>

      ) : (

        <div className="seat-grid">

          {seats.map((party, index) => (

            <div
              key={index}
              className="seat-block"
              style={{ background: partyColor(party) }}
            />

          ))}

        </div>

      )}

      <div className="seat-visualization-meta">

        <div className="meta-box">
          Declared
          <strong>{declared}</strong>
        </div>

        <div className="meta-box">
          Leading
          <strong>{leading}</strong>
        </div>

        <div className="meta-box">
          Remaining
          <strong>{remaining}</strong>
        </div>

      </div>

    </div>

  )
}