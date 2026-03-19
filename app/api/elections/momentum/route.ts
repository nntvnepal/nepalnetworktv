import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const election = await prisma.election.findFirst({
where:{ isActive:true }
})

if(!election){

return NextResponse.json({ momentum:[] })

}

const results = await prisma.electionResult.findMany({

where:{
electionId:election.id
},

include:{
party:true
}

})

//////////////////////////////////////////////////////
// COUNT PARTY SEATS
//////////////////////////////////////////////////////

const partySeats:any = {}

results.forEach(r=>{

if(!r.isLeader) return

const party = r.party?.name || "Independent"

partySeats[party] = (partySeats[party] || 0) + 1

})

//////////////////////////////////////////////////////
// CONVERT
//////////////////////////////////////////////////////

const momentum = Object.entries(partySeats).map(([party,seats])=>({

party,
change: seats

}))

return NextResponse.json({

momentum

})

}