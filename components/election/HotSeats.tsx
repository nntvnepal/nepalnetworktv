"use client"

import { useLiveResults } from "./LiveResultsProvider"
import Image from "next/image"

type Props = {
  results?: any[]
}

export default function HotSeats(props: Props) {

  //////////////////////////////////////////////////////
  // DATA SOURCE (SMART)
  //////////////////////////////////////////////////////

  const context = useLiveResults?.()
  const results = props.results || context?.results || []

  //////////////////////////////////////////////////////
  // SAFETY
  //////////////////////////////////////////////////////

  if (!results || results.length === 0) {
    return (
      <div className="text-gray-400 text-sm">
        No hot seats available
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // GROUP RESULTS BY SEAT
  //////////////////////////////////////////////////////

  const seats: Record<string, any[]> = {}

  for (const r of results) {

    const seat = r?.seat?.name || "Unknown"

    if (!seats[seat]) {
      seats[seat] = []
    }

    seats[seat].push(r)
  }

  //////////////////////////////////////////////////////
  // PREPARE PANELS (SAFE SORT)
  //////////////////////////////////////////////////////

  const panels = Object.entries(seats)
    .map(([seat, candidates]) => {

      const sorted = [...candidates].sort(
        (a, b) => (b?.votes || 0) - (a?.votes || 0)
      )

      return {
        seat,
        candidates: sorted.slice(0, 3)
      }

    })
    .slice(0, 12)

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="hot-seats">

      {panels.map((panel, index) => (

        <div key={`${panel.seat}-${index}`} className="hot-seat-panel">

          <div className="hot-seat-header">
            {panel.seat}
          </div>

          {panel.candidates.map((r: any, i: number) => {

            const name = r?.candidate?.name || "Unknown"
            const party = r?.candidate?.party?.name || "Independent"
            const votes = r?.votes || 0
            const photo = r?.candidate?.photo || "/candidate-placeholder.png"

            return (

              <div key={`${name}-${i}`} className="hot-seat-row">

                <div className="hot-seat-candidate">

                  <Image
                    src={photo}
                    alt={name}
                    width={36}
                    height={36}
                    className="hot-seat-avatar"
                  />

                  <div>

                    <div className="hot-seat-name">
                      {name}
                    </div>

                    <div className="hot-seat-party">
                      {party}
                    </div>

                  </div>

                </div>

                <div className="hot-seat-votes">
                  {votes.toLocaleString()}
                </div>

              </div>

            )

          })}

          <button className="hot-seat-button">
            View Details
          </button>

        </div>

      ))}

    </div>

  )
}