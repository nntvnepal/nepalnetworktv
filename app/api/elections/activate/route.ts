import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

try{

const { id } = await req.json()

if(!id){
return NextResponse.json(
{ error:"Election id required" },
{ status:400 }
)
}

// deactivate all elections
await prisma.election.updateMany({
data:{ isActive:false }
})

// activate selected election
const election = await prisma.election.update({
where:{ id },
data:{ isActive:true }
})

return NextResponse.json({
success:true,
election
})

}catch(err){

console.error("Election activation error:",err)

return NextResponse.json(
{ error:"Activation failed" },
{ status:500 }
)

}

}