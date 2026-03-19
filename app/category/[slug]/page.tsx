import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import AdRenderer from "@/components/ads/AdRenderer"
import CategoryFeed from "@/components/category/CategoryFeed"
import type { Metadata } from "next"

export const dynamic="force-dynamic"

interface Props{
params:{slug:string}
}

/* ================= METADATA ================= */

export async function generateMetadata({params}:Props):Promise<Metadata>{

const category=await prisma.category.findUnique({
where:{slug:params.slug}
})

if(!category) return {}

const canonical=`https://www.nntvnepal.com/category/${category.slug}`

return{

title:`${category.name} News | Nepal Network Television`,
description:`Latest ${category.name} news from Nepal Network Television.`,
alternates:{canonical},

openGraph:{
title:`${category.name} News`,
url:canonical,
siteName:"Nepal Network Television",
type:"website"
}

}

}

/* ================= PAGE ================= */

export default async function CategoryPage({params}:Props){

const category=await prisma.category.findUnique({
where:{slug:params.slug}
})

if(!category) return notFound()

const articles=await prisma.article.findMany({

where:{
categoryId:category.id,
status:"approved",
isDeleted:false
},

orderBy:{createdAt:"desc"},
take:30

})

const trending=await prisma.article.findMany({

where:{
categoryId:category.id,
status:"approved",
isDeleted:false
},

orderBy:{views:"desc"},
take:5

})

const hero=articles[0]
const side=articles.slice(1,3)
const grid=articles.slice(3,9)
const quick=articles.slice(0,5)

const canonical=`https://www.nntvnepal.com/category/${category.slug}`

/* ================= SCHEMA ================= */

const schema={
"@context":"https://schema.org",
"@type":"CollectionPage",
name:category.name,
url:canonical
}

return(

<div className="max-w-7xl mx-auto px-6 py-8">

<script
type="application/ld+json"
dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}
/>

{/* BREADCRUMB */}

<div className="text-sm text-gray-500 mb-3">

<Link href="/">Home</Link>

{" > "}

{category.name}

</div>

{/* CATEGORY TITLE */}

<h1 className="text-4xl font-serif mb-6">

{category.name}

</h1>

{/* HERO + SIDE */}

{hero&&(

<div className="grid lg:grid-cols-3 gap-6 mb-10">

{/* HERO */}

<Link
href={`/${params.slug}/${hero.slug}`}
className="lg:col-span-2 group"
>

{hero.images?.[0]&&(

<div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3">

<Image
src={hero.images[0]}
alt={hero.title}
fill
className="object-cover group-hover:scale-105 transition"
/>

</div>

)}

<h2 className="text-2xl font-bold leading-snug group-hover:text-purple-700">

{hero.title}

</h2>

<div className="text-xs text-gray-500 mt-2">

👁 {hero.views} • ❤ {hero.likes}

</div>

</Link>

{/* SIDE STORIES */}

<div className="space-y-5">

{side.map(article=>(

<Link
key={article.id}
href={`/${params.slug}/${article.slug}`}
className="flex gap-4 group"
>

{article.images?.[0]&&(

<div className="relative w-28 h-20 rounded overflow-hidden">

<Image
src={article.images[0]}
alt={article.title}
fill
className="object-cover"
/>

</div>

)}

<div>

<h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-purple-700">

{article.title}

</h3>

<div className="text-xs text-gray-500 mt-1">

👁 {article.views} • ❤ {article.likes}

</div>

</div>

</Link>

))}

</div>

</div>

)}

{/* ================= MAIN HEADLINES ================= */}

{quick.length>0&&(

<div className="border rounded-xl p-5 mb-8 bg-white">

<div className="flex items-center gap-2 mb-4">

<span className="w-1 h-6 bg-yellow-500 rounded"></span>

<h3 className="font-semibold text-lg">

 मुख्य समाचार

</h3>

</div>

<div className="space-y-3">

{quick.map((item,index)=>(

<Link
key={item.id}
href={`/${params.slug}/${item.slug}`}
className="flex gap-3 border-b pb-2 last:border-none hover:text-purple-700"
>

<span className="text-purple-700 font-bold w-5">

{index+1}

</span>

<span className="text-sm leading-snug">

{item.title}

</span>

</Link>

))}

</div>

</div>

)}

{/* ================= TRENDING ================= */}

{trending.length>0&&(

<div className="border rounded-xl p-5 mb-10">

<div className="flex items-center gap-2 mb-3">

<span className="w-1 h-6 bg-yellow-500 rounded"></span>

<h3 className="font-semibold text-lg">

यस श्रेणीमा ट्रेन्डिङ

</h3>

</div>

<div className="h-[3px] bg-gradient-to-r from-purple-700 to-purple-500 mb-4"></div>

<div className="space-y-3">

{trending.map((item,index)=>(

<Link
key={item.id}
href={`/${params.slug}/${item.slug}`}
className="flex items-start gap-3 border-b pb-3 last:border-none hover:text-purple-700"
>

<span className="text-purple-700 font-bold w-4">

{index+1}

</span>

<p className="text-sm leading-snug">

{item.title}

</p>

</Link>

))}

</div>

</div>

)}

{/* ================= GRID ================= */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

{grid.map(article=>(

<Link
key={article.id}
href={`/${params.slug}/${article.slug}`}
className="group"
>

{article.images?.[0]&&(

<div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3">

<Image
src={article.images[0]}
alt={article.title}
fill
className="object-cover group-hover:scale-105 transition"
/>

</div>

)}

<h3 className="font-semibold leading-snug group-hover:text-purple-700 line-clamp-2">

{article.title}

</h3>

<div className="text-xs text-gray-500 mt-1">

👁 {article.views} • ❤ {article.likes}

</div>

</Link>

))}

</div>

{/* AD */}

<div className="flex justify-center my-10">

<AdRenderer placement="category_after_3_posts"/>

</div>

{/* ================= INFINITE FEED ================= */}

<CategoryFeed slug={params.slug}/>

{/* BOTTOM AD */}

<div className="flex justify-center mt-10">

<AdRenderer placement="category_bottom"/>

</div>

</div>

)

}