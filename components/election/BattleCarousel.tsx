"use client"

import { useEffect, useState } from "react"
import CandidateBattleCard from "./CandidateBattleCard"

interface Battle {
seat:string
status:"leading"|"won"
margin:number
top1:any
top2:any
top3?:any
}

interface Props{
battles:Battle[]
}

export default function BattleCarousel({battles}:Props){

const visible = 5

const [index,setIndex] = useState(0)

//////////////////////////////////////////////////////
// AUTO ROTATE
//////////////////////////////////////////////////////

useEffect(()=>{

if(battles.length <= visible) return

const interval = setInterval(()=>{

setIndex((prev)=>{

const next = prev + visible

if(next >= battles.length) return 0

return next

})

},20000) // 20 seconds

return ()=>clearInterval(interval)

},[battles])


//////////////////////////////////////////////////////
// CURRENT SLICE
//////////////////////////////////////////////////////

const current = battles.slice(index,index+visible)

return(

<div className="battle-carousel">

<div className="battle-grid">

{current.map((b,i)=>(
<CandidateBattleCard key={i} {...b}/>
))}

</div>

</div>

)

}