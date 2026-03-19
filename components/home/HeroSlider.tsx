"use client"

import { useState } from "react"
import Link from "next/link"

export default function HeroSlider({articles}:any){

const [index,setIndex] = useState(0)

function next(){
setIndex((index+1)%articles.length)
}

function prev(){
setIndex((index-1+articles.length)%articles.length)
}

if(!articles || articles.length === 0){
return null
}

const article = articles[index]

return(

<div className="relative w-full h-[420px] overflow-hidden rounded-xl mb-12">

<img
src={article.images?.[0] || "/placeholder.jpg"}
className="absolute inset-0 w-full h-full object-cover"
/>

<div className="absolute inset-0 bg-black/50 flex items-end p-8">

<div>

<h2 className="text-white text-3xl font-bold mb-3">

<Link href={`/${article.category?.slug}/${article.slug}`}>
{article.title}
</Link>

</h2>

</div>

</div>

<button
onClick={prev}
className="absolute left-4 top-1/2 bg-black/50 text-white px-3 py-2"
>
‹
</button>

<button
onClick={next}
className="absolute right-4 top-1/2 bg-black/50 text-white px-3 py-2"
>
›
</button>

</div>

)

}