"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function AdsChart({data}:{data:any}){

return(

<div className="bg-[#1b0633] p-5 rounded-xl border border-white/10">

<h2 className="text-white font-semibold mb-4">
Views vs Clicks Performance
</h2>

<ResponsiveContainer width="100%" height={260}>

<LineChart data={data}>

<XAxis dataKey="date" stroke="#ccc"/>

<YAxis stroke="#ccc"/>

<Tooltip/>

<Line type="monotone" dataKey="views" stroke="#9b5cf6" strokeWidth={2}/>

<Line type="monotone" dataKey="clicks" stroke="#22c55e" strokeWidth={2}/>

</LineChart>

</ResponsiveContainer>

</div>

)

}