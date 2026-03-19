"use client"

import { useEffect, useState } from "react"

export default function TopDateTime(){

const [time,setTime] = useState("")

useEffect(()=>{

const update = ()=>{

const now = new Date()

setTime(
now.toLocaleString("en-IN",{
weekday:"long",
year:"numeric",
month:"long",
day:"numeric",
hour:"2-digit",
minute:"2-digit"
})
)

}

update()

const interval = setInterval(update,1000)

return ()=>clearInterval(interval)

},[])

return(

<div className="text-sm text-white">
{time}
</div>

)

}