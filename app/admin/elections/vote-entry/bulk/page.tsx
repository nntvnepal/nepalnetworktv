"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

type Row = {
  candidateId: string
  candidate: string
  seat: string
  region: string
  party?: string
  partyLogo?: string
  photo?: string
  votes: number
}

export default function BulkVoteEntry() {
  const router = useRouter()

  const [rows, setRows] = useState<Row[]>([])
  const [filtered, setFiltered] = useState<Row[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  // ✅ FIXED TYPE
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  //////////////////////////////////////////////////////
  // LOAD DATA
  //////////////////////////////////////////////////////

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setDataLoading(true)

      const res = await fetch("/api/elections/vote/bulk")

      if (!res.ok) throw new Error("Failed to load bulk vote data")

      const data: Row[] = await res.json()

      setRows(data)
      setFiltered(data)
    } catch (err) {
      console.error("Bulk load error:", err)
      alert("Failed to load vote data")
    } finally {
      setDataLoading(false)
    }
  }

  //////////////////////////////////////////////////////
  // SEARCH FILTER
  //////////////////////////////////////////////////////

  useEffect(() => {
    const q = search.toLowerCase()

    const filteredRows = rows.filter((r) =>
      (r.seat || "").toLowerCase().includes(q) ||
      (r.candidate || "").toLowerCase().includes(q) ||
      (r.region || "").toLowerCase().includes(q)
    )

    setFiltered(filteredRows)
  }, [search, rows])

  //////////////////////////////////////////////////////
  // CHANGE VOTE
  //////////////////////////////////////////////////////

  function changeVote(index: number, val: string) {
    const updated = [...filtered]
    updated[index].votes = Number(val) || 0
    setFiltered(updated)
  }

  //////////////////////////////////////////////////////
  // ENTER KEY NAVIGATION
  //////////////////////////////////////////////////////

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "Enter") {
      e.preventDefault()

      const next = inputRefs.current[index + 1]
      if (next) next.focus()
    }
  }

  //////////////////////////////////////////////////////
  // SAVE BULK
  //////////////////////////////////////////////////////

  async function saveAll() {
    try {
      setLoading(true)

      const res = await fetch("/api/elections/result/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: filtered,
        }),
      })

      if (!res.ok) throw new Error("Bulk vote save failed")

      alert("Bulk votes saved successfully")

      await loadData()
    } catch (err) {
      console.error("Bulk save error:", err)
      alert("Vote save failed")
    } finally {
      setLoading(false)
    }
  }

  //////////////////////////////////////////////////////
  // TOTAL VOTES
  //////////////////////////////////////////////////////

  const totalVotes = filtered.reduce(
    (acc, r) => acc + (r.votes || 0),
    0
  )

  //////////////////////////////////////////////////////
  // LOADING STATE
  //////////////////////////////////////////////////////

  if (dataLoading) {
    return (
      <div className="p-10 text-white">
        Loading bulk vote data...
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
        <h1 className="text-2xl font-bold">
          Super Bulk Vote Entry
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/elections/vote-entry")}
            className="bg-white/10 px-4 py-2 rounded"
          >
            Back
          </button>

          <button
            onClick={saveAll}
            disabled={loading}
            className="bg-green-600 px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save All Votes"}
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search seat / candidate / region..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-purple-900 border border-purple-700 px-4 py-2 rounded"
      />

      {/* TABLE */}
      <div className="overflow-auto max-h-[600px] border border-purple-800 rounded">
        <table className="min-w-full text-sm">

          <thead className="bg-purple-900 sticky top-0">
            <tr>
              <th className="p-3 text-left">Region</th>
              <th className="p-3 text-left">Seat</th>
              <th className="p-3 text-left">Candidate</th>
              <th className="p-3 text-left">Party</th>
              <th className="p-3 text-left">Votes</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, index) => (
              <tr
                key={`${row.candidateId}-${index}`}
                className="border-t border-purple-800 hover:bg-purple-900/40"
              >

                <td className="p-3">{row.region}</td>

                <td className="p-3 font-medium">{row.seat}</td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={row.photo || "/no-image.png"}
                      className="w-6 h-6 rounded"
                    />
                    {row.candidate}
                  </div>
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {row.partyLogo && (
                      <img
                        src={row.partyLogo}
                        className="w-5 h-5"
                      />
                    )}
                    {row.party}
                  </div>
                </td>

                <td className="p-3">
                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="number"
                    value={row.votes ?? 0}
                    onChange={(e) =>
                      changeVote(index, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="bg-purple-900 border border-purple-700 px-3 py-2 rounded w-28"
                  />
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between text-sm text-purple-300">
        <div>Rows: {filtered.length}</div>

        <div>
          Total Votes:{" "}
          <span className="text-white">
            {totalVotes.toLocaleString()}
          </span>
        </div>
      </div>

    </div>
  )
}