import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// ✅ build + dynamic fix
export const dynamic = "force-dynamic"

export async function GET() {

  try {

    //////////////////////////////////////////////////////
    // ACTIVE ELECTION
    //////////////////////////////////////////////////////

    const election = await prisma.election.findFirst({
      where: { isActive: true }
    })

    if (!election) {
      return NextResponse.json([])
    }

    //////////////////////////////////////////////////////
    // GET CANDIDATES (SAFE)
    //////////////////////////////////////////////////////

    const candidates = await prisma.candidate.findMany({

      where: {
        electionId: election.id,
        // ✅ safety filters
        seatId: { not: null }
      },

      include: {
        seat: true,
        party: true,
        results: {
          where: {
            electionId: election.id
          }
        }
      }

    })

    //////////////////////////////////////////////////////
    // FORMAT DATA (SAFE)
    //////////////////////////////////////////////////////

    const rows = candidates.map((c) => ({

      candidateId: c.id,
      seatId: c.seatId || null,
      seat: c.seat?.name || "Unknown",
      candidate: c.name || "Unknown",
      party: c.party?.name || "Independent",
      votes: c.results?.[0]?.votes ?? 0

    }))

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json(rows)

  } catch (error) {

    console.error("VOTE BULK API ERROR:", error)

    return NextResponse.json([], { status: 500 })

  }

}