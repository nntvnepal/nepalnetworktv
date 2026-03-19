export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"

export default async function ReporterDashboard() {

  //////////////////////////////////////////////////////
  // FETCH DATA (FIXED RELATIONS 🔥)
  //////////////////////////////////////////////////////

  const seats = await prisma.seat.findMany({
    include: {
      region: true,
      candidates: {
        include: {
          party: true,
          results: true // votes yahin se aayega
        }
      }
    },
    take: 20
  })

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div style={{ padding: 40, fontFamily: "Arial", color: "#fff", background: "#1a002f", minHeight: "100vh" }}>

      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Reporter Election Dashboard
      </h1>

      {seats.map((seat) => (

        <div
          key={seat.id}
          style={{
            border: "1px solid #444",
            marginTop: 20,
            padding: 20,
            borderRadius: 8,
            background: "#2b0045"
          }}
        >

          {/* HEADER */}
          <h3 style={{ marginBottom: 10 }}>
            {seat.region?.name || "Unknown Region"} – {seat.name || `Seat ${seat.number ?? ""}`}
          </h3>

          {/* TABLE */}
          <table width="100%" style={{ fontSize: 14 }}>

            <thead>
              <tr style={{ color: "#ccc" }}>
                <th align="left">Candidate</th>
                <th align="left">Party</th>
                <th align="right">Votes</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {seat.candidates.map((c) => {

                // 🔥 SAFE VOTES (from results)
                const votes = c.results?.[0]?.votes ?? 0

                return (
                  <tr key={c.id} style={{ borderTop: "1px solid #333" }}>

                    {/* NAME */}
                    <td style={{ padding: "8px 0" }}>
                      {c.name}
                    </td>

                    {/* PARTY */}
                    <td>
                      {c.party?.name || "Independent"}
                    </td>

                    {/* VOTES INPUT */}
                    <td align="right">

                      <form action="/api/election/vote" method="POST">

                        <input
                          type="hidden"
                          name="candidateId"
                          value={c.id}
                        />

                        <input
                          type="hidden"
                          name="seatId"
                          value={seat.id}
                        />

                        <input
                          type="number"
                          name="votes"
                          defaultValue={votes}
                          style={{
                            width: 80,
                            padding: 4,
                            background: "#140021",
                            color: "#fff",
                            border: "1px solid #555",
                            borderRadius: 4
                          }}
                        />

                        <button
                          type="submit"
                          style={{
                            marginLeft: 10,
                            padding: "4px 10px",
                            background: "#22c55e",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer"
                          }}
                        >
                          Save
                        </button>

                      </form>

                    </td>

                  </tr>
                )
              })}

            </tbody>

          </table>

        </div>

      ))}

    </div>
  )
}