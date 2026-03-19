import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

//////////////////////////////////////////////////////
// GET CANDIDATE
//////////////////////////////////////////////////////

export async function GET(
req:Request,
{params}:{params:{id:string}}
){

const candidate = await prisma.candidate.findUnique({
where:{id:params.id}
})

return NextResponse.json(candidate)

}

//////////////////////////////////////////////////////
// UPDATE CANDIDATE
//////////////////////////////////////////////////////

export async function PUT(
req:Request,
{params}:{params:{id:string}}
){

const body = await req.json()

const candidate = await prisma.candidate.update({

where:{id:params.id},

data:{
name:body.name,
photo:body.photo,
gender:body.gender,
dob: body.dob ? new Date(body.dob) : null,
partyId:body.partyId,
seatId:body.seatId
}

})

return NextResponse.json(candidate)

}

//////////////////////////////////////////////////////
// DELETE CANDIDATE
//////////////////////////////////////////////////////

export async function POST(
req:Request,
{params}:{params:{id:string}}
){

await prisma.candidate.delete({
where:{id:params.id}
})

return NextResponse.redirect(
new URL("/admin/elections/candidates", req.url)
)

}