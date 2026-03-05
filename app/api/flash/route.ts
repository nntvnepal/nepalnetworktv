import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { PostStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(){

try{

const flash = await prisma.article.findMany({

where:{
status:PostStatus.approved,
isDeleted:false,
flash:true
},

orderBy:{
createdAt:"desc"
},

take:8,

include:{
category:true
}

})

return NextResponse.json({
success:true,
articles:flash
})

}catch(error){

console.error("FLASH API ERROR:",error)

return NextResponse.json(
{success:false,error:"Failed to fetch flash news"},
{status:500}
)

}

}