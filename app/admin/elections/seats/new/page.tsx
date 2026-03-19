import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SeatPosition } from "@prisma/client"

//////////////////////////////////////////////////////
// SERVER ACTION
//////////////////////////////////////////////////////

async function createSeat(formData: FormData) {
  "use server"

  const name = String(formData.get("name") || "").trim()
  const code = String(formData.get("code") || "").trim()
  const regionId = String(formData.get("regionId") || "")
  const electionId = String(formData.get("electionId") || "")
  const rawPosition = formData.get("position")

  if (!name) throw new Error("Seat name is required")
  if (!electionId) throw new Error("Election is required")

  if (
    !rawPosition ||
    !Object.values(SeatPosition).includes(rawPosition as SeatPosition)
  ) {
    throw new Error("Invalid position")
  }

  const position = rawPosition as SeatPosition

  await prisma.seat.create({
    data: {
      name,
      code: code || null,
      position,

      // ✅ REQUIRED
      election: {
        connect: { id: electionId },
      },

      region: regionId
        ? { connect: { id: regionId } }
        : undefined,
    },
  })

  redirect("/admin/elections/seats")
}

//////////////////////////////////////////////////////
// PAGE
//////////////////////////////////////////////////////

export default async function NewSeatPage() {
  const [regions, elections] = await Promise.all([
    prisma.region.findMany({ orderBy: { name: "asc" } }),
    prisma.election.findMany({ orderBy: { year: "desc" } }),
  ])

  return (
    <div className="p-6 max-w-2xl space-y-6">

      <h1 className="text-2xl font-bold text-white">
        Create New Seat
      </h1>

      <form action={createSeat} className="space-y-4">

        {/* ELECTION SELECT 🔥 */}
        <select
          name="electionId"
          required
          className="w-full bg-purple-900 border border-purple-700 text-white px-4 py-2 rounded"
        >
          <option value="">Select Election</option>

          {elections.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.year})
            </option>
          ))}
        </select>

        {/* NAME */}
        <input
          name="name"
          placeholder="Seat Name"
          required
          className="w-full bg-purple-900 border border-purple-700 text-white px-4 py-2 rounded"
        />

        {/* CODE */}
        <input
          name="code"
          placeholder="Seat Code (optional)"
          className="w-full bg-purple-900 border border-purple-700 text-white px-4 py-2 rounded"
        />

        {/* POSITION */}
        <select
          name="position"
          required
          className="w-full bg-purple-900 border border-purple-700 text-white px-4 py-2 rounded"
        >
          <option value="">Select Position</option>

          {Object.values(SeatPosition).map((pos) => (
            <option key={pos} value={pos}>
              {pos.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        {/* REGION */}
        <select
          name="regionId"
          className="w-full bg-purple-900 border border-purple-700 text-white px-4 py-2 rounded"
        >
          <option value="">Select Region (optional)</option>

          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {/* BUTTON */}
        <button className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 w-full">
          Create Seat
        </button>

      </form>

    </div>
  )
}