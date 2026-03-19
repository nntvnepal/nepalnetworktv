import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

//////////////////////////////////////////////////////
// CREATE AD
//////////////////////////////////////////////////////

export async function POST(req:Request){

try{

const body = await req.json()

const {
title,
placement,
type,
imageUrl,
link,
adsenseCode,
priority,
startDate,
endDate
} = body

//////////////////////////////////////////////////////
// VALIDATION
//////////////////////////////////////////////////////

if(!title || !placement || !type){

return NextResponse.json(
{success:false,error:"Missing required fields"},
{status:400}
)

}

if(type==="image" && !imageUrl){

return NextResponse.json(
{success:false,error:"Image URL required for image ads"},
{status:400}
)

}

if(type==="adsense" && !adsenseCode){

return NextResponse.json(
{success:false,error:"Adsense code required"},
{status:400}
)

}

//////////////////////////////////////////////////////
// CREATE AD
//////////////////////////////////////////////////////

const ad = await prisma.ad.create({

data:{

title,
placement,
type,

imageUrl: imageUrl || null,
link: link || null,
adsenseCode: adsenseCode || null,

priority: priority ?? 1,

status:"active",

startDate: startDate ? new Date(startDate) : null,
endDate: endDate ? new Date(endDate) : null

}

})

return NextResponse.json({
success:true,
ad
})

}catch(err){

console.error("Ad create error:",err)

return NextResponse.json(
{success:false,error:"Ad creation failed"},
{status:500}
)

}

}

//////////////////////////////////////////////////////
// GET ADS
//////////////////////////////////////////////////////

export async function GET(){

try{

const now = new Date()

const ads = await prisma.ad.findMany({

where:{
status:"active",

OR:[
{startDate:null},
{startDate:{lte:now}}
],

AND:[
{
OR:[
{endDate:null},
{endDate:{gte:now}}
]
}
]

},

orderBy:{
priority:"asc"
}

})

return NextResponse.json({
success:true,
ads
})

}catch(err){

console.error("Ad fetch error:",err)

return NextResponse.json(
{success:false,error:"Failed to fetch ads"},
{status:500}
)

}

}