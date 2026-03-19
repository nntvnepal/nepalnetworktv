import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const {optionId,pollId} = await req.json()

const ip = req.headers.get("x-forwarded-for") || "unknown"

/* check existing vote */

const existing = await prisma.pollVote.findFirst({
where:{
pollId,
ip
}
})

if(existing){

return NextResponse.json({
error:"You already voted"
},{status:400})

}

/* save vote */

await prisma.pollVote.create({

data:{
pollId,
optionId,
ip
}

})

/* increment votes */

await prisma.pollOption.update({

where:{id:optionId},

data:{
votes:{increment:1}
}

})

return NextResponse.json({success:true})

}