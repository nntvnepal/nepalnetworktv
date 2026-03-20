import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// ✅ build fix
export const dynamic = "force-dynamic"

//////////////////////////////////////////////////////
// UTILS
//////////////////////////////////////////////////////

function normalize(name: string) {
  return name?.toLowerCase().replace(/\s/g, "") || ""
}

function resolveDistrict(region: any): string | null {
  if (!region) return null
  if (region.type === "DISTRICT") return region.name
  return resolveDistrict(region.parent)
}

function resolveProvince(region: any): string | null {
  if (!region) return null
  if (region.type === "PROVINCE") return region.name
  return resolveProvince(region.parent)
}

function resolveMunicipality(region: any): string | null {
  if (!region) return null

  const types = ["METRO", "SUB_METRO", "MUNICIPALITY", "RURAL_MUNICIPALITY"]

  if (types.includes(region.type)) return region.name

  return resolveMunicipality(region.parent)
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
    // RESULTS (SAFE FILTER)
    //////////////////////////////////////////////////////

    const results = await prisma.electionResult.findMany({

      where: {
        electionId: election.id,
        seatId: { not: null },
        candidateId: { not: null }
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

    const seatMap: Record<string, any[]> = {}

    for (const r of results) {

      // ✅ skip bad data
      if (!r.seatId || !r.seat || !r.candidate) continue

      if (!seatMap[r.seatId]) {
        seatMap[r.seatId] = []
      }

      seatMap[r.seatId].push(r)
    }

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

    Object.values(seatMap).forEach((seatResults: any[]) => {

      const sorted = seatResults.sort((a, b) => (b.votes || 0) - (a.votes || 0))
      const leader = sorted[0]

      if (!leader || !leader.seat || !leader.candidate) return

      const district = resolveDistrict(leader.seat.region)
      const province = resolveProvince(leader.seat.region)
      const municipality = resolveMunicipality(leader.seat.region)

      if (!district) return

      const dKey = normalize(district)

      //////////////////////////////////////////////////////
      // DISTRICT
      //////////////////////////////////////////////////////

      districtResults[dKey] = {
        district,
        party: leader.party?.name || "Independent",
        color: leader.party?.color || "#888888",
        candidate: leader.candidate?.name || "Unknown",
        votes: leader.votes ?? 0,
        votePercent: leader.votePercent ?? 0,
        seatId: leader.seatId
      }

      //////////////////////////////////////////////////////
      // PROVINCE
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
      // MUNICIPALITY
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
      // PARTY COUNT
      //////////////////////////////////////////////////////

      const party = leader.party?.name || "Independent"
      partySeats[party] = (partySeats[party] || 0) + 1

      //////////////////////////////////////////////////////
      // SEATS
      //////////////////////////////////////////////////////

      seats.push({
        seatId: leader.seatId,
        seatName: leader.seat?.name || "Unknown",
        district,
        winner: leader.candidate?.name || "Unknown",
        party,
        color: leader.party?.color || "#888888",
        votes: leader.votes ?? 0,
        votePercent: leader.votePercent ?? 0
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

  } catch (error) {

    console.error("MAP RESULTS ERROR:", error)

    return NextResponse.json(
      { error: "Map results fetch failed" },
      { status: 500 }
    )

  }

}