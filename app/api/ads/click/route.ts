import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

try{

const { id } = await req.json()

if(!id){
return NextResponse.json({success:false})
}

await prisma.ad.update({
where:{id},
data:{
clicks:{increment:1}
}
})

return NextResponse.json({success:true})

}catch(e){

console.error("Ad click tracking error",e)

return NextResponse.json({success:false})

}

}