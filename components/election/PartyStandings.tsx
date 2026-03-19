"use client"

interface Props{
  results?: any[]
  partySeats?: Record<string, number>
}

export default function PartyStandings({ results, partySeats }: Props){

  //////////////////////////////////////////////////////
  // BUILD PARTY SEATS (AUTO IF RESULTS GIVEN)
  //////////////////////////////////////////////////////

  let computedSeats: Record<string, number> = {}

  if (results && results.length > 0) {

    const seatWinners: Record<string, any> = {}

    results.forEach((r: any) => {

      const seatId = r?.seatId
      if (!seatId) return

      if (!seatWinners[seatId]) {
        seatWinners[seatId] = r
        return
      }

      if ((r?.votes || 0) > (seatWinners[seatId]?.votes || 0)) {
        seatWinners[seatId] = r
      }

    })

    Object.values(seatWinners).forEach((r: any) => {

      const party = r?.candidate?.party?.name || "Independent"

      if (!computedSeats[party]) {
        computedSeats[party] = 0
      }

      computedSeats[party]++

    })

  } else if (partySeats) {
    computedSeats = partySeats
  }

  //////////////////////////////////////////////////////
  // SAFETY
  //////////////////////////////////////////////////////

  if (!computedSeats || Object.keys(computedSeats).length === 0) {
    return (
      <div className="card">
        <h3 className="card-title">Party Results</h3>
        <p>No results available</p>
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // SORT
  //////////////////////////////////////////////////////

  const parties = Object.entries(computedSeats)
    .sort((a, b) => b[1] - a[1])

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="card">

      <h3 className="card-title">
        Party Results
      </h3>

      {parties.map(([party, count]) => (

        <div key={party} className="party-row">

          <span className="party-name">
            {party}
          </span>

          <span className="party-seat">
            {count}
          </span>

        </div>

      ))}

    </div>

  )
}