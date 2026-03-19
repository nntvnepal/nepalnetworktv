"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function PollAdminPage(){

const [polls,setPolls] = useState<any[]>([])
const [loading,setLoading] = useState(true)
const [search,setSearch] = useState("")
const [sort,setSort] = useState("latest")

//////////////////////////////////////////////////////
// LOAD POLLS
//////////////////////////////////////////////////////

async function loadPolls(){

try{

const res = await fetch("/api/poll/list")

const data = await res.json()

setPolls(data)

}catch(err){

console.error("Poll load error",err)

}

setLoading(false)

}

useEffect(()=>{
loadPolls()
},[])

//////////////////////////////////////////////////////
// ACTIVATE POLL
//////////////////////////////////////////////////////

async function activatePoll(pollId:string){

if(!confirm("Activate this poll?")) return

await fetch("/api/poll/activate",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({pollId})

})

loadPolls()

}

//////////////////////////////////////////////////////
// DELETE POLL
//////////////////////////////////////////////////////

async function deletePoll(pollId:string){

if(!confirm("Delete this poll permanently?")) return

await fetch("/api/poll/delete",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({pollId})

})

loadPolls()

}

//////////////////////////////////////////////////////
// DOWNLOAD REPORT
//////////////////////////////////////////////////////

function downloadReport(){

window.open("/api/poll/report","_blank")

}

//////////////////////////////////////////////////////
// FILTER / SORT
//////////////////////////////////////////////////////

let filteredPolls = polls.filter(p=>
p.question.toLowerCase().includes(search.toLowerCase())
)

if(sort==="votes"){

filteredPolls = [...filteredPolls].sort((a,b)=>{

const votesA = a.options.reduce((s:any,o:any)=>s+o.votes,0)
const votesB = b.options.reduce((s:any,o:any)=>s+o.votes,0)

return votesB - votesA

})

}

//////////////////////////////////////////////////////
// LOADING
//////////////////////////////////////////////////////

if(loading){

return(
<div className="p-8 text-white">
Loading polls...
</div>
)

}

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="p-8 max-w-6xl">

{/* HEADER */}

<div className="flex flex-wrap justify-between items-center gap-4 mb-10">

<h1 className="text-2xl font-bold tracking-wide">
जनआवाज Poll Manager
</h1>

<div className="flex gap-3">

<button
onClick={downloadReport}
className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
>
Download Report
</button>

<Link
href="/admin/polls/create"
className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 hover:opacity-90 text-white text-sm shadow"
>
Create Poll
</Link>

</div>

</div>

{/* SEARCH + SORT */}

<div className="flex gap-4 mb-8">

<input
placeholder="Search poll..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="px-3 py-2 rounded bg-black/20 border border-white/10 text-sm"
/>

<select
value={sort}
onChange={(e)=>setSort(e.target.value)}
className="px-3 py-2 rounded bg-black/20 border border-white/10 text-sm"
>

<option value="latest">Latest</option>
<option value="votes">Most Votes</option>

</select>

</div>

{/* POLL LIST */}

{filteredPolls.length===0 &&(

<div className="text-gray-400">
No polls found
</div>

)}

<div className="space-y-8">

{filteredPolls.map((poll:any)=>{

const totalVotes = poll.options.reduce(
(sum:any,o:any)=>sum + o.votes,0
)

return(

<div
key={poll.id}
className={`rounded-xl p-6 border transition ${
poll.isActive
? "border-green-500 bg-green-500/10"
: "border-white/10 bg-white/5"
}`}
>

{/* QUESTION */}

<div className="flex justify-between items-start mb-4">

<div>

<h2 className="font-semibold text-lg mb-1">
{poll.question}
</h2>

<p className="text-xs text-gray-400">
Total Votes: {totalVotes}
</p>

</div>

<div className="flex items-center gap-2">

<span className={`text-xs px-3 py-1 rounded-full ${
poll.isActive
? "bg-green-600 text-white"
: "bg-gray-500 text-white"
}`}>
{poll.isActive ? "Active":"Inactive"}
</span>

{!poll.isActive &&(

<button
onClick={()=>activatePoll(poll.id)}
className="text-xs px-3 py-1 bg-purple-700 hover:bg-purple-800 rounded text-white"
>
Activate
</button>

)}

<Link
href={`/admin/polls/edit/${poll.id}`}
className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
>
Edit
</Link>

<button
onClick={()=>deletePoll(poll.id)}
className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
>
Delete
</button>

</div>

</div>

{/* OPTIONS */}

<ul className="space-y-2 mb-6">

{poll.options.map((o:any)=>(

<li
key={o.id}
className="flex justify-between text-sm bg-black/20 px-3 py-2 rounded"
>

<span>{o.text}</span>

<span className="text-gray-300">
{o.votes} votes
</span>

</li>

))}

</ul>

{/* ANALYTICS CHART */}

<div className="h-[220px]">

<ResponsiveContainer width="100%" height="100%">

<BarChart data={poll.options}>

<XAxis dataKey="text"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="votes" fill="#9333ea"/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

)

})}

</div>

</div>

)

}