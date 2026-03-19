"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Editor from "@/components/Editor"

export const dynamic = "force-dynamic"

export default function CreatePost(){

const router = useRouter()

const MAX_IMAGES = 5
const MAX_SIZE = 2 * 1024 * 1024

const [categories,setCategories] = useState<any[]>([])
const [previewImages,setPreviewImages] = useState<string[]>([])
const [imageFiles,setImageFiles] = useState<File[]>([])
const [loading,setLoading] = useState(false)

const [form,setForm] = useState({
title:"",
content:"",
categoryId:"",
videoUrl:"",
metaTitle:"",
metaDescription:"",
metaKeywords:""
})

/* LOAD CATEGORIES */

useEffect(()=>{

async function load(){

try{

const res = await fetch("/api/categories")
const data = await res.json()

setCategories(data.categories || [])

}catch(err){
console.error("Category load error",err)
}

}

load()

},[])

/* IMAGE SELECT */

function handleImageSelect(files:FileList | null){

if(!files) return

const selected = Array.from(files)

if(selected.length + previewImages.length > MAX_IMAGES){
alert("अधिकतम 5 तस्बिर मात्र अपलोड गर्न सकिन्छ")
return
}

selected.forEach(file=>{

if(!file.type.startsWith("image/")){
alert("केवल image files मात्र अनुमति छ")
return
}

if(file.size > MAX_SIZE){
alert("प्रत्येक तस्बिर 2MB भन्दा सानो हुनुपर्छ")
return
}

const reader = new FileReader()

reader.onload = function(e){

setPreviewImages(prev=>[...prev,e.target?.result as string])
setImageFiles(prev=>[...prev,file])

}

reader.readAsDataURL(file)

})

}

/* REMOVE IMAGE */

function removeImage(index:number){

setPreviewImages(prev=> prev.filter((_,i)=>i!==index))
setImageFiles(prev=> prev.filter((_,i)=>i!==index))

}

/* SEO GENERATOR */

function generateSEO(){

if(!form.title) return

const text = form.content.replace(/<[^>]+>/g,"")

const desc = text.substring(0,155)

const keywords = form.title
.split(" ")
.slice(0,6)
.join(",")

setForm(prev=>({
...prev,
metaTitle: prev.title,
metaDescription: desc,
metaKeywords: keywords
}))

}

/* IMAGE UPLOAD */

async function uploadImages(){

const uploaded:string[] = []

for(const file of imageFiles){

const formData = new FormData()

formData.append("file",file)
formData.append(
"upload_preset",
process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
)

const res = await fetch(
`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
{
method:"POST",
body:formData
}
)

const data = await res.json()

if(data.secure_url){
uploaded.push(data.secure_url)
}

}

return uploaded

}

/* SUBMIT */

async function handleSubmit(e:any){

e.preventDefault()

if(!form.title.trim()){
alert("समाचार शीर्षक आवश्यक छ")
return
}

if(!form.content.trim()){
alert("समाचार सामग्री आवश्यक छ")
return
}

if(!form.categoryId){
alert("Category छान्नुहोस्")
return
}

setLoading(true)

try{

let images:string[] = []

if(imageFiles.length>0){
images = await uploadImages()
}

await fetch("/api/articles",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
title:form.title,
content:form.content,
categoryId:form.categoryId,
images,
videoUrl:form.videoUrl,
metaTitle:form.metaTitle,
metaDescription:form.metaDescription,
metaKeywords:form.metaKeywords
})
})

router.push("/admin/posts")
router.refresh()

}catch(err){

console.error(err)
alert("समाचार प्रकाशित गर्न सकिएन")

}

setLoading(false)

}

/* UI */

return(

<div className="p-10 bg-[#020617] text-white min-h-screen">

<h1 className="text-3xl font-bold mb-6">
समाचार लेख्नुहोस्
</h1>

<form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">

{/* MAIN CONTENT */}

<div className="col-span-2 space-y-6">

<input
placeholder="समाचार शीर्षक"
value={form.title}
onChange={e=>setForm({...form,title:e.target.value})}
className="w-full p-4 bg-slate-800 rounded text-lg"
/>

<div className="bg-white rounded text-black">

<Editor
value={form.content}
onChange={(v:string)=>setForm({...form,content:v})}
/>

</div>

<input
placeholder="Video URL"
value={form.videoUrl}
onChange={e=>setForm({...form,videoUrl:e.target.value})}
className="w-full p-3 bg-slate-800 rounded"
/>

{/* IMAGE UPLOAD */}

<div>

<label className="block mb-2">
तस्बिर अपलोड गर्नुहोस्
</label>

<input
type="file"
multiple
accept="image/*"
onChange={e=>handleImageSelect(e.target.files)}
/>

<p className="text-xs text-gray-400 mt-2">
अधिकतम 5 तस्बिर • प्रत्येक 2MB भन्दा सानो
</p>

<div className="flex flex-wrap gap-4 mt-4">

{previewImages.map((img,index)=>(

<div key={index} className="relative">

<img
src={img}
className="w-32 h-20 object-cover rounded border border-slate-700"
/>

<button
type="button"
onClick={()=>removeImage(index)}
className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded"
>
✕
</button>

</div>

))}

</div>

</div>

</div>

{/* SIDEBAR */}

<div className="bg-[#0f172a] p-6 rounded-xl space-y-4">

<select
value={form.categoryId}
onChange={e=>setForm({...form,categoryId:e.target.value})}
className="w-full p-3 bg-slate-800 rounded"
>

<option value="">Category छान्नुहोस्</option>

{categories.map(c=>(

<option key={c.id} value={c.id}>
{c.name}
</option>

))}

</select>

<button
type="button"
onClick={generateSEO}
className="w-full bg-purple-600 py-2 rounded"
>
SEO Generate
</button>

<input
placeholder="Meta Title"
value={form.metaTitle}
onChange={e=>setForm({...form,metaTitle:e.target.value})}
className="w-full p-2 bg-slate-800 rounded"
/>

<textarea
placeholder="Meta Description"
value={form.metaDescription}
onChange={e=>setForm({...form,metaDescription:e.target.value})}
className="w-full p-2 bg-slate-800 rounded"
/>

<input
placeholder="Keywords"
value={form.metaKeywords}
onChange={e=>setForm({...form,metaKeywords:e.target.value})}
className="w-full p-2 bg-slate-800 rounded"
/>

<button
disabled={loading}
className="w-full bg-orange-600 py-3 rounded font-semibold disabled:opacity-50"
>
{loading ? "Publishing..." : "समाचार प्रकाशित गर्नुहोस्"}
</button>

</div>

</form>

</div>

)

}