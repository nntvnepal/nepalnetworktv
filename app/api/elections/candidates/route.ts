import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

//////////////////////////////////////////////////////
// CREATE CANDIDATE
//////////////////////////////////////////////////////

export async function POST(req:Request){

try{

const body = await req.json()

// get active election

const election = await prisma.election.findFirst({
where:{ isActive:true }
})

if(!election){

return NextResponse.json(
{ error:"No active election found" },
{ status:400 }
)

}

// create candidate

const candidate = await prisma.candidate.create({

data:{

name: body.name,

photo: body.photo || null,

gender: body.gender || null,

dob: body.dob ? new Date(body.dob) : null,

partyId: body.partyId || null,

seatId: body.seatId,

electionId: election.id

}

})

return NextResponse.json(candidate)

}catch(err){

console.error("Candidate create error:",err)

return NextResponse.json(
{ error:"Candidate creation failed" },
{ status:500 }
)

}

}