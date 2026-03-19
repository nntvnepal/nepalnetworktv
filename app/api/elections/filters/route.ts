import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const provinceId = searchParams.get("provinceId")
  const districtId = searchParams.get("districtId")
  const localLevelId = searchParams.get("localLevelId")
  const wardId = searchParams.get("wardId")

  //////////////////////////////////////////////////////
  // DISTRICTS
  //////////////////////////////////////////////////////

  if (provinceId) {

    const districts = await prisma.region.findMany({
      where: {
        parentId: provinceId,
        type: "DISTRICT"
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json({ districts })
  }

  //////////////////////////////////////////////////////
  // MUNICIPALITIES
  //////////////////////////////////////////////////////

  if (districtId) {

    const locals = await prisma.region.findMany({
      where: {
        parentId: districtId,
        type: {
          in: [
            "METRO",
            "SUB_METRO",
            "MUNICIPALITY",
            "RURAL_MUNICIPALITY"
          ]
        }
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json({ locals })
  }

  //////////////////////////////////////////////////////
  // WARDS
  //////////////////////////////////////////////////////

  if (localLevelId) {

    const wards = await prisma.ward.findMany({
      where: {
        municipalityId: localLevelId
      },
      orderBy: { number: "asc" }
    })

    return NextResponse.json({ wards })
  }

  //////////////////////////////////////////////////////
  // SEATS
  //////////////////////////////////////////////////////

  if (wardId) {

    const seats = await prisma.seat.findMany({
      where: { wardId },
      select: { id: true, name: true }
    })

    return NextResponse.json({ seats })
  }

  //////////////////////////////////////////////////////
  // PROVINCES (default)
  //////////////////////////////////////////////////////

  const provinces = await prisma.region.findMany({
    where: {
      type: "PROVINCE"
    },
    orderBy: { name: "asc" }
  })

  return NextResponse.json({ provinces })
}