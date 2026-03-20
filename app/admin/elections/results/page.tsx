import { prisma } from "@/lib/prisma"
import dynamic from "next/dynamic"

import PartyCards from "@/components/election/PartyCards"
import ResultSummary from "@/components/election/ResultSummary"
import PartyStandings from "@/components/election/PartyStandings"
import SeatResultsTable from "@/components/election/SeatResultsTable"
import PartySeatBar from "@/components/election/PartySeatBar"
import ProvinceResults from "@/components/election/ProvinceResults"
import HotSeats from "@/components/election/HotSeats"
import DistrictResults from "@/components/election/DistrictResults"

import "@/styles/election.css"

// ✅ IMPORTANT (SSR issue fix)
export const dynamic = "force-dynamic"
export const revalidate = 0

const NepalElectionMap = dynamic(
  () => import("@/components/election/NepalElectionMap"),
  { ssr: false }
)

interface Props {
  params: { slug?: string }
}

export default async function ElectionPage({ params }: Props) {

  //////////////////////////////////////////////////////
  // SAFETY CHECK (VERY IMPORTANT)
  //////////////////////////////////////////////////////

  const slug = params?.slug

  if (!slug) {
    return (
      <div className="container">
        <h1>Invalid election URL</h1>
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // FETCH ELECTION
  //////////////////////////////////////////////////////

  const election = await prisma.election.findUnique({
    where: { slug }
  })

  if (!election) {
    return (
      <div className="container">
        <h1>Election not found</h1>
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // FETCH RESULTS (NULL SAFE)
  //////////////////////////////////////////////////////

  const results = await prisma.electionResult.findMany({
    where: {
      electionId: election.id
    },
    include: {
      candidate: {
        include: {
          party: true
        }
      },
      seat: {
        include: {
          region: true
        }
      }
    }
  })

  //////////////////////////////////////////////////////
  // CALCULATIONS (SAFE)
  //////////////////////////////////////////////////////

  const seatWinners: Record<string, any> = {}
  const partySeats: Record<string, number> = {}

  for (const r of results) {

    // ✅ skip invalid data (DB protection)
    if (!r.seatId || !r.candidate) continue

    const seatId = r.seatId

    if (!seatWinners[seatId] || r.votes > seatWinners[seatId].votes) {
      seatWinners[seatId] = r
    }
  }

  Object.values(seatWinners).forEach((r: any) => {
    const party = r?.candidate?.party?.name || "Independent"
    partySeats[party] = (partySeats[party] || 0) + 1
  })

  const totalSeats = Object.keys(seatWinners).length

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="election-page">

      <div className="container">

        {/* HEADER */}
        <div className="election-header">
          <h1>{election.name}</h1>
          <p className="election-subtitle">
            Election Year {election.year}
          </p>
        </div>

        {/* FILTER */}
        <div className="search-bar">
          <select>
            <option>प्रदेश</option>
          </select>

          <select>
            <option>जिल्ला</option>
          </select>

          <select>
            <option>निर्वाचन क्षेत्र</option>
          </select>

          <button>खोज्नुहोस्</button>
        </div>

        {/* SUMMARY */}
        <ResultSummary />

        {/* PARTY */}
        <PartyCards results={results} />
        <PartySeatBar results={results} />

        {/* MAP */}
        <div className="map-grid">

          <div className="card">
            <h3 className="card-title">Election Map</h3>
            <div className="map-box">
              <NepalElectionMap />
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Party Standings</h3>
            <PartyStandings results={results} />
          </div>

        </div>

        {/* RESULTS */}
        <h2 className="section-title">Province Results</h2>
        <ProvinceResults results={results} />

        <h2 className="section-title">Hot Seats</h2>
        <HotSeats results={results} />

        <h2 className="section-title">District Results</h2>
        <DistrictResults results={results} />

        <h2 className="section-title">Latest Seat Results</h2>
        <SeatResultsTable results={results} />

      </div>

    </div>
  )
}