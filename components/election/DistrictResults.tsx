"use client"

import { useLiveResults } from "./LiveResultsProvider"

type Props = {
  results?: any[]
}

export default function DistrictResults(props: Props) {

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
        No district results available
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
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="district-results">

      {Object.entries(seats).map(([seat, candidates]) => {

        const sorted = [...candidates].sort(
          (a, b) => (b?.votes || 0) - (a?.votes || 0)
        )

        const topVotes = sorted[0]?.votes || 0

        return (

          <div key={seat} className="district-card">

            <h3 className="district-title">
              {seat}
            </h3>

            {sorted.map((r: any, index: number) => {

              const id = r?.id || `${seat}-${index}`

              const name = r?.candidate?.name || "Unknown"
              const party = r?.candidate?.party?.name || "Independent"
              const votes = r?.votes || 0

              //////////////////////////////////////////////////////
              // SAFE PERCENT
              //////////////////////////////////////////////////////

              const percent = topVotes > 0
                ? ((votes / topVotes) * 100).toFixed(1)
                : "0.0"

              return (

                <div
                  key={id}
                  className={`district-row ${index === 0 ? "district-winner" : ""}`}
                >

                  <div className="district-candidate">

                    <span className="district-rank">
                      {index + 1}
                    </span>

                    <div className="district-info">

                      <div className="district-name">
                        {name}
                      </div>

                      <div className="district-party">
                        {party}
                      </div>

                    </div>

                  </div>

                  <div className="district-votes">

                    {votes.toLocaleString()}

                    <div className="district-percent">
                      {percent}%
                    </div>

                  </div>

                </div>

              )

            })}

          </div>

        )

      })}

    </div>

  )
}