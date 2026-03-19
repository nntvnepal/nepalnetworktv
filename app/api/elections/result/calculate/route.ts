import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(){

try{

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
// GET ALL SEATS
//////////////////////////////////////////////////////

const seats = await prisma.seat.findMany({

include:{
results:{
where:{ electionId:election.id },
include:{
candidate:true
}
}
}

})

//////////////////////////////////////////////////////
// CALCULATE RESULT
//////////////////////////////////////////////////////

for(const seat of seats){

const results = seat.results

if(results.length === 0) continue

//////////////////////////////////////////////////////
// TOTAL VOTES
//////////////////////////////////////////////////////

const totalVotes = results.reduce(
(sum,r)=>sum + r.votes,
0
)

//////////////////////////////////////////////////////
// SORT
//////////////////////////////////////////////////////

const sorted = results.sort(
(a,b)=>b.votes - a.votes
)

//////////////////////////////////////////////////////
// UPDATE
//////////////////////////////////////////////////////

for(let i=0;i<sorted.length;i++){

const r = sorted[i]

const percent = totalVotes
? (r.votes / totalVotes) * 100
: 0

await prisma.electionResult.update({

where:{ id:r.id },

data:{

rank:i+1,
votePercent:percent,
isLeader:i===0,
isWinner:i===0

}

})

}

}

return NextResponse.json({
success:true
})

}catch(err){

console.error(err)

return NextResponse.json(
{ error:"Calculation failed" },
{ status:500 }
)

}

}