"use client"

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
const [loading,setLoading] = useState(true)

//////////////////////////////////////////////////////
// 🔔 TOAST NOTIFICATION (NEW)
//////////////////////////////////////////////////////

const [toast,setToast] = useState<string | null>(null)
const [lastAppId,setLastAppId] = useState<string | null>(null)

function showToast(msg:string){
  setToast(msg)

  setTimeout(()=>{
    setToast(null)
  },3000)
}

//////////////////////////////////////////////////////
// FETCH DASHBOARD
//////////////////////////////////////////////////////

useEffect(()=>{

const controller = new AbortController()

async function load(){

try{

const res = await fetch("/api/admin/dashboard",{
cache:"no-store",
signal:controller.signal
})

if(!res.ok){
  throw new Error("Dashboard fetch failed")
}

const json = await res.json()

setData(json)

}catch(err){

console.error("Dashboard load error",err)

}finally{

setLoading(false)

}

}

load()

return ()=>controller.abort()

},[])

//////////////////////////////////////////////////////
// 🔔 APPLICATION REALTIME (FIXED)
//////////////////////////////////////////////////////

useEffect(()=>{

  const interval = setInterval(async ()=>{

    try{

      const res = await fetch("/api/applications",{ cache:"no-store" })
      const data = await res.json()

      if(!data.success) return

      const latest = data.applications?.[0]

      if(!lastAppId && latest){
        // first load → no toast
        setLastAppId(latest.id)
        return
      }

      if(latest && latest.id !== lastAppId){

        setLastAppId(latest.id)

        showToast(`🚀 New Application: ${latest.name}`)

      }

    }catch(err){
      console.error("Notification error",err)
    }

  },4000)

  return ()=>clearInterval(interval)

},[lastAppId])

//////////////////////////////////////////////////////
// LOADING
//////////////////////////////////////////////////////

if(loading){

return(

<div className="p-10 text-white space-y-6">

<div className="h-6 w-60 bg-gray-800 animate-pulse rounded"/>

<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">

{Array.from({length:6}).map((_,i)=>(
<div key={i} className="h-24 bg-gray-800 animate-pulse rounded-xl"/>
))}

</div>

</div>

)

}

//////////////////////////////////////////////////////
// ERROR
//////////////////////////////////////////////////////

if(!data){

return(
<div className="p-10 text-red-400">
Dashboard failed to load
</div>
)

}

//////////////////////////////////////////////////////
// DATA
//////////////////////////////////////////////////////

const {
stats = {},
latest = [],
top = [],
trending = [],
viral = [],
activity = [],
chart = [],
categories = []
} = data

//////////////////////////////////////////////////////
// PAGE
//////////////////////////////////////////////////////

return(

<div className="p-8 space-y-10 text-white relative">

{/* 🔔 TOAST UI */}
{toast && (
<div className="fixed top-6 right-6 z-50 bg-black/80 border border-white/10 px-5 py-3 rounded-xl shadow-xl animate-slide-in">
  {toast}
</div>
)}

{/* HEADER */}

<div>

<h1 className="text-2xl font-bold">
NNTV Admin Dashboard
</h1>

<p className="text-gray-400">
Newsroom control panel
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

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-8 hover:border-orange-400 transition">

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
dot={false}
/>

</LineChart>

</ResponsiveContainer>

</div>

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-8 hover:border-orange-400 transition">

<h2 className="text-lg font-semibold mb-6">
Content Distribution
</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={categories}>

<CartesianGrid stroke="#1f2937"/>

<XAxis dataKey="name" stroke="#888"/>

<YAxis stroke="#888"/>

<Tooltip/>

<Bar dataKey="count" fill="#f97316"/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

{/* CONTENT ROW */}

<div className="grid lg:grid-cols-2 gap-8">

<Panel title="Latest Articles">
{latest.length===0 ? <Empty message="No articles yet"/> :
latest.map((a:any)=>(
<Row key={a.id} title={a.title}/>
))}
</Panel>

<Panel title="Most Viewed">
{top.length===0 ? <Empty message="No popular articles"/> :
top.map((a:any)=>(
<Row key={a.id} title={a.title} value={`${a.views} views`}/>
))}
</Panel>

</div>

{/* TRENDING + VIRAL */}

<div className="grid lg:grid-cols-2 gap-8">

<Panel title="Trending News">
{trending.length===0 ? <Empty message="No trending news"/> :
trending.map((a:any)=>(
<Row key={a.id} title={a.title} value={`score ${a.trendingScore || 0}`}/>
))}
</Panel>

<Panel title="Viral Articles">
{viral.length===0 ? <Empty message="No viral articles"/> :
viral.map((a:any)=>(
<Row key={a.id} title={a.title} value={`${a.views} views`}/>
))}
</Panel>

</div>

{/* ACTIVITY */}

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-8">

<h2 className="text-lg font-semibold mb-6">
Recent Activity
</h2>

<div className="space-y-3">

{activity.length===0 ? (
<Empty message="No activity yet"/>
) : (
activity.map((a:any)=>(
<div key={a.id} className="flex justify-between border-b border-gray-800 pb-2">
<span>{a.title}</span>
<span className="text-gray-400 text-sm">{a.time}</span>
</div>
))
)}

</div>

</div>

{/* 🔥 ANIMATION */}
<style jsx global>{`
@keyframes slide-in {
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
`}</style>

</div>

)

}

//////////////////////////////////////////////////////
// COMPONENTS
//////////////////////////////////////////////////////

function Card({title,value}:{title:string,value:number}){
return(
<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-5 hover:border-orange-400 hover:scale-[1.02] transition">
<p className="text-gray-400 text-sm">{title}</p>
<h3 className="text-2xl font-bold mt-2">
{value?.toLocaleString?.() || 0}
</h3>
</div>
)
}

function Panel({title,children}:{title:string,children:any}){
return(
<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-6 hover:border-orange-400 transition">
<h2 className="text-lg font-semibold mb-4">{title}</h2>
<div className="space-y-3">{children}</div>
</div>
)
}

function Row({title,value}:{title:string,value?:string}){
return(
<div className="flex justify-between border-b border-gray-800 pb-2 hover:text-orange-400 transition cursor-pointer">
<span>{title}</span>
<span className="text-gray-400 text-sm">{value}</span>
</div>
)
}

function Empty({message}:{message:string}){
return(
<p className="text-gray-500 text-sm">{message}</p>
)
}