"use client"

import { useState } from "react"

export default function EditAdForm({ ad }: any){

const [title,setTitle] = useState(ad.title)
const [placement,setPlacement] = useState(ad.placement)
const [type,setType] = useState(ad.type)

const [link,setLink] = useState(ad.link || "")
const [adsenseCode,setAdsenseCode] = useState(ad.adsenseCode || "")

const [image,setImage] = useState(ad.imageUrl || "")
const [file,setFile] = useState<File | null>(null)

const [startDate,setStartDate] = useState(ad.startDate?.slice(0,10) || "")
const [endDate,setEndDate] = useState(ad.endDate?.slice(0,10) || "")

const [loading,setLoading] = useState(false)

//////////////////////////////////////////////////////
// IMAGE CHANGE
//////////////////////////////////////////////////////

function handleFile(e:any){

const f = e.target.files?.[0]

if(!f) return

setFile(f)

const reader = new FileReader()

reader.onload = (ev:any)=>{
setImage(ev.target.result)
}

reader.readAsDataURL(f)

}

//////////////////////////////////////////////////////
// SUBMIT
//////////////////////////////////////////////////////

async function handleSubmit(e:any){

e.preventDefault()

setLoading(true)

let imageUrl = ad.imageUrl

//////////////////////////////////////////////////////
// IMAGE UPLOAD
//////////////////////////////////////////////////////

if(file){

const formData = new FormData()

formData.append("file",file)

const upload = await fetch("/api/upload",{
method:"POST",
body:formData
})

const result = await upload.json()

if(result.success){
imageUrl = result.url
}

}

//////////////////////////////////////////////////////
// UPDATE AD
//////////////////////////////////////////////////////

const res = await fetch(`/api/ads/${ad.id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

title,
placement,
type,
imageUrl,
link,
adsenseCode,
startDate,
endDate

})

})

if(res.ok){

alert("Advertisement updated")

window.location.href="/admin/ads"

}else{

alert("Update failed")

}

setLoading(false)

}

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<form onSubmit={handleSubmit} className="space-y-5">

{/* TITLE */}

<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="w-full p-3 rounded bg-white text-black"
placeholder="Ad Title"
/>

{/* PLACEMENT */}

<select
value={placement}
onChange={(e)=>setPlacement(e.target.value)}
className="w-full p-3 rounded bg-white text-black"
>

<option value="homepage_after_hero">Homepage After Hero</option>
<option value="homepage_mid">Homepage Middle</option>
<option value="homepage_sidebar_top">Sidebar Top</option>
<option value="homepage_sidebar_bottom">Sidebar Bottom</option>
<option value="homepage_bottom">Homepage Bottom</option>

</select>

{/* TYPE */}

<select
value={type}
onChange={(e)=>setType(e.target.value)}
className="w-full p-3 rounded bg-white text-black"
>

<option value="image">Image Banner</option>
<option value="adsense">Adsense Code</option>

</select>

{/* IMAGE */}

{type==="image" &&(

<>

<input
type="file"
accept="image/*"
onChange={handleFile}
className="w-full p-3 rounded bg-white text-black"
/>

{image &&(

<img
src={image}
className="max-h-60 rounded border"
/>

)}

<input
value={link}
onChange={(e)=>setLink(e.target.value)}
placeholder="Target Link"
className="w-full p-3 rounded bg-white text-black"
/>

</>

)}

{/* ADSENSE */}

{type==="adsense" &&(

<textarea
rows={5}
value={adsenseCode}
onChange={(e)=>setAdsenseCode(e.target.value)}
className="w-full p-3 rounded bg-white text-black"
/>

)}

{/* DATE */}

<div className="grid grid-cols-2 gap-4">

<input
type="date"
value={startDate}
onChange={(e)=>setStartDate(e.target.value)}
className="p-3 rounded bg-white text-black"
/>

<input
type="date"
value={endDate}
onChange={(e)=>setEndDate(e.target.value)}
className="p-3 rounded bg-white text-black"
/>

</div>

<button
disabled={loading}
className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded"
>

{loading ? "Updating..." : "Update Advertisement"}

</button>

</form>

)

}