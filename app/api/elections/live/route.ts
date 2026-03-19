import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

//////////////////////////////////////////////////////
// ACTIVE ELECTION
//////////////////////////////////////////////////////

const election = await prisma.election.findFirst({
where:{ isActive:true }
})

if(!election){

return NextResponse.json({
results:[]
})

}

//////////////////////////////////////////////////////
// GET ALL RESULTS FOR ELECTION
//////////////////////////////////////////////////////

const results = await prisma.electionResult.findMany({

where:{
electionId:election.id
},

include:{
candidate:{
include:{
party:true
}
},
seat:{
include:{
region:true,
ward:true,
constituency:true
}
}
}

})

//////////////////////////////////////////////////////
// CALCULATE SEAT WINNERS
//////////////////////////////////////////////////////

const seatWinners:any = {}

results.forEach((r:any)=>{

const seat = r.seatId

if(!seatWinners[seat]){
seatWinners[seat] = r
return
}

if(r.votes > seatWinners[seat].votes){
seatWinners[seat] = r
}

})

//////////////////////////////////////////////////////
// RESPONSE
//////////////////////////////////////////////////////

return NextResponse.json({

results:Object.values(seatWinners),

updatedAt:new Date()

})

}