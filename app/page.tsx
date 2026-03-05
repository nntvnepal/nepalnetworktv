import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Home(){

let articles:any[]=[]
let flash:any[]=[]
let editorial:any[]=[]
let horoscope:any[]=[]

try{

articles = await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
isEditorial:false,
isAstrology:false
},
include:{category:true},
orderBy:{createdAt:"desc"},
take:20
})

flash = await prisma.article.findMany({
where:{
flash:true,
status:"approved",
isDeleted:false
},
orderBy:{flashPriority:"desc"},
take:5
})

editorial = await prisma.article.findMany({
where:{
isEditorial:true,
status:"approved",
isDeleted:false
},
orderBy:{createdAt:"desc"},
take:4
})

horoscope = await prisma.article.findMany({
where:{
isAstrology:true,
status:"approved",
isDeleted:false
},
take:12
})

}catch(e){
console.log(e)
}

const hero = articles[0]
const featured = articles.slice(1,5)
const latest = articles.slice(5,15)

return(

<main className="max-w-7xl mx-auto px-4 pt-8">

{/* FLASH NEWS */}

{flash.length>0 &&(

<div className="bg-red-600 text-white p-2 mb-6">

<div className="flex gap-6 overflow-x-auto whitespace-nowrap">

{flash.map((f)=>(
<Link key={f.id} href={`/${f.slug}`}>
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

<Link href={`/${hero.slug}`}>

<h1 className="text-4xl font-bold mb-4">
{hero.title}
</h1>

</Link>

{hero.images?.[0] &&(

<Image
src={hero.images[0]}
alt={hero.title}
width={1200}
height={600}
/>

)}

</section>

)}

{/* FEATURE GRID */}

<section className="grid md:grid-cols-4 gap-6 mb-12">

{featured.map((a)=>(
<div key={a.id}>

<Link href={`/${a.slug}`}>

{a.images?.[0] &&(

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

</div>
))}

</section>

{/* LATEST NEWS */}

<section className="mb-12">

<h2 className="text-2xl font-bold mb-6">
Latest News
</h2>

<div className="grid md:grid-cols-2 gap-6">

{latest.map((a)=>(
<div key={a.id}>

<Link href={`/${a.slug}`}>

<h3 className="text-lg font-semibold">
{a.title}
</h3>

</Link>

</div>
))}

</div>

</section>

{/* EDITORIAL */}

{editorial.length>0 &&(

<section className="mb-12">

<h2 className="text-2xl font-bold mb-6">
Editorial
</h2>

<div className="grid md:grid-cols-2 gap-6">

{editorial.map((e)=>(
<div key={e.id}>

<Link href={`/editorial/${e.slug}`}>
{e.title}
</Link>

</div>
))}

</div>

</section>

)}

{/* HOROSCOPE */}

{horoscope.length>0 &&(

<section className="mb-20">

<h2 className="text-2xl font-bold mb-6">
Daily Horoscope
</h2>

<div className="grid grid-cols-3 md:grid-cols-6 gap-4">

{horoscope.map((h)=>(
<div key={h.id} className="border p-3 text-center">

<Link href={`/astrology/${h.slug}`}>
{h.zodiacSign}
</Link>

</div>
))}

</div>

</section>

)}

</main>

)

}