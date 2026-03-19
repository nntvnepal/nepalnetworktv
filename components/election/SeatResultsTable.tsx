"use client"

import { useLiveResults } from "./LiveResultsProvider"

type Props = {
  results?: any[]
}

export default function SeatResultsTable(props: Props) {

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
  // GROUP RESULTS BY SEAT
  //////////////////////////////////////////////////////

  const seats: Record<string, any[]> = {}

  for (const r of results) {
    if (!seats[r.seatId]) {
      seats[r.seatId] = []
    }
    seats[r.seatId].push(r)
  }

  //////////////////////////////////////////////////////
  // BUILD TABLE DATA (SAFE SORT)
  //////////////////////////////////////////////////////

  const rows = Object.values(seats).map((seatResults: any[]) => {

    const sorted = [...seatResults].sort((a, b) => b.votes - a.votes) // clone to avoid mutation

    const winner = sorted[0]
    const runner = sorted[1]

    const margin = runner
      ? winner.votes - runner.votes
      : winner?.votes || 0

    return {
      seatName: winner?.seat?.name || "Unknown",
      position: winner?.seat?.position || "-",

      winnerName: winner?.candidate?.name || "N/A",
      winnerParty: winner?.candidate?.party?.name || "Independent",
      winnerColor: winner?.candidate?.party?.color || "#999",

      winnerVotes: winner?.votes || 0,

      runnerName: runner?.candidate?.name || null,
      runnerParty: runner?.candidate?.party?.name || "-",
      runnerVotes: runner?.votes || 0,

      margin
    }
  })

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="table-wrapper">

      <table className="results-table">

        <thead>
          <tr>
            <th>Seat</th>
            <th>Winner</th>
            <th>Runner-up</th>
            <th>Margin</th>
            <th>Votes</th>
          </tr>
        </thead>

        <tbody>

          {rows.map((r, i) => (

            <tr key={i}>

              <td>
                <strong>{r.seatName}</strong>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {r.position}
                </div>
              </td>

              <td>

                <div style={{ fontWeight: 600 }}>
                  {r.winnerName}
                </div>

                <span
                  className="party-badge"
                  style={{ borderLeft: `4px solid ${r.winnerColor}` }}
                >
                  {r.winnerParty}
                </span>

              </td>

              <td>

                {r.runnerName ? (

                  <>
                    <div>{r.runnerName}</div>
                    <span className="party-badge">
                      {r.runnerParty}
                    </span>
                  </>

                ) : (

                  <span className="text-gray-400 text-sm">
                    -
                  </span>

                )}

              </td>

              <td>
                <strong>+{r.margin}</strong>
              </td>

              <td className="votes">
                {r.winnerVotes.toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}