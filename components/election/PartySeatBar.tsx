"use client"

import { useLiveResults } from "./LiveResultsProvider"

type Props = {
  results?: any[]
}

export default function PartySeatBar(props: Props) {

  //////////////////////////////////////////////////////
  // DATA SOURCE (SMART FALLBACK)
  //////////////////////////////////////////////////////

  const context = useLiveResults?.()
  const results = props.results || context?.results || []

  //////////////////////////////////////////////////////
  // SAFETY
  //////////////////////////////////////////////////////

  if (!results || results.length === 0) {
    return (
      <div className="text-gray-400 text-sm">
        No results available
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // FIND SEAT WINNERS (OPTIMIZED)
  //////////////////////////////////////////////////////

  const seatWinners: Record<string, any> = {}

  for (const r of results) {
    const seat = r.seatId

    if (!seatWinners[seat] || r.votes > seatWinners[seat].votes) {
      seatWinners[seat] = r
    }
  }

  //////////////////////////////////////////////////////
  // COUNT PARTY SEATS
  //////////////////////////////////////////////////////

  const partySeats: Record<string, { seats: number; color: string }> = {}

  Object.values(seatWinners).forEach((r: any) => {

    const party = r?.candidate?.party?.name || "Independent"
    const color = r?.candidate?.party?.color || "#6c2bd9"

    if (!partySeats[party]) {
      partySeats[party] = { seats: 0, color }
    }

    partySeats[party].seats++
  })

  //////////////////////////////////////////////////////
  // SORT PARTIES
  //////////////////////////////////////////////////////

  const parties = Object.entries(partySeats).sort(
    (a, b) => b[1].seats - a[1].seats
  )

  //////////////////////////////////////////////////////
  // TOTAL SEATS (SAFE)
  //////////////////////////////////////////////////////

  const totalSeats = parties.reduce(
    (sum, p) => sum + p[1].seats,
    0
  )

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="party-bar-container">

      {parties.map(([party, data]) => {

        const seats = data.seats
        const color = data.color

        const percent = totalSeats > 0
          ? (seats / totalSeats) * 100
          : 0

        return (

          <div key={party} className="party-bar-row">

            <div className="party-bar-label">
              {party}
            </div>

            <div className="party-bar-track">

              <div
                className="party-bar-fill"
                style={{
                  width: `${percent}%`,
                  background: color
                }}
              />

            </div>

            <div className="party-bar-value">

              {seats}

              <span className="party-bar-percent">
                {percent.toFixed(1)}%
              </span>

            </div>

          </div>

        )

      })}

    </div>

  )
}