import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

//////////////////////////////////////////////////////
// GET ALL PARTIES
//////////////////////////////////////////////////////

export async function GET() {

try {

const parties = await prisma.party.findMany({

orderBy:{
priority:"asc"
}

})

return NextResponse.json(parties)

}

catch(error){

console.error("PARTY API ERROR:",error)

return NextResponse.json(
{ error:"Failed to load parties" },
{ status:500 }
)

}

}

//////////////////////////////////////////////////////
// CREATE PARTY
//////////////////////////////////////////////////////

export async function POST(req:Request){

try{

const body = await req.json()

const party = await prisma.party.create({

data:{
name:body.name,
code:body.code,
color:body.color,
logo:body.logo,
priority:body.priority || 0,
isActive:true
}

})

return NextResponse.json(party)

}

catch(error){

console.error("PARTY CREATE ERROR:",error)

return NextResponse.json(
{ error:"Failed to create party" },
{ status:500 }
)

}

}