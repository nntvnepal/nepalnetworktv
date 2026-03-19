import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

import AdRenderer from "@/components/ads/AdRenderer"
import AstrologySticky from "@/components/widgets/AstrologySticky"
import ReadingProgress from "@/components/widgets/ReadingProgress"
import ShareBar from "@/components/widgets/ShareBar"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface Props{
params:{
category:string
slug:string
}
}

/* ================= METADATA ================= */

export async function generateMetadata({params}:Props):Promise<Metadata>{

const article = await prisma.article.findFirst({
where:{slug:params.slug,status:"approved",isDeleted:false},
include:{category:true}
})

if(!article) return {}

const canonical=`https://www.nntvnepal.com/${article.category?.slug}/${article.slug}`

return{

title:article.metaTitle || article.title,
description:article.metaDescription || article.excerpt || "",

alternates:{canonical},

openGraph:{
title:article.metaTitle || article.title,
description:article.metaDescription || article.excerpt || "",
url:canonical,
images:article.images?.[0] ? [article.images[0]] : [],
type:"article",
siteName:"Nepal Network Television",
publishedTime:article.createdAt.toISOString(),
modifiedTime:(article.updatedAt || article.createdAt).toISOString()
},

twitter:{
card:"summary_large_image",
title:article.metaTitle || article.title,
description:article.metaDescription || article.excerpt || "",
images:article.images?.[0] ? [article.images[0]] : []
}

}

}

/* ================= PAGE ================= */

export default async function ArticlePage({params}:Props){

/* ARTICLE */

const article=await prisma.article.findFirst({
where:{slug:params.slug,status:"approved",isDeleted:false},
include:{category:true}
})

if(!article) return notFound()

await prisma.article.update({
where:{id:article.id},
data:{views:{increment:1}}
})

/* ================= PARALLEL QUERIES ================= */

const [mostRead,trending] = await Promise.all([

prisma.article.findMany({
where:{status:"approved",isDeleted:false,isAstrology:false},
orderBy:{views:"desc"},
take:5,
include:{category:true}
}),

prisma.article.findMany({
where:{status:"approved",isDeleted:false,isAstrology:false},
orderBy:{views:"desc"},
take:5,
include:{category:true}
})

])

/* ================= RELATED ================= */

let related=await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
isAstrology:false,
categoryId:article.categoryId,
NOT:{id:article.id}
},
take:6,
orderBy:{createdAt:"desc"},
include:{category:true}
})

if(related.length<4){
related=await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
isAstrology:false,
NOT:{id:article.id}
},
take:6,
orderBy:{createdAt:"desc"},
include:{category:true}
})
}

/* INLINE + CONTINUE */

const inlineRelated = related?.[0]
const continueArticle = related?.[1]

/* ================= TEXT CLEANER ================= */

function cleanText(html:string){
const text=html.replace(/<[^>]*>/g,"")
return text.replace(/\s+/g," ").trim()
}

/* ================= READING TIME ================= */

const wordCount=cleanText(article.content).split(" ").length
const readingTime=Math.max(1,Math.ceil(wordCount/200))

/* ================= PARAGRAPH ENGINE ================= */

function extractParagraphs(content:string){

// HTML article
if(content.includes("</p>")){
return content
.split("</p>")
.map(p=>p.trim())
.filter(Boolean)
}

// textarea article
return content
.split("\n")
.map(p=>p.trim())
.filter(Boolean)
.map(p=>`<p>${p}</p>`)

}

const paragraphs = extractParagraphs(article.content)

/* ================= SUMMARY ================= */

function generateSummary(html:string){

const text=cleanText(html)
const sentences=text.split(/[।.!?]/)

return sentences
.filter(s=>s.trim().length>40)
.slice(0,3)

}

const summary=generateSummary(article.content)

/* ================= AD ENGINE ================= */

const totalParas=paragraphs.length

function shouldShowAd(index:number){

const pos=index+1

if(totalParas<=5) return pos===3
if(totalParas<=10) return pos===3 || pos===6
if(totalParas<=18) return pos===4 || pos===8 || pos===12

return pos===4 || pos===8 || pos===12 || pos===16

}

const canonical=`https://www.nntvnepal.com/${article.category?.slug}/${article.slug}`

/* ================= SCHEMA ================= */

const articleSchema={
"@context":"https://schema.org",
"@type":"NewsArticle",
headline:article.title,
image:article.images?.[0],
datePublished:article.createdAt,
dateModified:article.updatedAt || article.createdAt,
author:{ "@type":"Organization", name:"Nepal Network Television" },
publisher:{
"@type":"Organization",
name:"Nepal Network Television",
logo:{ "@type":"ImageObject", url:"https://www.nntvnepal.com/logo.png" }
},
mainEntityOfPage:canonical
}

return(

<div className="max-w-7xl mx-auto px-6 py-10">

<ReadingProgress/>

<div className="hidden lg:block fixed right-6 top-[40%] z-50">
<ShareBar/>
</div>

<script
type="application/ld+json"
dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema)}}
/>

<div className="grid lg:grid-cols-3 gap-12">

{/* MAIN */}

<div className="lg:col-span-2">

<div className="text-sm text-gray-500 mb-3">

<Link href="/">Home</Link> {" > "}

<Link href={`/category/${article.category?.slug}`}>
{article.category?.name}
</Link> {" > "}

{article.title}

</div>

<span className="bg-blue-900 text-white text-xs px-3 py-1 rounded uppercase">
{article.category?.name}
</span>

