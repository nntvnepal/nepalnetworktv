"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type Candidate = {
  id: string
  name: string
  photo?: string
  party?: {
    name?: string
    logo?: string
  }
  results?: {
    votes: number
  }[]
}

type Seat = {
  id: string
  name: string
  position: string
  region?: {
    name?: string
  }
  candidates: Candidate[]
}

export default function SeatVoteEntry() {
  const params = useParams()
  const router = useRouter()
  const seatId = params?.seatId as string

  const [seat, setSeat] = useState<Seat | null>(null)
  const [votes, setVotes] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////////////
  // LOAD SEAT DATA
  //////////////////////////////////////////////////////

  useEffect(() => {
    if (!seatId) return
    fetchSeat()
  }, [seatId])

  async function fetchSeat() {
    try {
      const res = await fetch(`/api/elections/seats/${seatId}`)

      if (!res.ok) throw new Error("Seat fetch failed")

      const data: Seat = await res.json()

      setSeat(data)

      const initialVotes: Record<string, number> = {}

      data?.candidates?.forEach((c) => {
        initialVotes[c.id] = c.results?.[0]?.votes ?? 0
      })

      setVotes(initialVotes)
    } catch (err) {
      console.error("Seat load error", err)
    }
  }

  //////////////////////////////////////////////////////
  // CHANGE VOTE
  //////////////////////////////////////////////////////

  function changeVote(candidateId: string, val: string) {
    setVotes((prev) => ({
      ...prev,
      [candidateId]: Number(val) || 0,
    }))
  }

  //////////////////////////////////////////////////////
  // TOTAL VOTES (FIXED 🔥)
  //////////////////////////////////////////////////////

  const totalVotes = Object.values(votes).reduce(
    (sum, v) => sum + v,
    0
  )

  //////////////////////////////////////////////////////
  // SAVE VOTES
  //////////////////////////////////////////////////////

  async function saveVotes() {
    try {
      setLoading(true)

      const res = await fetch("/api/elections/result/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seatId,
          votes,
        }),
      })

      if (!res.ok) throw new Error("Save failed")

      alert("Votes saved successfully")

      await fetchSeat()
    } catch (err) {
      console.error(err)
      alert("Vote save failed")
    }

    setLoading(false)
  }

  //////////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////////

  if (!seat) {
    return (
      <div className="p-8 text-white">
        Loading seat data...
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="p-8 space-y-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {seat.name}
          </h1>

          <p className="text-purple-300 text-sm">
            {seat.position} • {seat.region?.name}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/elections/vote-entry")}
            className="bg-white/10 px-4 py-2 rounded"
          >
            Back
          </button>

          <button
            onClick={() => router.push("/admin/elections/vote-entry/bulk")}
            className="bg-yellow-500 text-black px-4 py-2 rounded"
          >
            Bulk Entry
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-purple-800 text-sm">

          <thead className="bg-purple-900">
            <tr>
              <th className="p-3 text-left">Candidate</th>
              <th className="p-3 text-left">Party</th>
              <th className="p-3 text-left">Votes</th>
            </tr>
          </thead>

          <tbody>
            {seat.candidates?.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-purple-300">
                  No candidates found
                </td>
              </tr>
            )}

            {seat.candidates?.map((c) => (
              <tr
                key={c.id}
                className="border-t border-purple-800 hover:bg-purple-900/30"
              >

                {/* Candidate */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.photo || "/no-image.png"}
                      className="w-8 h-8 rounded object-cover"
                    />

                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-purple-400">
                        {seat.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Party */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {c.party?.logo && (
                      <img
                        src={c.party.logo}
                        className="w-5 h-5"
                      />
                    )}
                    {c.party?.name || "-"}
                  </div>
                </td>

                {/* Votes */}
                <td className="p-3">
                  <input
                    type="number"
                    value={votes[c.id] ?? 0}
                    onChange={(e) => changeVote(c.id, e.target.value)}
                    className="bg-purple-900 border border-purple-700 text-white px-3 py-2 rounded w-28"
                  />
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <div className="text-purple-300 text-sm">
          Total Votes:{" "}
          <span className="text-white font-semibold">
            {totalVotes}
          </span>
        </div>

        <button
          onClick={saveVotes}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Saving Votes..." : "Save Votes"}
        </button>
      </div>

    </div>
  )
}