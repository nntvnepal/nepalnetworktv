"use client"

import { useEffect,useState,useRef } from "react"

export default function Teleprompter(){

const [script,setScript] = useState("")
const [speed,setSpeed] = useState(20)
const [fontSize,setFontSize] = useState(48)
const [playing,setPlaying] = useState(true)
const [mirror,setMirror] = useState(false)

const scrollRef = useRef<HTMLDivElement>(null)

//////////////////////////////////////////////////
// LOAD SCRIPT
//////////////////////////////////////////////////

async function loadScript(){

try{

const res = await fetch("/api/tv-control/teleprompter")
const data = await res.json()

if(data.length>0){
setScript(data[0].content)
}else{
setScript("Welcome to NNTV Teleprompter")
}

}catch{

setScript("Teleprompter ready")

}

}

useEffect(()=>{
loadScript()
},[])

//////////////////////////////////////////////////
// FULLSCREEN
//////////////////////////////////////////////////

function openFullscreen(){

const el = document.documentElement

if(el.requestFullscreen){
el.requestFullscreen()
}

}

//////////////////////////////////////////////////
// SCROLL
//////////////////////////////////////////////////

useEffect(()=>{

let interval:any

if(playing){

interval = setInterval(()=>{

if(scrollRef.current){

scrollRef.current.scrollTop += 1

}

},speed)

}

return ()=>clearInterval(interval)

},[playing,speed])

//////////////////////////////////////////////////

return(

<div className="bg-black text-white h-screen w-full relative overflow-hidden">

{/* SCRIPT AREA */}

<div
ref={scrollRef}
className={`absolute inset-0 overflow-hidden flex justify-center ${mirror ? "scale-x-[-1]" : ""}`}
>

<div
className="pt-[100vh] pb-[100vh] text-center"
style={{
fontSize:fontSize,
lineHeight:1.6,
width:"70%"
}}
>

{script}

</div>

</div>

{/* CONTROL PANEL */}

<div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xl p-4 rounded-xl flex gap-4 items-center">

<button
onClick={()=>setPlaying(!playing)}
className="bg-red-600 px-4 py-2 rounded"
>
{playing ? "Pause" : "Play"}
</button>

<button
onClick={loadScript}
className="bg-gray-700 px-4 py-2 rounded"
>
Reload
</button>

<button
onClick={openFullscreen}
className="bg-blue-600 px-4 py-2 rounded"
>
Full Screen
</button>

<button
onClick={()=>setMirror(!mirror)}
className="bg-gray-700 px-4 py-2 rounded"
>
Mirror
</button>

<label className="text-sm">
Speed
</label>

<input
type="range"
min="5"
max="50"
value={speed}
onChange={e=>setSpeed(Number(e.target.value))}
/>

<label className="text-sm">
Font
</label>

<input
type="range"
min="32"
max="90"
value={fontSize}
onChange={e=>setFontSize(Number(e.target.value))}
/>

</div>

</div>

)

}