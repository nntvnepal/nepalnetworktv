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
take:20
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

{/* HERO */}

{hero &&(

<section className="mb-10">

<Link href={url(hero)}>

<h1 className="text-5xl font-bold mb-4">
{hero.title}
</h1>

</Link>

{hero?.images?.[0] &&(

<Image
src={hero.images[0]}
alt={hero.title}
width={1000}
height={500}
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

<h3 className="font-semibold mt-2">
{a.title}
</h3>

</Link>

))}

</section>

{/* LATEST + SIDEBAR */}

<section className="grid lg:grid-cols-3 gap-10">

<div className="lg:col-span-2">

<h2 className="text-2xl font-bold mb-6">
Latest News
</h2>

<div className="space-y-6">

{latest.map(a=>(

<div key={a.id}>

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

<div className="space-y-4">

{editorials.map(e=>(

<Link key={e.id} href={`/editorial/${e.slug}`}>

<p className="hover:text-blue-700">
{e.title}
</p>

</Link>

))}

</div>

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

</main>

)

}