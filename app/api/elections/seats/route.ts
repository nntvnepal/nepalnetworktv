import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {

try {

const { searchParams } = new URL(req.url)

const regionId = searchParams.get("regionId")
const position = searchParams.get("position")

const where: any = {}

if (regionId) {
where.regionId = regionId
}

if (position) {
where.position = position
}

const seats = await prisma.seat.findMany({

where,

include:{
region:true
},

orderBy:{
name:"asc"
}

})

return NextResponse.json(seats)

} catch (error) {

console.error("SEAT API ERROR:", error)

return NextResponse.json(
{
success:false,
message:"Seat fetch failed"
},
{ status:500 }
)

}

}