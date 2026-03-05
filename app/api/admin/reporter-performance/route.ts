import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(){

try{

const reporters = await prisma.user.findMany({

where:{ role:"reporter" },

include:{
articles:{
select:{
views:true
}
}
}

})

const data = reporters.map(r=>{

const totalViews = r.articles.reduce(
(sum,a)=>sum + (a.views || 0),0
)

return{

id:r.id,
name:r.name,
email:r.email,
articles:r.articles.length,
views:totalViews,

avgViews: r.articles.length
? Math.round(totalViews / r.articles.length)
:0

}

})

return NextResponse.json({
success:true,
reporters:data
})

}catch(error){

console.error("Reporter performance API error:",error)

return NextResponse.json(
{ error:"Failed to load reporter performance" },
{ status:500 }
)

}

}