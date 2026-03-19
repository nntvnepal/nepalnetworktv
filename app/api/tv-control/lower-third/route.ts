import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

//////////////////////////////////////////////////
// GET LOWER THIRD
//////////////////////////////////////////////////

export async function GET(){

const data = await prisma.lowerThird.findMany({
orderBy:{ createdAt:"desc" }
})

return NextResponse.json(data)

}

//////////////////////////////////////////////////
// CREATE LOWER THIRD
//////////////////////////////////////////////////

export async function POST(req:Request){

const body = await req.json()

const item = await prisma.lowerThird.create({
data:{
title:body.title,
subtitle:body.subtitle || ""
}
})

return NextResponse.json(item)

}

//////////////////////////////////////////////////
// ACTIVATE LOWER THIRD
//////////////////////////////////////////////////

export async function PUT(req:Request){

const body = await req.json()

await prisma.lowerThird.updateMany({
data:{ isActive:false }
})

const active = await prisma.lowerThird.update({
where:{ id:body.id },
data:{ isActive:true }
})

return NextResponse.json(active)

}

//////////////////////////////////////////////////
// DELETE
//////////////////////////////////////////////////

export async function DELETE(req:Request){

const body = await req.json()

await prisma.lowerThird.delete({
where:{ id:body.id }
})

return NextResponse.json({success:true})

}