"use client"

import { useState } from "react"
import Link from "next/link"
import { deleteRegion } from "./actions"

export default function GeographyClient({ data, stats }: any) {

const [openProvince,setOpenProvince] = useState<string | null>(null)
const [openDistrict,setOpenDistrict] = useState<string | null>(null)
const [openLocal,setOpenLocal] = useState<string | null>(null)

async function handleDelete(id:string){

const confirmDelete = confirm("Delete this region?")

if(!confirmDelete) return

try{

await deleteRegion(id)

}catch(e){

alert("Cannot delete region with children")

}

}

return(

<div className="space-y-8">

{/* HEADER */}

<div className="flex justify-between items-center">

<h1 className="text-2xl font-semibold text-white">
Geography Dashboard
</h1>

<Link
href="/admin/elections/geography/new"
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
>
Add Region
</Link>

</div>


{/* STATS */}

<div className="grid grid-cols-4 gap-4">

<Stat title="Provinces" value={stats.provinces}/>
<Stat title="Districts" value={stats.districts}/>
<Stat title="Metro Cities" value={stats.metros}/>
<Stat title="Sub Metro" value={stats.subMetros}/>
<Stat title="Municipalities" value={stats.municipalities}/>
<Stat title="Rural Municipalities" value={stats.ruralMunicipalities}/>
<Stat title="Wards" value={stats.wards}/>

</div>


{/* PROVINCES */}

<div className="space-y-5">

{data.map((province:any)=>{

const isOpenProvince = openProvince === province.id

return(

<div
key={province.id}
className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl overflow-hidden"
>

{/* PROVINCE HEADER */}

<div
className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5 transition"
onClick={()=>{

setOpenProvince(
isOpenProvince ? null : province.id
)

setOpenDistrict(null)
setOpenLocal(null)

}}
>

<div className="flex items-center gap-3">

<span className="text-purple-200 text-lg">
{isOpenProvince ? "▾" : "▸"}
</span>

<span className="text-purple-200 font-semibold">
{province.name}
</span>

</div>

<div className="flex items-center gap-4">

<span className="text-xs text-purple-300">
{province.children?.length || 0} districts
</span>

<div className="flex gap-3 text-xs">

<Link
href={`/admin/elections/geography/edit/${province.id}`}
className="text-blue-400 hover:text-blue-300"
onClick={(e)=>e.stopPropagation()}
>
Edit
</Link>

<button
onClick={(e)=>{
e.stopPropagation()
handleDelete(province.id)
}}
className="text-red-400 hover:text-red-300"
>
Delete
</button>

</div>

</div>

</div>


{/* DISTRICTS */}

{isOpenProvince && (

<div className="border-t border-white/10 p-5">

<div className="grid grid-cols-4 gap-3">

{province.children?.map((district:any)=>{

const isOpenDistrict = openDistrict === district.id

return(

<div
key={district.id}
className={`rounded-lg p-3 cursor-pointer transition ${
isOpenDistrict
? "bg-purple-500/40"
: "bg-purple-900/40 hover:bg-purple-700/40"
}`}
onClick={()=>{

setOpenDistrict(
isOpenDistrict ? null : district.id
)

setOpenLocal(null)

}}
>

<div className="text-sm font-semibold text-white">
{district.name}
</div>

<div className="text-xs text-purple-200">
{district.children?.length || 0} local levels
</div>

<div className="flex gap-3 mt-2 text-xs">

<Link
href={`/admin/elections/geography/edit/${district.id}`}
className="text-blue-400 hover:text-blue-300"
onClick={(e)=>e.stopPropagation()}
>
Edit
</Link>

<button
onClick={(e)=>{
e.stopPropagation()
handleDelete(district.id)
}}
className="text-red-400 hover:text-red-300"
>
Delete
</button>

</div>

</div>

)

})}

</div>


{/* LOCAL LEVELS */}

{province.children?.map((district:any)=>{

if(openDistrict !== district.id) return null

return(

<div key={district.id} className="mt-6 space-y-3">

{district.children?.map((local:any)=>{

const isOpenLocal = openLocal === local.id

return(

<div key={local.id} className="flex flex-wrap items-center gap-3">

<div
className={`px-3 py-1 rounded cursor-pointer transition ${
isOpenLocal
? "bg-purple-400/40 text-white"
: "bg-purple-800/40 text-purple-100 hover:bg-purple-700/40"
}`}
onClick={()=>{

setOpenLocal(
isOpenLocal ? null : local.id
)

}}
>

{local.name}

</div>

<span className="text-xs text-purple-300">
{local.wards?.length || 0} wards
</span>

<div className="flex gap-3 text-xs">

<Link
href={`/admin/elections/geography/edit/${local.id}`}
className="text-blue-400 hover:text-blue-300"
>
Edit
</Link>

<button
onClick={()=>handleDelete(local.id)}
className="text-red-400 hover:text-red-300"
>
Delete
</button>

</div>


{/* WARDS */}

{isOpenLocal && (

<div className="w-full mt-2 flex flex-wrap gap-2">

{local.wards?.map((w:any)=>(

<span
key={w.id}
className="bg-purple-900/60 text-purple-200 px-2 py-1 rounded text-xs"
>
Ward {w.number}
</span>

))}

</div>

)}

</div>

)

})}

</div>

)

})}

</div>

)}

</div>

)

})}

</div>

</div>

)

}



function Stat({title,value}:{title:string,value:number}){

return(

<div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-lg p-4">

<div className="text-xs text-purple-300">
{title}
</div>

<div className="text-2xl font-bold text-white">
{value}
</div>

</div>

)

}