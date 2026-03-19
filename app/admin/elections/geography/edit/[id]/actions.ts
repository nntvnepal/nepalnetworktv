"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateGeography(formData: FormData){

const id = String(formData.get("id") || "")
const name = String(formData.get("name") || "")
const type = String(formData.get("type") || "")

const provinceId = formData.get("provinceId")
const districtId = formData.get("districtId")

let parentId: string | null = null

//////////////////////////////////////////////////////
// SET PARENT
//////////////////////////////////////////////////////

if(type === "DISTRICT"){

parentId = provinceId ? String(provinceId) : null

}

if(
type === "METRO" ||
type === "SUB_METRO" ||
type === "MUNICIPALITY" ||
type === "RURAL_MUNICIPALITY"
){

parentId = districtId ? String(districtId) : null

}

//////////////////////////////////////////////////////
// UPDATE REGION
//////////////////////////////////////////////////////

await prisma.region.update({

where:{ id },

data:{
name,
type: type as any,
parentId
}

})

//////////////////////////////////////////////////////
// REFRESH UI
//////////////////////////////////////////////////////

revalidatePath("/admin/elections/geography")

redirect("/admin/elections/geography")

}