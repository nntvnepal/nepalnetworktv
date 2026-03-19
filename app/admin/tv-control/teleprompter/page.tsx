"use client"

import { useEffect,useState } from "react"

export default function Teleprompter(){

const [title,setTitle] = useState("")
const [content,setContent] = useState("")
const [scripts,setScripts] = useState<any[]>([])

async function load(){

const res = await fetch("/api/tv-control/teleprompter")
const data = await res.json()

setScripts(data)

}

useEffect(()=>{
load()
},[])

async function add(){

await fetch("/api/tv-control/teleprompter",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({title,content})
})

setTitle("")
setContent("")

load()

}

async function remove(id:string){

await fetch("/api/tv-control/teleprompter",{
method:"DELETE",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({id})
})

load()

}

return(

<div className="text-white">

<h1 className="text-2xl font-bold mb-6">
Teleprompter Script Editor
</h1>

<div className="bg-[#3b0146] p-6 rounded-xl mb-6 space-y-4">

<input
value={title}
onChange={e=>setTitle(e.target.value)}
placeholder="Script Title"
className="w-full p-3 bg-black/40 rounded"
/>

<textarea
value={content}
onChange={e=>setContent(e.target.value)}
placeholder="Write anchor script..."
className="w-full h-40 p-3 bg-black/40 rounded"
/>

<button
onClick={add}
className="bg-red-600 px-6 py-2 rounded"
>
Save Script
</button>

</div>

<div className="space-y-3">

{scripts.map(script=>(

<div
key={script.id}
className="bg-black/30 border border-white/10 p-4 rounded flex justify-between"
>

<span>{script.title}</span>

<button
onClick={()=>remove(script.id)}
className="text-red-400"
>
Delete
</button>

</div>

))}

</div>

</div>

)

}