"use client"

import { useState } from "react"

export default function BreakingAdmin({initialData}:any){

const [data,setData] = useState(initialData)

async function toggle(id:string,isActive:boolean){

await fetch("/api/breaking/toggle",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({id,isActive:!isActive})
})

setData(data.map((n:any)=>
n.id===id?{...n,isActive:!isActive}:n
))

}

async function updateHeadline(id:string,value:string){

await fetch("/api/breaking/update",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({id,headline:value})
})

}

return(

<div className="p-6">

<div className="flex justify-between mb-8">

<h1 className="text-2xl font-bold text-white">
Breaking News Manager
</h1>

<a
href="/admin/breaking/create"
className="bg-purple-600 px-4 py-2 rounded text-white"
>
Add Breaking
</a>

</div>

<div className="space-y-4">

{data.map((item:any)=>(

<div
key={item.id}
className="bg-black/30 p-4 rounded flex justify-between items-center"
>

<input
defaultValue={item.headline}
onBlur={(e)=>updateHeadline(item.id,e.target.value)}
className="bg-transparent text-white w-full outline-none"
/>

<div className="flex gap-4 items-center">

<span className="text-gray-400">
Priority {item.priority}
</span>

<button
onClick={()=>toggle(item.id,item.isActive)}
className={`px-3 py-1 rounded ${
item.isActive
?"bg-green-600"
:"bg-gray-600"
}`}
>
{item.isActive?"Active":"Inactive"}
</button>

<form action={`/api/breaking/delete?id=${item.id}`} method="post">
<button className="text-red-400">Delete</button>
</form>

</div>

</div>

))}

</div>

</div>

)

}