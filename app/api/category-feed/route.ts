import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic="force-dynamic"

export async function GET(req:Request){

const {searchParams}=new URL(req.url)

const slug=searchParams.get("slug")
const skip=Number(searchParams.get("skip")||0)

if(!slug){
return NextResponse.json({success:false})
}

const category=await prisma.category.findUnique({
where:{slug}
})

if(!category){
return NextResponse.json([])
}

const articles=await prisma.article.findMany({

where:{
categoryId:category.id,
status:"approved",
isDeleted:false
},

orderBy:{
createdAt:"desc"
},

skip,
take:9,

select:{
id:true,
title:true,
slug:true,
images:true,
views:true,
likes:true
}

})

return NextResponse.json(articles)

}