import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { seatId: string } }
){

try{

const seatId = params.seatId

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
// SEAT + CANDIDATES + RESULTS
//////////////////////////////////////////////////////

const seat = await prisma.seat.findUnique({

where:{ id:seatId },

include:{

region:true,

ward:true,

candidates:{

where:{
electionId:election.id
},

include:{

party:true,

results:{
where:{
electionId:election.id
}
}

}

}

}

})

if(!seat){

return NextResponse.json(
{ error:"Seat not found" },
{ status:404 }
)

}

//////////////////////////////////////////////////////
// RESPONSE
//////////////////////////////////////////////////////

return NextResponse.json(seat)

}catch(err){

console.error("Seat vote load error",err)

return NextResponse.json(
{ error:"Server error" },
{ status:500 }
)

}

}