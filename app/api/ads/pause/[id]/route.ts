import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
req: Request,
{ params }: { params: { id: string } }
){

const ad = await prisma.ad.findUnique({
where:{ id:params.id }
})

if(!ad){
return NextResponse.json({error:"Not found"})
}

const newStatus = ad.status==="active"
? "paused"
: "active"

await prisma.ad.update({

where:{ id:params.id },

data:{
status:newStatus
}

})

return NextResponse.json({success:true})

}