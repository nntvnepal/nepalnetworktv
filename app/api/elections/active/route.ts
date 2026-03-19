import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const election = await prisma.election.findFirst({
where:{ isActive:true }
})

return NextResponse.json(election)

}