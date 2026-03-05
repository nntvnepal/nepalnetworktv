import { prisma } from "@/lib/prisma"
import { PostStatus } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
title: "Nation Path – Breaking News, Editorial & Analysis",
description:
"Latest breaking news, politics, defence, world, technology and editorial insights from Nation Path.",
openGraph:{
title:"Nation Path",
description:"Independent digital newsroom delivering credible journalism."
}
}

export default async function Home(){

let articles:any[]=[]
let flash:any[]=[]
let editorials:any[]=[]
let horoscope:any[]=[]

try{

articles=await prisma.article.findMany({
where:{
status:PostStatus.approved,
isDeleted:false,
isEditorial:false,
isAstrology:false
},
include:{category:true},
orderBy:{createdAt:"desc"},
take:30
})

}catch(e){console.log(e)}

try{

flash=await prisma.article.findMany({
where:{
flash:true,
status:PostStatus.approved,
isDeleted:false
},
orderBy:{flashPriority:"desc"},
take:5
})

}catch(e){}

try{

editorials=await prisma.article.findMany({
where:{
isEditorial:true,
status:PostStatus.approved,
isDeleted:false
},
take:6
})

}catch(e){}

try{

horoscope=await prisma.article.findMany({
where:{
isAstrology:true,
status:PostStatus.approved,
isDeleted:false
},
take:12
})

}catch(e){}

const hero=articles[0]
const feature=articles.slice(1,5)
const latest=articles.slice(5,15)

const politics=articles.filter(a=>a?.category?.slug==="politics").slice(0,4)
const defence=articles.filter(a=>a?.category?.slug==="defence").slice(0,4)
const technology=articles.filter(a=>a?.category?.slug==="technology").slice(0,4)

function url(a:any){
if(!a?.category?.slug) return "#"
return `/${a.category.slug}/${a.slug}`
}

return(

<main className="max-w-7xl mx-auto px-4 pt-8">

{/* FLASH TICKER */}

{flash.length>0 &&(

<div className="bg-red-600 text-white py-2 px-3 mb-8 rounded">

<div className="flex gap-8 overflow-x-auto whitespace-nowrap text-sm font-semibold">

{flash.map(f=>(

<Link key={f.id} href={url(f)}>
⚡ {f.title}
</Link>

))}

</div>

</div>

)}

{/* TOP AD */}

<div className="border border-dashed h-[90px] flex items-center justify-center text-gray-400 mb-10">
TOP AD 970x90
</div>

{/* HERO */}

{hero &&(

<section className="mb-14">

<Link href={url(hero)}>

<h1 className="text-5xl font-bold leading-tight mb-6 hover:text-blue-800">
{hero.title}
</h1>

</Link>

{hero?.images?.[0] &&(

<Image
src={hero.images[0]}
alt={hero.title}
width={1200}
height={650}
className="rounded-lg"
/>

)}

</section>

)}

{/* FEATURE GRID */}

<section className="grid md:grid-cols-4 gap-6 mb-14">

{feature.map(a=>(

<Link key={a.id} href={url(a)} className="group">

{a?.images?.[0] &&(

<Image
src={a.images[0]}
alt={a.title}
width={400}
height={250}
className="rounded"
/>

)}

<h3 className="font-semibold mt-3 leading-snug group-hover:text-blue-700">
{a.title}
</h3>

</Link>

))}

</section>

{/* MID AD */}

<div className="border border-dashed h-[90px] flex items-center justify-center text-gray-400 mb-12">
MID AD 970x90
</div>

{/* LATEST + SIDEBAR */}

<section className="grid lg:grid-cols-3 gap-12">

<div className="lg:col-span-2">

<h2 className="text-2xl font-bold mb-6 border-b pb-2">
Latest News
</h2>

<div className="space-y-6">

{latest.map(a=>(

<div key={a.id} className="border-b pb-5">

<Link href={url(a)}>

<h3 className="text-lg font-semibold hover:text-blue-700">
{a.title}
</h3>

</Link>

</div>

))}

</div>

</div>

{/* SIDEBAR */}

<div>

<h2 className="text-xl font-bold mb-6 border-b pb-2">
Editorial
</h2>

<div className="space-y-4 mb-10">

{editorials.map(e=>(

<Link key={e.id} href={`/editorial/${e.slug}`}>

<p className="hover:text-blue-700">
{e.title}
</p>

</Link>

))}

</div>

{/* SIDEBAR AD */}

<div className="border border-dashed h-[250px] flex items-center justify-center text-gray-400">
SIDEBAR AD 300x250
</div>

</div>

</section>

{/* CATEGORY BLOCKS */}

<CategoryBlock title="Politics" articles={politics}/>
<CategoryBlock title="Defence" articles={defence}/>
<CategoryBlock title="Technology" articles={technology}/>

{/* EDITORIAL GRID */}

<section className="mt-16">

<h2 className="text-2xl font-bold mb-6 border-b pb-2">
Editorial
</h2>

<div className="grid md:grid-cols-3 gap-6">

{editorials.map(e=>(

<Link key={e.id} href={`/editorial/${e.slug}`}>

<h3 className="font-semibold hover:text-blue-700">
{e.title}
</h3>

</Link>

))}

</div>

</section>

{/* HOROSCOPE */}

<section className="mt-16">

<h2 className="text-2xl font-bold mb-6 border-b pb-2">
Daily Horoscope
</h2>

<div className="grid grid-cols-3 md:grid-cols-6 gap-4">

{horoscope.map(h=>(

<Link key={h.id} href={`/astrology/${h.slug}`}>

<div className="border rounded p-4 text-center hover:bg-gray-100">

{h.zodiacSign}

</div>

</Link>

))}

</div>

</section>

{/* BOTTOM AD */}

<div className="border border-dashed h-[90px] flex items-center justify-center text-gray-400 mt-16">
BOTTOM AD 970x90
</div>

</main>

)

}

function CategoryBlock({title,articles}:any){

if(!articles?.length) return null

return(

<section className="mt-16">

<h2 className="text-2xl font-bold mb-6 border-b pb-2">
{title}
</h2>

<div className="grid md:grid-cols-4 gap-6">

{articles.map((a:any)=>(

<Link key={a.id} href={`/${a.category?.slug}/${a.slug}`}>

<h3 className="font-semibold hover:text-blue-700">
{a.title}
</h3>

</Link>

))}

</div>

</section>

)

}