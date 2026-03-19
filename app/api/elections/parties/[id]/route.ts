import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
req:Request,
{params}:any
){

const data = await req.formData()

if(data.get("name")){

await prisma.party.update({

where:{ id: params.id },

data:{
name: data.get("name") as string,
code: data.get("code") as string,
logo: data.get("logo") as string,
color: data.get("color") as string
}

})

}else{

await prisma.party.delete({
where:{ id: params.id }
})

}

return NextResponse.redirect("/admin/election/parties")
}