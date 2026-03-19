import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

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

//////////////////////////////////////////////////////
// POST
//////////////////////////////////////////////////////

export async function POST(req: Request) {

  try {

    const body = await req.json()

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!body.name || !body.type || !body.year) {
      return NextResponse.json(
        { error: "Name, type and year are required" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // SLUG
    //////////////////////////////////////////////////////

    let baseSlug = generateSlug(body.name)
    let slug = baseSlug

    // 🔥 ensure unique slug
    const existing = await prisma.election.findFirst({
      where: { slug }
    })

    if (existing) {
      slug = `${baseSlug}-${Date.now()}`
    }

    //////////////////////////////////////////////////////
    // CREATE
    //////////////////////////////////////////////////////

    const election = await prisma.election.create({
      data: {
        name: body.name,
        slug, // ✅ REQUIRED FIX
        type: body.type,
        year: Number(body.year),
        totalSeats: Number(body.totalSeats) || 0,
        isActive: false,
      }
    })

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json({
      success: true,
      election
    })

  } catch (error) {

    console.error("CREATE ELECTION ERROR:", error)

    return NextResponse.json(
      { error: "Failed to create election" },
      { status: 500 }
    )

  }
}