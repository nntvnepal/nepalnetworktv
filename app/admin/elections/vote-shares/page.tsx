import { prisma } from "@/lib/prisma"
import PartyVoteChart from "@/components/PartyVoteChart"

export const dynamic = "force-dynamic"
export const revalidate = 20

type PartyData = {
  party: string
  votes: number
  percent: number
  color: string
}

export default async function VoteSharesPage() {

  //////////////////////////////////////////////////////
  // ACTIVE ELECTION
  //////////////////////////////////////////////////////

  const election = await prisma.election.findFirst({
    where: { isActive: true },
    select: { id: true, name: true }
  })

  if (!election) {
    return (
      <div className="p-10 text-white">
        No Active Election
      </div>
    )
  }

  //////////////////////////////////////////////////////
  // RESULTS
  //////////////////////////////////////////////////////

  const results = await prisma.electionResult.findMany({
    where: { electionId: election.id },
    select: {
      votes: true,
      candidate: {
        select: {
          party: {
            select: {
              name: true,
              color: true
            }
          }
        }
      }
    }
  })

  //////////////////////////////////////////////////////
  // CALCULATE PARTY VOTES
  //////////////////////////////////////////////////////

  let totalVotes = 0

  const partyVotes: Record<string, number> = {}
  const partyColors: Record<string, string> = {}

  for (const r of results) {

    const party = r.candidate?.party?.name || "Independent"
    const color = r.candidate?.party?.color || "#22c55e"

    partyVotes[party] = (partyVotes[party] || 0) + r.votes
    partyColors[party] = color

    totalVotes += r.votes
  }

  //////////////////////////////////////////////////////
  // PREPARE DATA
  //////////////////////////////////////////////////////

  const voteShareData: PartyData[] = Object.entries(partyVotes).map(
    ([party, votes]) => {

      const percent = totalVotes
        ? Number(((votes / totalVotes) * 100).toFixed(2))
        : 0

      return {
        party,
        votes,
        percent,
        color: partyColors[party] // ✅ FIXED
      }
    }
  )

  const sorted = voteShareData.sort((a, b) => b.votes - a.votes)

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-[#2b0045]
      via-[#3c0a5c]
      to-[#140021]
      p-8
      space-y-8
      text-white
    ">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Vote Shares
        </h1>

        <p className="text-purple-300">
          {election.name}
        </p>
      </div>

      {/* TOTAL VOTES */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-2">
          Total Votes Counted
        </h2>

        <div className="text-3xl font-bold text-green-400">
          {totalVotes.toLocaleString()}
        </div>
      </div>

      {/* CHART */}
      <div className="glass-card p-6">
        <h2 className="mb-4 font-semibold">
          Party Vote Share
        </h2>

        <PartyVoteChart
          data={sorted.map(p => ({
            party: p.party,
            votes: p.votes,
            color: p.color // ✅ pass color
          }))}
        />
      </div>

      {/* TABLE */}
      <div className="glass-card overflow-x-auto">

        <table className="min-w-full text-sm">

          <thead className="bg-purple-900">
            <tr>
              <th className="p-3 text-left">Party</th>
              <th className="p-3 text-left">Votes</th>
              <th className="p-3 text-left">Vote %</th>
            </tr>
          </thead>

          <tbody>

            {sorted.map((p, i) => (
              <tr
                key={i}
                className="border-t border-purple-800 hover:bg-purple-900/40"
              >

                <td className="p-3 font-medium flex items-center gap-2">

                  {/* COLOR DOT */}
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: p.color }}
                  />

                  {p.party}
                </td>

                <td className="p-3">
                  {p.votes.toLocaleString()}
                </td>

                <td className="p-3 text-green-400 font-semibold">
                  {p.percent}%
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}