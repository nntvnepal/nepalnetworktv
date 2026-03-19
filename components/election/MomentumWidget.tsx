"use client"

import { useEffect, useState } from "react"

export default function MomentumWidget(){

const [momentum,setMomentum] = useState<any[]>([])

//////////////////////////////////////////////////////
// LOAD MOMENTUM
//////////////////////////////////////////////////////

async function load(){

const res = await fetch("/api/elections/momentum")

const data = await res.json()

setMomentum(data.momentum || [])

}

//////////////////////////////////////////////////////
// AUTO REFRESH
//////////////////////////////////////////////////////

useEffect(()=>{

load()

const timer = setInterval(load,5000)

return ()=>clearInterval(timer)

},[])

//////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////

return(

<div className="momentum-widget">

<div className="momentum-title">
📈 Momentum
</div>

{momentum.map((m:any)=>(

<div key={m.party} className="momentum-row">

<span className="momentum-party">
{m.party}
</span>

<span
className={
m.change >= 0
? "momentum-up"
: "momentum-down"
}
>
{m.change >= 0 ? "+" : ""}{m.change}
</span>

</div>

))}

</div>

)

}