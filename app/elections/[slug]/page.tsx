import { prisma } from "@/lib/prisma"

import ElectionMap from "@/components/election/ElectionMap"
import ElectionFilters from "@/components/election/ElectionFilters"
import PartyCards from "@/components/election/PartyCards"
import PartyStandings from "@/components/election/PartyStandings"
import SeatResultsTable from "@/components/election/SeatResultsTable"
import PartySeatBar from "@/components/election/PartySeatBar"
import ProvinceResults from "@/components/election/ProvinceResults"
import HotSeats from "@/components/election/HotSeats"
import DistrictResults from "@/components/election/DistrictResults"
import MomentumWidget from "@/components/election/MomentumWidget"
import LiveStatusBar from "@/components/election/LiveStatusBar"
import { LiveResultsProvider } from "@/components/election/LiveResultsProvider"
import BattleCarousel from "@/components/election/BattleCarousel"
import SeatSummary from "@/components/election/SeatSummary"

import "@/styles/election.css"

interface Props {
  params: { slug: string }
}

type BattleStatus = "leading" | "won"

export default async function ElectionPage({ params }: Props) {

//////////////////////////////////////////////////////
// FETCH ELECTION
//////////////////////////////////////////////////////

const election = await prisma.election.findUnique({
  where: { slug: params.slug }
})

if (!election) {
  return (
    <div className="container">
      <h1>Election not found</h1>
    </div>
  )
}

//////////////////////////////////////////////////////
// FETCH RESULTS
//////////////////////////////////////////////////////

const results = await prisma.electionResult.findMany({
  where: { electionId: election.id },
  include: {
    candidate: { include: { party: true } },
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
// SEAT WINNERS
//////////////////////////////////////////////////////

const seatWinners: Record<string, any> = {}

for (const r of results) {
  if (!seatWinners[r.seatId] || r.votes > seatWinners[r.seatId].votes) {
    seatWinners[r.seatId] = r
  }
}

//////////////////////////////////////////////////////
// PARTY SEATS
//////////////////////////////////////////////////////

const partySeats: Record<string, number> = {}

Object.values(seatWinners).forEach((r: any) => {
  const party = r.candidate?.party?.name || "Independent"
  partySeats[party] = (partySeats[party] || 0) + 1
})

//////////////////////////////////////////////////////
// GROUP RESULTS
//////////////////////////////////////////////////////

const seatGroups: Record<string, any[]> = {}

for (const r of results) {
  if (!seatGroups[r.seatId]) {
    seatGroups[r.seatId] = []
  }
  seatGroups[r.seatId].push(r)
}

//////////////////////////////////////////////////////
// BATTLES (🔥 FIXED)
//////////////////////////////////////////////////////

const battles = Object.values(seatGroups)
  .map((seatResults: any[]) => {

    const sorted = [...seatResults].sort((a, b) => b.votes - a.votes)

    const top1 = sorted[0]
    const top2 = sorted[1]
    const top3 = sorted[2]

    if (!top1 || !top2) return null

    const seatName =
      top1.seat?.constituency?.name ||
      top1.seat?.region?.name ||
      (top1.seat?.ward ? `Ward ${top1.seat.ward.number}` : "Seat")

    const margin = (top1.votes || 0) - (top2.votes || 0)

    const status: BattleStatus =
      margin > 500 ? "won" : "leading"

    return {
      seat: seatName,
      status,
      margin,

      top1: {
        name: top1.candidate?.name || "N/A",
        party: top1.candidate?.party?.name || "Independent",
        votes: top1.votes || 0,
        photo: top1.candidate?.photo || "/no-image.png",
        slug: top1.candidate?.slug || ""
      },

      top2: {
        name: top2.candidate?.name || "N/A",
        party: top2.candidate?.party?.name || "Independent",
        votes: top2.votes || 0,
        photo: top2.candidate?.photo || "/no-image.png",
        slug: top2.candidate?.slug || ""
      },

      top3: top3 ? {
        name: top3.candidate?.name || "N/A",
        party: top3.candidate?.party?.name || "Independent",
        votes: top3.votes || 0,
        photo: top3.candidate?.photo || "/no-image.png",
        slug: top3.candidate?.slug || ""
      } : undefined

    }

  })
  .filter(Boolean) as any[]
  
//////////////////////////////////////////////////////
// SORT + LIMIT
//////////////////////////////////////////////////////

const sortedBattles = battles
  .sort((a, b) => a.margin - b.margin)
  .slice(0, 30)

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return (

<LiveResultsProvider>

<div className="election-page">

<div className="container">

<LiveStatusBar />

{/* HEADER */}

<div className="election-header">
<h1>{election.name}</h1>
<p className="election-subtitle">
Election Year {election.year}
</p>
</div>

{/* FILTER */}

<div className="filter-row">
<ElectionFilters electionType={election.type} />
<MomentumWidget />
</div>

{/* BATTLES */}

<div className="battle-section">

<h2 className="section-title">
Top Candidate Battles
</h2>

<div className="battle-grid">
<BattleCarousel battles={sortedBattles} />
</div>

</div>

{/* SUMMARY */}

<SeatSummary
results={results}
seatWinners={seatWinners}
election={election}
/>

{/* PARTY */}

<PartyCards results={results} />
<PartySeatBar results={results} />

{/* MAP */}

<div className="card">
<h3 className="card-title">Election Map</h3>
<div className="map-box">
<ElectionMap />
</div>
</div>

{/* STANDINGS */}

<div className="card">
<h3 className="card-title">Party Standings</h3>
<PartyStandings results={results} />
</div>

{/* PROVINCE */}

{election.type !== "LOCAL" && (
<>
<h2 className="section-title">Province Results</h2>
<ProvinceResults results={results} />
</>
)}

{/* HOT */}

<h2 className="section-title">Hot Seats</h2>
<HotSeats results={results} />

{/* DISTRICT */}

<h2 className="section-title">District Results</h2>
<DistrictResults results={results} />

{/* TABLE */}

<h2 className="section-title">Latest Seat Results</h2>
<SeatResultsTable results={results} />

</div>
</div>

</LiveResultsProvider>

)
}