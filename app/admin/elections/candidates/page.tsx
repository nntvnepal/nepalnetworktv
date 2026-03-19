import { prisma } from "@/lib/prisma"
import Link from "next/link"

const PAGE_SIZE = 20

export default async function CandidatesPage({ searchParams }: any) {

//////////////////////////////////////////////////////
// SEARCH + PAGINATION
//////////////////////////////////////////////////////

const page = Number(searchParams?.page || 1)
const search = searchParams?.search || ""

//////////////////////////////////////////////////////
// ACTIVE ELECTION
//////////////////////////////////////////////////////

const activeElection = await prisma.election.findFirst({
where:{ isActive:true }
})

if(!activeElection){
return(

<div className="p-8 text-center text-purple-300">

<h2 className="text-xl mb-2">No Active Election</h2>
<p>Please activate an election first.</p>

<Link
href="/admin/elections"
className="text-blue-400 underline mt-3 inline-block"
>
Go to Elections
</Link>

</div>

)
}

//////////////////////////////////////////////////////
// WHERE FILTER
//////////////////////////////////////////////////////

const where:any = {
electionId: activeElection.id
}

if(search){
where.name = {
contains:search,
mode:"insensitive"
}
}

//////////////////////////////////////////////////////
// FETCH DATA
//////////////////////////////////////////////////////

const [candidates,total] = await Promise.all([

prisma.candidate.findMany({

where,

include:{
seat:{
include:{
region:true
}
},
party:true
},

orderBy:{
createdAt:"desc"
},

skip:(page-1)*PAGE_SIZE,
take:PAGE_SIZE

}),

prisma.candidate.count({where})

])

const totalPages = Math.ceil(total / PAGE_SIZE)

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="p-6 space-y-6">

{/* HEADER */}

<div className="flex items-center justify-between">

<div>

<h1 className="text-2xl font-bold text-white">
Election Candidates
</h1>

<p className="text-purple-300 text-sm">
Active Election: {activeElection.name}
</p>

</div>

<Link
href="/admin/elections/candidates/new"
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
>
Add Candidate
</Link>

</div>

{/* SEARCH */}

<form method="GET" className="flex gap-3">

<input
name="search"
defaultValue={search}
placeholder="Search candidate..."
className="bg-purple-900 border border-purple-700 text-white px-3 py-2 rounded"
/>

<button
className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded"
>
Search
</button>

</form>

{/* TABLE */}

<div className="bg-purple-950 border border-purple-800 rounded-lg overflow-hidden">

<table className="w-full text-sm text-purple-100">

<thead className="bg-purple-900">

<tr>

<th className="p-4 text-left">Photo</th>
<th className="p-4 text-left">Name</th>
<th className="p-4 text-left">Party</th>
<th className="p-4 text-left">Seat</th>
<th className="p-4 text-left">Region</th>
<th className="p-4 text-right">Actions</th>

</tr>

</thead>

<tbody>

{candidates.length === 0 &&(

<tr>

<td
colSpan={6}
className="p-6 text-center text-purple-300"
>

No candidates found

</td>

</tr>

)}

{candidates.map((c:any)=>(

<tr
key={c.id}
className="border-t border-purple-800 hover:bg-purple-900/40"
>

<td className="p-4">

<img
src={c.photo || "/no-image.png"}
className="w-10 h-10 rounded object-cover"
/>

</td>

<td className="p-4 font-medium">
{c.name}
</td>

<td className="p-4 flex items-center gap-2">

{c.party?.logo &&(
<img
src={c.party.logo}
className="w-5 h-5"
/>
)}

{c.party?.name || "-"}

</td>

<td className="p-4">
{c.seat?.name || "-"}
</td>

<td className="p-4">
{c.seat?.region?.name || "-"}
</td>

<td className="p-4">

<div className="flex justify-end gap-4">

<Link
href={`/admin/elections/candidates/new?id=${c.id}`}
className="text-blue-400 hover:underline"
>
Edit
</Link>

<form
action={`/api/elections/candidates/${c.id}`}
method="POST"
>

<button
className="text-red-400 hover:underline"
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

{/* PAGINATION */}

<div className="flex justify-end gap-3 text-purple-200">

{page > 1 &&(

<Link
href={`?page=${page-1}&search=${search}`}
className="px-3 py-1 border border-purple-600 rounded"
>
Previous
</Link>

)}

<span>
Page {page} of {totalPages || 1}
</span>

{page < totalPages &&(

<Link
href={`?page=${page+1}&search=${search}`}
className="px-3 py-1 border border-purple-600 rounded"
>
Next
</Link>

)}

</div>

</div>

)

}