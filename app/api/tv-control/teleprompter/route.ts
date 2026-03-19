import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

//////////////////////////////////////////////////
// GET SCRIPTS
//////////////////////////////////////////////////

export async function GET(){

const scripts = await prisma.teleprompterScript.findMany({
orderBy:{ createdAt:"desc" }
})

return NextResponse.json(scripts)

}

//////////////////////////////////////////////////
// CREATE SCRIPT
//////////////////////////////////////////////////

export async function POST(req:Request){

const body = await req.json()

const script = await prisma.teleprompterScript.create({
data:{
title:body.title,
content:body.content
}
})

return NextResponse.json(script)

}

//////////////////////////////////////////////////
// DELETE SCRIPT
//////////////////////////////////////////////////

export async function DELETE(req:Request){

const body = await req.json()

await prisma.teleprompterScript.delete({
where:{ id:body.id }
})

return NextResponse.json({success:true})

}