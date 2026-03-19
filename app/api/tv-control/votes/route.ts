import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const form = await req.formData()

    const candidateId = String(form.get("id"))
    const votes = Number(form.get("votes") || 0)

    if (!candidateId) {
      return NextResponse.json(
        { error: "Candidate ID required" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // GET CANDIDATE (seat + election needed)
    //////////////////////////////////////////////////////

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      select: {
        id: true,
        seatId: true,
        electionId: true,
        partyId: true
      }
    })

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      )
    }

    //////////////////////////////////////////////////////
    // CHECK EXISTING RESULT
    //////////////////////////////////////////////////////

    const existing = await prisma.electionResult.findFirst({
      where: {
        candidateId: candidate.id,
        seatId: candidate.seatId,
        electionId: candidate.electionId
      }
    })

    //////////////////////////////////////////////////////
    // UPDATE OR CREATE
    //////////////////////////////////////////////////////

    if (existing) {

      await prisma.electionResult.update({
        where: { id: existing.id },
        data: {
          votes
        }
      })

    } else {

      await prisma.electionResult.create({
        data: {
          candidateId: candidate.id,
          seatId: candidate.seatId,
          electionId: candidate.electionId,
          partyId: candidate.partyId || null,
          votes
        }
      })

    }

    //////////////////////////////////////////////////////
    // REDIRECT
    //////////////////////////////////////////////////////

    return NextResponse.redirect(
      new URL("/admin/tv-control/reporter", req.url)
    )

  } catch (error) {

    console.error("VOTE UPDATE ERROR:", error)

    return NextResponse.json(
      { error: "Vote update failed" },
      { status: 500 }
    )

  }

}