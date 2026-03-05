import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request){

try{

const body = await req.json()

const { name, email, password, role } = body

if(!name || !email || !password){

return NextResponse.json(
{ success:false, message:"Missing required fields" },
{ status:400 }
)

}

const user = await prisma.user.create({
data:{
name,
email,
password,
role
}
})

return NextResponse.json({
success:true,
user
})

}catch(error){

console.error("CREATE USER ERROR:",error)

return NextResponse.json(
{ success:false, message:"Server error" },
{ status:500 }
)

}

}