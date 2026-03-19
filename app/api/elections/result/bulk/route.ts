import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { calculateSeatResults } from "@/lib/election/calculateResults"

export async function POST(req: Request){

try{

const body = await req.json()
const { rows } = body

//////////////////////////////////////////////////////
// ACTIVE ELECTION
//////////////////////////////////////////////////////

const election = await prisma.election.findFirst({
where:{ isActive:true }
})

if(!election){

return NextResponse.json(
{ error:"No active election" },
{ status:400 }
)

}

//////////////////////////////////////////////////////
// TRACK UPDATED SEATS
//////////////////////////////////////////////////////

const seatSet = new Set<string>()

//////////////////////////////////////////////////////
// SAVE VOTES
//////////////////////////////////////////////////////

for(const row of rows){

const seatId = row.seatId
const candidateId = row.candidateId
const votes = Number(row.votes) || 0
const partyId = row.partyId || null

seatSet.add(seatId)

await prisma.electionResult.upsert({

where:{
electionId_seatId_candidateId:{
electionId:election.id,
seatId,
candidateId
}
},

update:{
votes
},

create:{
electionId:election.id,
seatId,
candidateId,
partyId,
votes
}

})

}

//////////////////////////////////////////////////////
// RECALCULATE EACH SEAT
//////////////////////////////////////////////////////

for(const seatId of seatSet){

await calculateSeatResults(election.id,seatId)

}

return NextResponse.json({
success:true
})

}catch(err){

console.error(err)

return NextResponse.json(
{ error:"Bulk save failed" },
{ status:500 }
)

}

}