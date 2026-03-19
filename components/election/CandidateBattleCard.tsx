"use client"

import Image from "next/image"
import Link from "next/link"

type Candidate = {
  name?: string
  party?: string
  votes?: number
  photo?: string
  slug?: string
}

type Props = {
  seat?: string
  top1?: Candidate
  top2?: Candidate
  top3?: Candidate
  status?: "leading" | "won"
  margin?: number
}

export default function CandidateBattleCard({
  seat = "Unknown Seat",
  top1 = {},
  top2 = {},
  top3,
  status = "leading",
  margin = 0
}: Props) {

  //////////////////////////////////////////////////////
  // SAFE VALUES
  //////////////////////////////////////////////////////

  const votes1 = top1.votes || 0
  const votes2 = top2.votes || 0

  const totalVotes = votes1 + votes2

  const p1 = totalVotes > 0 ? (votes1 / totalVotes) * 100 : 0
  const p2 = totalVotes > 0 ? (votes2 / totalVotes) * 100 : 0

  //////////////////////////////////////////////////////
  // LEADING
  //////////////////////////////////////////////////////

  const leading = votes1 >= votes2 ? "top1" : "top2"

  //////////////////////////////////////////////////////
  // IMAGES (SAFE)
  //////////////////////////////////////////////////////

  const img1 = top1.photo || "/candidate-placeholder.png"
  const img2 = top2.photo || "/candidate-placeholder.png"

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="battle-card">

      {/* SEAT */}
      <div className="battle-seat">
        {seat}
      </div>

      {/* STATUS */}
      <div className={`battle-status ${status}`}>
        {status === "won" ? "🏆 Won" : "Leading"}
      </div>

      {/* MAIN */}
      <div className="battle-main">

        {/* CANDIDATE 1 */}
        <div className={`battle-candidate ${leading === "top1" ? "leading" : ""}`}>

          <Image
            src={img1}
            alt={top1.name || "Candidate"}
            width={56}
            height={56}
          />

          <div className="battle-name">
            {top1.name || "N/A"}
          </div>

          <div className="battle-party">
            {top1.party || "Independent"}
          </div>

          <div className={`battle-votes ${leading === "top1" ? "vote-first" : "vote-second"}`}>
            {votes1.toLocaleString()}
          </div>

        </div>

        {/* VS */}
        <div className="battle-vs">VS</div>

        {/* CANDIDATE 2 */}
        <div className={`battle-candidate ${leading === "top2" ? "leading" : ""}`}>

          <Image
            src={img2}
            alt={top2.name || "Candidate"}
            width={56}
            height={56}
          />

          <div className="battle-name">
            {top2.name || "N/A"}
          </div>

          <div className="battle-party">
            {top2.party || "Independent"}
          </div>

          <div className={`battle-votes ${leading === "top2" ? "vote-first" : "vote-second"}`}>
            {votes2.toLocaleString()}
          </div>

        </div>

      </div>

      {/* BARS */}
      <div className="battle-bars">

        <div
          className="bar bar1"
          style={{ width: `${Math.max(p1, 5)}%` }}
        />

        <div
          className="bar bar2"
          style={{ width: `${Math.max(p2, 5)}%` }}
        />

      </div>

      {/* THIRD */}
      {top3 && (

        <div className="battle-third">

          <div className="third-circle">③</div>

          <div className="third-info">

            <div>{top3.name || "N/A"}</div>
            <div>{top3.party || "-"}</div>

            <div className="vote-third">
              {(top3.votes || 0).toLocaleString()} votes
            </div>

          </div>

        </div>

      )}

      {/* MARGIN */}
      <div className="battle-margin">
        🔥 Margin {Math.abs(margin).toLocaleString()}
      </div>

      {/* LINK */}
      <Link
        className="battle-more"
        href={`/candidate/${top1.slug || ""}`}
      >
        View Full Result →
      </Link>

    </div>

  )
}