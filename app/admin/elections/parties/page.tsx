import { prisma } from "@/lib/prisma"
import Link from "next/link"
import PartyLogoUpload from "@/components/election/PartyLogoUpload"

const PAGE_SIZE = 16

export default async function PartyDashboard({ searchParams }: any){

const page = Number(searchParams?.page || 1)
const search = searchParams?.search || ""
const color = searchParams?.color || ""

const where:any = {}

if(search){
where.name = { contains: search, mode:"insensitive" }
}

if(color){
where.color = color
}

const [parties,total] = await Promise.all([

prisma.party.findMany({
where,
orderBy:{ name:"asc"},
skip:(page-1)*PAGE_SIZE,
take:PAGE_SIZE
}),

prisma.party.count({ where })

])

const totalPages = Math.ceil(total/PAGE_SIZE)

return(

<div className="p-6 space-y-6">

{/* HEADER */}

<div className="flex items-center justify-between">

<h1 className="text-2xl font-bold text-white">
Election Parties
</h1>

<Link
href="/admin/elections/parties/create"
className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
>
Add Party
</Link>

</div>

{/* STATS */}

<div className="grid grid-cols-3 gap-4">

<div className="bg-purple-900/60 border border-purple-700 rounded-lg p-4 hover:bg-purple-900 transition">
<p className="text-sm text-purple-200">Total Parties</p>
<p className="text-2xl font-bold text-white">{total}</p>
</div>

<div className="bg-purple-900/60 border border-purple-700 rounded-lg p-4 hover:bg-purple-900 transition">
<p className="text-sm text-purple-200">Current Page</p>
<p className="text-2xl font-bold text-white">{page}</p>
</div>

<div className="bg-purple-900/60 border border-purple-700 rounded-lg p-4 hover:bg-purple-900 transition">
<p className="text-sm text-purple-200">Showing</p>
<p className="text-2xl font-bold text-white">{parties.length}</p>
</div>

</div>

{/* FILTER */}

<form method="GET" className="flex gap-3 items-center">

<input
name="search"
defaultValue={search}
placeholder="Search party..."
className="bg-purple-900 border border-purple-700 text-white px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
/>

<input
type="color"
name="color"
defaultValue={color}
className="border border-purple-700 rounded cursor-pointer"
/>

<button className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 transition">
Filter
</button>

</form>

{/* TABLE */}

<div className="bg-purple-950 border border-purple-800 rounded-lg overflow-hidden">

<div className="overflow-x-auto">

<table className="w-full text-sm text-purple-100">

<thead className="bg-purple-900">

<tr>
<th className="p-4 text-left">Logo</th>
<th className="p-4 text-left">Party Name</th>
<th className="p-4 text-left">Code</th>
<th className="p-4 text-left">Color</th>
<th className="p-4 text-right">Actions</th>
</tr>

</thead>

<tbody>

{parties.length === 0 && (

<tr>

<td colSpan={5} className="text-center p-8 text-purple-300">
No parties found
</td>

</tr>

)}

{parties.map(p=>(

<tr
key={p.id}
className="border-t border-purple-800 hover:bg-purple-900/40 transition"
>

<td className="p-4">

<PartyLogoUpload
id={p.id}
logo={p.logo}
name={p.name}
/>

</td>

<td className="p-4 font-medium text-white">
{p.name}
</td>

<td className="p-4">

<span className="bg-purple-800 text-xs px-2 py-1 rounded">
{p.code}
</span>

</td>

<td className="p-4">

<div className="flex items-center gap-2">

<div
className="w-5 h-5 rounded border border-white shadow"
style={{background:p.color}}
/>

<span className="text-xs text-purple-300 font-mono">
{p.color}
</span>

</div>

</td>

<td className="p-4">

<div className="flex justify-end gap-4">

<Link
href={`/admin/elections/parties/edit/${p.id}`}
className="text-blue-400 hover:text-blue-300 hover:underline"
>
Edit
</Link>

<form
action={`/api/elections/parties/${p.id}`}
method="POST"
>

<button
className="text-red-400 hover:text-red-300 hover:underline"
>
Delete
</button>

</form>

</div>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

{/* PAGINATION */}

<div className="flex justify-end gap-3 text-purple-200 items-center">

{page>1 &&(

<Link
href={`?page=${page-1}&search=${search}&color=${color}`}
className="px-3 py-1 border border-purple-600 rounded hover:bg-purple-900 transition"
>
Previous
</Link>

)}

<span>
Page {page} of {totalPages || 1}
</span>

{page<totalPages &&(

<Link
href={`?page=${page+1}&search=${search}&color=${color}`}
className="px-3 py-1 border border-purple-600 rounded hover:bg-purple-900 transition"
>
Next
</Link>

)}

</div>

</div>

)
}