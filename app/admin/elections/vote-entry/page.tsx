import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function VoteEntryPage(){

//////////////////////////////////////////////////////
// ACTIVE ELECTION
//////////////////////////////////////////////////////

const election = await prisma.election.findFirst({
where:{ isActive:true }
})

if(!election){

return(
<div className="p-10 text-white">
No Active Election
</div>
)

}

//////////////////////////////////////////////////////
// SEATS WITH CANDIDATES
//////////////////////////////////////////////////////

const seats = await prisma.seat.findMany({

where:{
candidates:{
some:{
electionId:election.id
}
}
},

include:{
region:true,
candidates:{
include:{
party:true,
results:{
where:{ electionId:election.id }
}
}
}

}

})

//////////////////////////////////////////////////////
// STATS
//////////////////////////////////////////////////////

const totalSeats = seats.length

let votesCounted = 0
let seatsReported = 0
let candidateCount = 0

const partyVotes:any = {}

seats.forEach(seat=>{

let seatVotes = 0

seat.candidates.forEach(c=>{

candidateCount++

const v = c.results?.[0]?.votes || 0

votesCounted += v
seatVotes += v

const partyName = c.party?.name || "Independent"

if(!partyVotes[partyName]){
partyVotes[partyName] = 0
}

partyVotes[partyName] += v

})

if(seatVotes > 0){
seatsReported++
}

})

//////////////////////////////////////////////////////
// TOP PARTIES
//////////////////////////////////////////////////////

const topParties = Object.entries(partyVotes)
.sort((a:any,b:any)=>b[1]-a[1])
.slice(0,5)

//////////////////////////////////////////////////////
// PROGRESS
//////////////////////////////////////////////////////

const expectedVotes = election.voters || 0

const progress = expectedVotes
? Math.min(100,Math.round((votesCounted/expectedVotes)*100))
: 0

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="p-8 space-y-8 text-white">

{/* HEADER */}

<div className="flex justify-between items-center">

<div>

<h1 className="text-2xl font-bold">
Vote Entry
</h1>

<p className="text-purple-300 text-sm">
{election.name}
</p>

</div>

<Link
href="/admin/elections/vote-entry/bulk"
className="bg-yellow-500 text-black px-4 py-2 rounded"
>
Bulk Vote Entry
</Link>

</div>

{/* PROGRESS BAR */}

<div>

<div className="flex justify-between text-sm text-purple-300 mb-1">

<span>Counting Progress</span>
<span>{progress}%</span>

</div>

<div className="w-full bg-purple-900 rounded h-3">

<div
className="bg-green-500 h-3 rounded"
style={{ width:`${progress}%` }}
/>

</div>

</div>

{/* STATS */}

<div className="grid grid-cols-4 gap-4">

<div className="bg-purple-900 p-4 rounded">

<p className="text-sm text-purple-300">
Seats With Candidates
</p>

<p className="text-xl font-bold">
{totalSeats}
</p>

</div>

<div className="bg-purple-900 p-4 rounded">

<p className="text-sm text-purple-300">
Seats Reported
</p>

<p className="text-xl font-bold">
{seatsReported}
</p>

</div>

<div className="bg-purple-900 p-4 rounded">

<p className="text-sm text-purple-300">
Votes Counted
</p>

<p className="text-xl font-bold">
{votesCounted.toLocaleString()}
</p>

</div>

<div className="bg-purple-900 p-4 rounded">

<p className="text-sm text-purple-300">
Candidates
</p>

<p className="text-xl font-bold">
{candidateCount}
</p>

</div>

</div>

{/* GRID + PARTY */}

<div className="grid grid-cols-4 gap-6">

{/* SEATS */}

<div className="col-span-3 grid grid-cols-4 gap-4">

{seats.map(seat=>{

let seatVotes = 0

seat.candidates.forEach(c=>{
seatVotes += c.results?.[0]?.votes || 0
})

const status =
seatVotes === 0
? "Pending"
: "Entered"

return(

<Link
key={seat.id}
href={`/admin/elections/vote-entry/${seat.id}`}
className="bg-purple-900 border border-purple-800 rounded p-4 hover:bg-purple-800"
>

<p className="text-xs text-purple-300">
{seat.region?.name}
</p>

<p className="font-semibold text-sm">
{seat.name}
</p>

<p className="text-xs text-purple-400">
{seat.candidates.length} Candidates
</p>

<p className={`text-xs mt-2 ${
status === "Entered"
? "text-green-400"
: "text-red-400"
}`}>

{status === "Entered" ? "✔ Entered" : "Pending"}

</p>

</Link>

)

})}

</div>

{/* PARTY PANEL */}

<div className="bg-purple-900 p-4 rounded space-y-4">

<h2 className="text-sm font-semibold">
Top Parties (Votes)
</h2>

{topParties.map((p:any,index)=>{

const percent = votesCounted
? Math.round((p[1]/votesCounted)*100)
: 0

return(

<div key={index}>

<div className="flex justify-between text-xs">

<span>{p[0]}</span>
<span>{p[1].toLocaleString()}</span>

</div>

<div className="bg-purple-800 h-2 rounded mt-1">

<div
className="bg-green-500 h-2 rounded"
style={{ width:`${percent}%` }}
/>

</div>

</div>

)

})}

</div>

</div>

</div>

)

}