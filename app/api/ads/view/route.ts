import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

try {

const body = await req.json()
const adId = body?.adId

/* VALIDATION */

if(!adId){
return NextResponse.json(
{ success:false, message:"adId missing" },
{ status:400 }
)
}

/* UPDATE VIEW COUNT */

await prisma.ad.update({
where:{ id: adId },
data:{
views:{ increment:1 }
}
})

return NextResponse.json({ success:true })

}catch(error){

console.error("Ad view API error:",error)

return NextResponse.json(
{ success:false, message:"Server error" },
{ status:500 }
)

}

}
