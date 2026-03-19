"use client"

import SeatMetrics from "./SeatMetrics"
import PartySeatDistribution from "./PartySeatDistribution"
import SeatGrid from "./SeatGrid"
import LocalSeatBreakdown from "./LocalSeatBreakdown"

type Props = {
  results?: any[]
  seatWinners?: Record<string, any>
  election?: any
}

export default function SeatSummary({
  results = [],
  seatWinners = {},
  election
}: Props) {

  //////////////////////////////////////////////////////
  // SAFETY
  //////////////////////////////////////////////////////

  const hasData = Object.keys(seatWinners).length > 0

  //////////////////////////////////////////////////////
  // TOTAL SEATS
  //////////////////////////////////////////////////////

  const totalSeats = Object.keys(seatWinners).length

  //////////////////////////////////////////////////////
  // DECLARED / LEADING
  //////////////////////////////////////////////////////

  let declared = 0
  let leading = 0

  Object.values(seatWinners).forEach((r: any) => {

    if (r?.status === "DECLARED") declared++
    else if (r?.status === "LEADING") leading++

  })

  const remaining = Math.max(0, totalSeats - declared - leading)

  //////////////////////////////////////////////////////
  // MAJORITY (SAFE)
  //////////////////////////////////////////////////////

  const majority = totalSeats > 0
    ? Math.floor(totalSeats / 2) + 1
    : 0

  //////////////////////////////////////////////////////
  // PARTY SEATS
  //////////////////////////////////////////////////////

  const partySeats: Record<string, number> = {}

  Object.values(seatWinners).forEach((r: any) => {

    const party = r?.candidate?.party?.name || "Independent"

    partySeats[party] = (partySeats[party] || 0) + 1

  })

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="seat-summary">

      <h2 className="section-title">
        Seat Summary
      </h2>

      {!hasData ? (

        <div className="text-gray-400 text-sm">
          No seat data available
        </div>

      ) : (

        <>
          {/* METRICS */}

          <SeatMetrics
            total={totalSeats}
            declared={declared}
            leading={leading}
            remaining={remaining}
            majority={majority}
          />

          {/* GRID */}

          <div className="seat-summary-grid">

            <PartySeatDistribution
              partySeats={partySeats}
              totalSeats={totalSeats}
            />

            <SeatGrid
              partySeats={partySeats}
              totalSeats={totalSeats}
              declared={declared}
              leading={leading}
              remaining={remaining}
            />

          </div>

          {/* LOCAL BREAKDOWN */}

          {election?.type === "LOCAL" && (
            <LocalSeatBreakdown results={results} />
          )}

        </>

      )}

    </div>

  )
}