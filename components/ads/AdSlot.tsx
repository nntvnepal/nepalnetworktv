"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

interface Props{
ad?:any
}

export default function AdSlot({ad}:Props){

const viewed = useRef(false)

//////////////////////////////////////////////////////
// TRACK VIEW
//////////////////////////////////////////////////////

useEffect(()=>{

if(!ad || viewed.current) return

viewed.current = true

async function trackView(){

try{

await fetch("/api/ads/view",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({id:ad.id})
})

}catch(e){
console.error("Ad view tracking failed")
}

}

trackView()

},[ad])

//////////////////////////////////////////////////////
// NO AD
//////////////////////////////////////////////////////

if(!ad) return null

//////////////////////////////////////////////////////
// CLICK TRACK
//////////////////////////////////////////////////////

async function handleClick(){

try{

await fetch("/api/ads/click",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({id:ad.id})
})

}catch(e){
console.error("Ad click tracking failed")
}

if(ad.link){
window.open(ad.link,"_blank","noopener,noreferrer")
}

}

//////////////////////////////////////////////////////
// ADSENSE
//////////////////////////////////////////////////////

if(ad.type==="adsense"){

return(

<div className="w-full flex justify-center">

<div
className="adsense-container"
dangerouslySetInnerHTML={{__html:ad.adsenseCode}}
/>

</div>

)

}

//////////////////////////////////////////////////////
// VIDEO AD
//////////////////////////////////////////////////////

if(ad.type==="video" && ad.imageUrl){

return(

<div className="w-full flex justify-center">

<video
src={ad.imageUrl}
controls
autoPlay
muted
loop
className="rounded max-w-full"
/>

</div>

)

}

//////////////////////////////////////////////////////
// IMAGE AD
//////////////////////////////////////////////////////

if(ad.type==="image" && ad.imageUrl){

return(

<div className="w-full flex justify-center">

<div
onClick={handleClick}
className="cursor-pointer w-full flex justify-center"
>

<Image
src={ad.imageUrl}
alt={ad.title || "Advertisement"}
width={970}
height={180}
sizes="(max-width:768px) 100vw, 970px"
className="w-full h-auto rounded-lg"
priority={false}
/>

</div>

</div>

)

}

//////////////////////////////////////////////////////
// FALLBACK
//////////////////////////////////////////////////////

return null

}