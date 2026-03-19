"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function EditElectionForm({ election }: any) {

const router = useRouter()

if(!election){
return <div className="text-white">Loading...</div>
}

const [form,setForm] = useState({
name: election?.name || "",
type: election?.type || "Federal",
year: election?.year || "",
phase: election?.phase || "",
voters: election?.voters || "",
totalSeats: election?.totalSeats || ""
})

const [loading,setLoading] = useState(false)

async function save(){

setLoading(true)

await fetch(`/api/elections/${election.id}`,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(form)
})

router.push("/admin/elections")
router.refresh()

}

async function activateElection(){

await fetch("/api/elections/activate",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ id:election.id })
})

router.push("/admin/elections")
router.refresh()

}

async function deactivateElection(){

await fetch(`/api/elections/${election.id}`,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ isActive:false })
})

router.push("/admin/elections")
router.refresh()

}

return(

<div className="max-w-xl space-y-6">

<h1 className="text-xl font-semibold text-white">
Edit Election
</h1>

<div className="space-y-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">

<input
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
className="w-full bg-black/30 border border-white/10 text-white rounded px-3 py-2"
/>

<select
value={form.type}
onChange={(e)=>setForm({...form,type:e.target.value})}
className="w-full bg-black/30 border border-white/10 text-white rounded px-3 py-2"
>
<option>Federal</option>
<option>Provincial</option>
<option>Local</option>
</select>

<input
type="number"
value={form.year}
onChange={(e)=>setForm({...form,year:e.target.value})}
className="w-full bg-black/30 border border-white/10 text-white rounded px-3 py-2"
/>

<input
value={form.phase}
onChange={(e)=>setForm({...form,phase:e.target.value})}
className="w-full bg-black/30 border border-white/10 text-white rounded px-3 py-2"
/>

<input
type="number"
value={form.voters}
onChange={(e)=>setForm({...form,voters:e.target.value})}
className="w-full bg-black/30 border border-white/10 text-white rounded px-3 py-2"
/>

<input
type="number"
value={form.totalSeats}
onChange={(e)=>setForm({...form,totalSeats:e.target.value})}
className="w-full bg-black/30 border border-white/10 text-white rounded px-3 py-2"
/>

<div className="flex gap-4 pt-3">

<button
onClick={save}
className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded"
>
Save Changes
</button>

{!election?.isActive && (

<button
onClick={activateElection}
className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
>
Activate Election
</button>

)}

{election?.isActive && (

<button
onClick={deactivateElection}
className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
>
Deactivate Election
</button>

)}

</div>

</div>

</div>

)

}