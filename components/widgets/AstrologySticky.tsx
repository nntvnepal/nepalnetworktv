"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"

//////////////////////////////////////////////////
// ZODIAC LIST
//////////////////////////////////////////////////

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

export default function AstrologySticky(){

const [posted,setPosted] = useState<Record<string,string>>({})
const [visible,setVisible] = useState(false)

const hideTimer = useRef<NodeJS.Timeout | null>(null)

//////////////////////////////////////////////////
// FETCH HOROSCOPE DATA
//////////////////////////////////////////////////

useEffect(()=>{

async function load(){

try{

const res = await fetch("/api/horoscope")

if(!res.ok) return

const data = await res.json()

if(data?.success){

const map:Record<string,string> = {}

data.horoscopes.forEach((h:any)=>{
map[h.zodiacSign] = h.slug
})

setPosted(map)

}

}catch(err){

console.error("Horoscope fetch error",err)

}

}

load()

},[])

//////////////////////////////////////////////////
// SHOW AFTER 10s
//////////////////////////////////////////////////

useEffect(()=>{

const showTimer = setTimeout(()=>{

setVisible(true)

hideTimer.current = setTimeout(()=>{
setVisible(false)
},15000)

},10000)

return ()=>{

clearTimeout(showTimer)

if(hideTimer.current){
clearTimeout(hideTimer.current)
}

}

},[])

//////////////////////////////////////////////////
// CLOSE HANDLER
//////////////////////////////////////////////////

function closeWidget(){

setVisible(false)

if(hideTimer.current){
clearTimeout(hideTimer.current)
}

}

//////////////////////////////////////////////////
// DO NOT RENDER
//////////////////////////////////////////////////

if(!visible) return null
if(Object.keys(posted).length === 0) return null

//////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////

return(

<div className="fixed left-4 bottom-24 z-50 animate-astroSlide">

<div className="astro-widget relative">

{/* CLOSE BUTTON */}

<button
onClick={closeWidget}
className="astro-widget-close"
aria-label="Close astrology widget"
>
✕
</button>

<h3 className="astro-widget-title">
आजका राशिहरू
</h3>

<div className="astro-widget-grid">

{signs.map((s)=>{

const slug = posted[s.slug]

if(!slug) return null

return(

<Link
key={s.slug}
href={`/astrology/${slug}`}
className="astro-widget-item"
>

<div className="astro-widget-icon">

<Image
src={`/zodiac/${s.slug}.png`}
alt={s.name}
width={22}
height={22}
/>

</div>

<p>{s.name}</p>

</Link>

)

})}

</div>

</div>

</div>

)

}