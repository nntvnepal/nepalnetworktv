"use client";

import { useEffect, useState } from "react";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function NewsletterPage(){

const [subs,setSubs] = useState([]);
const [search,setSearch] = useState("");

useEffect(()=>{
loadSubs();
},[]);

async function loadSubs(){

const res = await fetch("/api/admin/newsletter");
const data = await res.json();

setSubs(data);

}

async function deleteSub(id:string){

await fetch("/api/newsletter/delete",{
method:"DELETE",
body:JSON.stringify({id})
});

loadSubs();

}

function exportCSV(){

const rows = subs.map((s:any)=>s.email).join("\n");

const blob = new Blob([`email\n${rows}`]);

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href=url;
a.download="newsletter.csv";
a.click();

}

const filtered = subs.filter((s:any)=>
s.email.toLowerCase().includes(search.toLowerCase())
);

return(

<div className="p-8">

<div className="flex justify-between mb-6">

<h1 className="text-2xl font-bold">
Newsletter Subscribers
</h1>

<div className="flex gap-3">

<input
placeholder="Search email..."
className="border px-3 py-1 rounded"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<button
onClick={exportCSV}
className="bg-green-600 text-white px-4 py-1 rounded"
>
Export CSV
</button>

</div>

</div>

<table className="w-full border rounded-lg overflow-hidden">

<thead className="bg-gray-100">

<tr>
<th className="p-3 text-left">Email</th>
<th className="p-3 text-left">Joined</th>
<th className="p-3 text-left">Action</th>
</tr>

</thead>

<tbody>

{filtered.map((sub:any)=>(
<tr key={sub.id} className="border-t">

<td className="p-3">{sub.email}</td>

<td className="p-3">
{new Date(sub.createdAt).toLocaleDateString()}
</td>

<td className="p-3">

<button
onClick={()=>deleteSub(sub.id)}
className="text-red-600"
>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

);

}