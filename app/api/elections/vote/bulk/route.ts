import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const election = await prisma.election.findFirst({
where:{ isActive:true }
})

if(!election){
return NextResponse.json([])
}

const candidates = await prisma.candidate.findMany({

where:{
electionId:election.id
},

include:{
seat:true,
party:true,
results:{
where:{ electionId:election.id }
}
}

})

const rows = candidates.map(c=>({

candidateId:c.id,
seatId:c.seatId,
seat:c.seat?.name,
candidate:c.name,
party:c.party?.name || "",
votes:c.results?.[0]?.votes || 0

}))

return NextResponse.json(rows)

}