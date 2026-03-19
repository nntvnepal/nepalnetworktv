import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

const provinces = await prisma.region.findMany({
  where:{ type:"PROVINCE" },
  orderBy:{ name:"asc" }
})

const districts = await prisma.region.findMany({
  where:{ type:"DISTRICT" },
  orderBy:{ name:"asc" }
})

const municipalities = await prisma.region.findMany({
  where:{
    type:{
      in:["METRO","SUB_METRO","MUNICIPALITY","RURAL_MUNICIPALITY"]
    }
  },
  orderBy:{ name:"asc" }
})

return NextResponse.json({
  provinces,
  districts,
  municipalities
})

}