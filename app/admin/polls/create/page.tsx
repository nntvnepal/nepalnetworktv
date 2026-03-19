"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreatePoll(){

const router = useRouter()

const [question,setQuestion] = useState("")
const [options,setOptions] = useState(["","","",""])
const [loading,setLoading] = useState(false)
const [error,setError] = useState("")

function updateOption(index:number,value:string){

const newOpts=[...options]
newOpts[index]=value
setOptions(newOpts)

}

function addOption(){

if(options.length >= 6) return

setOptions([...options,""])

}

function removeOption(index:number){

if(options.length <= 2) return

const newOpts = options.filter((_,i)=>i!==index)
setOptions(newOpts)

}

async function createPoll(){

setError("")

if(!question.trim()){
setError("Please enter poll question")
return
}

const validOptions = options
.map(o=>o.trim())
.filter(o=>o!=="")

if(validOptions.length < 2){
setError("At least 2 options required")
return
}

setLoading(true)

try{

const res = await fetch("/api/poll/create",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
question:question.trim(),
options:validOptions
})

})

if(!res.ok) throw new Error()

router.push("/admin/polls")
router.refresh()

}catch{

setError("Failed to create poll")

}

setLoading(false)

}

return(

<div className="p-8 max-w-3xl">

<h1 className="text-2xl font-bold mb-6 text-white">
Create जनआवाज Poll
</h1>

{error && (
<div className="text-red-500 mb-4">{error}</div>
)}

{/* QUESTION */}

<input
value={question}
onChange={(e)=>setQuestion(e.target.value)}
placeholder="Poll Question"
className="w-full p-3 border border-gray-300 rounded-lg mb-6 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
/>

{/* OPTIONS */}

<div className="space-y-3">

{options.map((opt,i)=>(

<div key={i} className="flex gap-3">

<input
value={opt}
onChange={(e)=>updateOption(i,e.target.value)}
placeholder={`Option ${i+1}`}
className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
/>

{options.length > 2 && (

<button
type="button"
onClick={()=>removeOption(i)}
className="px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg"
>
✕
</button>

)}

</div>

))}

</div>

{/* ACTION BUTTONS */}

<div className="flex items-center gap-4 mt-6">

{options.length < 6 && (

<button
type="button"
onClick={addOption}
className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
>

Add Option

</button>

)}

<button
onClick={createPoll}
disabled={loading}
className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg disabled:opacity-50"
>

{loading ? "Creating..." : "Create Poll"}

</button>

</div>

</div>

)

}