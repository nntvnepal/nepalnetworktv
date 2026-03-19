import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ObjectId } from "mongodb"

export default async function ManageElection({
params,
}:{
params:{ id:string }
}){

if(!ObjectId.isValid(params.id)){

return(

<div className="text-white p-6">
Invalid election ID
</div>
)

}

const election = await prisma.election.findUnique({
where:{ id:params.id }
})

if(!election){

return(

<div className="text-white p-6">
Election not found
</div>
)

}

const [seatCount,candidateCount,partyCount] = await Promise.all([

prisma.seat.count({
where:{ electionId:election.id }
}),

prisma.candidate.count(),

prisma.party.count()

])

return(

<div className="space-y-8 p-6">

{/* HEADER */}

<div>

<h1 className="text-2xl font-bold text-white">
Manage Election
</h1>

<p className="text-purple-300">
{election.name}
</p>

</div>

{/* ELECTION INFO */}

<div className="grid md:grid-cols-3 gap-6">

<Card
title="Type"
value={election.type}
/>

<Card
title="Year"
value={String(election.year ?? "-")}
/>

<Card
title="Status"
value={election.isActive ? "Active":"Draft"}
color={election.isActive ? "text-green-400":"text-yellow-400"}
/>

</div>

{/* ELECTION STATS */}

<div className="grid md:grid-cols-3 gap-6">

<Card
title="Seats"
value={String(seatCount)}
/>

<Card
title="Candidates"
value={String(candidateCount)}
/>

<Card
title="Parties"
value={String(partyCount)}
/>

</div>

{/* ACTIONS */}

<div className="grid md:grid-cols-3 gap-6">

<ActionCard
title="Edit Election"
desc="Edit election details"
href={`/admin/elections/${election.id}/edit`}
/>

<ActionCard
title="Seats"
desc="Manage constituencies"
href="/admin/elections/seats"
/>

<ActionCard
title="Candidates"
desc="Manage candidates"
href="/admin/elections/candidates"
/>

<ActionCard
title="Vote Entry"
desc="Enter votes"
href="/admin/elections/vote-entry"
/>

<ActionCard
title="Results"
desc="View election results"
href="/admin/elections/results"
/>

<ActionCard
title="Parties"
desc="Manage political parties"
href="/admin/elections/parties"
/>

</div>

</div>

)

}

function Card({
title,
value,
color="text-white"
}:{
title:string
value:string
color?:string
}){

return(

<div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">

<p className="text-purple-300 text-sm">
{title}
</p>

<p className={`text-xl font-semibold mt-1 ${color}`}>
{value}
</p>

</div>

)

}

function ActionCard({
title,
desc,
href
}:{
title:string
desc:string
href:string
}){

return(

<Link
href={href}
className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition block"
>

<h3 className="text-white font-semibold">
{title}
</h3>

<p className="text-purple-300 text-sm mt-1">
{desc}
</p>

</Link>

)

}
