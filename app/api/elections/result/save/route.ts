import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { calculateSeatResults } from "@/lib/election/calculateResults"

export async function POST(req:Request){

try{

const body = await req.json()

const { seatId, votes } = body

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
// SAVE EACH CANDIDATE VOTE
//////////////////////////////////////////////////////

for(const candidateId in votes){

const voteCount = Number(votes[candidateId]) || 0

const candidate = await prisma.candidate.findUnique({
where:{ id:candidateId },
select:{ partyId:true }
})

await prisma.electionResult.upsert({

where:{
electionId_seatId_candidateId:{
electionId:election.id,
seatId,
candidateId
}
},

update:{
votes:voteCount
},

create:{
electionId:election.id,
seatId,
candidateId,
partyId:candidate?.partyId,
votes:voteCount
}

})

}

//////////////////////////////////////////////////////
// RUN RESULT ENGINE
//////////////////////////////////////////////////////

await calculateSeatResults(election.id,seatId)

return NextResponse.json({
success:true
})

}catch(err){

console.error(err)

return NextResponse.json(
{ error:"Vote save failed" },
{ status:500 }
)

}

}