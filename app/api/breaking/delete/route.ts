import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const {searchParams} = new URL(req.url)

const id = searchParams.get("id")

if(!id){
return NextResponse.json({error:"id required"})
}

await prisma.breakingNews.delete({
where:{id}
})

return NextResponse.redirect(new URL("/admin/breaking",req.url))

}