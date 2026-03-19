import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { SeatPosition } from "@prisma/client"

const PAGE_SIZE = 20

export default async function SeatsPage({ searchParams }: any){

const page = Number(searchParams?.page || 1)
const search = searchParams?.search || ""
const position = searchParams?.position || ""

//////////////////////////////////////////////////////
// ACTIVE ELECTION
//////////////////////////////////////////////////////

const activeElection = await prisma.election.findFirst({
where:{ isActive:true }
})

//////////////////////////////////////////////////////
// BASE WHERE
//////////////////////////////////////////////////////

const where:any = {}

//////////////////////////////////////////////////////
// ELECTION TYPE FILTER
//////////////////////////////////////////////////////

if(activeElection?.type === "LOCAL"){

where.position = {
in:[
SeatPosition.MAYOR,
SeatPosition.DEPUTY_MAYOR,
SeatPosition.CHAIRPERSON,
SeatPosition.VICE_CHAIRPERSON,
SeatPosition.WARD_CHAIR,
SeatPosition.WARD_MEMBER
]
}

}

if(activeElection?.type === "PROVINCIAL"){

where.position = {
in:[
SeatPosition.MLA,
SeatPosition.MLA_PR
]
}

}

if(activeElection?.type === "FEDERAL"){

where.position = {
in:[
SeatPosition.MP,
SeatPosition.MP_PR
]
}

}

//////////////////////////////////////////////////////
// SEARCH
//////////////////////////////////////////////////////

if(search){

where.OR = [

{ name:{ contains:search, mode:"insensitive"} },
{ code:{ contains:search, mode:"insensitive"} }

]

}

//////////////////////////////////////////////////////
// MANUAL POSITION FILTER
//////////////////////////////////////////////////////

if(position){

where.position = position

}

//////////////////////////////////////////////////////
// DATA
//////////////////////////////////////////////////////

const [seats,total] = await Promise.all([

prisma.seat.findMany({

where,

include:{
region:true,
candidates:true,
results:true
},

orderBy:{
createdAt:"desc"
},

skip:(page-1)*PAGE_SIZE,
take:PAGE_SIZE

}),

prisma.seat.count({ where })

])

const totalPages = Math.ceil(total/PAGE_SIZE)

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="p-6 space-y-6">

<div className="flex items-center justify-between">

<h1 className="text-2xl font-bold text-white">
Seat Management
</h1>

<Link
href="/admin/elections/seats/new"
className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
>
Add Seat
</Link>

</div>

<form method="GET" className="flex gap-3">

<input
name="search"
defaultValue={search}
placeholder="Search seat..."
className="bg-purple-900 border border-purple-700 text-white px-3 py-2 rounded"
/>

<select
name="position"
defaultValue={position}
className="bg-purple-900 border border-purple-700 text-white px-3 py-2 rounded"
>

<option value="">All Positions</option>
<option value={SeatPosition.MAYOR}>Mayor</option>
<option value={SeatPosition.DEPUTY_MAYOR}>Deputy Mayor</option>
<option value={SeatPosition.CHAIRPERSON}>Chairperson</option>
<option value={SeatPosition.VICE_CHAIRPERSON}>Vice Chairperson</option>
<option value={SeatPosition.WARD_CHAIR}>Ward Chair</option>
<option value={SeatPosition.WARD_MEMBER}>Ward Member</option>
<option value={SeatPosition.MLA}>MLA</option>
<option value={SeatPosition.MLA_PR}>MLA PR</option>
<option value={SeatPosition.MP}>MP</option>
<option value={SeatPosition.MP_PR}>MP PR</option>

</select>

<button
className="bg-purple-700 px-4 py-2 rounded text-white hover:bg-purple-800"
>
Filter
</button>

</form>

<div className="bg-purple-950 border border-purple-800 rounded-lg overflow-hidden">

<table className="w-full text-sm text-purple-100">

<thead className="bg-purple-900">

<tr>

<th className="p-4 text-left">Seat</th>
<th className="p-4 text-left">Position</th>
<th className="p-4 text-left">Region</th>
<th className="p-4 text-left">Candidates</th>
<th className="p-4 text-right">Actions</th>

</tr>

</thead>

<tbody>

{seats.map((s:any)=>(

<tr
key={s.id}
className="border-t border-purple-800 hover:bg-purple-900/40"
>

<td className="p-4 font-medium">
{s.name}
</td>

<td className="p-4 capitalize">
{s.position}
</td>

<td className="p-4">
{s.region?.name || "-"}
</td>

<td className="p-4">
{s.candidates?.length || 0}
</td>

<td className="p-4">

<div className="flex justify-end gap-4">

<Link
href={`/admin/elections/seats/edit/${s.id}`}
className="text-blue-400 hover:underline"
>
Edit
</Link>

<form
action={`/api/seats/${s.id}`}
method="POST"
>

<button className="text-red-400 hover:underline">
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

<div className="flex justify-end gap-3 text-purple-200">

{page>1 &&(

<Link
href={`?page=${page-1}&search=${search}&position=${position}`}
className="px-3 py-1 border border-purple-600 rounded hover:bg-purple-900"
>
Previous
</Link>

)}

<span>

Page {page} of {totalPages}

</span>

{page<totalPages &&(

<Link
href={`?page=${page+1}&search=${search}&position=${position}`}
className="px-3 py-1 border border-purple-600 rounded hover:bg-purple-900"
>
Next
</Link>

)}

</div>

</div>

)

}