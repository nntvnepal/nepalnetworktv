import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {

try {

const election = await prisma.election.findUnique({
  where:{ slug: params.slug }
})

if(!election){
  return NextResponse.json({ error:"Election not found" },{ status:404 })
}

const electionId = election.id

//////////////////////////////////////////////////
// RESULTS WITH RELATIONS
//////////////////////////////////////////////////

const results = await prisma.electionResult.findMany({
  where:{ electionId },
  include:{
    seat:{ include:{ region:true }},
    candidate:{
      include:{ party:true }
    }
  }
})

//////////////////////////////////////////////////
// SEAT COUNT
//////////////////////////////////////////////////

const totalSeats = await prisma.seat.count()

//////////////////////////////////////////////////
// DECLARED
//////////////////////////////////////////////////

const declaredSeats = results.filter(r=>r.isWinner).length
const pendingSeats = totalSeats - declaredSeats

//////////////////////////////////////////////////
// VOTE SUM
//////////////////////////////////////////////////

let totalVotes = 0
const partyVotes:Record<string,any> = {}
const partySeats:Record<string,number> = {}

const seatMap:Record<string,any[]> = {}

results.forEach(r=>{

totalVotes += r.votes

const party = r.candidate.party?.name || "Independent"
const color = r.candidate.party?.color || "#999"

if(!partyVotes[party]){
  partyVotes[party] = { party, color, votes:0 }
}

partyVotes[party].votes += r.votes

if(r.isWinner){
  if(!partySeats[party]) partySeats[party]=0
  partySeats[party]++
}

//////////////////////////////////////////////////
// seat grouping
//////////////////////////////////////////////////

if(!seatMap[r.seatId]) seatMap[r.seatId]=[]
seatMap[r.seatId].push(r)

})

//////////////////////////////////////////////////
// LEADERS & BATTLES
//////////////////////////////////////////////////

const leaders:any[]=[]
const battles:any[]=[]

Object.values(seatMap).forEach((seatResults:any)=>{

seatResults.sort((a:any,b:any)=>b.votes-a.votes)

const leader = seatResults[0]
const runner = seatResults[1]

if(!leader) return

if(runner){

const margin = leader.votes-runner.votes

leaders.push({
 seat:leader.seat.name,
 region:leader.seat.region?.name,
 leader:leader.candidate.name,
 party:leader.candidate.party?.name,
 margin
})

if(margin < 500){
 battles.push({
  seat:leader.seat.name,
  margin
 })
}

}

})

//////////////////////////////////////////////////
// RESPONSE
//////////////////////////////////////////////////

return NextResponse.json({

election:{
 name:election.name,
 year:election.year,
 type:election.type
},

progress:{
 totalSeats,
 declaredSeats,
 pendingSeats
},

votesCounted: totalVotes,

voteShare:Object.values(partyVotes),

partySeats,

leaders:leaders.sort((a,b)=>b.margin-a.margin).slice(0,5),

battles:battles.sort((a,b)=>a.margin-b.margin).slice(0,5)

})

}catch(e){

console.error(e)
return NextResponse.json({ error:"Server error" },{ status:500 })

}

}