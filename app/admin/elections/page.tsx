import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ElectionDashboard(){

const elections = await prisma.election.findMany({
orderBy:{ createdAt:"desc" }
})

const activeElection = elections.find(e=>e.isActive)

const totalSeats = await prisma.seat.count()
const totalParties = await prisma.party.count()
const totalCandidates = await prisma.candidate.count()

return(

<div className="space-y-8">

{/* HEADER */}

<div>

<h1 className="text-3xl font-bold text-white">
Election Dashboard
</h1>

<p className="text-purple-300">
Manage election system, candidates and results
</p>

</div>


{/* STATUS CARDS */}

<div className="grid md:grid-cols-3 gap-6">

<Card
title="Election Status"
value={activeElection ? "Active Election" : "Draft Election"}
color={activeElection ? "text-green-400":"text-yellow-400"}
/>

<Card
title="Election Type"
value={activeElection?.type || "Not Selected"}
/>

<Card
title="Total Seats"
value={String(totalSeats)}
/>

</div>



{/* CONTROL CARDS */}

<div className="grid md:grid-cols-3 gap-6">

<MenuCard
title="Election Setup"
desc="Create and manage elections"
href="/admin/elections"
/>

<MenuCard
title="Geography"
desc="PROVINCE / DISTRICT / Local Levels"
href="/admin/elections/geography"
/>

<MenuCard
title="Parties"
desc={`${totalParties} Political Parties`}
href="/admin/elections/parties"
/>

<MenuCard
title="Candidates"
desc={`${totalCandidates} Candidates`}
href="/admin/elections/candidates"
/>

<MenuCard
title="Seats"
desc={`${totalSeats} Constituencies`}
href="/admin/elections/seats"
/>

<MenuCard
title="Results"
desc="Election result dashboard"
href="/admin/elections/results"
/>

</div>



{/* TV TOOLS */}

<div className="grid md:grid-cols-2 gap-6">

<MenuCard
title="Graphics Control"
desc="Control on-screen election graphics"
href="/admin/tv-control/election"
/>

<MenuCard
title="Breaking / Alerts"
desc="Push breaking election updates"
href="/admin/tv-control/breaking-news"
/>

</div>



{/* ELECTION LIST */}

<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">

<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">

<h2 className="text-white font-semibold">
Election List
</h2>

<Link
href="/admin/elections/new"
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
>
+ Add Election
</Link>

</div>

<table className="w-full text-sm">

<thead className="bg-white/5 text-purple-200">

<tr>

<th className="px-6 py-3 text-left">Election</th>
<th className="px-6 py-3 text-left">Type</th>
<th className="px-6 py-3 text-left">Year</th>
<th className="px-6 py-3 text-left">Seats</th>
<th className="px-6 py-3 text-left">Status</th>
<th className="px-6 py-3 text-left">Actions</th>

</tr>

</thead>

<tbody>

{elections.map(e=>(
<tr
key={e.id}
className="border-t border-white/10 hover:bg-white/5"
>

<td className="px-6 py-4 text-white font-medium">
{e.name}
</td>

<td className="px-6 py-4 text-purple-200">
{e.type}
</td>

<td className="px-6 py-4 text-purple-200">
{e.year ?? "-"}
</td>

<td className="px-6 py-4 text-purple-200">
{e.totalSeats ?? "-"}
</td>

<td className="px-6 py-4">

{e.isActive ? (

<span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
Active
</span>

):(

<span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs">
Draft
</span>

)}

</td>

<td className="px-6 py-4 flex gap-4">

<Link
href={`/admin/elections/${e.id}/edit`}
className="text-blue-400 hover:underline"
>
Edit
</Link>

<Link
href={`/admin/elections/${e.id}`}
className="text-purple-300 hover:underline"
>
Manage
</Link>

</td>

</tr>
))}

{elections.length === 0 &&(

<tr>

<td
colSpan={6}
className="text-center py-10 text-purple-300"
>

No elections created

</td>

</tr>

)}

</tbody>

</table>

</div>

</div>

)
}



function Card({title,value,color="text-white"}:{
title:string
value:string
color?:string
}){

return(

<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">

<p className="text-purple-300 text-sm">
{title}
</p>

<p className={`text-2xl font-semibold mt-2 ${color}`}>
{value}
</p>

</div>

)

}



function MenuCard({title,desc,href}:{
title:string
desc:string
href:string
}){

return(

<Link
href={href}
className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition block"
>

<h3 className="text-white font-semibold text-lg">
{title}
</h3>

<p className="text-purple-300 text-sm mt-1">
{desc}
</p>

</Link>

)

}