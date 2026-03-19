"use client"

import CandidateBattle from "@/components/tv/election/CandidateBattle"

export default function Page(){

  return(

    <div className="tv-root">

      <div className="tv-election">
        <CandidateBattle
          seat="Kathmandu-1"
          candidates={[
            {
              name:"Ram Bahadur Thapa",
              party:"UML",
              votes:54230,
              percent:48,
              color:"#d32f2f"
            },
            {
              name:"Prakash Sharan",
              party:"NC",
              votes:49800,
              percent:44,
              color:"#1976d2"
            },
            {
              name:"RSP Candidate",
              party:"RSP",
              votes:7200,
              percent:6,
              color:"#9c27b0"
            },
            {
              name:"Others",
              party:"OTH",
              votes:1800,
              percent:2,
              color:"#888"
            },
          ]}
        />
      </div>

    </div>
  )
}