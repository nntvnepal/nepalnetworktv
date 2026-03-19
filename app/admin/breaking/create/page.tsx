"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateBreaking() {

const router = useRouter()

const [headline,setHeadline] = useState("")
const [priority,setPriority] = useState(1)
const [expireMinutes,setExpireMinutes] = useState("")
const [isActive,setIsActive] = useState(true)
const [loading,setLoading] = useState(false)
const [error,setError] = useState("")
const [success,setSuccess] = useState("")

async function handleSubmit(e:React.FormEvent){

e.preventDefault()

setError("")
setSuccess("")

if(!headline.trim()){
setError("Breaking headline required")
return
}

setLoading(true)

try{

const res = await fetch("/api/breaking/create",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
headline: headline.trim(),
priority: Number(priority) || 1,
expireMinutes: expireMinutes ? Number(expireMinutes) : null,
isActive
})
})

const data = await res.json()

if(!res.ok){
throw new Error(data?.error || "Failed to create breaking news")
}

setSuccess("Breaking news created successfully")

setHeadline("")
setPriority(1)
setExpireMinutes("")
setIsActive(true)

/* small delay so admin sees success */

setTimeout(()=>{
router.push("/admin/breaking")
router.refresh()
},800)

}catch(err:any){

console.error(err)
setError(err.message || "Server error")

}

setLoading(false)

}

return(

<div className="max-w-2xl">

<h1 className="text-2xl font-semibold mb-8 text-white">
Create Breaking News
</h1>

<form
onSubmit={handleSubmit}
className="space-y-6"
>

{/* ERROR */}

{error && (
<div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
{error}
</div>
)}

{/* SUCCESS */}

{success && (
<div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
{success}
</div>
)}

{/* HEADLINE */}

<div>

<label className="block mb-2 text-sm text-gray-300">
Breaking Headline
</label>

<input
value={headline}
onChange={(e)=>setHeadline(e.target.value)}
placeholder="Enter breaking headline..."
className="w-full px-4 py-3 rounded-lg bg-black/40 border border-purple-500/40 text-white placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-600/40"
/>

</div>

{/* PRIORITY */}

<div>

<label className="block mb-2 text-sm text-gray-300">
Priority
</label>

<input
type="number"
min={1}
value={priority}
onChange={(e)=>setPriority(Number(e.target.value))}
className="w-full px-4 py-3 rounded-lg bg-black/40 border border-purple-500/40 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-600/40"
/>

<p className="text-xs text-gray-400 mt-2">
Higher priority shows breaking first
</p>

</div>

{/* EXPIRE */}

<div>

<label className="block mb-2 text-sm text-gray-300">
Expire After (Minutes)
</label>

<input
type="number"
value={expireMinutes}
onChange={(e)=>setExpireMinutes(e.target.value)}
placeholder="Example: 10"
className="w-full px-4 py-3 rounded-lg bg-black/40 border border-purple-500/40 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-600/40"
/>

<p className="text-xs text-gray-400 mt-2">
Breaking will automatically expire after these minutes
</p>

</div>

{/* ACTIVE */}

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={isActive}
onChange={(e)=>setIsActive(e.target.checked)}
className="w-4 h-4"
/>

<label className="text-sm text-gray-300">
Active Breaking
</label>

</div>

{/* BUTTON */}

<button
type="submit"
disabled={loading}
className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-6 py-3 rounded-lg text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
>

{loading ? "Saving..." : "Save Breaking News"}

</button>

</form>

</div>

)

}