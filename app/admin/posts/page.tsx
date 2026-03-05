"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function AdminPosts() {

const [posts,setPosts]=useState<any[]>([]);
const [loading,setLoading]=useState(false);
const [status,setStatus]=useState("");
const [editorialFilter,setEditorialFilter]=useState<"all"|"true">("all");
const [astrologyFilter,setAstrologyFilter]=useState<"all"|"true">("all");

const [stats,setStats]=useState({
total:0,
pending:0,
approved:0,
rejected:0,
draft:0,
editorial:0,
horoscope:0
});

/* ================= FETCH ================= */

useEffect(()=>{
fetchPosts();
fetchStats();
},[status,editorialFilter,astrologyFilter]);

const fetchPosts=async()=>{
setLoading(true);
try{

const params=new URLSearchParams();

if(status) params.append("status",status);
if(editorialFilter==="true") params.append("editorial","true");
if(astrologyFilter==="true") params.append("astrology","true");

const res=await fetch(`/api/articles?${params.toString()}`);
const data=await res.json();

if(data.success){
setPosts(data.articles||[]);
}

}catch(e){
console.error(e);
}
setLoading(false);
};

const fetchStats=async()=>{
try{
const res=await fetch("/api/articles/stats");
const data=await res.json();
if(data.success){
setStats({
total:data.stats.total??0,
pending:data.stats.pending??0,
approved:data.stats.approved??0,
rejected:data.stats.rejected??0,
draft:data.stats.draft??0,
editorial:data.stats.editorial??0,
horoscope:data.stats.horoscope??0
});
}
}catch(e){
console.error(e);
}
};

/* ================= ACTIONS ================= */

const updateStatus=async(id:string,newStatus:string,current:string)=>{
if(newStatus===current) return;

if(!confirm(`Change status to "${newStatus.toUpperCase()}" ?`)){
fetchPosts();
return;
}

try{
const res=await fetch(`/api/articles/${id}`,{
method:"PATCH",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({status:newStatus})
});

const data=await res.json();

if(!data.success){
alert("Status update failed");
}

}catch(error){
console.error(error);
alert("Server error while updating");
}

fetchPosts();
fetchStats();
};

const deletePost=async(id:string)=>{
if(!confirm("Delete permanently?")) return;

try{
await fetch(`/api/articles/${id}`,{
method:"DELETE"
});
}catch(e){
console.error(e);
}

fetchPosts();
fetchStats();
};

const quickReject=async(id:string)=>{
if(!confirm("Reject this article?")) return;

try{
await fetch(`/api/articles/${id}`,{
method:"PATCH",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({status:"rejected"})
});
}catch(e){
console.error(e);
}

fetchPosts();
fetchStats();
};

/* ================= UI HELPERS ================= */

const Card=({title,value,color,active,onClick}:any)=>(
<div
onClick={onClick}
className={`cursor-pointer p-5 rounded-xl ${color}
shadow hover:scale-105 transition
${active?"ring-2 ring-white":""}`}
>
<p className="text-sm opacity-80">{title}</p>
<h2 className="text-2xl font-bold mt-2">{value??0}</h2>
</div>
);

const statusBadge=(status:string)=>{
switch(status){
case "approved": return "bg-green-600";
case "pending": return "bg-yellow-500";
case "rejected": return "bg-red-600";
case "draft": return "bg-gray-600";
default: return "bg-gray-500";
}
};

/* ================= PAGE ================= */

return(
<div className="p-8 bg-[#0f172a] text-white min-h-screen">

<h1 className="text-3xl font-bold mb-8">
News-Editorial-Horoscope Dashboard
</h1>

{/* ================= STATS ================= */}

<div className="grid grid-cols-2 md:grid-cols-8 gap-5 mb-10">

<Card title="Total" value={stats.total} color="bg-blue-600"
active={status===""}
onClick={()=>{setStatus("");setEditorialFilter("all");setAstrologyFilter("all");}} />

<Card title="Pending" value={stats.pending} color="bg-yellow-500"
active={status==="pending"}
onClick={()=>setStatus("pending")} />

<Card title="Approved" value={stats.approved} color="bg-green-600"
active={status==="approved"}
onClick={()=>setStatus("approved")} />

<Card title="Rejected" value={stats.rejected} color="bg-red-600"
active={status==="rejected"}
onClick={()=>setStatus("rejected")} />

<Card title="Draft" value={stats.draft} color="bg-gray-600"
active={status==="draft"}
onClick={()=>setStatus("draft")} />

<Card title="Editorial" value={stats.editorial} color="bg-orange-600"
active={editorialFilter==="true"}
onClick={()=>{setEditorialFilter("true");setAstrologyFilter("all");setStatus("");}} />

<Card title="Horoscope" value={stats.horoscope} color="bg-purple-600"
active={astrologyFilter==="true"}
onClick={()=>{setAstrologyFilter("true");setEditorialFilter("all");setStatus("");}} />

</div>

{/* CREATE BUTTONS */}

<div className="flex justify-end gap-3 mb-6">
<Link href="/admin/posts/create" className="bg-orange-600 px-4 py-2 rounded hover:opacity-90">
+ News
</Link>
<Link href="/admin/posts/editorial" className="bg-purple-600 px-4 py-2 rounded hover:opacity-90">
Editorial
</Link>
<Link href="/admin/posts/astrology" className="bg-indigo-600 px-4 py-2 rounded hover:opacity-90">
🔮 Astrology
</Link>
</div>

{/* TABLE */}

<div className="bg-[#1e293b] rounded-xl overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-[#0f172a] text-gray-300">
<tr>
<th className="p-4">Title</th>
<th className="p-4">Status</th>
<th className="p-4 text-center">Editorial</th>
<th className="p-4">Category</th>
<th className="p-4">Date</th>
<th className="p-4">Actions</th>
</tr>
</thead>

<tbody>

{loading?
<tr><td colSpan={6} className="text-center p-6">Loading...</td></tr>
:
posts.length===0?
<tr><td colSpan={6} className="text-center p-6 text-gray-400">No posts found</td></tr>
:
posts.map(post=>(
<tr key={post.id} className="border-t border-gray-700 hover:bg-[#243044]">

<td className="p-4">{post.title}</td>

<td className="p-4">
<select
value={post.status}
onChange={(e)=>updateStatus(post.id,e.target.value,post.status)}
className={`px-3 py-1 rounded text-white ${statusBadge(post.status)}`}
>
<option value="pending">Pending</option>
<option value="approved">Approved</option>
<option value="rejected">Rejected</option>
<option value="draft">Draft</option>
</select>
</td>

<td className="p-4 text-center">
<input type="checkbox" checked={post.isEditorial} disabled className="h-4 w-4 opacity-60"/>
</td>

<td className="p-4">{post.category?.name||"-"}</td>

<td className="p-4">
{new Date(post.createdAt).toLocaleDateString()}
</td>

<td className="p-4 flex gap-2">
<Link href={`/admin/posts/edit/${post.id}`}
className="bg-blue-600 px-3 py-1 rounded text-xs hover:opacity-90">
Edit
</Link>

<button onClick={()=>deletePost(post.id)}
className="bg-red-600 px-3 py-1 rounded text-xs hover:opacity-90">
Delete
</button>

{post.status!=="rejected"&&(
<button onClick={()=>quickReject(post.id)}
className="bg-yellow-600 px-3 py-1 rounded text-xs hover:opacity-90">
Reject
</button>
)}
</td>

</tr>
))
}

</tbody>
</table>

</div>

</div>
);
}