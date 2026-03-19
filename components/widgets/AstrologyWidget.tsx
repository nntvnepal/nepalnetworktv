"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import SectionHeader from "@/components/home/SectionHeader"

const signs = [
{ name:"मेष", slug:"aries" },
{ name:"वृष", slug:"taurus" },
{ name:"मिथुन", slug:"gemini" },
{ name:"कर्क", slug:"cancer" },
{ name:"सिंह", slug:"leo" },
{ name:"कन्या", slug:"virgo" },
{ name:"तुला", slug:"libra" },
{ name:"वृश्चिक", slug:"scorpio" },
{ name:"धनु", slug:"sagittarius" },
{ name:"मकर", slug:"capricorn" },
{ name:"कुम्भ", slug:"aquarius" },
{ name:"मीन", slug:"pisces" }
]

export default function AstrologyWidget(){

const [posted,setPosted] = useState<Record<string,string>>({})
const [loading,setLoading] = useState(true)

//////////////////////////////////////////////////////
// FETCH HOROSCOPE
//////////////////////////////////////////////////////

useEffect(()=>{

async function load(){

try{

const res = await fetch("/api/horoscope",{cache:"no-store"})
const data = await res.json()

if(data?.success){

const map:Record<string,string> = {}

data.horoscopes.forEach((h:any)=>{
map[h.zodiacSign] = h.slug
})

setPosted(map)

}

}catch(e){

console.error("Horoscope fetch error",e)

}

setLoading(false)

}

load()

},[])

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<section className="mt-14">

<SectionHeader
title="आजको राशिफल"
link="/astrology"
/>

<div className="grid grid-cols-3 md:grid-cols-6 gap-8 text-center mt-8">

{signs.map((s)=>{

const slug = posted[s.slug]
const active = !!slug

return(

<div key={s.slug}>

{active ? (

<Link
href={`/astrology/${slug}`}
className="rashi-round-card rashi-active"
>

<div className="rashi-round-circle">

<img
src={`/zodiac/${s.slug}.png`}
alt={s.name}
className="rashi-round-icon"
/>

</div>

<p className="rashi-round-name">
{s.name}
</p>

</Link>

) : (

<div className="rashi-round-card rashi-disabled">

<div className="rashi-round-circle opacity-40">

<img
src={`/zodiac/${s.slug}.png`}
alt={s.name}
className="rashi-round-icon"
/>

</div>

<p className="rashi-round-name opacity-50">
{s.name}
</p>

</div>

)}

</div>

)

})}

</div>

</section>

)

}
