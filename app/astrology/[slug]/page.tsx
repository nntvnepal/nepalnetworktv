import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdRenderer from "@/components/ads/AdRenderer";

export const dynamic = "force-dynamic";

/* ================= ZODIAC DATA ================= */

const zodiac = [
["Aries","मेष","aries"],
["Taurus","वृष","taurus"],
["Gemini","मिथुन","gemini"],
["Cancer","कर्क","cancer"],
["Leo","सिंह","leo"],
["Virgo","कन्या","virgo"],
["Libra","तुला","libra"],
["Scorpio","वृश्चिक","scorpio"],
["Sagittarius","धनु","sagittarius"],
["Capricorn","मकर","capricorn"],
["Aquarius","कुम्भ","aquarius"],
["Pisces","मीन","pisces"]
];

const zodiacNames:any = {
aries:"मेष",
taurus:"वृष",
gemini:"मिथुन",
cancer:"कर्क",
leo:"सिंह",
virgo:"कन्या",
libra:"तुला",
scorpio:"वृश्चिक",
sagittarius:"धनु",
capricorn:"मकर",
aquarius:"कुम्भ",
pisces:"मीन"
};

export default async function Page({params}:{params:{slug:string}}){

/* ================= FETCH ARTICLE ================= */

const article = await prisma.article.findFirst({

where:{
slug: params.slug,
isAstrology:true,
isDeleted:false
},

orderBy:{
publishedAt:"desc"
}

})

if(!article) notFound()

/* ================= HEADER DATA ================= */

const zodiacName = zodiacNames[article.zodiacSign] || ""

const date = article.horoscopeDate
? new Date(article.horoscopeDate).toLocaleDateString("ne-NP",{
year:"numeric",
month:"long",
day:"numeric"
})
: ""

/* ================= CONTENT PARSER ================= */

const lines = (article.content || "").split("\n").filter(Boolean)

let luckyColor=""
let luckyNumber=""
let luckyDirection=""
let luckyTime=""

const sections:any=[]
let current:any=null

lines.forEach(line=>{

if(line.includes("शुभ रंग")){
luckyColor=line.replace(/⭐?\s*शुभ रंग\s*:/,"").trim()
return
}

if(line.includes("शुभ अंक")){
luckyNumber=line.replace(/🍀?\s*शुभ अंक\s*:/,"").trim()
return
}

if(line.includes("शुभ दिशा")){
luckyDirection=line.replace(/🧭?\s*शुभ दिशा\s*:/,"").trim()
return
}

if(line.includes("शुभ समय")){
luckyTime=line.replace(/⏰?\s*शुभ समय\s*:/,"").trim()
return
}

if(
line.startsWith("⭐")||
line.startsWith("💼")||
line.startsWith("💰")||
line.startsWith("❤️")||
line.startsWith("🩺")
){

if(current) sections.push(current)

current={
title:line,
content:""
}

}else{

if(current){
current.content+=line+" "
}

}

})

if(current) sections.push(current)

const hasSections=sections.length>0

/* ================= PAGE ================= */

return(

<div className="max-w-6xl mx-auto px-6 pt-12 pb-24 grid md:grid-cols-3 gap-12">

{/* ================= LEFT CONTENT ================= */}

<div className="md:col-span-2">

<div className="text-center mb-12">

<div className="w-28 h-28 mx-auto rounded-full
bg-gradient-to-br from-[#6b1d7c] to-[#3a0a44]
flex items-center justify-center shadow-xl">

<img
src={`/zodiac/${article.zodiacSign}.png`}
className="w-14 brightness-0 invert"
/>

</div>

<h1 className="text-4xl font-serif text-[#0b2a6f] mt-6">
{zodiacName} राशिफल
</h1>

<p className="text-gray-500 mt-2">
{date}
</p>

</div>

{/* ===== AD AFTER TITLE ===== */}

<div className="flex justify-center mb-10">
<AdRenderer placement="article_after_hero"/>
</div>

<div className="space-y-6">

{hasSections && sections.map((s:any,i:number)=>(

<div
key={i}
className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
>

<h3 className="font-semibold text-lg mb-3">
{s.title}
</h3>

<p className="text-gray-700 leading-relaxed">
{s.content}
</p>

{/* ===== MID CONTENT AD ===== */}

{i===1 && (
<div className="flex justify-center my-6">
<AdRenderer placement="article_mid"/>
</div>
)}

</div>

))}

{!hasSections && (

<div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">

<p className="text-gray-700 whitespace-pre-line">
{article.content}
</p>

</div>

)}

</div>

{/* ===== BOTTOM AD ===== */}

<div className="flex justify-center mt-10">
<AdRenderer placement="article_bottom"/>
</div>

</div>

{/* ================= SIDEBAR ================= */}

<div>

{/* ===== SIDEBAR AD ===== */}

<div className="mb-8 flex justify-center">
<AdRenderer placement="article_sidebar_top"/>
</div>

{/* ZODIAC NAVIGATION */}

<div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">

<h3 className="font-semibold text-lg mb-6 text-center">
आजका राशिहरू
</h3>

<div className="grid grid-cols-3 gap-4">

{zodiac.map(([eng,nep,icon]:any,i)=>(

<Link
key={i}
href={`/astrology/${icon}`}
className="text-center group"
>

<div className="w-12 h-12 mx-auto rounded-full
bg-purple-200 flex items-center justify-center
group-hover:scale-110 transition">

<img
src={`/zodiac/${icon}.png`}
className="w-6 opacity-80"
/>

</div>

<p className="text-xs mt-1 text-gray-600">
{nep}
</p>

</Link>

))}

</div>

</div>

{/* ================= LUCKY SECTION ================= */}

<div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">

<h3 className="font-semibold text-lg mb-4">
🍀 आजको भाग्य संकेत
</h3>

<div className="grid grid-cols-2 gap-3 text-center text-sm">

<div className="bg-purple-50 p-3 rounded">
🎨
<p>शुभ रंग</p>
<b>{luckyColor || "—"}</b>
</div>

<div className="bg-purple-50 p-3 rounded">
🔢
<p>शुभ अंक</p>
<b>{luckyNumber || "—"}</b>
</div>

<div className="bg-purple-50 p-3 rounded">
🧭
<p>शुभ दिशा</p>
<b>{luckyDirection || "—"}</b>
</div>

<div className="bg-purple-50 p-3 rounded">
⏰
<p>शुभ समय</p>
<b>{luckyTime || "—"}</b>
</div>

</div>

</div>

</div>

</div>

)
}