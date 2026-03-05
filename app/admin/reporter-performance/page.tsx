"use client"

import { useEffect,useState } from "react"
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function ReporterPerformance(){

const [data,setData] = useState<any[]>([])

useEffect(()=>{

fetch("/api/admin/reporter-performance")
.then(res=>res.json())
.then(setData)

},[])

return(

<div className="p-8 space-y-6 text-white">

<h1 className="text-2xl font-bold">
Reporter Performance
</h1>

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-6">

<table className="w-full">

<thead>

<tr className="border-b border-gray-800">

<th>Name</th>
<th>Email</th>
<th>Articles</th>
<th>Total Views</th>
<th>Avg Views</th>

</tr>

</thead>

<tbody>

{data.map(r=>(

<tr key={r.id} className="border-b border-gray-800">

<td>{r.name}</td>
<td>{r.email}</td>
<td>{r.articles}</td>
<td>{r.views}</td>
<td>{r.avgViews}</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}