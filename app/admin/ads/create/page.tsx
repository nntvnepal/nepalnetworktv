"use client"

import { useState } from "react"

//////////////////////////////////////////////////////
// PLACEMENTS (MATCH PRISMA ENUM)
//////////////////////////////////////////////////////

const placements: Record<string,{label:string,size:string,desc:string}> = {

//////////////////// HOMEPAGE ////////////////////

homepage_top:{
label:"Homepage Top",
size:"970×180",
desc:"Top banner of homepage"
},

homepage_after_hero:{
label:"Homepage After Hero",
size:"970×180",
desc:"Below main hero section"
},

homepage_block_1:{
label:"Homepage Block 1",
size:"728×90",
desc:"Between homepage sections"
},

homepage_block_2:{
label:"Homepage Block 2",
size:"728×90",
desc:"Between homepage sections"
},

homepage_block_3:{
label:"Homepage Block 3",
size:"728×90",
desc:"Between homepage sections"
},

homepage_block_4:{
label:"Homepage Block 4",
size:"728×90",
desc:"Between homepage sections"
},

homepage_mid:{
label:"Homepage Middle",
size:"728×90",
desc:"Middle leaderboard"
},

homepage_after_list:{
label:"Homepage After List",
size:"728×90",
desc:"After homepage article list"
},

homepage_sidebar_top:{
label:"Homepage Sidebar Top",
size:"300×250",
desc:"Top sidebar ad"
},

homepage_sidebar_bottom:{
label:"Homepage Sidebar Bottom",
size:"300×250",
desc:"Bottom sidebar ad"
},

homepage_bottom:{
label:"Homepage Bottom",
size:"970×180",
desc:"Homepage footer banner"
},

//////////////////// ARTICLE ////////////////////

article_top:{
label:"Article Top",
size:"728×90",
desc:"Above article headline"
},

article_after_hero:{
label:"Article After Hero",
size:"728×90",
desc:"Below article image"
},

article_after_paragraph:{
label:"Article After Paragraph",
size:"728×90",
desc:"Inline paragraph ad"
},

article_mid:{
label:"Article Middle",
size:"728×90",
desc:"Middle of article content"
},

article_sidebar_top:{
label:"Article Sidebar Top",
size:"300×250",
desc:"Sidebar top advertisement"
},

article_sidebar_bottom:{
label:"Article Sidebar Bottom",
size:"300×250",
desc:"Sidebar bottom advertisement"
},

article_bottom:{
label:"Article Bottom",
size:"728×90",
desc:"End of article"
},

//////////////////// CATEGORY ////////////////////

category_top:{
label:"Category Top",
size:"970×180",
desc:"Top of category page"
},

category_after_3_posts:{
label:"Category After 3 Posts",
size:"728×90",
desc:"After first 3 articles"
},

category_after_6_posts:{
label:"Category After 6 Posts",
size:"728×90",
desc:"After 6 articles"
},

category_sidebar:{
label:"Category Sidebar",
size:"300×250",
desc:"Category sidebar ad"
},

category_bottom:{
label:"Category Bottom",
size:"970×180",
desc:"Bottom of category page"
},

//////////////////// GLOBAL ////////////////////

header_banner:{
label:"Header Banner",
size:"728×90",
desc:"Header navigation banner"
},

footer_banner:{
label:"Footer Banner",
size:"970×180",
desc:"Footer banner"
},

sticky_bottom:{
label:"Sticky Bottom",
size:"320×100",
desc:"Mobile sticky advertisement"
},

popup:{
label:"Popup Advertisement",
size:"Variable",
desc:"Popup modal advertisement"
}

}

//////////////////////////////////////////////////////
// COMPONENT
//////////////////////////////////////////////////////

