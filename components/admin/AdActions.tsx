"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdActions({ad}:any){

const router = useRouter()

const [loading,setLoading] = useState(false)

//////////////////////////////////////////////////
// PAUSE
//////////////////////////////////////////////////

async function togglePause(){

setLoading(true)

await fetch(`/api/ads/pause/${ad.id}`,{
method:"POST"
})

router.refresh()

setLoading(false)

}

//////////////////////////////////////////////////
// DELETE
//////////////////////////////////////////////////

async function deleteAd(){

if(!confirm("Delete this advertisement?")) return

setLoading(true)

await fetch(`/api/ads/delete/${ad.id}`,{
method:"DELETE"
})

router.refresh()

}

return(

<div className="flex justify-center gap-3">

<a
href={`/admin/ads/edit/${ad.id}`}
className="text-blue-400 hover:underline"
>
Edit
</a>

<button
onClick={togglePause}
disabled={loading}
className="text-yellow-400 hover:underline"
>
{ad.status==="active" ? "Pause" : "Resume"}
</button>

<button
onClick={deleteAd}
className="text-red-400 hover:underline"
>
Delete
</button>

</div>

)

}