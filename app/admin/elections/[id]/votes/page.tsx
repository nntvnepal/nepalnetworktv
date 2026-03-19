"use client"

import { useEffect,useState } from "react"

export default function VoteEntry({params}:any){

const [candidates,setCandidates] = useState([])

useEffect(()=>{

fetch(`/api/candidates?electionId=${params.id}`)
.then(res=>res.json())
.then(data=>setCandidates(data))

},[])

async function updateVote(id:any,votes:any){

await fetch("/api/votes",{

method:"POST",

body:JSON.stringify({

candidateId:id,
votes:Number(votes)

})

})

alert("Votes Updated")

}

return(

<div className="p-8 text-white">

<h1 className="text-xl font-semibold mb-6">

Vote Entry

</h1>

<table className="w-full">

<thead>

<tr className="text-left border-b">

<th>Candidate</th>
<th>Party</th>
<th>Votes</th>
<th>Update</th>

</tr>

</thead>

<tbody>

{candidates.map((c:any)=>(

<tr key={c.id} className="border-b">

<td>{c.name}</td>
<td>{c.party}</td>

<td>

<input
defaultValue={c.votes}
className="text-black p-1"
onChange={(e)=>c.votes=e.target.value}
/>

</td>

<td>

<button
className="bg-yellow-500 px-3 py-1 text-black"
onClick={()=>updateVote(c.id,c.votes)}
>

Save

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}