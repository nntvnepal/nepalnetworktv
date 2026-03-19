"use client"

import useSWR from "swr"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

const fetcher=(url:string)=>fetch(url).then(r=>r.json())

export default function CategoryFeed({slug}:{slug:string}){

const [skip,setSkip]=useState(9)

const {data}=useSWR(
`/api/category-feed?slug=${slug}&skip=${skip}`,
fetcher,
{
refreshInterval:30000
}
)

if(!data) return null

return(

<div className="mt-10">

{/* SECTION TITLE */}

<div className="flex items-center gap-2 mb-4">

<span className="w-1 h-6 bg-yellow-500 rounded"></span>

<h3 className="font-semibold text-lg">
अर्को समाचार
</h3>

</div>

<div className="h-[3px] bg-gradient-to-r from-purple-700 to-purple-500 mb-6"></div>

{/* GRID */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{data.map((article:any)=>(

<Link
key={article.id}
href={`/${slug}/${article.slug}`}
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

{/* LOAD MORE */}

<div className="flex justify-center mt-10">

<button
onClick={()=>setSkip(skip+9)}
className="px-6 py-2 border rounded-full hover:bg-purple-50"
>

Load More

</button>

</div>

</div>

)

}