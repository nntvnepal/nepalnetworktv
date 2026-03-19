import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

import PollWidget from "@/components/widgets/PollWidget"
import BreakingTicker from "@/components/widgets/BreakingTicker"
import AstrologyWidget from "@/components/widgets/AstrologyWidget"
import SectionHeader from "@/components/home/SectionHeader"
import AdRenderer from "@/components/ads/AdRenderer"

export const metadata = {
title:"नेपाल नेटवर्क टेलिभिजन (NNTV)",
description:"नेपाल र विश्वका ताजा समाचार",
}

export default async function HomePage(){

const now = Date.now()
const twoDaysAgo = new Date(now - 48*60*60*1000)

//////////////////////////////////////////////////
// HERO
//////////////////////////////////////////////////

const hero = await prisma.article.findFirst({
where:{
status:"approved",
isDeleted:false,
category:{slug:{not:"horoscope"}}
},
orderBy:{createdAt:"desc"},
include:{category:true}
})

//////////////////////////////////////////////////
// TRENDING
//////////////////////////////////////////////////

const trending = await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
createdAt:{gte:twoDaysAgo}
},
orderBy:{views:"desc"},
take:5,
include:{category:true}
})

//////////////////////////////////////////////////
// LATEST
//////////////////////////////////////////////////

const latest = await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
id:{not:hero?.id},
category:{slug:"news"}
},
orderBy:{createdAt:"desc"},
take:6,
include:{category:true}
})

//////////////////////////////////////////////////
// POLL
//////////////////////////////////////////////////

const poll = await prisma.poll.findFirst({
where:{isActive:true},
include:{options:true},
orderBy:{createdAt:"desc"}
})

//////////////////////////////////////////////////
// EDITORIAL
//////////////////////////////////////////////////

const editorial = await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
category:{slug:"editorial"}
},
orderBy:{createdAt:"desc"},
take:4,
include:{category:true}
})

//////////////////////////////////////////////////
// VIDEO
//////////////////////////////////////////////////

const videos = await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
category:{slug:"video"}
},
orderBy:{createdAt:"desc"},
take:4,
include:{category:true}
})

return(

<div className="max-w-7xl mx-auto px-3 pt-2">

{/* TOP AD */}

<BreakingTicker/>

{/* HERO + TRENDING */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">

<div className="col-span-2">

{hero &&(

<Link
href={`/${hero.category?.slug}/${hero.slug}`}
className="relative block h-[420px] rounded overflow-hidden"
>

<Image
src={hero.images?.[0] || "/news.jpg"}
fill
priority
alt={hero.title}
className="object-cover"
/>

<div className="absolute bottom-0 p-6 text-white">

<span className="bg-purple-700 px-3 py-1 text-xs rounded">
{hero.category?.name}
</span>

<h1 className="text-3xl font-bold mt-2">
{hero.title}
</h1>

</div>

</Link>

)}

</div>

<div>

<SectionHeader title="ट्रेन्डिङ"/>

<ul className="space-y-3">

{trending.map((t,i)=>(

<li key={t.id} className="flex gap-2">

<span className="font-bold text-purple-700">
{i+1}
</span>

<Link href={`/${t.category?.slug}/${t.slug}`}>
{t.title}
</Link>

</li>

))}

</ul>

</div>

</div>

{/* AFTER HERO AD */}
<AdRenderer placement="homepage_after_hero"/>

{/* LATEST NEWS */}

<SectionHeader title="ताजा समाचार"/>

<div className="news-grid mb-12">

{latest.map(post=>(

<Link
key={post.id}
href={`/${post.category?.slug}/${post.slug}`}
className="news-card"
>

<Image
src={post.images?.[0] || "/news.jpg"}
width={400}
height={250}
alt={post.title}
/>

<h3>{post.title}</h3>

</Link>

))}

</div>

{/* POLL + SIDEBAR AD */}

{poll &&(

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-12 items-start">

<div className="lg:col-span-2">
<PollWidget poll={poll}/>
</div>

<div className="lg:col-span-1 flex justify-center">
<AdRenderer placement="homepage_sidebar_top"/>
</div>

</div>

)}

{/* EDITORIAL */}

<SectionHeader title="सम्पादकीय"/>

<div className="news-grid mb-12">

{editorial.map(post=>(

<Link
key={post.id}
href={`/${post.category?.slug}/${post.slug}`}
className="news-card"
>

<Image
src={post.images?.[0] || "/news.jpg"}
width={400}
height={250}
alt={post.title}
/>

<h3>{post.title}</h3>

</Link>

))}

</div>

{/* MID AD */}
<AdRenderer placement="homepage_mid"/>

{/* CATEGORY BLOCKS */}

{await CategoryBlock("samachar","समाचार")}
{await CategoryBlock("politics","राजनीति")}
{await CategoryBlock("economy","अर्थ")}
{await CategoryBlock("sports","खेलकुद")}

{/* AFTER CATEGORY LIST */}
<AdRenderer placement="homepage_after_list"/>

<AstrologyWidget/>

{/* VIDEO */}

<SectionHeader title="भिडियो समाचार"/>

<div className="video-grid mb-12">

{videos.map(post=>(

<div key={post.id}>

<Image
src={post.images?.[0] || "/news.jpg"}
width={400}
height={250}
alt={post.title}
/>

<h3>{post.title}</h3>

</div>

))}

</div>

{/* BOTTOM AD */}
<AdRenderer placement="homepage_bottom"/>

</div>

)

}

//////////////////////////////////////////////////
// CATEGORY BLOCK FUNCTION
//////////////////////////////////////////////////

async function CategoryBlock(slug:string,title:string){

const articles = await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
category:{slug}
},
orderBy:{createdAt:"desc"},
take:4,
include:{category:true}
})

if(!articles.length) return null

const main = articles[0]
const list = articles.slice(1)

return(

<div className="mb-12">

<SectionHeader title={title} link={`/${slug}`}/>

<div className="grid md:grid-cols-2 gap-4">

<Link
href={`/${main.category?.slug}/${main.slug}`}
className="relative h-[260px] block"
>

<Image
src={main.images?.[0] || "/news.jpg"}
fill
alt={main.title}
className="object-cover rounded"
/>

</Link>

<div className="space-y-4">

{list.map(a=>(

<Link
key={a.id}
href={`/${a.category?.slug}/${a.slug}`}
className="flex gap-3 items-start"
>

<Image
src={a.images?.[0] || "/news.jpg"}
width={90}
height={65}
alt={a.title}
className="rounded"
/>

<h4 className="font-medium leading-snug">
{a.title}
</h4>

</Link>

))}

</div>

</div>

</div>

)

}