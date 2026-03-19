import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

//////////////////////////////////////////////////////
// UTILS
//////////////////////////////////////////////////////

function normalize(name: string) {
  return name.toLowerCase().replace(/\s/g, "")
}

//////////////////////////////////////////////////////
// FIND DISTRICT FROM REGION HIERARCHY
//////////////////////////////////////////////////////

function resolveDistrict(region: any): string | null {

  if (!region) return null

  if (region.type === "DISTRICT") {
    return region.name
  }

  if (region.parent) {
    return resolveDistrict(region.parent)
  }

  return null
}

//////////////////////////////////////////////////////
// FIND PROVINCE FROM REGION HIERARCHY
//////////////////////////////////////////////////////

function resolveProvince(region: any): string | null {

  if (!region) return null

  if (region.type === "PROVINCE") {
    return region.name
  }

  if (region.parent) {
    return resolveProvince(region.parent)
  }

  return null
}

//////////////////////////////////////////////////////
// FIND MUNICIPALITY FROM REGION HIERARCHY
//////////////////////////////////////////////////////

function resolveMunicipality(region: any): string | null {

  if (!region) return null

  const types = [
    "METRO",
    "SUB_METRO",
    "MUNICIPALITY",
    "RURAL_MUNICIPALITY"
  ]

  if (types.includes(region.type)) {
    return region.name
  }

  if (region.parent) {
    return resolveMunicipality(region.parent)
  }

  return null
}

//////////////////////////////////////////////////////
// API
//////////////////////////////////////////////////////

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
        election: null,
        totalDistricts: 0,
        districtResults: {},
        provinceResults: {},
        municipalityResults: {},
        partySeats: {},
        seats: []
      })
    }

    //////////////////////////////////////////////////////
    // RESULTS
    //////////////////////////////////////////////////////

    const results = await prisma.electionResult.findMany({

      where: {
        electionId: election.id
      },

      include: {
        candidate: true,
        party: true,
        seat: {
          include: {
            region: {
              include: {
                parent: {
                  include: {
                    parent: true
                  }
                }
              }
            }
          }
        }
      }

    })

    //////////////////////////////////////////////////////
    // GROUP BY SEAT
    //////////////////////////////////////////////////////

    const seatMap: any = {}

    results.forEach(r => {

      if (!seatMap[r.seatId]) {
        seatMap[r.seatId] = []
      }

      seatMap[r.seatId].push(r)

    })

    //////////////////////////////////////////////////////
    // RESULT STRUCTURES
    //////////////////////////////////////////////////////

    const districtResults: any = {}
    const provinceResults: any = {}
    const municipalityResults: any = {}

    const partySeats: any = {}
    const seats: any[] = []

    //////////////////////////////////////////////////////
    // PROCESS EACH SEAT
    //////////////////////////////////////////////////////

    Object.values(seatMap).forEach((seatResults: any) => {

      const sorted = seatResults.sort((a: any, b: any) => b.votes - a.votes)

      const leader = sorted[0]

      const district = resolveDistrict(leader.seat.region)
      const province = resolveProvince(leader.seat.region)
      const municipality = resolveMunicipality(leader.seat.region)

      if (!district) return

      const dKey = normalize(district)

      //////////////////////////////////////////////////////
      // DISTRICT RESULT (EXISTING)
      //////////////////////////////////////////////////////

      districtResults[dKey] = {

        district,

        party: leader.party?.name || "Independent",

        color: leader.party?.color || "#888888",

        candidate: leader.candidate.name,

        votes: leader.votes,

        votePercent: leader.votePercent,

        seatId: leader.seatId

      }

      //////////////////////////////////////////////////////
      // PROVINCE RESULT (NEW)
      //////////////////////////////////////////////////////

      if (province) {

        const pKey = normalize(province)

        provinceResults[pKey] = {

          province,

          party: leader.party?.name || "Independent",

          color: leader.party?.color || "#888888"

        }

      }

      //////////////////////////////////////////////////////
      // MUNICIPALITY RESULT (NEW)
      //////////////////////////////////////////////////////

      if (municipality) {

        const mKey = normalize(municipality)

        municipalityResults[mKey] = {

          municipality,

          party: leader.party?.name || "Independent",

          color: leader.party?.color || "#888888"

        }

      }

      //////////////////////////////////////////////////////
      // PARTY SEAT COUNT (EXISTING)
      //////////////////////////////////////////////////////

      const party = leader.party?.name || "Independent"

      if (!partySeats[party]) {
        partySeats[party] = 0
      }

      partySeats[party]++

      //////////////////////////////////////////////////////
      // SEAT RESULTS (EXISTING)
      //////////////////////////////////////////////////////

      seats.push({

        seatId: leader.seatId,

        seatName: leader.seat.name,

        district,

        winner: leader.candidate.name,

        party: leader.party?.name || "Independent",

        color: leader.party?.color || "#888888",

        votes: leader.votes,

        votePercent: leader.votePercent

      })

    })

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json({

      election: {
        id: election.id,
        name: election.name,
        year: election.year,
        type: election.type
      },

      totalDistricts: Object.keys(districtResults).length,

      districtResults,

      provinceResults,

      municipalityResults,

      partySeats,

      seats

    })

  }

  catch (error) {

    console.error("MAP RESULTS ERROR:", error)

    return NextResponse.json(
      { error: "Map results fetch failed" },
      { status: 500 }
    )

  }

}