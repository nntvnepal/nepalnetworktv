import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request){

const data = await req.json()

if(!data.headline){
return NextResponse.json({error:"headline required"})
}

let expireAt = null

if(data.expireMinutes){
expireAt = new Date(Date.now() + Number(data.expireMinutes)*60000)
}

const breaking = await prisma.breakingNews.create({
data:{
headline:data.headline,
priority:Number(data.priority)||1,
isActive:true,
expireAt
}
})

return NextResponse.json(breaking)

}