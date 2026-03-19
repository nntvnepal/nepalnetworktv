"use client"

import { useEffect, useState } from "react"

type Category = {
id:string
name:string
slug:string
description?:string
color?:string
status:"active"|"hidden"
postCount?:number
}

type FormType={
name:string
slug:string
description:string
color:string
status:"active"|"hidden"
}

function generateSlug(text:string){
return text
.toLowerCase()
.replace(/[^a-z0-9\s-]/g,"")
.replace(/\s+/g,"-")
.trim()
}

export default function AdminCategories(){

const PAGE_SIZE = 10

const [categories,setCategories]=useState<Category[]>([])
const [search,setSearch]=useState("")
const [page,setPage]=useState(1)

const [form,setForm]=useState<FormType>({
name:"",
slug:"",
description:"",
color:"#f97316",
status:"active"
})

const [editingId,setEditingId]=useState<string|null>(null)
const [loading,setLoading]=useState(false)

useEffect(()=>{
fetchCategories()
},[])

async function fetchCategories(){

try{

const res=await fetch("/api/categories")
const data=await res.json()

if(data.success){
setCategories(data.categories)
}

}catch(err){
console.error(err)
}

}

/* INPUT */

function handleChange(e:any){

const {name,value}=e.target

setForm(prev=>({
...prev,
[name]:value,
...(name==="name" && {slug:generateSlug(value)})
}))

}

/* SAVE */

async function handleSubmit(e:any){

e.preventDefault()

setLoading(true)

try{

const url = editingId
? `/api/categories/${editingId}`
: "/api/categories"

const method = editingId ? "PUT":"POST"

const res=await fetch(url,{
method,
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(form)
})

const data=await res.json()

if(!data.success){
alert(data.error||"Operation failed")
}

}catch(err){
console.error(err)
}

setForm({
name:"",
slug:"",
description:"",
color:"#f97316",
status:"active"
})

setEditingId(null)

fetchCategories()

setLoading(false)

}

/* DELETE */

async function deleteCategory(id:string){

if(!confirm("Delete this category?")) return

await fetch(`/api/categories/${id}`,{method:"DELETE"})

fetchCategories()

}

/* STATUS */

async function toggleStatus(cat:Category){

await fetch(`/api/categories/${cat.id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
...cat,
status:cat.status==="active"?"hidden":"active"
})

})

fetchCategories()

}

/* EDIT */

function editCategory(cat:Category){

setEditingId(cat.id)

setForm({
name:cat.name,
slug:cat.slug,
description:cat.description||"",
color:cat.color||"#f97316",
status:cat.status
})

window.scrollTo({top:0,behavior:"smooth"})

}

/* SEARCH */

const filtered = categories.filter(c=>
c.name.toLowerCase().includes(search.toLowerCase())
)

/* PAGINATION */

const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

const paginated = filtered.slice(
(page-1)*PAGE_SIZE,
page*PAGE_SIZE
)

/* STATS */

const totalCategories = categories.length
const activeCategories = categories.filter(c=>c.status==="active").length
const hiddenCategories = categories.filter(c=>c.status==="hidden").length

return(

<div className="min-h-screen bg-[#0f172a] text-white p-8">

<h1 className="text-3xl font-bold mb-8">
Category Management
</h1>

{/* STATS */}

<div className="grid grid-cols-3 gap-6 mb-8">

<StatBox label="Total Categories" value={totalCategories}/>
<StatBox label="Active Categories" value={activeCategories}/>
<StatBox label="Hidden Categories" value={hiddenCategories}/>

</div>

{/* FORM */}

<div className="bg-[#1f2937] p-6 rounded-xl mb-8 border border-gray-700">

<h2 className="text-lg mb-4">
{editingId ? "Edit Category":"Add Category"}
</h2>

<form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Category Name (नेपाली)"
className="p-3 bg-[#111827] rounded"
/>

<input
name="slug"
value={form.slug}
onChange={handleChange}
placeholder="Slug (english)"
className="p-3 bg-[#111827] rounded"
/>

<input
type="color"
name="color"
value={form.color}
onChange={handleChange}
className="p-1 h-12"
/>

<select
name="status"
value={form.status}
onChange={handleChange}
className="p-3 bg-[#111827] rounded"
>
<option value="active">Active</option>
<option value="hidden">Hidden</option>
</select>

<textarea
name="description"
value={form.description}
onChange={handleChange}
placeholder="Description"
className="p-3 bg-[#111827] rounded md:col-span-2"
/>

<button
disabled={loading}
className="bg-orange-600 py-3 rounded font-semibold md:col-span-2"
>
{loading ? "Saving..." : editingId ? "Update Category":"Create Category"}
</button>

</form>

</div>

{/* SEARCH */}

<div className="mb-4">

<input
placeholder="Search category..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="p-3 bg-[#111827] rounded w-64"
/>

</div>

{/* TABLE */}

<div className="bg-[#1f2937] rounded-xl border border-gray-700 overflow-hidden">

<table className="w-full text-sm">

<thead className="bg-[#111827]">

<tr>

<th className="p-3 text-left">Name</th>
<th>Slug</th>
<th>Posts</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{paginated.map(cat=>(

<tr key={cat.id} className="border-t border-gray-700">

<td className="p-3 flex items-center gap-2">

<span
className="w-3 h-3 rounded-full"
style={{background:cat.color}}
/>

{cat.name}

</td>

<td>{cat.slug}</td>

<td>{cat.postCount||0}</td>

<td>

<button
onClick={()=>toggleStatus(cat)}
className={`px-3 py-1 rounded text-sm ${
cat.status==="active"
? "bg-green-600"
: "bg-gray-600"
}`}
>
{cat.status}
</button>

</td>

<td className="space-x-2">

<button
onClick={()=>editCategory(cat)}
className="bg-blue-600 px-3 py-1 rounded"
>
Edit
</button>

<button
onClick={()=>deleteCategory(cat.id)}
className="bg-red-600 px-3 py-1 rounded"
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* PAGINATION */}

{totalPages > 1 && (

<div className="flex gap-2 mt-6">

{Array.from({length:totalPages}).map((_,i)=>(

<button
key={i}
onClick={()=>setPage(i+1)}
className={`px-3 py-1 rounded ${
page===i+1
? "bg-orange-600"
: "bg-gray-700"
}`}
>
{i+1}
</button>

))}

</div>

)}

</div>

)

}

/* STAT BOX */

function StatBox({label,value}:{label:string,value:number}){

return(

<div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700 text-center">

<p className="text-gray-400 text-sm">{label}</p>

<p className="text-2xl font-bold">{value}</p>

</div>

)

}