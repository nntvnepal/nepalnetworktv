import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request){

try{

const body = await req.json()

const { pollId } = body

if(!pollId){
return NextResponse.json(
{error:"Poll ID missing"},
{status:400}
)
}

/* deactivate all polls */

await prisma.poll.updateMany({
data:{isActive:false}
})

/* activate selected poll */

await prisma.poll.update({
where:{id:pollId},
data:{isActive:true}
})

return NextResponse.json({success:true})

}catch(err){

console.error("Activate Poll Error:",err)

return NextResponse.json(
{error:"Server error"},
{status:500}
)

}

}