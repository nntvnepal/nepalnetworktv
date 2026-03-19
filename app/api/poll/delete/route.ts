import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const {pollId} = await req.json()

await prisma.poll.delete({
where:{id:pollId}
})

return NextResponse.json({success:true})

}