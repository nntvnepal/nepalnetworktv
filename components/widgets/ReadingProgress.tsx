"use client"

import { useEffect, useState } from "react"

export default function ReadingProgress(){

const [progress,setProgress] = useState(0)

useEffect(()=>{

function updateProgress(){

const scrollTop = window.scrollY

const docHeight =
document.documentElement.scrollHeight - window.innerHeight

const percent = (scrollTop / docHeight) * 100

setProgress(percent)

}

window.addEventListener("scroll",updateProgress)

return ()=>window.removeEventListener("scroll",updateProgress)

},[])

return(

<div className="fixed top-0 left-0 w-full h-[4px] z-[9999]">

<div
className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-150"
style={{width:`${progress}%`}}
/>

</div>

)

}