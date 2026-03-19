import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    //////////////////////////////////////////////////////
    // FORM DATA
    //////////////////////////////////////////////////////

    const data = await req.formData()

    const name = String(data.get("name") || "")
    const type = String(data.get("type") || "")

    const provinceId = String(data.get("PROVINCEId") || "")
    const districtId = String(data.get("DISTRICTId") || "")
    const municipalityId = String(data.get("RURAL_MUNICIPALITYId") || "")

    const wardNumber = String(data.get("wardNumber") || "")

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!type) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      )
    }

    //////////////////////////////////////////////////////
    // PARENT LOGIC
    //////////////////////////////////////////////////////

    let parentId: string | null = null

    if (districtId) parentId = districtId
    else if (provinceId) parentId = provinceId

    //////////////////////////////////////////////////////
    // CREATE WARD
    //////////////////////////////////////////////////////

    if (type === "ward") {

      if (!municipalityId || !wardNumber) {
        return NextResponse.json(
          { error: "Municipality and ward number required" },
          { status: 400 }
        )
      }

      await prisma.ward.create({
        data: {
          number: Number(wardNumber),
          municipalityId: municipalityId // ✅ FIXED
        }
      })

    }

    //////////////////////////////////////////////////////
    // CREATE REGION
    //////////////////////////////////////////////////////

    else {

      if (!name) {
        return NextResponse.json(
          { error: "Name is required" },
          { status: 400 }
        )
      }

      await prisma.region.create({
        data: {
          name,
          type: type as any, // enum handled
          parentId: parentId || null
        }
      })

    }

    //////////////////////////////////////////////////////
    // REDIRECT
    //////////////////////////////////////////////////////

    return NextResponse.redirect(
      new URL("/admin/elections/geography", req.url)
    )

  } catch (error) {

    console.error("GEOGRAPHY CREATE ERROR:", error)

    return NextResponse.json(
      { error: "Failed to create geography" },
      { status: 500 }
    )

  }
}