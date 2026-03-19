"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createGeography(formData: FormData){

const name = String(formData.get("name") || "")
const type = String(formData.get("type") || "")

const provinceId = String(formData.get("provinceId") || "")
const districtId = String(formData.get("districtId") || "")
const municipalityId = String(formData.get("municipalityId") || "")

const wardNumber = Number(formData.get("wardNumber") || 0)

//////////////////////////////////////////////////////
// WARD CREATE
//////////////////////////////////////////////////////

if(type === "WARD"){

if(!municipalityId){
throw new Error("Municipality required for ward")
}

if(!wardNumber){
throw new Error("Ward number required")
}

const exists = await prisma.ward.findFirst({
where:{
municipalityId,
number: wardNumber
}
})

if(exists){
throw new Error("Ward already exists")
}

await prisma.ward.create({
data:{
number: wardNumber,
municipalityId
}
})

redirect("/admin/elections/geography")

}

//////////////////////////////////////////////////////
// REGION CREATE
//////////////////////////////////////////////////////

let parentId: string | null = null

// DISTRICT → parent PROVINCE

if(type === "DISTRICT"){

if(!provinceId){
throw new Error("Province required for district")
}

parentId = provinceId

}

// MUNICIPALITIES → parent DISTRICT

if(
type === "METRO" ||
type === "SUB_METRO" ||
type === "MUNICIPALITY" ||
type === "RURAL_MUNICIPALITY"
){

if(!districtId){
throw new Error("District required")
}

parentId = districtId

}

await prisma.region.create({

data:{
name,
type: type as any,
parentId
}

})

redirect("/admin/elections/geography")

}