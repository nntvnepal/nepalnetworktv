import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { generateSeats } from "@/lib/election/generateSeats"
import { ElectionType, ElectionStatus } from "@prisma/client"

//////////////////////////////////////////////////////
// SLUG GENERATOR
//////////////////////////////////////////////////////

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function POST(req: Request) {

  try {

    const body = await req.json()

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // ENUM SAFETY (🔥 IMPORTANT)
    //////////////////////////////////////////////////////

    const type = String(body.type).toUpperCase() as ElectionType

    if (!Object.values(ElectionType).includes(type)) {
      return NextResponse.json(
        { error: "Invalid election type" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // SLUG
    //////////////////////////////////////////////////////

    let baseSlug = generateSlug(body.name)
    let slug = baseSlug

    const exists = await prisma.election.findFirst({
      where: { slug }
    })

    if (exists) {
      slug = `${baseSlug}-${Date.now()}`
    }

    //////////////////////////////////////////////////////
    // CALCULATIONS
    //////////////////////////////////////////////////////

    let totalSeats = 0
    let majority = 0
    let meta: any = {}

    //////////////////////////////////////////////////////
    // LOCAL
    //////////////////////////////////////////////////////

    if (type === "LOCAL") {

      const mayor = 293
      const deputyMayor = 293
      const chairperson = 460
      const viceChairperson = 460
      const wardChairperson = 6743
      const wardMembers = 26972

      totalSeats =
        mayor +
        deputyMayor +
        chairperson +
        viceChairperson +
        wardChairperson +
        wardMembers

      majority = Math.floor(totalSeats / 2) + 1

      meta = {
        mayor,
        deputyMayor,
        chairperson,
        viceChairperson,
        wardChairperson,
        wardMembers
      }
    }

    //////////////////////////////////////////////////////
    // FEDERAL
    //////////////////////////////////////////////////////

    if (type === "FEDERAL") {

      const fptp = 165
      const pr = 110

      totalSeats = fptp + pr
      majority = Math.floor(totalSeats / 2) + 1

      meta = { fptp, pr }
    }

    //////////////////////////////////////////////////////
    // PROVINCIAL
    //////////////////////////////////////////////////////

    if (type === "PROVINCIAL") {

      const provinces = [
        { name: "Koshi", seats: 93 },
        { name: "Madhesh", seats: 107 },
        { name: "Bagmati", seats: 110 },
        { name: "Gandaki", seats: 60 },
        { name: "Lumbini", seats: 87 },
        { name: "Karnali", seats: 40 },
        { name: "Sudurpashchim", seats: 53 }
      ]

      totalSeats = provinces.reduce((sum, p) => sum + p.seats, 0)
      majority = Math.floor(totalSeats / 2) + 1

      meta = { provinces }
    }

    //////////////////////////////////////////////////////
    // CREATE
    //////////////////////////////////////////////////////

    const election = await prisma.election.create({
      data: {
        name: body.name,
        slug,

        type,

        year: body.year ? Number(body.year) : null,
        phase: body.phase ? Number(body.phase) : null,
        voters: body.voters ? Number(body.voters) : null,

        status: (body.status?.toUpperCase() as ElectionStatus) || "DRAFT",

        totalSeats,
        majority,

        meta,

        isActive: Boolean(body.isActive)
      }
    })

    //////////////////////////////////////////////////////
    // AUTO GENERATE SEATS (SAFE CALL)
    //////////////////////////////////////////////////////

    try {
      await generateSeats(election.id, election.type)
    } catch (e) {
      console.error("Seat generation failed (non-blocking):", e)
    }

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json({
      success: true,
      election
    })

  } catch (error) {

    console.error("ELECTION CREATE ERROR:", error)

    return NextResponse.json(
      { error: "Failed to create election" },
      { status: 500 }
    )
  }
}