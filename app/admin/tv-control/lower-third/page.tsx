"use client"

import { useEffect,useState } from "react"

export default function LowerThird(){

const [title,setTitle] = useState("")
const [subtitle,setSubtitle] = useState("")
const [data,setData] = useState<any[]>([])

async function load(){

const res = await fetch("/api/tv-control/lower-third")
const json = await res.json()

setData(json)

}

useEffect(()=>{
load()
},[])

async function add(){

await fetch("/api/tv-control/lower-third",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({title,subtitle})
})

setTitle("")
setSubtitle("")

load()

}

async function activate(id:string){

await fetch("/api/tv-control/lower-third",{
method:"PUT",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({id})
})

load()

}

async function remove(id:string){

await fetch("/api/tv-control/lower-third",{
method:"DELETE",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({id})
})

load()

}

return(

<div className="text-white">

<h1 className="text-2xl font-bold mb-6">
Lower Third Graphics
</h1>

<div className="bg-[#3b0146] p-6 rounded-xl mb-6 space-y-4">

<input
value={title}
onChange={e=>setTitle(e.target.value)}
placeholder="Headline"
className="w-full p-3 bg-black/40 rounded"
/>

<input
value={subtitle}
onChange={e=>setSubtitle(e.target.value)}
placeholder="Subtitle (optional)"
className="w-full p-3 bg-black/40 rounded"
/>

<button
onClick={add}
className="bg-red-600 px-6 py-2 rounded"
>
Add Graphic
</button>

</div>

<div className="space-y-3">

{data.map(item=>(

<div
key={item.id}
className="bg-black/30 border border-white/10 p-4 rounded flex justify-between items-center"
>

<div>
<p className="font-semibold">{item.title}</p>
<p className="text-sm text-gray-400">{item.subtitle}</p>
</div>

<div className="flex gap-3">

<button
onClick={()=>activate(item.id)}
className="text-green-400"
>
Activate
</button>

<button
onClick={()=>remove(item.id)}
className="text-red-400"
>
Delete
</button>

</div>

</div>

))}

</div>

</div>

)

}