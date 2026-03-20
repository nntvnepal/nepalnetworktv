import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// ✅ IMPORTANT (build crash fix)
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
      return NextResponse.json({
        results: [],
        updatedAt: new Date()
      })
    }

    //////////////////////////////////////////////////////
    // GET RESULTS (SAFE FILTER)
    //////////////////////////////////////////////////////

    const results = await prisma.electionResult.findMany({

      where: {
        electionId: election.id,
        // ✅ EXTRA SAFETY (important)
        seatId: { not: null },
        candidateId: { not: null }
      },

      include: {
        candidate: {
          include: {
            party: true
          }
        },
        seat: {
          include: {
            region: true,
            ward: true,
            constituency: true
          }
        }
      }

    })

    //////////////////////////////////////////////////////
    // CALCULATE WINNERS (SAFE)
    //////////////////////////////////////////////////////

    const seatWinners: Record<string, any> = {}

    for (const r of results) {

      // ✅ skip bad data
      if (!r.seatId || !r.candidate) continue

      const seat = r.seatId

      if (!seatWinners[seat] || r.votes > seatWinners[seat].votes) {
        seatWinners[seat] = r
      }

    }

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json({
      results: Object.values(seatWinners),
      updatedAt: new Date()
    })

  } catch (error) {

    console.error("LIVE API ERROR:", error)

    return NextResponse.json({
      results: [],
      updatedAt: new Date(),
      error: "Internal Server Error"
    }, { status: 500 })

  }

}