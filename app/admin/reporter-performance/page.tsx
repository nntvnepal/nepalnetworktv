import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatViews(num:number){

if(num >= 1000000) return (num/1000000).toFixed(1)+"M";
if(num >= 1000) return (num/1000).toFixed(1)+"K";

return num;

}

export default async function ReporterPerformance(){

const reporters = await prisma.user.findMany({
where:{
role:"reporter",
isActive:true
},
include:{
articles:true
}
})

const now = new Date()

const startToday = new Date()
startToday.setHours(0,0,0,0)

const startWeek = new Date()
startWeek.setDate(now.getDate()-7)

const startMonth = new Date()
startMonth.setMonth(now.getMonth()-1)

const performance = reporters.map((r)=>{

const articles = r.articles.filter(a=>!a.isDeleted)

const today = articles.filter(
a=> new Date(a.createdAt) >= startToday
).length

const week = articles.filter(
a=> new Date(a.createdAt) >= startWeek
).length

const month = articles.filter(
a=> new Date(a.createdAt) >= startMonth
).length

const total = articles.length

const views = articles.reduce(
(sum,a)=>sum + a.views,
0
)

return{
name: r.name || "Reporter",
today,
week,
month,
total,
views
}

})

performance.sort((a,b)=> b.total - a.total)

const totalReporters = reporters.length

const totalToday = performance.reduce((s,r)=> s+r.today ,0)
const totalWeek = performance.reduce((s,r)=> s+r.week ,0)
const totalMonth = performance.reduce((s,r)=> s+r.month ,0)

const top3 = performance.slice(0,3)

return(

<div className="p-6">

<h1 className="text-2xl font-bold text-white mb-6">
Reporter Performance
</h1>

{/* STATS */}

<div className="grid md:grid-cols-4 grid-cols-2 gap-4 mb-6">

<StatCard label="Reporters" value={totalReporters}/>
<StatCard label="Articles Today" value={totalToday}/>
<StatCard label="Articles This Week" value={totalWeek}/>
<StatCard label="Articles This Month" value={totalMonth}/>

</div>

{/* GRID */}

<div className="grid lg:grid-cols-4 gap-6">

{/* TABLE */}

<div className="lg:col-span-3 bg-[#2d0036] rounded-lg shadow border border-[#4c0259] overflow-x-auto">

<table className="w-full text-sm text-white">

<thead className="bg-[#4c0259]">

<tr>

<th className="p-3 text-left">Rank</th>
<th className="p-3 text-left">Reporter</th>
<th className="p-3 text-center">Today</th>
<th className="p-3 text-center">Week</th>
<th className="p-3 text-center">Month</th>
<th className="p-3 text-center">Total</th>
<th className="p-3 text-center">Views</th>

</tr>

</thead>

<tbody>

{performance.length === 0 ? (

<tr>

<td colSpan={7} className="text-center py-8 opacity-60">
No reporters yet
</td>

</tr>

) : (

performance.map((r,i)=>(

<tr
key={i}
className="border-t border-[#4c0259] hover:bg-[#3b0146]"
>

<td className="p-3 font-bold">#{i+1}</td>

<td className="p-3">{r.name}</td>

<td className="p-3 text-center">{r.today}</td>

<td className="p-3 text-center">{r.week}</td>

<td className="p-3 text-center">{r.month}</td>

<td className="p-3 text-center font-semibold">{r.total}</td>

<td className="p-3 text-center">
{formatViews(r.views)}
</td>

</tr>

))

)}

</tbody>

</table>

</div>

{/* TOP PERFORMERS */}

<div className="bg-[#2d0036] border border-[#4c0259] rounded-lg p-4 text-white">

<h2 className="font-bold mb-4 text-lg">
🏆 Top Performers
</h2>

{top3.length === 0 ? (

<p className="opacity-60 text-sm">
No data yet
</p>

) : (

top3.map((r,i)=>(

<div
key={i}
className="border-b border-[#4c0259] py-3 flex justify-between"
>

<div>

<p className="font-semibold">
#{i+1} {r.name}
</p>

<p className="text-sm opacity-70">
{r.total} Articles
</p>

</div>

<div className="text-sm opacity-70">
{formatViews(r.views)} Views
</div>

</div>

))

)}

</div>

</div>

</div>

)

}

/* STAT CARD */

function StatCard({label,value}:{label:string,value:number}){

return(

<div className="bg-[#3b0146] text-white p-4 rounded-lg shadow">

<p className="text-sm opacity-70">
{label}
</p>

<p className="text-2xl font-bold">
{value}
</p>

</div>

)

}