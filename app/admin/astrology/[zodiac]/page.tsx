import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PostStatus } from "@prisma/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

/* ================= ZODIAC ================= */

const zodiacList = [
"aries","taurus","gemini","cancer","leo","virgo",
"libra","scorpio","sagittarius","capricorn","aquarius","pisces"
]

const nepaliNames:any = {
aries:"मेष",
taurus:"वृष",
gemini:"मिथुन",
cancer:"कर्कट",
leo:"सिंह",
virgo:"कन्या",
libra:"तुला",
scorpio:"वृश्चिक",
sagittarius:"धनु",
capricorn:"मकर",
aquarius:"कुम्भ",
pisces:"मीन"
}

/* ================= PAGE ================= */

export default async function ZodiacEditor({
params,
}:{
params:{ zodiac:string }
}){

const zodiac = params.zodiac?.toLowerCase()

/* INVALID ZODIAC */

if(!zodiac || !zodiacList.includes(zodiac)){
return <div>Invalid Zodiac Sign</div>
}

/* TODAY RANGE */

const today = new Date()
today.setHours(0,0,0,0)

const tomorrow = new Date(today)
tomorrow.setDate(today.getDate()+1)

/* ================= CHECK EXISTING ================= */

const existing = await prisma.article.findFirst({
where:{
isAstrology:true,
zodiacSign:zodiac,
horoscopeDate:{
gte:today,
lt:tomorrow
},
isDeleted:false
}
})

/* IF EXISTS → EDIT */

if(existing){
redirect(`/admin/astrology/edit/${existing.id}`)
}

/* ================= CREATE NEW ================= */

const dateString = today.toISOString().split("T")[0]

const title = `${nepaliNames[zodiac]} राशिफल — ${dateString}`

/* SAFE SLUG */

const slug = `${zodiac}-${dateString}`

/* CREATE ARTICLE */

const newArticle = await prisma.article.create({

data:{
title,
slug,
content:"",
images:[],
excerpt:"",
isAstrology:true,
zodiacSign:zodiac,
horoscopeDate:today,

status:PostStatus.draft,

metaTitle:title,
metaDescription:`${title} आजको राशिफल`
}

})

/* REDIRECT */

redirect(`/admin/astrology/edit/${newArticle.id}`)

}
