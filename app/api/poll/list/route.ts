import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const sevenDaysAgo = new Date(
Date.now() - 7*24*60*60*1000
)

const polls = await prisma.poll.findMany({

where:{
createdAt:{
gte: sevenDaysAgo
}
},

include:{options:true},

orderBy:{
createdAt:"desc"
}

})

return NextResponse.json(polls)

}