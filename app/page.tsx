import { prisma } from "@/lib/prisma"
import { PostStatus } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

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

{/* FLASH NEWS */}

{flash.length>0 &&(

<div className="bg-red-600 text-white p-2 mb-8">

<div className="flex gap-6 overflow-x-auto whitespace-nowrap">

{flash.map(f=>(

<Link key={f.id} href={url(f)}>

<span className="font-semibold">
⚡ {f.title}
</span>

</Link>

))}

</div>

</div>

)}

{/* TOP AD PLACEHOLDER */}

<div className="border border-dashed h-[90px] flex items-center justify-center text-gray-400 mb-10">
TOP AD 970x90
</div>

{/* HERO */}

{hero &&(

<section className="mb-12">

<Link href={url(hero)}>

<h1 className="text-5xl font-bold mb-6 leading-tight">
{hero.title}
</h1>

</Link>

{hero?.images?.[0] &&(

<Image
src={hero.images[0]}
alt={hero.title}
width={1200}
height={600}
className="mb-6"
/>

)}

</section>

)}

{/* FEATURE GRID */}

<section className="grid md:grid-cols-4 gap-6 mb-12">

{feature.map(a=>(

<Link key={a.id} href={url(a)}>

{a?.images?.[0] &&(

<Image
src={a.images[0]}
alt={a.title}
width={400}
height={250}
/>

)}

<h3 className="font-semibold mt-3 leading-snug">
{a.title}
</h3>

</Link>

))}

</section>

{/* MID AD */}

<div className="border border-dashed h-[90px] flex items-center justify-center text-gray-400 mb-10">
MID AD 970x90
</div>

{/* LATEST + SIDEBAR */}

<section className="grid lg:grid-cols-3 gap-10">

<div className="lg:col-span-2">

<h2 className="text-2xl font-bold mb-6">
Latest News
</h2>

<div className="space-y-6">

{latest.map(a=>(

<div key={a.id} className="border-b pb-4">

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

<h2 className="text-xl font-bold mb-6">
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

<CategoryBlock title="Politics" articles={politics} />
<CategoryBlock title="Defence" articles={defence} />
<CategoryBlock title="Technology" articles={technology} />

{/* EDITORIAL */}

<section className="mt-16">

<h2 className="text-2xl font-bold mb-6">
Editorial
</h2>

<div className="grid md:grid-cols-3 gap-6">

{editorials.map(e=>(

<Link key={e.id} href={`/editorial/${e.slug}`}>

<h3 className="font-semibold">
{e.title}
</h3>

</Link>

))}

</div>

</section>

{/* HOROSCOPE */}

<section className="mt-16">

<h2 className="text-2xl font-bold mb-6">
Daily Horoscope
</h2>

<div className="grid grid-cols-3 md:grid-cols-6 gap-4">

{horoscope.map(h=>(

<Link key={h.id} href={`/astrology/${h.slug}`}>

<div className="border p-4 text-center">

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

<h2 className="text-2xl font-bold mb-6">
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