<h1 className="font-serif text-4xl md:text-5xl leading-tight mt-3 mb-3">
{article.title}
</h1>

<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
<span>{new Date(article.createdAt).toLocaleDateString()}</span>
<span>{readingTime} min read</span>
<span>👁 {article.views+1}</span>
</div>

{/* HERO */}

{article.images?.[0] &&(

<div className="relative w-full h-[450px] mb-6 rounded-2xl overflow-hidden">

<Image
src={article.images[0]}
alt={article.title}
fill
priority
sizes="(max-width:768px) 100vw, 800px"
className="object-cover"
/>

</div>

)}

{/* SUMMARY */}

{summary.length>0 &&(

<div className="nntv-summary my-8">

<div className="nntv-summary-header">

<div className="nntv-summary-title">
<span className="summary-star">✦</span>
<span>सारांश</span>
</div>

<span className="text-sm opacity-80">
NNTV Brief
</span>

</div>

<div className="nntv-summary-line"></div>

<div className="px-6 py-5">

<ul className="space-y-4">

{summary.map((point:string,i:number)=>(

<li key={i} className="flex gap-3 items-start text-[15px] leading-relaxed">

<span className="bg-gradient-to-br from-purple-900 to-purple-600 text-white text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full shadow">
{i+1}
</span>

<span>{point.trim()}</span>

</li>

))}

</ul>

</div>

<div className="nntv-summary-line"></div>

</div>

)}

<div className="flex justify-center my-8">
<AdRenderer placement="article_after_hero"/>
</div>

{/* CONTENT */}

<div className="prose prose-lg prose-p:my-4 max-w-none leading-relaxed">

{paragraphs.map((para,index)=>(

<div key={index}>

<div dangerouslySetInnerHTML={{__html:para}}/>

{index===2 && inlineRelated &&(

<Link
href={`/${inlineRelated.category?.slug}/${inlineRelated.slug}`}
className="block my-8 p-5 border-l-4 border-purple-700 bg-gray-50 rounded-lg hover:bg-purple-50 transition"
>

<p className="text-xs text-gray-500 mb-1">
सम्बन्धित समाचार
</p>

<p className="font-semibold leading-snug">
{inlineRelated.title}
</p>

</Link>

)}

{shouldShowAd(index)&&(

<div className="my-10 flex justify-center">
<AdRenderer placement="article_after_paragraph"/>
</div>

)}

</div>

))}

</div>

<div className="flex justify-center my-10">
<AdRenderer placement="article_mid"/>
</div>

<div className="flex justify-center my-12">
<AdRenderer placement="article_bottom"/>
</div>

{/* RELATED */}

<div className="mt-14">

<div className="flex items-center gap-2 mb-3">

<span className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded"></span>

<h3 className="text-xl font-semibold">
सम्बन्धित समाचार
</h3>

</div>

<div className="h-[3px] bg-gradient-to-r from-purple-700 to-purple-500 mb-6"></div>

<div className="grid md:grid-cols-2 gap-4">

{related.map((item:any)=>(

<Link
key={item.id}
href={`/${item.category?.slug}/${item.slug}`}
className="border rounded-xl px-4 py-3 hover:shadow-md transition hover:border-purple-300"
>

<p className="text-sm font-serif leading-snug">
{item.title}
</p>

</Link>

))}

</div>

</div>

{/* CONTINUE READING */}

{continueArticle &&(

<div className="mt-14">

<div className="flex items-center gap-2 mb-3">

<span className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded"></span>

<h3 className="text-xl font-semibold">
अर्को समाचार
</h3>

</div>

<div className="h-[3px] bg-gradient-to-r from-purple-700 to-purple-500 mb-6"></div>

<Link
href={`/${continueArticle.category?.slug}/${continueArticle.slug}`}
className="group flex items-center justify-between border rounded-xl p-6 hover:border-purple-400 hover:shadow-md transition"
>

<div>

<p className="text-xs text-gray-500 mb-1">
पढ्न जारी राख्नुहोस्
</p>

<h4 className="text-lg font-semibold group-hover:text-purple-700 transition">
{continueArticle.title}
</h4>

</div>

<span className="text-purple-600 text-xl group-hover:translate-x-1 transition">
→
</span>

</Link>

</div>

)}

</div>

{/* SIDEBAR */}

<aside className="space-y-8 lg:sticky lg:top-24 self-start">

<AdRenderer placement="article_sidebar_top"/>

<AstrologySticky/>

{/* MOST READ */}

<div className="bg-white border rounded-xl p-5">

<div className="flex items-center gap-2 mb-3">

<span className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded"></span>

<h3 className="font-semibold text-lg">
सबैभन्दा पढिएको
</h3>

</div>

<div className="h-[3px] bg-gradient-to-r from-purple-700 to-purple-500 mb-4"></div>

<div className="space-y-3">

{mostRead.map((item:any,index:number)=>(

<Link
key={item.id}
href={`/${item.category?.slug}/${item.slug}`}
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

<AdRenderer placement="article_sidebar_bottom"/>

{/* TRENDING */}

<div className="bg-white border rounded-xl p-5">

<div className="flex items-center gap-2 mb-3">

<span className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded"></span>

<h3 className="font-semibold text-lg">
🔥 ट्रेन्डिङ
</h3>

</div>

<div className="h-[3px] bg-gradient-to-r from-purple-700 to-purple-500 mb-4"></div>

<div className="space-y-3">

{trending.map((item:any,index:number)=>(

<Link
key={item.id}
href={`/${item.category?.slug}/${item.slug}`}
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

</aside>

</div>

</div>

)

}
