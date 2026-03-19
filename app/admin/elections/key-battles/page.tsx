import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 20

export default async function KeyBattlesPage(){

//////////////////////////////////////////////////////
// ACTIVE ELECTION
//////////////////////////////////////////////////////

const election = await prisma.election.findFirst({
where:{ isActive:true },
select:{ id:true,name:true }
})

if(!election){
return(

<div className="p-10 text-white">
No Active Election
</div>
)
}

//////////////////////////////////////////////////////
// RESULTS
//////////////////////////////////////////////////////

const results = await prisma.electionResult.findMany({
where:{ electionId:election.id },
orderBy:[
{ seatId:"asc" },
{ rank:"asc" }
],
include:{
seat:{
select:{
name:true,
region:{ select:{ name:true } }
}
},
candidate:{
select:{
name:true,
party:{ select:{ name:true } }
}
}
}
})

//////////////////////////////////////////////////////
// GROUP BY SEAT
//////////////////////////////////////////////////////

const seatMap:any = {}

for(const r of results){

if(!seatMap[r.seatId]){
seatMap[r.seatId] = []
}

seatMap[r.seatId].push(r)

}

//////////////////////////////////////////////////////
// CALCULATE SEAT BATTLES
//////////////////////////////////////////////////////

const battles:any = []

for(const seatId in seatMap){

const seatResults = seatMap[seatId]

const leader = seatResults[0]
const runner = seatResults[1]

if(!leader || !runner) continue

const margin = leader.votes - runner.votes

battles.push({

seat:leader.seat?.name,

region:leader.seat?.region?.name,

leader:leader.candidate?.name,

party:leader.candidate?.party?.name || "Independent",

votes:leader.votes,

runner:runner.candidate?.name,

runnerVotes:runner.votes,

margin

})

}

//////////////////////////////////////////////////////
// SEAT BATTLE SORTING
//////////////////////////////////////////////////////

const closest = battles
.filter(b=>b.margin < 50)
.sort((a,b)=>a.margin-b.margin)
.slice(0,10)

const tight = battles
.filter(b=>b.margin < 100)
.sort((a,b)=>a.margin-b.margin)
.slice(0,10)

const battleground = battles
.filter(b=>b.margin < 500)
.sort((a,b)=>a.margin-b.margin)
.slice(0,10)

const biggest = [...battles]
.sort((a,b)=>b.margin-a.margin)
.slice(0,10)

//////////////////////////////////////////////////////
// REGION ANALYSIS
//////////////////////////////////////////////////////

const regionStats:any = {}

for(const b of battles){

const region = b.region || "Unknown"

if(!regionStats[region]){
regionStats[region] = { seats:0 }
}

regionStats[region].seats++

}

const regionLeaders = Object.entries(regionStats)
.map(([region,data]:any)=>({

region,
seats:data.seats

}))
.sort((a,b)=>b.seats-a.seats)
.slice(0,10)

//////////////////////////////////////////////////////
// CANDIDATE ANALYSIS
//////////////////////////////////////////////////////

const topCandidates = [...battles]
.sort((a,b)=>b.votes-a.votes)
.slice(0,10)

//////////////////////////////////////////////////////
// CARD COMPONENT
//////////////////////////////////////////////////////

function Card({title,data,color}:any){

return(

<div className="glass-card p-6">

<h2 className="text-lg font-semibold mb-4">
{title}
</h2>

{data.length === 0 && (

<p className="text-purple-400 text-sm">
No data yet
</p>
)}

{data.map((b:any,i:number)=>(

<div
key={i}
className="flex justify-between border-b border-purple-800 py-2 text-sm"
>

<span className="text-purple-200">
{b.seat || b.region || b.leader}
</span>

<span className={`font-semibold ${color}`}>
{b.margin || b.seats || b.votes} </span>

</div>

))}

</div>

)

}

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="
min-h-screen
bg-gradient-to-br
from-[#2b0045]
via-[#3c0a5c]
to-[#140021]
p-8
space-y-10
text-white
">

{/* HEADER */}

<div>

<h1 className="text-3xl font-bold">
Key Battles
</h1>

<p className="text-purple-300">
{election.name}
</p>

</div>

{/* SEAT BATTLES */}

<div>

<h2 className="text-xl font-semibold mb-4">
Seat Battles
</h2>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

<Card title="Closest Battles (<50)" data={closest} color="text-yellow-400" />

<Card title="Tight Battles (<100)" data={tight} color="text-green-400" />

<Card title="Battlegrounds (<500)" data={battleground} color="text-blue-400" />

<Card title="Biggest Wins" data={biggest} color="text-green-400" />

</div>

</div>

{/* REGION BATTLES */}

<div>

<h2 className="text-xl font-semibold mb-4">
Region Battles
</h2>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

<Card title="Top Regions" data={regionLeaders} color="text-blue-400" />

</div>

</div>

{/* CANDIDATE BATTLES */}

<div>

<h2 className="text-xl font-semibold mb-4">
Candidate Battles
</h2>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

<Card title="Top Candidates (Votes)" data={topCandidates} color="text-green-400" />

</div>

</div>

</div>

)

}
