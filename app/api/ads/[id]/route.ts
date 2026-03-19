import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req:Request,{params}:any){

const body = await req.json()

const ad = await prisma.ad.update({

where:{id:params.id},

data:{
title:body.title,
link:body.link,
startDate: body.startDate ? new Date(body.startDate) : null,
endDate: body.endDate ? new Date(body.endDate) : null
}

})

return NextResponse.json(ad)

}