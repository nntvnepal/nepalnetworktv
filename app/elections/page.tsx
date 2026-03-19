import { prisma } from "@/lib/prisma"

export default async function ElectionHome(){

//////////////////////////////////////////////////////
// ACTIVE ELECTION
//////////////////////////////////////////////////////

const election = await prisma.election.findFirst({
where:{isActive:true}
})

//////////////////////////////////////////////////////
// RESULTS
//////////////////////////////////////////////////////

const results = await prisma.electionResult.findMany({

where:{ electionId:election?.id },

include:{
candidate:true,
party:true,
seat:{
include:{
region:true
}
}
}

})

//////////////////////////////////////////////////////
// PARTY SEATS
//////////////////////////////////////////////////////

const partySeats:any={}

results.forEach(r=>{
const party=r.party?.name || "Independent"
partySeats[party]=(partySeats[party]||0)+1
})

//////////////////////////////////////////////////////
// GROUP BY SEAT (FOR BATTLE CARDS)
//////////////////////////////////////////////////////

const seatMap:any={}

results.forEach(r=>{

if(!seatMap[r.seatId]){
seatMap[r.seatId]=[]
}

seatMap[r.seatId].push(r)

})

//////////////////////////////////////////////////////
// HOT SEATS
//////////////////////////////////////////////////////

const hotSeats=Object.values(seatMap)
.map((seat:any)=>seat.sort((a:any,b:any)=>b.votes-a.votes))
.slice(0,6)

//////////////////////////////////////////////////////
// PROVINCES
//////////////////////////////////////////////////////

const provinces=await prisma.region.findMany({
where:{type:"PROVINCE"}
})

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="election-bg p-10 space-y-12">

{/* HEADER */}

<div className="glass-light p-10 text-center">

<h1 className="text-4xl font-bold text-white">
{election?.name}
</h1>

<p className="text-purple-200">
Election Year {election?.year}
</p>

</div>

{/* SEARCH BAR */}

<div className="glass-light p-4 flex gap-3">

<input
placeholder="Search Candidate"
className="flex-1 px-3 py-2 rounded"
/>

<select className="px-3 py-2 rounded">
<option>Province</option>
{provinces.map(p=>(

<option key={p.id}>
{p.name}
</option>

))}
</select>

<select className="px-3 py-2 rounded">
<option>District</option>
</select>

<select className="px-3 py-2 rounded">
<option>Seat</option>
</select>

<button className="bg-purple-700 text-white px-6 py-2 rounded">
Search
</button>

</div>

{/* MAP + PARTY PANEL */}

<div className="grid grid-cols-3 gap-6">

<div className="col-span-2 glass p-6">

<h2 className="text-white font-bold mb-4">
Election Map
</h2>

<div className="h-[420px] flex items-center justify-center text-purple-200">

MAP COMPONENT HERE

</div>

</div>

<div className="glass p-6">

<h3 className="text-white font-bold mb-4">
Party-wise Results
</h3>

{Object.entries(partySeats).map(([party,count])=>(

<div key={party} className="flex justify-between text-white mb-2">

<span>{party}</span>

<span className="font-bold">
{count as number}
</span>

</div>

))}

</div>

</div>

{/* HOT SEATS BATTLES */}

<div>

<h2 className="text-white text-xl font-bold mb-4">
Key Battles
</h2>

<div className="grid grid-cols-2 gap-6">

{hotSeats.map((seat:any,i)=>{

const winner=seat[0]
const opponents=seat.slice(1)

return(

<div key={i} className="glass overflow-hidden">

<div className="p-3 font-bold text-white">
{winner.seat.name}
</div>

<div className="grid grid-cols-3">

{/* WINNER */}

<div className="result-win p-4 text-center">

<img
src={winner.candidate.photo || "/candidate.png"}
className="w-20 h-20 rounded-full mx-auto"
/>

<p className="font-bold mt-2">
{winner.candidate.name}
</p>

<p className="text-sm">
{winner.party?.name}
</p>

<p className="text-lg font-bold">
{winner.votes}
</p>

</div>

{/* OPPONENTS */}

<div className="col-span-2">

{opponents.map((o:any)=>(
<div key={o.id} className="result-lose p-3 flex justify-between border-b">

<div>

<p className="font-semibold">
{o.candidate.name}
</p>

<p className="text-sm">
{o.party?.name}
</p>

</div>

<p className="font-bold">
{o.votes}
</p>

</div>
))}

</div>

</div>

</div>

)

})}

</div>

</div>

{/* PROVINCE RESULTS */}

<div>

<h2 className="text-white text-xl font-bold mb-4">
Results by Province
</h2>

<div className="grid grid-cols-3 gap-6">

{provinces.map(p=>(

<div key={p.id} className="glass p-6">

<h3 className="text-white font-bold mb-3">
{p.name}
</h3>

<div className="text-sm text-purple-200">
District • Seats
</div>

</div>

))}

</div>

</div>

</div>

)

}