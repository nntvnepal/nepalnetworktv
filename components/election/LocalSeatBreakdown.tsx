"use client"

interface Props {
  results?: any[]
}

export default function LocalSeatBreakdown({ results = [] }: Props) {

  //////////////////////////////////////////////////////
  // SAFETY
  //////////////////////////////////////////////////////

  if (!Array.isArray(results) || results.length === 0) {
    return null
  }

  //////////////////////////////////////////////////////
  // GET UNIQUE SEAT WINNERS (IMPORTANT FIX)
  //////////////////////////////////////////////////////

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

  const winners = Object.values(seatWinners)

  //////////////////////////////////////////////////////
  // COUNT BY POSITION (CORRECT)
  //////////////////////////////////////////////////////

  const count = (pos: string) =>
    winners.filter((r: any) => r?.seat?.position === pos).length

  const mayor = count("MAYOR") + count("CHAIRPERSON")
  const deputyMayor = count("DEPUTY_MAYOR") + count("VICE_CHAIRPERSON")
  const wardChair = count("WARD_CHAIR")
  const wardMembers = count("WARD_MEMBER")

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="local-seat-breakdown">

      <h3 className="card-title">
        Local Representation
      </h3>

      <div className="local-seat-grid">

        <Card value={mayor} label="Mayor / Chairperson" />
        <Card value={deputyMayor} label="Deputy / Vice Chair" />
        <Card value={wardChair} label="Ward Chair" />
        <Card value={wardMembers} label="Ward Members" />

      </div>

    </div>

  )
}

//////////////////////////////////////////////////////
// REUSABLE CARD (CLEAN UI)
//////////////////////////////////////////////////////

function Card({ value, label }: { value: number; label: string }) {

  return (

    <div className="local-seat-card">

      <div className="local-seat-number">
        {value}
      </div>

      <div className="local-seat-label">
        {label}
      </div>

    </div>

  )
}