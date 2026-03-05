"use client"
export const dynamic = "force-dynamic";
export const revalidate = 0;
import VisitorMessages from "@/components/admin/VisitorMessages"
import { useEffect, useState } from "react"
import {
LineChart,
Line,
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts"

interface DashboardData{
stats:any
latest:any[]
top:any[]
trending:any[]
viral:any[]
activity:any[]
chart:any[]
categories:any[]
}

export default function AdminDashboard(){

const [data,setData] = useState<DashboardData | null>(null)

useEffect(()=>{

fetch("/api/admin/dashboard")
.then(res=>res.json())
.then(res=>setData(res))

},[])

if(!data){
return(
<div className="p-10 text-white">
Loading dashboard...
</div>
)
}

const {
stats,
latest,
top,
trending,
viral,
activity,
chart,
categories
} = data

return(

<div className="p-8 space-y-10 text-white">

{/* HEADER */}

<div>
<h1 className="text-2xl font-bold">
Nation Path Admin
</h1>
<p className="text-gray-400">
Newsroom control dashboard
</p>
</div>

{/* MAIN STATS */}

<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">

<Card title="Articles" value={stats.totalArticles}/>
<Card title="Pending" value={stats.pendingArticles}/>
<Card title="Users" value={stats.totalUsers}/>
<Card title="Comments" value={stats.totalComments}/>
<Card title="Views" value={stats.totalViews}/>
<Card title="Active Ads" value={stats.activeAds}/>

</div>

{/* SECONDARY STATS */}

<div className="grid md:grid-cols-4 gap-6">

<Card title="Drafts" value={stats.drafts}/>
<Card title="Published Today" value={stats.publishedToday}/>
<Card title="This Week" value={stats.weekArticles}/>
<Card title="Ad Clicks" value={stats.adClicks}/>

</div>

{/* CHARTS */}

<div className="grid lg:grid-cols-2 gap-8">

{/* TRAFFIC */}

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-8">

<h2 className="text-lg font-semibold mb-6">
Traffic Analytics
</h2>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={chart}>

<CartesianGrid stroke="#1f2937"/>

<XAxis dataKey="day" stroke="#888"/>

<YAxis stroke="#888"/>

<Tooltip/>

<Line
type="monotone"
dataKey="views"
stroke="#ff7a18"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

{/* CATEGORY DISTRIBUTION */}

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-8">

<h2 className="text-lg font-semibold mb-6">
Content Distribution
</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={categories}>

<CartesianGrid stroke="#1f2937"/>

<XAxis dataKey="name" stroke="#888"/>

<YAxis stroke="#888"/>

<Tooltip/>

<Bar
dataKey="count"
fill="#f97316"
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

{/* CONTENT ROW */}

<div className="grid lg:grid-cols-2 gap-8">

{/* LATEST */}

<Panel title="Latest Articles">

{latest?.map((a:any)=>(

<Row
key={a.id}
title={a.title}
/>

))}

</Panel>

{/* MOST VIEWED */}

<Panel title="Most Viewed">

{top?.map((a:any)=>(

<Row
key={a.id}
title={a.title}
value={`${a.views} views`}
/>

))}

</Panel>

</div>

{/* TRENDING + VIRAL */}

<div className="grid lg:grid-cols-2 gap-8">

<Panel title="Trending News">

{trending?.map((a:any)=>(

<Row
key={a.id}
title={a.title}
value={`score ${a.trendingScore}`}
/>

))}

</Panel>

<Panel title="Viral Articles">

{viral?.map((a:any)=>(

<Row
key={a.id}
title={a.title}
value={`${a.views} views`}
/>

))}

</Panel>

</div>

{/* VISITOR CHAT SECTION */}

<div className="grid lg:grid-cols-2 gap-8">

<VisitorMessages />

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-8">

<h2 className="text-lg font-semibold mb-6">
Recent Activity
</h2>

<div className="space-y-3">

{activity?.map((a:any)=>(

<div
key={a.id}
className="flex justify-between border-b border-gray-800 pb-2"
>

<span>{a.title}</span>

<span className="text-gray-400 text-sm">
{a.time}
</span>

</div>

))}

</div>

</div>

</div>

</div>

)

}

function Card({title,value}:{title:string,value:number}){

return(

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-5 hover:border-orange-400 transition">

<p className="text-gray-400 text-sm">
{title}
</p>

<h3 className="text-2xl font-bold mt-2">
{value?.toLocaleString()}
</h3>

</div>

)

}

function Panel({title,children}:{title:string,children:any}){

return(

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4">
{title}
</h2>

<div className="space-y-3">

{children}

</div>

</div>

)

}

function Row({title,value}:{title:string,value?:string}){

return(

<div className="flex justify-between border-b border-gray-800 pb-2">

<span className="hover:text-orange-400 cursor-pointer">
{title}
</span>

<span className="text-gray-400 text-sm">
{value}
</span>

</div>

)

}