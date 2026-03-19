"use client"

import { useLiveResults } from "./LiveResultsProvider"

type Props = {
  results?: any[]
}

export default function PartyCards(props: Props) {

  //////////////////////////////////////////////////////
  // DATA SOURCE (SMART FALLBACK)
  //////////////////////////////////////////////////////

  const context = useLiveResults?.()
  const results = props.results || context?.results || []

  //////////////////////////////////////////////////////
  // CALCULATE SEAT WINNERS
  //////////////////////////////////////////////////////

  const seatWinners: Record<string, any> = {}

  for (const r of results) {
    const seat = r.seatId

    if (!seatWinners[seat] || r.votes > seatWinners[seat].votes) {
      seatWinners[seat] = r
    }
  }

  //////////////////////////////////////////////////////
  // CALCULATE PARTY SEATS
  //////////////////////////////////////////////////////

  const partySeats: Record<string, { seats: number; color: string }> = {}

  Object.values(seatWinners).forEach((r: any) => {

    const party = r?.candidate?.party?.name || "Independent"
    const color = r?.candidate?.party?.color || "#888888"

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
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="party-cards">

      {parties.length === 0 && (
        <div className="text-gray-400 text-sm">
          No results yet
        </div>
      )}

      {parties.map(([party, data]) => (

        <div key={party} className="party-card">

          <div
            className="party-color-bar"
            style={{ background: data.color }}
          />

          <div className="party-card-body">

            <div className="party-card-header">
              {party}
            </div>

            <div
              className="party-seat-count"
              style={{ color: data.color }}
            >
              {data.seats}
            </div>

            <div className="party-seat-label">
              Seats Won
            </div>

          </div>

        </div>

      ))}

    </div>

  )
}