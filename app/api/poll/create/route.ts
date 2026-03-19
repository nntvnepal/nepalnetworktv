import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const body = await req.json()

const {question,options} = body

const poll = await prisma.poll.create({

data:{
question,

options:{
create:options.map((o:string)=>({
text:o
}))
}

}

})

return NextResponse.json(poll)

}