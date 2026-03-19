"use client"

import { useLiveResults } from "./LiveResultsProvider"
import { useEffect, useState } from "react"

export default function LiveStatusBar() {

  const { results, updated } = useLiveResults()

  const [time, setTime] = useState("")

  //////////////////////////////////////////////////////
  // LIVE CLOCK (AUTO UPDATE)
  //////////////////////////////////////////////////////

  useEffect(() => {

    const updateTime = () => {
      setTime(new Date().toLocaleTimeString())
    }

    updateTime()

    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)

  }, [])

  //////////////////////////////////////////////////////
  // COUNT UNIQUE SEATS (SAFE)
  //////////////////////////////////////////////////////

  const seatSet = new Set<string>()

  results?.forEach((r: any) => {
    if (r?.seatId) {
      seatSet.add(r.seatId)
    }
  })

  const countedSeats = seatSet.size

  //////////////////////////////////////////////////////
  // TOTAL + MAJORITY (SAFE)
  //////////////////////////////////////////////////////

  const totalSeats = 753
  const majority = totalSeats > 0 ? Math.floor(totalSeats / 2) + 1 : 0

  //////////////////////////////////////////////////////
  // PROGRESS (SAFE)
  //////////////////////////////////////////////////////

  const progress = totalSeats > 0
    ? ((countedSeats / totalSeats) * 100).toFixed(1)
    : "0.0"

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="live-election-ticker">

      <div className="live-election-inner">

        <span className="live-dot"></span>

        <span className="live-label">
          LIVE COUNTING
        </span>

        <span>
          Seats Counted: <b>{countedSeats}</b> / {totalSeats}
        </span>

        <span>
          Majority: <b>{majority}</b>
        </span>

        <span>
          Progress: <b>{progress}%</b>
        </span>

        <span className="live-update">
          Updated: {updated || time}
        </span>

      </div>

    </div>

  )
}