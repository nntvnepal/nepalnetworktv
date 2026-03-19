"use client"

import { useState } from "react"

export default function CreateParty(){

const [preview,setPreview] = useState<string | null>(null)

return(

<div className="p-6 space-y-6">

<h1 className="text-2xl font-bold text-white">
Add Election Party
</h1>

<div className="bg-purple-950 border border-purple-800 rounded-lg p-6 max-w-lg">

<form
action="/api/elections/parties"
method="POST"
encType="multipart/form-data"
className="space-y-5"
>

{/* PARTY NAME */}

<div className="flex flex-col gap-1">

<label className="text-sm text-purple-300">
Party Name
</label>

<input
name="name"
placeholder="Nepali Congress"
required
className="bg-purple-900 border border-purple-700 text-white px-3 py-2 rounded"
/>

</div>

{/* PARTY CODE */}

<div className="flex flex-col gap-1">

<label className="text-sm text-purple-300">
Party Code
</label>

<input
name="code"
placeholder="NC"
required
className="bg-purple-900 border border-purple-700 text-white px-3 py-2 rounded"
/>

</div>

{/* LOGO UPLOAD */}

<div className="flex flex-col gap-2">

<label className="text-sm text-purple-300">
Party Logo
</label>

<div className="flex items-center gap-4">

<div className="w-14 h-14 bg-white rounded flex items-center justify-center overflow-hidden">

{preview ? (

<img
src={preview}
className="object-contain w-full h-full"
/>

) : (

<span className="text-xs text-gray-400">
No Logo
</span>

)}

</div>

<input
type="file"
name="logo"
accept="image/*"
required
className="text-sm text-purple-200"
onChange={(e)=>{

const file = e.target.files?.[0]

if(file){

setPreview(URL.createObjectURL(file))

}

}}
/>

</div>

</div>

{/* COLOR */}

<div className="flex flex-col gap-2">

<label className="text-sm text-purple-300">
Party Color
</label>

<input
type="color"
name="color"
defaultValue="#ff0000"
className="w-20 h-10 border border-purple-700 rounded cursor-pointer"
/>

</div>

{/* SUBMIT */}

<button
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"

>

Create Party </button>

</form>

</div>

</div>

)
}