export default function CreateAd(){

const [title,setTitle]=useState("")
const [placement,setPlacement]=useState("homepage_after_hero")
const [type,setType]=useState("image")
const [link,setLink]=useState("")
const [file,setFile]=useState<File|null>(null)
const [preview,setPreview]=useState("")
const [adsenseCode,setAdsenseCode]=useState("")
const [startDate,setStartDate]=useState("")
const [endDate,setEndDate]=useState("")
const [loading,setLoading]=useState(false)

//////////////////////////////////////////////////////
// IMAGE PREVIEW
//////////////////////////////////////////////////////

function handleFile(e:React.ChangeEvent<HTMLInputElement>){

const f=e.target.files?.[0]
if(!f) return

setFile(f)

const reader=new FileReader()

reader.onload=(ev)=>{
setPreview(ev.target?.result as string)
}

reader.readAsDataURL(f)

}

//////////////////////////////////////////////////////
// SUBMIT
//////////////////////////////////////////////////////

async function handleSubmit(e:React.FormEvent){

e.preventDefault()

if(!title){
alert("Ad title required")
return
}

setLoading(true)

try{

let imageUrl=""

//////////////////////////////////////////////////////
// IMAGE UPLOAD
//////////////////////////////////////////////////////

if(type==="image" && file){

const formData=new FormData()
formData.append("file",file)

const upload=await fetch("/api/upload",{method:"POST",body:formData})

const result=await upload.json()

if(!result.success){
alert("Image upload failed")
setLoading(false)
return
}

imageUrl=result.url

}

//////////////////////////////////////////////////////
// CREATE AD
//////////////////////////////////////////////////////

const res=await fetch("/api/ads",{

method:"POST",

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

startDate:startDate ? new Date(startDate) : null,
endDate:endDate ? new Date(endDate) : null

})

})

if(!res.ok) throw new Error("Ad creation failed")

alert("Advertisement created")

window.location.href="/admin/ads"

}catch(err){

console.error(err)
alert("Failed to create ad")

}

setLoading(false)

}

const selected=placements[placement]

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="max-w-2xl space-y-6">

<h1 className="text-2xl font-bold text-white">
Create Advertisement
</h1>

<form onSubmit={handleSubmit} className="space-y-5">

{/* TITLE */}

<input
required
placeholder="Ad Title"
className="w-full p-3 rounded bg-white text-black"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

{/* PLACEMENT */}

<select
className="w-full p-3 rounded bg-white text-black"
value={placement}
onChange={(e)=>setPlacement(e.target.value)}
>

{Object.entries(placements).map(([key,val])=>(

<option key={key} value={key}>
{val.label} ({val.size})
</option>

))}

</select>

{/* INFO */}

<div className="bg-white/10 border border-white/20 p-4 rounded text-sm text-white">

<p><b>Placement:</b> {selected.label}</p>
<p><b>Recommended Size:</b> {selected.size}</p>
<p><b>Description:</b> {selected.desc}</p>

</div>

{/* TYPE */}

<select
className="w-full p-3 rounded bg-white text-black"
value={type}
onChange={(e)=>setType(e.target.value)}
>

<option value="image">Image Banner</option>
<option value="adsense">Google Adsense</option>

</select>

{/* IMAGE */}

{type==="image" &&(

<>

<input
type="file"
accept="image/*"
className="w-full p-3 rounded bg-white text-black"
onChange={handleFile}
/>

{preview &&(

<img
src={preview}
className="rounded border mt-2 max-h-60"
/>

)}

<input
placeholder="Target Link"
className="w-full p-3 rounded bg-white text-black"
value={link}
onChange={(e)=>setLink(e.target.value)}
/>

</>

)}

{/* ADSENSE */}

{type==="adsense" &&(

<textarea
rows={6}
placeholder="Paste Adsense code"
className="w-full p-3 rounded bg-white text-black"
value={adsenseCode}
onChange={(e)=>setAdsenseCode(e.target.value)}
/>

)}

{/* DATE RANGE */}

<div className="grid grid-cols-2 gap-4">

<div>

<label className="text-sm text-gray-300 block mb-1">
Start Date
</label>

<input
type="date"
className="w-full p-3 rounded bg-white text-black"
value={startDate}
onChange={(e)=>setStartDate(e.target.value)}
/>

</div>

<div>

<label className="text-sm text-gray-300 block mb-1">
End Date
</label>

<input
type="date"
className="w-full p-3 rounded bg-white text-black"
value={endDate}
onChange={(e)=>setEndDate(e.target.value)}
/>

</div>

</div>

<button
type="submit"
disabled={loading}
className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded"
>

{loading ? "Creating..." : "Create Advertisement"}

</button>

</form>

</div>

)

}