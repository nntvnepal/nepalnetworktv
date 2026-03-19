import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
 req: Request,
 { params }: { params: { seatId: string } }
){

try{

const seatId = params?.seatId

if(!seatId){

return NextResponse.json(
{ error:"Seat ID missing" },
{ status:400 }
)

}

const seat = await prisma.seat.findUnique({

where:{ id: seatId },

include:{
region:true,

candidates:{
include:{
party:true,
results:true
},
orderBy:{
name:"asc"
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

return NextResponse.json(seat)

}catch(err){

console.error("Seat API Error:",err)

return NextResponse.json(
{ error:"Failed to fetch seat" },
{ status:500 }
)

}

}